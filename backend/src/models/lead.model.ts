import mongoose, { Document, Schema } from "mongoose";

export type LeadPriority = "HIGH" | "MEDIUM" | "LOW";

export interface ILead extends Document {
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

  scoreBreakdown: {
    industryFit: number;
    revenueFit: number;
    geographyFit: number;
    sizeFit: number;
    contactability: number;
    businessMaturity: number;
  };

  recommendation: string;

  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true
    },

    normalizedDomain: {
      type: String,
      lowercase: true,
      trim: true
    },

    website: String,

    industry: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    revenue: Number,

    employees: Number,

    yearsInBusiness: Number,

    contactName: String,

    contactEmail: String,

    contactPhone: String,

    linkedinUrl: String,

    source: {
      type: String,
      required: true
    },

    sourceUrl: String,

    score: {
      type: Number,
      default: 0,
      index: true
    },

    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW",
      index: true
    },

    scoreBreakdown: {
      industryFit: { type: Number, default: 0 },
      revenueFit: { type: Number, default: 0 },
      geographyFit: { type: Number, default: 0 },
      sizeFit: { type: Number, default: 0 },
      contactability: { type: Number, default: 0 },
      businessMaturity: { type: Number, default: 0 }
    },

    recommendation: {
      type: String,
      default: "Review before outreach"
    }
  },
  {
    timestamps: true
  }
);

leadSchema.index({
  normalizedDomain: 1
});

leadSchema.index({
  industry: 1,
  location: 1
});

leadSchema.index({
  score: -1
});

export const Lead = mongoose.model<ILead>("Lead", leadSchema);