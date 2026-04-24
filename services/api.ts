const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface UserInput {
  grade: string;
  marks: number;
  budget: number;
  location: string;
  career_interest: string;
}

export interface College {
  aishe_code: string;
  name: string;
  district: string;
  location_type: string;
  program: string;
  entrance_exam: string;
  quota: string;
  closing_rank: number | string;
  fee: number;
  management_fee: number;
  avg_package: number;
  tier: string;
  university: string;
  website: string;
}

export interface PathNode {
  id: number;
  title: string;
  description: string;
  type: string;
  colleges: College[];
  cost: string;
  eligibility: string;
  exams: string[];
  resources: string[];
}

export interface PathEdge {
  from: number;
  to: number;
}

export interface AlternativePath {
  label: string;
  nodes: PathNode[];
  edges: PathEdge[];
}

export interface PathResponse {
  nodes: PathNode[];
  edges: PathEdge[];
  alternative_paths: AlternativePath[];
  summary: string;
}

export async function generatePath(input: UserInput): Promise<PathResponse> {
  const res = await fetch(`${BASE_URL}/generate-path`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function branchPath(
  userInput: UserInput,
  fromNodeId: number,
  fromNodeTitle: string
): Promise<PathResponse> {
  const res = await fetch(`${BASE_URL}/branch-path`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_input: userInput, from_node_id: fromNodeId, from_node_title: fromNodeTitle }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function downloadPDF(input: UserInput): Promise<void> {
  const res = await fetch(`${BASE_URL}/export-pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "PATH_Career_Report.pdf";
  a.click();
  URL.revokeObjectURL(url);
}
