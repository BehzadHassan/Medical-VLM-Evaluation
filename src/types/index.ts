export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
}

export interface ModelResponse {
  model_name: string;
  output: string;
  confidence_score?: number;
  metrics: ModelMetrics;
}

export interface QueryRequest {
  text: string;
  image?: File;
}
