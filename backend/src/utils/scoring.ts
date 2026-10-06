export interface LeadScoringInput {
  industry: string;
  targetIndustry?: string;

  revenue?: number;
  employees?: number;
  yearsInBusiness?: number;

  location: string;
  targetLocation?: string;

  contactEmail?: string;
  contactPhone?: string;
}

export interface LeadScoreResult {
  score: number;
  priority: "HIGH" | "MEDIUM" | "LOW";

  breakdown: {
    industryFit: number;
    revenueFit: number;
    geographyFit: number;
    sizeFit: number;
    contactability: number;
    businessMaturity: number;
  };

  recommendation: string;
}

export function calculateLeadScore(
  input: LeadScoringInput
): LeadScoreResult {
  let industryFit = 0;
  let revenueFit = 0;
  let geographyFit = 0;
  let sizeFit = 0;
  let contactability = 0;
  let businessMaturity = 0;

  // Industry — 20 points
  if (
    input.targetIndustry &&
    input.industry.toLowerCase() === input.targetIndustry.toLowerCase()
  ) {
    industryFit = 20;
  } else if (!input.targetIndustry) {
    industryFit = 15;
  }

  // Revenue — 25 points
  if (input.revenue) {
    if (input.revenue >= 2_000_000 && input.revenue <= 20_000_000) {
      revenueFit = 25;
    } else if (
      input.revenue >= 1_000_000 &&
      input.revenue < 2_000_000
    ) {
      revenueFit = 18;
    } else if (input.revenue > 20_000_000) {
      revenueFit = 12;
    } else {
      revenueFit = 8;
    }
  }

  // Geography — 15 points
  if (
    input.targetLocation &&
    input.location.toLowerCase().includes(
      input.targetLocation.toLowerCase()
    )
  ) {
    geographyFit = 15;
  } else if (!input.targetLocation) {
    geographyFit = 10;
  }

  // Company size — 15 points
  if (input.employees) {
    if (input.employees >= 10 && input.employees <= 100) {
      sizeFit = 15;
    } else if (input.employees > 100 && input.employees <= 250) {
      sizeFit = 10;
    } else {
      sizeFit = 6;
    }
  }

  // Contactability — 15 points
  if (input.contactEmail) {
    contactability += 8;
  }

  if (input.contactPhone) {
    contactability += 7;
  }

  // Business maturity — 10 points
  if (input.yearsInBusiness) {
    if (input.yearsInBusiness >= 10) {
      businessMaturity = 10;
    } else if (input.yearsInBusiness >= 5) {
      businessMaturity = 8;
    } else if (input.yearsInBusiness >= 3) {
      businessMaturity = 5;
    } else {
      businessMaturity = 3;
    }
  }

  const score =
    industryFit +
    revenueFit +
    geographyFit +
    sizeFit +
    contactability +
    businessMaturity;

  let priority: "HIGH" | "MEDIUM" | "LOW";

  if (score >= 80) {
    priority = "HIGH";
  } else if (score >= 60) {
    priority = "MEDIUM";
  } else {
    priority = "LOW";
  }

  let recommendation = "Review before outreach";

  if (score >= 80 && contactability >= 12) {
    recommendation = "Contact owner";
  } else if (score >= 70) {
    recommendation = "Enrich contact information";
  } else if (score >= 60) {
    recommendation = "Review business fit";
  }

  return {
    score,
    priority,
    breakdown: {
      industryFit,
      revenueFit,
      geographyFit,
      sizeFit,
      contactability,
      businessMaturity
    },
    recommendation
  };
}