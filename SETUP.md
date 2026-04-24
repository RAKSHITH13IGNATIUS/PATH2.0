# P.A.T.H. — Setup Guide

## Folder Structure

```
ECOM/
├── app/                  # Next.js pages
│   ├── page.tsx          # Landing page
│   └── platform/page.tsx # Main platform
├── components/
│   ├── graph/            # ReactFlow graph components
│   └── ui/               # Form + UI components
├── services/api.ts       # Frontend API client
├── backend/
│   ├── main.py           # FastAPI app
│   ├── routes/           # API routes
│   ├── services/         # Path engine + PDF generator + Data loader
│   ├── models/           # Pydantic schemas
│   └── data/             # Karnataka_Colleges_Complete.xlsx
└── .env.local            # NEXT_PUBLIC_API_URL
```

---

## 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API runs at: http://localhost:8000
Swagger docs: http://localhost:8000/docs

---

## 2. Frontend Setup

```bash
# From project root
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

---

## 3. Environment Variables

`.env.local` (already created):
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate-path` | Generate career path from user input |
| POST | `/api/branch-path` | Branch path from a node |
| POST | `/api/export-pdf` | Download PDF report |

### Sample Request: POST /api/generate-path
```json
{
  "grade": "12th",
  "marks": 78,
  "budget": 150000,
  "location": "Bengaluru Urban",
  "career_interest": "Engineering"
}
```

---

## Dataset Format

File: `backend/data/Karnataka_Colleges_Complete.xlsx`
Sheet: `College Data` (header at row 3)

| Column | Description |
|--------|-------------|
| Aishe Code | College ID |
| Name | College name |
| District | Karnataka district |
| Program_Name | Degree program |
| Entrance_Exam | CET/NEET/JEE/etc |
| Quota | GM/OBC/SC/ST |
| Closing_Rank | Last rank admitted |
| Fee_for_Quota | Annual fee (INR) |
| Management_Quota_Fee | Mgmt seat fee |
| Average_Package | Avg placement package |
| Tier college | Tier 1/2/3 |

---

## How the Rule Engine Works

1. **Stream eligibility** — marks + grade → allowed stream (Science/Commerce/Arts)
2. **Program mapping** — career interest → relevant degree programs
3. **College scoring** — each college scored by:
   - Budget fit (40 pts): fee ≤ budget
   - Location match (25 pts): district match
   - Tier (20 pts): Tier 1 > Tier 2
   - Placement (10 pts): avg package > 5L
4. **Node graph** — stage → exam prep → degree → career (4-5 nodes)
5. **Alternatives** — all-Karnataka search + management quota branch
