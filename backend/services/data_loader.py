import pandas as pd
import os
from functools import lru_cache

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "Karnataka_Colleges_Complete.xlsx")


@lru_cache(maxsize=1)
def load_dataset() -> pd.DataFrame:
    df = pd.read_excel(DATA_PATH, header=2, engine="openpyxl")
    df.columns = [
        "aishe_code", "name", "state", "district", "website",
        "year_established", "location_type", "college_type", "management",
        "university_aishe", "university_name", "university_type",
        "program", "entrance_exam", "quota", "closing_rank",
        "fee", "management_fee", "avg_package", "tier"
    ]
    df = df.dropna(subset=["name", "program"])
    df["fee"] = pd.to_numeric(df["fee"], errors="coerce").fillna(0)
    df["management_fee"] = pd.to_numeric(df["management_fee"], errors="coerce").fillna(0)
    df["avg_package"] = pd.to_numeric(df["avg_package"], errors="coerce").fillna(0)
    df["closing_rank"] = pd.to_numeric(df["closing_rank"], errors="coerce")
    df["district"] = df["district"].str.strip().str.title()
    df["program"] = df["program"].str.strip()
    df["entrance_exam"] = df["entrance_exam"].str.strip()
    df["tier"] = df["tier"].str.strip()
    df["location_type"] = df["location_type"].str.strip()
    df["website"] = df["website"].fillna("N/A").str.strip()
    df["aishe_code"] = df["aishe_code"].astype(str).str.strip()
    df["quota"] = df["quota"].str.strip()
    return df


# Career interest → program name mappings
CAREER_PROGRAM_MAP = {
    "engineering": [
        "B.E. Computer Science and Engineering",
        "B.E. Information Science and Engineering",
        "B.E. Electronics and Communication Engineering",
        "B.E. Electrical and Electronics Engineering",
        "B.E. Civil Engineering",
        "B.E. Mechanical Engineering",
        "B.Tech Artificial Intelligence and Machine Learning",
        "B.Tech Data Science",
    ],
    "medical": ["MBBS", "BDS", "BAMS", "BPT (Bachelor of Physiotherapy)", "B.Sc Nursing"],
    "commerce": [
        "B.Com (Bachelor of Commerce)",
        "B.Com (Hons)",
        "BBA (Bachelor of Business Administration)",
    ],
    "arts": ["B.A. (Bachelor of Arts)", "B.A. Economics"],
    "law": ["BA LLB", "BBA LLB", "KLEE"],
    "computer": [
        "BCA (Bachelor of Computer Applications)",
        "B.Sc Computer Science",
        "B.E. Computer Science and Engineering",
        "B.E. Information Science and Engineering",
        "B.Tech Artificial Intelligence and Machine Learning",
        "B.Tech Data Science",
    ],
    "science": [
        "B.Sc (Bachelor of Science)",
        "B.Sc Agriculture",
        "B.Sc Horticulture",
        "B.V.Sc (Veterinary Science)",
    ],
    "pharmacy": ["B.Pharm", "D.Pharm"],
    "architecture": ["B.Arch"],
    "education": ["B.Ed", "M.Ed", "D.El.Ed"],
    "agriculture": ["B.Sc Agriculture", "B.Sc Horticulture", "B.V.Sc (Veterinary Science)"],
    "nursing": ["B.Sc Nursing"],
    "technology": [
        "B.Tech Artificial Intelligence and Machine Learning",
        "B.Tech Data Science",
        "B.E. Computer Science and Engineering",
        "BCA (Bachelor of Computer Applications)",
    ],
}


def get_programs_for_career(career_interest: str) -> list[str]:
    ci = career_interest.lower().strip()
    for key, programs in CAREER_PROGRAM_MAP.items():
        if key in ci:
            return programs
    # fuzzy fallback: match any key that appears in the interest string
    matched = []
    for key, programs in CAREER_PROGRAM_MAP.items():
        if any(word in ci for word in key.split()):
            matched.extend(programs)
    return matched if matched else list(CAREER_PROGRAM_MAP["engineering"])


# Program → required exams
EXAM_MAP = {
    "B.E.": ["CET", "JEE Main", "COMEDK"],
    "B.Tech": ["CET", "JEE Main", "COMEDK"],
    "MBBS": ["NEET UG"],
    "BDS": ["NEET UG"],
    "BAMS": ["NEET UG"],
    "BPT": ["NEET UG", "Karnataka Allied Health Entrance"],
    "B.Sc Nursing": ["Karnataka Nursing Entrance", "NEET UG"],
    "B.Pharm": ["GPAT", "CET"],
    "B.Arch": ["NATA", "JEE Main Paper 2"],
    "BA LLB": ["CLAT", "LSAT India", "KLEE"],
    "BBA LLB": ["CLAT", "LSAT India"],
    "B.Sc Agriculture": ["ICAR AIEEA", "KCET Agriculture"],
    "M.Ed": ["KTET"],
    "BCA": ["Direct Admission", "Merit Based", "CET"],
    "B.Com": ["Merit Based", "Direct Admission"],
    "BBA": ["Merit Based", "Direct Admission"],
    "B.A.": ["Merit Based", "Direct Admission"],
    "B.Sc": ["Merit Based", "CET"],
}


def get_exams_for_program(program: str) -> list[str]:
    for key, exams in EXAM_MAP.items():
        if program.startswith(key) or key in program:
            return exams
    return ["Merit Based", "Direct Admission"]


# Stream eligibility rules
def get_eligible_stream(marks: float, grade: str) -> dict:
    grade = grade.strip()
    if grade == "10th":
        if marks >= 85:
            return {"stream": "Science (PCM/PCB)", "detail": "Eligible for all science streams"}
        elif marks >= 70:
            return {"stream": "Science or Commerce", "detail": "Eligible for Science or Commerce"}
        elif marks >= 50:
            return {"stream": "Commerce or Arts", "detail": "Recommended: Commerce or Arts"}
        else:
            return {"stream": "Arts/Vocational", "detail": "Recommended: Arts or Vocational"}
    else:  # 12th
        if marks >= 80:
            return {"stream": "Any Stream - Top Colleges", "detail": "Eligible for all top colleges"}
        elif marks >= 60:
            return {"stream": "Science/Engineering/Medical", "detail": "Eligible for Science stream"}
        elif marks >= 50:
            return {"stream": "Commerce/Arts", "detail": "Commerce or Arts recommended"}
        else:
            return {"stream": "Arts/Diploma", "detail": "Diploma or Arts pathways available"}


RESOURCE_MAP = {
    "engineering": ["Khan Academy - Physics/Math", "NPTEL Engineering Courses", "GeeksforGeeks CS", "Coursera - Engineering"],
    "medical": ["NEET Prep - Aakash", "Khan Academy - Biology", "NCERT Biology/Chemistry", "Unacademy NEET"],
    "law": ["CLAT Prep - Legal Edge", "Bar & Bench", "Indian Kanoon", "LawSikho Courses"],
    "computer": ["LeetCode", "freeCodeCamp", "CS50 Harvard", "Coursera - Google IT"],
    "commerce": ["CA Foundation Prep", "ICAI Study Material", "Commerce IQ", "Unacademy Commerce"],
    "arts": ["NCERT Arts Portal", "UGC NET Prep", "Fine Arts Resources", "Humanities Net"],
    "science": ["CSIR NET Prep", "NCERT Science", "Khan Academy Science", "Research Gate"],
    "pharmacy": ["PCI Guidelines", "GPAT Prep - PharmacyExam", "Pharma Buzz"],
    "architecture": ["NATA Prep Academy", "Archinect", "ArchDaily Learning"],
    "agriculture": ["ICAR Resources", "AgriExam", "Agri India Portal"],
    "nursing": ["Karnataka Nursing Council", "RGUHS Prep", "NursingExam.in"],
}


def get_resources(career_interest: str) -> list[str]:
    ci = career_interest.lower()
    for key, res in RESOURCE_MAP.items():
        if key in ci:
            return res
    return ["Khan Academy", "Coursera", "NPTEL", "Unacademy"]
