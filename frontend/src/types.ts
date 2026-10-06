export type LeadPriority = "HIGH" | "MEDIUM" | "LOW";

export interface ScoreBreakdown {
  industryFit: number;
  revenueFit: number;
  geographyFit: number;
  sizeFit: number;
  contactability: number;
  businessMaturity: number;
}

export interface Lead {
  _id: string;
  companyName: string;
  normalizedDomain?: string;
  website?: string;

  industry: string;
  location: string;

  revenue?: number;
  employees?: number;
  yearsInBusiness?: number;

  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  linkedinUrl?: string;

  source: string;
  sourceUrl?: string;

  score: number;
  priority: LeadPriority;

  scoreBreakdown: ScoreBreakdown;

  recommendation: string;

  createdAt: string;
  updatedAt: string;
}

export interface LeadsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeadsResponse {
  success: boolean;
  data: {
    leads: Lead[];
    pagination: LeadsPagination;
  };
}

export interface LeadStats {
  total: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  averageScore: number;
}

export interface StatsResponse {
  success: boolean;
  data: LeadStats;
}