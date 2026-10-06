# Caprae Acquisition Intelligence

A full-stack acquisition intelligence platform designed to help investment and acquisition teams identify, qualify, and prioritize potential acquisition targets.

Instead of giving acquisition teams more leads, the goal of this project is to help them identify **fewer, higher-quality acquisition opportunities** and understand *why* each company is worth pursuing.

---

## 1. Problem Statement

Acquisition teams often have access to large volumes of company and lead data, but the difficult part is determining:

* Which companies best match the acquisition thesis?
* Which opportunities should be reviewed first?
* Which targets have sufficient contact information for outreach?
* Why is one company a better acquisition candidate than another?
* What should the acquisition team do next?

This project addresses that problem through a **Buy Box + Acquisition Fit Score + Prioritization workflow**.

### Core workflow

```text
Potential Companies
        ↓
Normalize & Deduplicate
        ↓
Apply Acquisition Buy Box
        ↓
Calculate Acquisition Fit Score
        ↓
Prioritize Targets
        ↓
Explain Score
        ↓
Recommend Next Action
        ↓
Export for Outreach
```

---

# 2. Product Concept

The platform allows an acquisition professional to define a target profile using criteria such as:

* Industry
* Geography
* Revenue range
* Employee range
* Priority
* Company search

The system then returns prioritized acquisition targets with:

* Acquisition Fit Score
* Priority classification
* Score breakdown
* Company information
* Contact information
* Recommended action
* CSV export

The goal is to move from:

> "Here are many companies."

to:

> "Here are the companies that best fit the acquisition thesis, ranked by priority, with an explanation of why."

---

# 3. Key Features

## Acquisition Buy Box

Users can filter acquisition opportunities by:

* Industry
* Location
* Priority
* Minimum revenue
* Maximum revenue
* Minimum employees
* Maximum employees
* Company search

---

## Acquisition Fit Score

Each lead receives a deterministic score out of 100.

### Scoring model

| Criterion         | Maximum Score |
| ----------------- | ------------: |
| Industry Fit      |            20 |
| Revenue Fit       |            25 |
| Geography Fit     |            15 |
| Company Size      |            15 |
| Contactability    |            15 |
| Business Maturity |            10 |
| **Total**         |       **100** |

This makes the ranking transparent instead of relying on an opaque ranking mechanism.

---

## Priority Classification

|  Score | Priority |
| -----: | -------- |
| 80–100 | HIGH     |
|  60–79 | MEDIUM   |
|   0–59 | LOW      |

---

## Recommended Action

The platform also converts the score into an actionable next step.

Examples:

* **Contact owner**
* **Enrich contact information**
* **Review business fit**
* **Review before outreach**

This is intended to make the output operational rather than simply analytical.

---

## Score Breakdown

Users can open any acquisition target and see how its score was calculated.

Example:

```text
Industry Fit       20 / 20
Revenue Fit        25 / 25
Geography Fit      15 / 15
Company Size       15 / 15
Contactability     15 / 15
Business Maturity  10 / 10
                   --------
                   100 / 100
```

---

## Acquisition Dashboard

The dashboard provides global portfolio-level metrics including:

* Total targets
* High-priority targets
* Average acquisition score
* Medium-priority targets

It also provides current result insights such as:

* Contact-ready targets
* Average revenue
* Top acquisition opportunity

---

## Pagination

The target table supports pagination so that the frontend does not need to load the entire dataset at once.

Example:

```text
Showing 5 of 10 targets
Page 1 of 2
```

---

## CSV Export

Users can export the currently visible acquisition targets as CSV.

Exported fields include:

* Company
* Industry
* Location
* Revenue
* Employees
* Score
* Priority
* Contact
* Email
* Recommendation

---

# 4. Architecture

```text
                    ┌──────────────────────────┐
                    │       React Frontend     │
                    │      TypeScript + Vite   │
                    └────────────┬─────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌──────────────────────────┐
                    │     Node.js Backend      │
                    │ Express + TypeScript     │
                    └────────────┬─────────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │                             │
                  ▼                             ▼
        ┌──────────────────┐          ┌──────────────────┐
        │ Acquisition      │          │ MongoDB          │
        │ Scoring Service  │          │ Lead Data        │
        └──────────────────┘          └──────────────────┘
```

---

# 5. Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* Lucide React

## Backend

* Node.js
* TypeScript
* Express
* Zod
* Mongoose

## Database

* MongoDB

---

# 6. Project Structure

```text
caprae-acquisition-intelligence/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   │
│   │   ├── controllers/
│   │   │   └── lead.controller.ts
│   │   │
│   │   ├── models/
│   │   │   └── lead.model.ts
│   │   │
│   │   ├── routes/
│   │   │   └── lead.routes.ts
│   │   │
│   │   ├── services/
│   │   │   └── lead.service.ts
│   │   │
│   │   ├── utils/
│   │   │   └── scoring.ts
│   │   │
│   │   ├── data/
│   │   │   └── seedLeads.ts
│   │   │
│   │   └── server.ts
│   │
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── api.ts
│   │   ├── main.tsx
│   │   ├── types.ts
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
└── docker-compose.yml
```

---

# 7. API Endpoints

## Health Check

```http
GET /health
```

Example:

```json
{
  "success": true,
  "message": "Caprae Acquisition Intelligence API is running"
}
```

---

## List Leads

```http
GET /api/leads
```

Supports filtering and pagination.

### Query parameters

```text
search
industry
location
priority
minRevenue
maxRevenue
minEmployees
maxEmployees
page
limit
sort
order
```

Example:

```http
GET /api/leads?industry=HVAC&location=Texas&priority=HIGH&page=1&limit=5
```

---

## Get Lead

```http
GET /api/leads/:id
```

Returns a single acquisition target with its score and score breakdown.

---

## Create Lead

```http
POST /api/leads
```

The backend calculates the acquisition score when a lead is created.

---

## Lead Statistics

```http
GET /api/leads/stats
```

Returns global acquisition portfolio metrics.

Example response:

```json
{
  "success": true,
  "data": {
    "total": 10,
    "highPriority": 4,
    "mediumPriority": 4,
    "lowPriority": 2,
    "averageScore": 76.4
  }
}
```

---

# 8. Data Model

Each acquisition target contains information such as:

```text
Company
Domain
Website
Industry
Location
Revenue
Employees
Years in Business
Contact Name
Contact Email
Contact Phone
LinkedIn
Source
Score
Priority
Score Breakdown
Recommendation
```

MongoDB indexes are used for commonly queried fields such as:

* normalized domain
* industry + location
* score
* priority

---

# 9. Deduplication

Company domains are normalized before storing them.

For example:

```text
https://www.example.com/
http://example.com
www.example.com
```

are normalized to the same domain representation.

This helps reduce duplicate acquisition opportunities.

---

# 10. Demo Dataset

For this time-boxed assignment, the project uses a small **synthetic/demo dataset** designed to demonstrate the acquisition prioritization workflow.

The dataset is intentionally structured around acquisition-relevant attributes such as:

* Industry
* Geography
* Revenue
* Employees
* Years in business
* Contact availability

The data should **not be interpreted as live scraped company intelligence**.

Where demo websites or contact information are used, they are placeholders for demonstration purposes.

---

# 11. Why This Approach

The assignment presented a broad lead dataset problem.

Within the five-hour implementation window, I prioritized the feature that I believe provides the highest immediate business value:

### Acquisition Target Prioritization

Instead of attempting to build a large scraping or enrichment pipeline, the application focuses on answering:

> "Which companies should an acquisition team look at first?"

This creates a direct workflow from raw company information to:

```text
Fit → Priority → Explanation → Recommended Action
```

---

# 12. Design Decisions

## Deterministic scoring

The scoring model is intentionally deterministic.

Benefits:

* Easy to understand
* Easy to audit
* Easy to modify
* Easy to explain to an investment team
* Avoids opaque ranking behavior

A future version could support configurable scoring weights based on a specific acquisition thesis.

---

## Backend-driven filtering

Filtering, sorting and pagination are performed through the backend API rather than loading the entire dataset into the browser.

This makes the architecture more suitable for larger datasets.

---

## Global vs visible metrics

Dashboard portfolio metrics are retrieved from the backend statistics endpoint.

Table-level insights are based on the currently visible result set.

This distinction prevents pagination from incorrectly changing global acquisition metrics.

---

# 13. Local Development

## Prerequisites

Install:

* Node.js 20+
* MongoDB
* npm

---

## Clone Repository

```bash
git clone https://github.com/rahul-sharma-sh/caprae-acquisition-intelligence
cd caprae-acquisition-intelligence
```

---

# 14. Backend Setup

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Add:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/caprae-acquisition-intelligence
```

Start MongoDB.

Then seed the demo dataset:

```bash
npm run seed
```

Start backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:4000
```

Health check:

```text
http://localhost:4000/health
```

---

# 15. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 16. Production Build

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd backend
npm run build
```

---

# 17. Environment Configuration

For production deployment, the frontend API URL should be configurable through an environment variable.

Example:

```env
VITE_API_URL=https://caprae-acquisition-intelligence.onrender.com/api
```

The backend should similarly use environment variables for:

```env
PORT=
MONGODB_URI=
```

Production CORS should be restricted to the deployed frontend domain.

---

# 18. Five-Hour Implementation Trade-offs

Because the assignment was intentionally time-boxed, development focused on the highest-value workflow.

### Prioritized

* Acquisition Buy Box
* Acquisition scoring
* Priority ranking
* Score transparency
* Recommended actions
* Search and filtering
* Pagination
* Dashboard statistics
* CSV export
* Detail view

### Deferred

* Live external data ingestion
* Large-scale web scraping
* Automated enrichment
* Email outreach automation
* CRM integrations
* Authentication and role management
* Advanced ML-based acquisition prediction
* Configurable scoring rules UI

The architecture leaves room for these capabilities to be added later.

---

# 19. Future Improvements

If extended beyond the assignment time limit, the next improvements would be:

### 1. Real data ingestion

Integrate approved company data providers and public sources.

### 2. Configurable Buy Boxes

Allow investment teams to save multiple acquisition theses.

Example:

```text
Healthcare Services
$2M–$15M Revenue
10–100 Employees
Southeast US
```

### 3. Advanced enrichment

Add:

* Ownership information
* Funding history
* Acquisition history
* Technology stack
* Employee growth
* Website signals
* Industry trends

### 4. Acquisition readiness signals

Introduce additional indicators such as:

* Founder/owner age
* Business tenure
* Growth trajectory
* Customer concentration
* Geographic expansion
* Market position

### 5. CRM workflow

Allow acquisition teams to move targets through:

```text
New
→ Research
→ Contacted
→ Interested
→ NDA
→ Due Diligence
→ LOI
→ Closed
```

### 6. Configurable scoring

Allow users to adjust scoring weights depending on their acquisition strategy.

### 7. Authentication

Add secure user authentication and role-based access for investment teams.

---

# 20. Demo Video

Project Links
Live Demo

https://caprae-acquisition-intelligence.vercel.app/

GitHub Repository

https://github.com/rahul-sharma-sh/caprae-acquisition-intelligence

Demo Video

https://drive.google.com/file/d/1aEo6kEbOv40cJAvaTUL3TnTGiv_XPinX/view?usp=sharing

The demo covers:

1. Acquisition dashboard
2. Buy Box filtering
3. Acquisition Fit Score
4. Score breakdown
5. Top acquisition opportunity
6. Target detail drawer
7. Pagination
8. CSV export

---

# 21. Evaluation Alignment

| Evaluation Area   | Implementation                                             |
| ----------------- | ---------------------------------------------------------- |
| Business Use Case | Acquisition target prioritization                          |
| UX/UI             | Clean acquisition dashboard and Buy Box                    |
| Technicality      | React + TypeScript + Node + MongoDB                        |
| Design            | Layered backend architecture + scoring service             |
| Other             | Transparent scoring, pagination, CSV export, demo workflow |

---

# 22. Summary

Caprae Acquisition Intelligence is designed around one core objective:

> **Help acquisition teams spend less time sorting through companies and more time evaluating the companies most likely to fit their acquisition thesis.**

The platform turns company data into a prioritized acquisition workflow:

```text
Company Data
     ↓
Buy Box
     ↓
Fit Score
     ↓
Priority
     ↓
Why This Lead?
     ↓
Recommended Action
     ↓
Outreach / Review
```

This provides a practical foundation that can later evolve into a larger acquisition intelligence and workflow platform.
