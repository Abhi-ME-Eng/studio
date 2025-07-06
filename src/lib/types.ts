export type HistoryItem = {
  id: string;
  feature: string;
  timestamp: number;
  query: Record<string, any>;
  result: Record<string, any>;
};
