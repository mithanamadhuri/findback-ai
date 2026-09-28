export type ReportType = 'lost' | 'found';

export type ReportCategory =
  | 'Electronics'
  | 'Wallets & Bags'
  | 'Cards & IDs'
  | 'Keys'
  | 'Water Bottles'
  | 'Clothing & Accessories'
  | 'Books & Stationery'
  | 'Jewelry & Watches'
  | 'Other Items';

export interface ItemReport {
  id: string;
  type: ReportType;
  itemName: string;
  category: ReportCategory;
  description: string;
  color: string;
  brand?: string;
  location: string;
  date: string;
  time: string;
  additionalDetails?: string;
  custodyLocation?: string; // where found item is deposited
  status: 'active' | 'matched' | 'resolved';
  createdAt: string;
  isDemo?: boolean;
}

export type IndicatorStatus = 'exact' | 'high' | 'nearby' | 'compatible' | 'moderate' | 'low';

export interface MatchIndicator {
  status: IndicatorStatus;
  label: string;
}

export interface MatchResult {
  candidateId: string;
  similarityScore: number;
  confidence: 'High' | 'Moderate' | 'Low';
  explanation: string;
  indicators: {
    itemType: MatchIndicator;
    color: MatchIndicator;
    location: MatchIndicator;
    time: MatchIndicator;
    description: MatchIndicator;
  };
  matchingCharacteristics: string[];
  recommendedAction: string;
  suggestedVerificationPrompt: string;
}

export interface MatchEvaluationResponse {
  matches: MatchResult[];
  engine?: string;
  analyzedAt: string;
}
