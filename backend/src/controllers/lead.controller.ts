import { Request, Response } from "express";
import {
  createLead,
  getLeadById,
  getLeadStats,
  getLeads
} from "../services/lead.service.js";

export async function createLeadController(
  req: Request,
  res: Response
) {
  try {
    const result = await createLead(req.body);

    res.status(result.duplicated ? 200 : 201).json({
      success: true,
      duplicated: result.duplicated,
      message: result.duplicated
        ? "Lead already exists"
        : "Lead created successfully",
      data: result.lead
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create lead"
    });
  }
}

export async function listLeadsController(
  req: Request,
  res: Response
) {
  try {
    const result = await getLeads({
      industry: req.query.industry as string,
      location: req.query.location as string,
      priority: req.query.priority as
        | "HIGH"
        | "MEDIUM"
        | "LOW"
        | undefined,

      minRevenue: req.query.minRevenue
        ? Number(req.query.minRevenue)
        : undefined,

      maxRevenue: req.query.maxRevenue
        ? Number(req.query.maxRevenue)
        : undefined,

      minEmployees: req.query.minEmployees
        ? Number(req.query.minEmployees)
        : undefined,

      maxEmployees: req.query.maxEmployees
        ? Number(req.query.maxEmployees)
        : undefined,

      minScore: req.query.minScore
        ? Number(req.query.minScore)
        : undefined,

      search: req.query.search as string,

      page: req.query.page
        ? Number(req.query.page)
        : 1,

      limit: req.query.limit
        ? Number(req.query.limit)
        : 20,

      sort:
        req.query.sort === "revenue" ||
        req.query.sort === "createdAt"
          ? req.query.sort
          : "score",

      order:
        req.query.order === "asc"
          ? "asc"
          : "desc"
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leads"
    });
  }
}

export async function getLeadController(
  req: Request,
  res: Response
) {
  try {
    const leadId = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;

const lead = await getLeadById(leadId);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found"
      });

      return;
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lead"
    });
  }
}

export async function statsController(
  _req: Request,
  res: Response
) {
  try {
    const stats = await getLeadStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics"
    });
  }
}