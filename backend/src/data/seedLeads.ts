import { connectDatabase } from "../config/database.js";
import { Lead } from "../models/lead.model.js";
import { createLead } from "../services/lead.service.js";

const sampleLeads = [
  // =========================
  // HIGH PRIORITY
  // =========================
  {
    companyName: "Summit HVAC Services",
    website: "https://summithvac.example.com",
    industry: "HVAC",
    location: "Dallas, Texas",
    revenue: 4200000,
    employees: 28,
    yearsInBusiness: 14,
    contactName: "Michael Carter",
    contactEmail: "michael@example.com",
    contactPhone: "+1-555-0101",
    source: "Demo Dataset",
    targetIndustry: "HVAC",
    targetLocation: "Texas"
  },

  {
    companyName: "Blue Ridge Commercial Roofing",
    website: "https://blueridge.example.com",
    industry: "Roofing",
    location: "Austin, Texas",
    revenue: 6800000,
    employees: 42,
    yearsInBusiness: 18,
    contactName: "Sarah Mitchell",
    contactEmail: "sarah@example.com",
    contactPhone: "+1-555-0102",
    source: "Demo Dataset",
    targetIndustry: "Roofing",
    targetLocation: "Texas"
  },

  {
    companyName: "Precision Industrial Supply",
    website: "https://precisionindustrial.example.com",
    industry: "Industrial Distribution",
    location: "Houston, Texas",
    revenue: 12500000,
    employees: 76,
    yearsInBusiness: 21,
    contactName: "Robert Davis",
    contactEmail: "robert@example.com",
    contactPhone: "+1-555-0104",
    source: "Demo Dataset",
    targetIndustry: "Industrial Distribution",
    targetLocation: "Texas"
  },

  {
    companyName: "Pioneer Logistics Group",
    website: "https://pioneerlogistics.example.com",
    industry: "Logistics",
    location: "Atlanta, Georgia",
    revenue: 9200000,
    employees: 65,
    yearsInBusiness: 13,
    contactName: "Christopher Lee",
    contactEmail: "chris@example.com",
    contactPhone: "+1-555-0108",
    source: "Demo Dataset",
    targetIndustry: "Logistics",
    targetLocation: "Georgia"
  },

  // =========================
  // MEDIUM PRIORITY
  // =========================
  {
    companyName: "Evergreen Dental Partners",
    website: "https://evergreendental.example.com",
    industry: "Dental",
    location: "Tampa, Florida",
    revenue: 3100000,
    employees: 24,
    yearsInBusiness: 11,
    contactName: "James Wilson",
    contactEmail: "james@example.com",
    source: "Demo Dataset",

    // Strong geography fit but different target industry
    targetIndustry: "Healthcare Services",
    targetLocation: "Florida"
  },

  {
    companyName: "Northstar IT Solutions",
    website: "https://northstarit.example.com",
    industry: "IT Services",
    location: "Denver, Colorado",
    revenue: 1800000,
    employees: 19,
    yearsInBusiness: 9,
    contactName: "Daniel Brown",
    contactEmail: "daniel@example.com",
    source: "Demo Dataset",

    // Geography fits, industry does not
    targetIndustry: "Business Services",
    targetLocation: "Colorado"
  },

  {
    companyName: "Coastal Property Services",
    website: "https://coastalproperty.example.com",
    industry: "Property Services",
    location: "Miami, Florida",
    revenue: 2400000,
    employees: 31,
    yearsInBusiness: 12,
    contactPhone: "+1-555-0106",
    source: "Demo Dataset",

    // Geography fits, industry does not
    targetIndustry: "Facilities Services",
    targetLocation: "Florida"
  },

  {
    companyName: "Midwest Equipment Repair",
    website: "https://midwestequipment.example.com",
    industry: "Equipment Repair",
    location: "Chicago, Illinois",
    revenue: 3900000,
    employees: 37,
    yearsInBusiness: 16,
    contactName: "Andrew Taylor",
    contactEmail: "andrew@example.com",
    contactPhone: "+1-555-0107",
    source: "Demo Dataset",

    // Broader target geography and industry mismatch
    targetIndustry: "Industrial Services",
    targetLocation: "Illinois"
  },

  // =========================
  // LOW PRIORITY
  // =========================
  {
    companyName: "Lakeside Manufacturing",
    website: "https://lakesidemanufacturing.example.com",
    industry: "Manufacturing",
    location: "Cleveland, Ohio",
    revenue: 15000000,
    employees: 95,
    yearsInBusiness: 24,
    contactName: "Mark Anderson",
    contactEmail: "mark@example.com",
    source: "Demo Dataset",

    // Both industry and geography are outside the target buy box
    targetIndustry: "Specialty Services",
    targetLocation: "Texas"
  },

  {
    companyName: "BrightPath Accounting",
    website: "https://brightpath.example.com",
    industry: "Accounting",
    location: "Phoenix, Arizona",
    revenue: 1200000,
    employees: 12,
    yearsInBusiness: 8,
    contactName: "Emily Johnson",
    contactEmail: "emily@example.com",
    source: "Demo Dataset",

    // Both industry and geography are outside the target buy box
    targetIndustry: "Professional Services",
    targetLocation: "Texas"
  }
];

async function seed() {
  try {
    await connectDatabase();

    await Lead.deleteMany({});

    for (const lead of sampleLeads) {
      await createLead(lead);
    }

    console.log(
      `Seeded ${sampleLeads.length} acquisition targets`
    );

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();