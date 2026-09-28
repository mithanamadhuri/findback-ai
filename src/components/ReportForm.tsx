import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  MapPin, 
  Calendar, 
  Clock, 
  Tag, 
  FileText, 
  Info, 
  RotateCcw,
  Sparkle
} from 'lucide-react';
import { ItemReport, ReportCategory, ReportType } from '../types';
import { CAMPUS_LOCATIONS, DEMO_PRESETS } from '../data/mockData';

interface ReportFormProps {
  type: ReportType;
  onCancel: () => void;
  onSubmit: (report: Omit<ItemReport, 'id' | 'status' | 'createdAt'>) => void;
  initialPreset?: typeof DEMO_PRESETS[0] | null;
}

const CATEGORIES: ReportCategory[] = [
  'Electronics',
  'Wallets & Bags',
  'Cards & IDs',
  'Keys',
  'Water Bottles',
  'Clothing & Accessories',
  'Books & Stationery',
  'Jewelry & Watches',
  'Other Items',
];

export const ReportForm: React.FC<ReportFormProps> = ({
  type,
  onCancel,
  onSubmit,
  initialPreset,
}) => {
  const isLost = type === 'lost';

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<ReportCategory>('Electronics');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('Around 2:30 PM');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [custodyLocation, setCustodyLocation] = useState(
    isLost ? '' : 'Turned in to Campus Lost & Found / Info Desk'
  );

  const [privacyWarning, setPrivacyWarning] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync initial preset if passed
  useEffect(() => {
    if (initialPreset) {
      setItemName(initialPreset.itemName);
      setCategory(initialPreset.category as ReportCategory);
      setDescription(initialPreset.description);
      setColor(initialPreset.color);
      setBrand(initialPreset.brand || '');
      setLocation(initialPreset.location);
      setDate(initialPreset.date);
      setTime(initialPreset.time);
      setAdditionalDetails(initialPreset.additionalDetails || '');
      if (!isLost) {
        setCustodyLocation('Main Library 1st Floor Circulation Desk');
      }
    }
  }, [initialPreset, isLost]);

  // Real-time privacy guard
  const checkPrivacy = (text: string) => {
    const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const passwordPattern = /(password|passcode|pin\s*code|ssn|social security)/i;

    if (phonePattern.test(text) || emailPattern.test(text)) {
      setPrivacyWarning('Privacy Notice: Avoid including direct phone numbers or email addresses. FindBack AI provides a safe anonymous contact channel.');
    } else if (passwordPattern.test(text)) {
      setPrivacyWarning('Security Notice: Never disclose passwords, PINs, or government identity numbers.');
    } else {
      setPrivacyWarning(null);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setDescription(val);
    checkPrivacy(val + ' ' + additionalDetails);
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setAdditionalDetails(val);
    checkPrivacy(description + ' ' + val);
  };

  const handleLoadDemoCase = (preset: typeof DEMO_PRESETS[0]) => {
    setItemName(preset.itemName);
    setCategory(preset.category as ReportCategory);
    setDescription(preset.description);
    setColor(preset.color);
    setBrand(preset.brand || '');
    setLocation(preset.location);
    setDate(preset.date);
    setTime(preset.time);
    setAdditionalDetails(preset.additionalDetails || '');
    if (!isLost) {
      setCustodyLocation('Main Library 1st Floor Circulation Desk');
    }
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!itemName.trim()) newErrors.itemName = 'Please enter what the item is.';
    if (!category) newErrors.category = 'Please choose a category.';
    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = 'Please describe the item (at least 10 characters).';
    }
    if (!color.trim()) newErrors.color = 'Please specify primary color(s).';
    if (!location.trim()) newErrors.location = 'Please state where it was lost or found.';
    if (!date) newErrors.date = 'Please select approximate date.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setErrors({});
    onSubmit({
      type,
      itemName: itemName.trim(),
      category,
      description: description.trim(),
      color: color.trim(),
      brand: brand.trim() || undefined,
      location: location.trim(),
      date,
      time: time.trim() || 'Approximate time not specified',
      additionalDetails: additionalDetails.trim() || undefined,
      custodyLocation: isLost ? undefined : (custodyLocation.trim() || 'Turned in to campus desk')
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm mb-8 transition-colors ${
        isLost 
          ? 'bg-gradient-to-br from-rose-50/80 via-white to-amber-50/40 border-rose-200/80' 
          : 'bg-gradient-to-br from-indigo-50/80 via-white to-emerald-50/40 border-indigo-200/80'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
              isLost ? 'bg-rose-600 shadow-rose-500/25' : 'bg-indigo-600 shadow-indigo-500/25'
            }`}>
              {isLost ? <Search className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isLost ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'
              }`}>
                {isLost ? 'Missing Item Report' : 'Found Item Turn-in Report'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {isLost ? 'I Lost Something' : 'I Found Something'}
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                {isLost 
                  ? 'Provide non-sensitive details so our AI can cross-reference against all found campus items.'
                  : 'Report an item you found so the rightful owner can be safely identified without revealing private marks.'}
              </p>
            </div>
          </div>

          {/* Quick Demo Pre-fill Button */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <div className="relative group">
              <button
                type="button"
                onClick={() => handleLoadDemoCase(DEMO_PRESETS[isLost ? 0 : 1])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-300 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 shadow-2xs hover:shadow-xs transition-all"
              >
                <Sparkle className="w-3.5 h-3.5 text-amber-500" />
                <span>Fill Demo Example</span>
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Notice Banner */}
        <div className="mt-6 flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs sm:text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold">Privacy &amp; Safety Rule:</span> Please avoid submitting passwords, financial details, government IDs, room numbers, or exact personal addresses. FindBack AI uses non-sensitive physical traits for matching.
          </div>
        </div>

        {privacyWarning && (
          <div className="mt-3 flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs sm:text-sm animate-in fade-in duration-200">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="font-medium">{privacyWarning}</div>
          </div>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        
        {/* Row 1: Item Name & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center justify-between">
              <span>Item Name <span className="text-rose-500">*</span></span>
              <span className="text-xs font-normal text-slate-400">e.g. Black wireless earbuds, Hydro Flask</span>
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Black wireless earbuds"
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.itemName ? 'border-rose-400 ring-rose-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.itemName && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.itemName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ReportCategory)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Color & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center justify-between">
              <span>Color(s) <span className="text-rose-500">*</span></span>
              <span className="text-xs font-normal text-slate-400">e.g. Matte Black, Pacific Blue</span>
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. Matte Black with silver trim"
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.color ? 'border-rose-400 ring-rose-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.color && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.color}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center justify-between">
              <span>Brand / Manufacturer <span className="text-xs text-slate-400 font-normal">(Optional)</span></span>
              <span className="text-xs font-normal text-slate-400">e.g. Sony, Apple, Hydro Flask</span>
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Sony, Apple, The North Face"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Row 3: Location */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>{isLost ? 'Approximate Location Lost' : 'Location Where Found'} <span className="text-rose-500">*</span></span>
            </span>
            <span className="text-xs text-slate-400 font-normal">Campus building, room or quad area</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Main Library — 2nd Floor Study Desks"
            className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.location ? 'border-rose-400 ring-rose-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {errors.location && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.location}</p>}

          {/* Quick campus location chips */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium mr-1">Quick Select:</span>
            {CAMPUS_LOCATIONS.slice(0, 5).map((loc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setLocation(loc)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {loc.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: Date & Approximate Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>{isLost ? 'Approximate Date Lost' : 'Date Found'} <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.date ? 'border-rose-400 ring-rose-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.date && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Approximate Time</span>
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. Around 3:15 PM, Lunch hour, Morning class"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Row 5: Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Description <span className="text-rose-500">*</span></span>
            </span>
            <span className="text-xs text-slate-400 font-normal">Physical shape, material, size</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={handleDescriptionChange}
            placeholder={
              isLost
                ? "Describe the item's general appearance (e.g., small black charging case with wireless earbuds, matte finish, USB-C port at the back)."
                : "Describe the item found (e.g., small black charging case with wireless earbuds inside, found left on study cubicle desk)."
            }
            className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.description ? 'border-rose-400 ring-rose-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {errors.description && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.description}</p>}
        </div>

        {/* Row 6: Additional Non-Sensitive Details */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Additional Non-Sensitive Details <span className="text-xs text-slate-400 font-normal">(Optional)</span></span>
            </span>
            <span className="text-xs text-slate-400 font-normal">Scratches, decals, stickers, or tags</span>
          </label>
          <textarea
            rows={2}
            value={additionalDetails}
            onChange={handleDetailsChange}
            placeholder="e.g. Has a small national park sticker on lower side, medium silicone tips, slightly scuffed on left corner."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Found items specific: Custody Location */}
        {!isLost && (
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80">
            <label className="block text-sm font-semibold text-indigo-950 mb-1.5">
              Where is this item currently held? <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-600 mb-2">
              For security, found items should ideally be turned in to an official lost &amp; found desk or departmental office.
            </p>
            <input
              type="text"
              value={custodyLocation}
              onChange={(e) => setCustodyLocation(e.target.value)}
              placeholder="e.g. Main Library 1st Floor Circulation Desk, Campus Security Room 102"
              className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        )}

        {/* Explicit Privacy Notice */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-600">
          <span className="text-base">🔒</span>
          <span>
            <strong className="font-semibold text-slate-800">Privacy Notice:</strong> Please avoid submitting passwords, financial information, government IDs, or other sensitive personal information. FindBack AI never displays personal phone numbers or email addresses publicly.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Cancel &amp; Return
          </button>

          <button
            type="submit"
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-white shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
              isLost
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/35'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>{isLost ? 'Find Possible Matches' : 'Check for Matches'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
