import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  RefreshCw,
  Settings,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  isHint?: boolean;
}

const DEFAULT_N8N_WEBHOOK = 'https://madhuri-reddy06.app.n8n.cloud/webhook/05e8976c-9bca-42e2-aa54-6fc33a795eb9/chat';

export const N8nChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(DEFAULT_N8N_WEBHOOK);
  const [showConfig, setShowConfig] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentSource, setAgentSource] = useState<'n8n' | 'gemini' | 'auto'>('auto');
  const [sessionId] = useState(() => `findback-${Math.random().toString(36).substring(2, 9)}`);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: "Hello! 👋 I'm your FindBack AI Assistant. I can help you search for lost items, answer questions about campus retrieval, or guide you through safe verification. What are you looking for today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/n8n-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          sessionId,
          webhookUrl
        })
      });

      const data = await response.json();

      let replyText = "I've checked the campus lost & found records. If you recently misplaced or found an item, please click 'Report Lost Item' or 'Report Found Item' at the top so our matching engine can scan for matches.";
      
      if (data.source === 'n8n') {
        setAgentSource('n8n');
      } else {
        setAgentSource('gemini');
      }

      if (data.output && typeof data.output === 'string') {
        replyText = data.output;
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: `I'm here to help! Please check our top navigation to submit a Lost or Found item report, or visit the Main Library 1st Floor Circulation Desk.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'How do I report a lost item?',
    'Where is the Main Library lost & found desk?',
    'Are there any black earbuds reported found?',
    'How does safe ownership verification work?'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          title="Chat with n8n AI Agent"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-indigo-700 rounded-full animate-pulse" />
          </div>
          <div className="text-left pr-1">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
              <span>n8n AI Agent</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-sm font-extrabold text-white">FindBack Assistant</div>
          </div>
        </button>
      )}

      {/* Floating Chat Container */}
      {isOpen && (
        <div
          className={`bg-white rounded-3xl border border-slate-200 shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${
            isMinimized
              ? 'w-80 h-16'
              : 'w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-indigo-900/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">FindBack Assistant</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 font-semibold border border-indigo-400/20">
                    n8n
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <span>madhuri-reddy06.app.n8n.cloud</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setShowConfig(!showConfig)}
                className={`p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors ${
                  showConfig ? 'text-indigo-300 bg-white/10' : ''
                }`}
                title="Webhook Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Optional Webhook Configuration Strip */}
              {showConfig && (
                <div className="p-3 bg-indigo-50 border-b border-indigo-100 text-xs space-y-2">
                  <div className="flex items-center justify-between text-indigo-950 font-semibold">
                    <span className="flex items-center gap-1">
                      <Settings className="w-3.5 h-3.5 text-indigo-600" />
                      <span>n8n Webhook Configuration</span>
                    </span>
                    <button
                      onClick={() => setWebhookUrl(DEFAULT_N8N_WEBHOOK)}
                      className="text-[10px] text-indigo-600 hover:underline"
                    >
                      Reset Default
                    </button>
                  </div>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 font-mono"
                    placeholder="https://.../webhook/.../chat"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Target: Cloud n8n Chat Trigger</span>
                    <a
                      href="https://madhuri-reddy06.app.n8n.cloud"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-0.5 text-indigo-600 hover:underline"
                    >
                      <span>Open n8n</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 p-3 bg-white border border-slate-200/80 rounded-2xl w-fit">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                    <span className="text-xs text-slate-500 ml-1">n8n agent thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    disabled={isLoading}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] font-medium text-slate-600 transition-colors border border-slate-200/60 disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask your n8n agent anything..."
                    disabled={isLoading}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-40 disabled:hover:bg-indigo-600 shrink-0 shadow-xs"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 px-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Safe anonymous communication</span>
                  </span>
                  <button
                    onClick={() =>
                      setMessages([
                        {
                          id: 'welcome-reset',
                          sender: 'agent',
                          text: "Chat cleared. What can I assist you with?",
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                      ])
                    }
                    className="hover:text-slate-600 transition-colors"
                  >
                    Clear history
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
