export interface AnalyzeSearchParams {
  metadata?: Record<string, any>;
  query: string;
  num?: number;
  prompt: string;
  startPublishedDate?: string;
  endPublishedDate?: string;
  temperature?: number;
}

export interface AnalyzeLinksParams {
  metadata?: Record<string, any>;
  link: string | string[];
  prompt: string;
  temperature?: number;
}

export interface AnalyzeResults {
  usageId: string;
  metadata?: Record<string, any>;
  costCredits: number;
  results: AnalyzeResultObject[];
}

export interface AnalyzeResultObject {
  analysisId: string;
  createdAt: string;
  updatedAt: string;
  analysis: AnalyzeAnalysisObject;
}

export interface AnalyzeAnalysisObject {
  title: string;
  url: string;
  publishedDate?: string;
  author?: string;
  score?: number;
  id: string;
  image?: string;
  favicon?: string;
  extras: {
    imageLinks?: string[];
  };
  text: string;
  content: string;
}

export interface AnalysisResult {
  createdAt: string;
  updatedAt: string;
  analysisId: string;
  analysis?: AnalyzeAnalysisObject;
  metadata?: Record<string, any>;
}

export interface UpdateAnalysisParams {
  analysisId: string;
  content?: string;
  metadata?: Record<string, any>;
}
