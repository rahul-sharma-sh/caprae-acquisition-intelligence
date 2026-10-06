import { Lead, ILead } from "../models/lead.model.js";
import {
  calculateLeadScore,
  LeadScoringInput
} from "../utils/scoring.js";

export interface LeadFilters {
  industry?: string;
  location?: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  minRevenue?: number;
  maxRevenue?: number;
  minEmployees?: number;
  maxEmployees?: number;
  minScore?: number;
  search?: string;
  page?: number;
  limit?: number;
  sort?: "score" | "revenue" | "createdAt";
  order?: "asc" | "desc";
}

export async function createLead(
  payload: Partial<ILead> & {
    targetIndustry?: string;
    targetLocation?: string;
  }
) {
  const scoreInput: LeadScoringInput = {
    industry: payload.industry || "",
    targetIndustry: payload.targetIndustry,

    revenue: payload.revenue,
    employees: payload.employees,
    yearsInBusiness: payload.yearsInBusiness,

    location: payload.location || "",
    targetLocation: payload.targetLocation,

    contactEmail: payload.contactEmail,
    contactPhone: payload.contactPhone
  };

  const scoreResult = calculateLeadScore(scoreInput);

  const normalizedDomain = normalizeDomain(payload.website);

  const existingLead = normalizedDomain
    ? await Lead.findOne({ normalizedDomain })
    : null;

  if (existingLead) {
    return {
      lead: existingLead,
      duplicated: true
    };
  }

  const lead = await Lead.create({
    ...payload,
    normalizedDomain,

    score: scoreResult.score,
    priority: scoreResult.priority,

    scoreBreakdown: scoreResult.breakdown,

    recommendation: scoreResult.recommendation
  });

  return {
    lead,
    duplicated: false
  };
}

export async function getLeads(filters: LeadFilters) {
  const {
    industry,
    location,
    priority,
    minRevenue,
    maxRevenue,
    minEmployees,
    maxEmployees,
    minScore,
    search,
    page = 1,
    limit = 20,
    sort = "score",
    order = "desc"
  } = filters;

  const query: Record<string, any> = {};

  if (industry) {
    query.industry = {
      $regex: industry,
      $options: "i"
    };
  }

  if (location) {
    query.location = {
      $regex: location,
      $options: "i"
    };
  }

  if (priority) {
    query.priority = priority;
  }

  if (minRevenue !== undefined || maxRevenue !== undefined) {
    query.revenue = {};

    if (minRevenue !== undefined) {
      query.revenue.$gte = minRevenue;
    }

    if (maxRevenue !== undefined) {
      query.revenue.$lte = maxRevenue;
    }
  }

  if (minEmployees !== undefined || maxEmployees !== undefined) {
    query.employees = {};

    if (minEmployees !== undefined) {
      query.employees.$gte = minEmployees;
    }

    if (maxEmployees !== undefined) {
      query.employees.$lte = maxEmployees;
    }
  }

  if (minScore !== undefined) {
    query.score = {
      $gte: minScore
    };
  }

  if (search) {
    query.$or = [
      {
        companyName: {
          $regex: search,
          $options: "i"
        }
      },
      {
        industry: {
          $regex: search,
          $options: "i"
        }
      },
      {
        location: {
          $regex: search,
          $options: "i"
        }
      }
    ];
  }

  const skip = (page - 1) * limit;

  const sortDirection = order === "asc" ? 1 : -1;

  const sortField =
    sort === "revenue"
      ? "revenue"
      : sort === "createdAt"
        ? "createdAt"
        : "score";

  const [leads, total] = await Promise.all([
    Lead.find(query)
      .sort({
        [sortField]: sortDirection
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Lead.countDocuments(query)
  ]);

  return {
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getLeadById(id: string) {
  return Lead.findById(id).lean();
}

export async function getLeadStats() {
  const [
    total,
    highPriority,
    mediumPriority,
    lowPriority,
    averageScore
  ] = await Promise.all([
    Lead.countDocuments(),

    Lead.countDocuments({
      priority: "HIGH"
    }),

    Lead.countDocuments({
      priority: "MEDIUM"
    }),

    Lead.countDocuments({
      priority: "LOW"
    }),

    Lead.aggregate([
      {
        $group: {
          _id: null,
          average: {
            $avg: "$score"
          }
        }
      }
    ])
  ]);

  return {
    total,
    highPriority,
    mediumPriority,
    lowPriority,
    averageScore:
      averageScore.length > 0
        ? Math.round(averageScore[0].average)
        : 0
  };
}

function normalizeDomain(website?: string) {
  if (!website) {
    return undefined;
  }

  try {
    let value = website.trim();

    if (!value.startsWith("http")) {
      value = `https://${value}`;
    }

    const url = new URL(value);

    return url.hostname
      .toLowerCase()
      .replace(/^www\./, "");
  } catch {
    return undefined;
  }
}