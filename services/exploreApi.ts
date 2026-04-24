const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface ExploreInput {
  stream: string;
  marks: number;
  budget: number;
  location: string;
}

export interface JsonPathNode {
  id: number;
  raw_id: number;
  title: string;
  description: string;
  type: string;
  cost: string;
  exams: string[];
  colleges: string[];
  career_outcomes: string[];
  marks_required: number;
  budget_min: number;
  depth: number;
}

export interface JsonPathEdge {
  from: number;
  to: number;
}

export interface JsonPathResponse {
  nodes: JsonPathNode[];
  edges: JsonPathEdge[];
  alternatives: JsonPathNode[];
  summary: string;
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const exploreApi = {
  generatePath: (inp: ExploreInput) =>
    post<JsonPathResponse>(`${BASE}/generate-path-json`, inp),

  branchPath: (stream: string, fromNodeTitle: string, marks: number, budget: number) =>
    post<JsonPathResponse>(`${BASE}/branch-json`, {
      stream,
      from_node_title: fromNodeTitle,
      marks,
      budget,
    }),

  exportPdf: async (inp: ExploreInput, selectedTitles: string[]) => {
    const res = await fetch(`${BASE}/export-pdf-json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ explore_input: inp, selected_node_titles: selectedTitles }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PATH_Career_Explorer.pdf";
    a.click();
    URL.revokeObjectURL(url);
  },

  getStreams: async (): Promise<string[]> => {
    const res = await fetch(`${BASE}/streams`);
    const data = (await res.json()) as { streams: string[] };
    return data.streams;
  },
};
