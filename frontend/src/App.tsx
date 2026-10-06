import { useEffect, useState } from "react";
import {
  Building2,
  ChevronDown,
  Download,
  MapPin,
  Search,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import { api } from "./api";
import type { Lead, LeadStats, LeadsResponse, StatsResponse } from "./types";

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [stats, setStats] = useState<LeadStats>({
    total: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    averageScore: 0,
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("");

  const [minRevenue, setMinRevenue] = useState("");
  const [maxRevenue, setMaxRevenue] = useState("");
  const [minEmployees, setMinEmployees] = useState("");
  const [maxEmployees, setMaxEmployees] = useState("");

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  const limit = 5;

  // --------------------------------------------------
  // Fetch Leads
  // --------------------------------------------------

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", String(limit));

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (industry) {
        params.set("industry", industry);
      }

      if (location) {
        params.set("location", location);
      }

      if (priority) {
        params.set("priority", priority);
      }

      if (minRevenue) {
        params.set("minRevenue", minRevenue);
      }

      if (maxRevenue) {
        params.set("maxRevenue", maxRevenue);
      }

      if (minEmployees) {
        params.set("minEmployees", minEmployees);
      }

      if (maxEmployees) {
        params.set("maxEmployees", maxEmployees);
      }

      params.set("sort", "score");
      params.set("order", "desc");

      const response = await api.get<LeadsResponse>("/leads", {
        params: Object.fromEntries(params),
      });

      console.log("LEADS API RESPONSE:", response.data);

      setLeads(response.data.data.leads);
      setTotalPages(response.data.data.pagination.totalPages);
      setTotalLeads(response.data.data.pagination.total);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      setLeads([]);
      setTotalPages(1);
      setTotalLeads(0);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Fetch Global Stats
  // --------------------------------------------------

  const fetchStats = async () => {
    try {
      const response = await api.get<StatsResponse>("/leads/stats");

      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  // --------------------------------------------------
  // Effects
  // --------------------------------------------------

  useEffect(() => {
    fetchLeads();
  }, [
    page,
    search,
    industry,
    location,
    priority,
    minRevenue,
    maxRevenue,
    minEmployees,
    maxEmployees,
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  function handleSearch() {
    setPage(1);
    fetchLeads();
  }

  // --------------------------------------------------
  // Reset Filters
  // --------------------------------------------------

  function resetFilters() {
    setSearch("");
    setIndustry("");
    setLocation("");
    setPriority("");
    setMinRevenue("");
    setMaxRevenue("");
    setMinEmployees("");
    setMaxEmployees("");
    setPage(1);
  }

  // --------------------------------------------------
  // CSV Export
  // --------------------------------------------------

  function exportCsv() {
    if (leads.length === 0) {
      return;
    }

    const headers = [
      "Company",
      "Industry",
      "Location",
      "Revenue",
      "Employees",
      "Score",
      "Priority",
      "Contact",
      "Email",
      "Recommendation",
    ];

    const rows = leads.map((lead) => [
      lead.companyName,
      lead.industry,
      lead.location,
      lead.revenue ?? "",
      lead.employees ?? "",
      lead.score,
      lead.priority,
      lead.contactName ?? "",
      lead.contactEmail ?? "",
      lead.recommendation,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "caprae-qualified-leads.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // --------------------------------------------------
  // Derived UI Data
  // --------------------------------------------------

  const contactReady = leads.filter(
    (lead) =>
      Boolean(lead.contactEmail) || Boolean(lead.contactPhone),
  ).length;

  const topOpportunity =
    leads.length > 0
      ? [...leads].sort((a, b) => b.score - a.score)[0]
      : null;

  const averageRevenue =
    leads.length > 0
      ? leads.reduce(
          (sum, lead) => sum + (lead.revenue || 0),
          0,
        ) / leads.length
      : 0;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {/* =====================================================
          Header
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Target size={21} />
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Acquisition Intelligence
              </h1>

              <p className="text-xs text-slate-500">
                Lead sourcing & qualification
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={exportCsv}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            <Download size={16} />
            Export Leads
          </button>
        </div>
      </header>

      {/* =====================================================
          Main
      ====================================================== */}

      <main className="mx-auto max-w-[1500px] px-6 py-7">

        {/* ===================================================
            Global Stats
        ==================================================== */}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Targets"
            value={stats.total}
            icon={<Building2 size={19} />}
            description="Qualified companies"
          />

          <StatCard
            title="High Priority"
            value={stats.highPriority}
            icon={<TrendingUp size={19} />}
            description="Strong acquisition fit"
          />

          <StatCard
            title="Average Score"
            value={`${stats.averageScore}/100`}
            icon={<Target size={19} />}
            description="Overall acquisition fit"
          />

          <StatCard
            title="Medium Priority"
            value={stats.mediumPriority}
            icon={<Users size={19} />}
            description="Require further qualification"
          />
        </section>

        {/* ===================================================
            Acquisition Buy Box
        ==================================================== */}

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold">
              Acquisition Buy Box
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Define your target criteria to prioritize acquisition
              opportunities.
            </p>
          </div>

          {/* Top Opportunity */}

          {topOpportunity && (
            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Top Acquisition Opportunity
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    {topOpportunity.companyName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {topOpportunity.industry} ·{" "}
                    {topOpportunity.location}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">
                    {topOpportunity.score}
                  </p>

                  <p className="text-xs font-medium text-slate-500">
                    Acquisition Fit Score
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">

            {/* Search */}

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search companies..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>

            {/* Industry */}

            <SelectFilter
              value={industry}
              onChange={(value) => {
                setIndustry(value);
                setPage(1);
              }}
              options={[
                "HVAC",
                "Roofing",
                "Dental",
                "Industrial Distribution",
                "IT Services",
                "Property Services",
                "Equipment Repair",
                "Logistics",
                "Manufacturing",
                "Accounting",
              ]}
              placeholder="Industry"
            />

            {/* Location */}

            <SelectFilter
              value={location}
              onChange={(value) => {
                setLocation(value);
                setPage(1);
              }}
              options={[
                "Texas",
                "Florida",
                "Colorado",
                "Illinois",
                "Georgia",
                "Ohio",
                "Arizona",
              ]}
              placeholder="Location"
            />

            {/* Priority */}

            <SelectFilter
              value={priority}
              onChange={(value) => {
                setPriority(value);
                setPage(1);
              }}
              options={["HIGH", "MEDIUM", "LOW"]}
              placeholder="Priority"
            />

            {/* Apply */}

            <button
              type="button"
              onClick={() => setPage(1)}
              className="h-11 rounded-lg bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-700"
            >
              Apply
            </button>
          </div>

          {/* Revenue / Employee Filters */}

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input
              type="number"
              value={minRevenue}
              onChange={(e) => {
                setMinRevenue(e.target.value);
                setPage(1);
              }}
              placeholder="Min revenue ($)"
              className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
            />

            <input
              type="number"
              value={maxRevenue}
              onChange={(e) => {
                setMaxRevenue(e.target.value);
                setPage(1);
              }}
              placeholder="Max revenue ($)"
              className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
            />

            <input
              type="number"
              value={minEmployees}
              onChange={(e) => {
                setMinEmployees(e.target.value);
                setPage(1);
              }}
              placeholder="Min employees"
              className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
            />

            <input
              type="number"
              value={maxEmployees}
              onChange={(e) => {
                setMaxEmployees(e.target.value);
                setPage(1);
              }}
              placeholder="Max employees"
              className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          {/* Filter Footer */}

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {leads.length} of {totalLeads} targets
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Clear filters
            </button>
          </div>
        </section>

        {/* ===================================================
            Current Page Insights
        ==================================================== */}

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InsightCard
            title="High Priority"
            value={stats.highPriority}
            description="Immediate acquisition candidates"
          />

          <InsightCard
            title="Medium Priority"
            value={stats.mediumPriority}
            description="Require further qualification"
          />

          <InsightCard
            title="Contact Ready"
            value={`${contactReady}/${leads.length}`}
            description="Visible targets with contact data"
          />

          <InsightCard
            title="Average Revenue"
            value={formatRevenue(averageRevenue)}
            description="Across visible targets"
          />
        </section>

        {/* ===================================================
            Lead Table
        ==================================================== */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold">
              Qualified Acquisition Targets
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Prioritized targets based on acquisition fit score.
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading acquisition targets...
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-medium text-slate-700">
                No matching targets
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your buy box filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3 font-medium">
                      Company
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Industry
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Location
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Revenue
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Employees
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Fit Score
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Priority
                    </th>

                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead) => (
                    <LeadRow
                      key={lead._id}
                      lead={lead}
                      onClick={() => setSelectedLead(lead)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}

          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
            <div className="text-sm text-slate-500">
              Showing {leads.length} of {totalLeads} targets
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                  setPage((current) => current - 1)
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="px-2 text-sm font-medium text-slate-600">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) => current + 1)
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          Detail Drawer
      ====================================================== */}

      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}

// ==========================================================
// Stat Card
// ==========================================================

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

// ==========================================================
// Insight Card
// ==========================================================

function InsightCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-semibold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

// ==========================================================
// Select Filter
// ==========================================================

function SelectFilter({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 pr-9 text-sm outline-none focus:border-slate-400 focus:bg-white"
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-3.5 text-slate-400"
      />
    </div>
  );
}

// ==========================================================
// Lead Row
// ==========================================================

function LeadRow({
  lead,
  onClick,
}: {
  lead: Lead;
  onClick: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className="cursor-pointer border-b border-slate-100 transition hover:bg-slate-50"
    >
      <td className="px-5 py-4">
        <div className="font-medium text-slate-900">
          {lead.companyName}
        </div>

        {lead.contactName && (
          <div className="mt-1 text-xs text-slate-500">
            Owner: {lead.contactName}
          </div>
        )}
      </td>

      <td className="px-5 py-4 text-sm text-slate-600">
        {lead.industry}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <MapPin size={14} />
          {lead.location}
        </div>
      </td>

      <td className="px-5 py-4 text-sm font-medium">
        {formatRevenue(lead.revenue)}
      </td>

      <td className="px-5 py-4 text-sm text-slate-600">
        {lead.employees ?? "—"}
      </td>

      <td className="px-5 py-4">
        <ScoreBadge score={lead.score} />
      </td>

      <td className="px-5 py-4">
        <PriorityBadge priority={lead.priority} />
      </td>

      <td className="px-5 py-4 text-right">
        <span className="text-xs font-medium text-slate-500">
          View →
        </span>
      </td>
    </tr>
  );
}

// ==========================================================
// Score Badge
// ==========================================================

function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-800"
          style={{
            width: `${score}%`,
          }}
        />
      </div>

      <span className="text-sm font-semibold">
        {score}
      </span>
    </div>
  );
}

// ==========================================================
// Priority Badge
// ==========================================================

function PriorityBadge({
  priority,
}: {
  priority: Lead["priority"];
}) {
  const classes =
    priority === "HIGH"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : priority === "MEDIUM"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      {priority}
    </span>
  );
}

// ==========================================================
// Lead Drawer
// ==========================================================

function LeadDrawer({
  lead,
  onClose,
}: {
  lead: Lead;
  onClose: () => void;
}) {
  const breakdown = [
    ["Industry Fit", lead.scoreBreakdown.industryFit, 20],
    ["Revenue Fit", lead.scoreBreakdown.revenueFit, 25],
    ["Geography Fit", lead.scoreBreakdown.geographyFit, 15],
    ["Company Size", lead.scoreBreakdown.sizeFit, 15],
    ["Contactability", lead.scoreBreakdown.contactability, 15],
    ["Business Maturity", lead.scoreBreakdown.businessMaturity, 10],
  ];

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-900/30"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Acquisition Target
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              {lead.companyName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-7 p-6">

          {/* Score */}

          <div className="rounded-2xl bg-slate-900 p-5 text-white">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-300">
                  Acquisition Fit
                </p>

                <p className="mt-1 text-4xl font-semibold">
                  {lead.score}
                  <span className="text-lg text-slate-400">
                    /100
                  </span>
                </p>
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">
                {lead.priority} PRIORITY
              </span>
            </div>
          </div>

          {/* Recommendation */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Recommended Action
            </p>

            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-medium">
                {lead.recommendation}
              </p>
            </div>
          </div>

          {/* Why */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Why this lead?
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              This target received a{" "}
              <strong>{lead.score}/100</strong>{" "}
              acquisition fit score based on industry,
              revenue, geography, company size,
              contactability and business maturity.
            </p>
          </div>

          {/* Breakdown */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Score Breakdown
            </p>

            <div className="mt-3 space-y-4">
              {breakdown.map(([label, value, max]) => (
                <div key={String(label)}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-slate-600">
                      {label}
                    </span>

                    <span className="font-medium">
                      {value}/{max}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-800"
                      style={{
                        width: `${
                          (Number(value) / Number(max)) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Information */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Company Information
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <InfoItem
                label="Industry"
                value={lead.industry}
              />

              <InfoItem
                label="Location"
                value={lead.location}
              />

              <InfoItem
                label="Revenue"
                value={formatRevenue(lead.revenue)}
              />

              <InfoItem
                label="Employees"
                value={
                  lead.employees
                    ? String(lead.employees)
                    : "—"
                }
              />

              <InfoItem
                label="Years in Business"
                value={
                  lead.yearsInBusiness
                    ? String(lead.yearsInBusiness)
                    : "—"
                }
              />

              <InfoItem
                label="Source"
                value={lead.source}
              />
            </div>
          </div>

          {/* Contact */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Contact
            </p>

            <div className="mt-3 rounded-xl border border-slate-200 p-4">
              <p className="font-medium">
                {lead.contactName ||
                  "Contact not available"}
              </p>

              {lead.contactEmail && (
                <p className="mt-2 text-sm text-slate-600">
                  {lead.contactEmail}
                </p>
              )}

              {lead.contactPhone && (
                <p className="mt-1 text-sm text-slate-600">
                  {lead.contactPhone}
                </p>
              )}
            </div>
          </div>

          {/* Website */}

          {lead.website && (
            <a
              href={lead.website}
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white hover:bg-slate-700"
            >
              Visit Company Website
            </a>
          )}
        </div>
      </aside>
    </div>
  );
}

// ==========================================================
// Info Item
// ==========================================================

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}

// ==========================================================
// Revenue Formatter
// ==========================================================

function formatRevenue(revenue?: number) {
  if (!revenue) {
    return "—";
  }

  if (revenue >= 1_000_000) {
    return `$${(revenue / 1_000_000).toFixed(1)}M`;
  }

  if (revenue >= 1_000) {
    return `$${(revenue / 1_000).toFixed(0)}K`;
  }

  return `$${revenue}`;
}

export default App;