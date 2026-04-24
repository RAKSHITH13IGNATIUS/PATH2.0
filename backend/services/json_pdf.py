"""PDF generator for JSON-tree based career paths."""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import io
from models.json_schemas import ExploreInput, JsonPathResponse, JsonPathNode

PURPLE = colors.Color(0.44, 0.18, 0.86)
DARK = colors.Color(0.06, 0.06, 0.12)
LIGHT_PURPLE = colors.Color(0.92, 0.86, 1.0)
VIOLET = colors.Color(0.6, 0.3, 0.9)
WHITE = colors.white
GRAY = colors.Color(0.5, 0.5, 0.5)
DARK_ROW = colors.Color(0.96, 0.94, 1.0)

TYPE_COLORS = {
    "degree": colors.Color(0.85, 0.78, 1.0),
    "exam": colors.Color(0.78, 0.9, 0.78),
    "stream": colors.Color(0.78, 0.88, 1.0),
    "substream": colors.Color(0.95, 0.95, 1.0),
    "option": colors.Color(0.95, 0.92, 1.0),
}


def _type_badge_color(t: str) -> colors.Color:
    return TYPE_COLORS.get(t, DARK_ROW)


def generate_json_pdf(
    user: ExploreInput,
    path: JsonPathResponse,
    selected_titles: list[str],
) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=2 * cm, leftMargin=2 * cm,
        topMargin=2 * cm, bottomMargin=2 * cm,
    )
    styles = getSampleStyleSheet()

    title_s = ParagraphStyle("T", parent=styles["Title"], textColor=PURPLE, fontSize=24, spaceAfter=4, alignment=TA_CENTER)
    sub_s = ParagraphStyle("S", parent=styles["Normal"], textColor=GRAY, fontSize=10, spaceAfter=14, alignment=TA_CENTER)
    sec_s = ParagraphStyle("Sec", parent=styles["Heading2"], textColor=PURPLE, fontSize=13, spaceBefore=14, spaceAfter=5)
    body_s = ParagraphStyle("B", parent=styles["Normal"], fontSize=9, textColor=DARK, spaceAfter=3, leading=13)
    node_title_s = ParagraphStyle("NT", parent=styles["Heading3"], textColor=DARK, fontSize=11, spaceBefore=8, spaceAfter=2)
    small_s = ParagraphStyle("Sm", parent=styles["Normal"], fontSize=8, textColor=GRAY, leading=11)

    story = []

    # ── Title ─────────────────────────────────────────────────────────────────
    story.append(Paragraph("P.A.T.H.", title_s))
    story.append(Paragraph("Personalized Academic & Career Trajectory Hub — Career Explorer", sub_s))
    story.append(HRFlowable(width="100%", thickness=1, color=PURPLE))
    story.append(Spacer(1, 0.4 * cm))

    # ── Profile ───────────────────────────────────────────────────────────────
    story.append(Paragraph("Your Profile", sec_s))
    profile_data = [
        ["Stream", user.stream],
        ["Marks", f"{user.marks}%"],
        ["Annual Budget", f"₹{int(user.budget):,}"],
        ["Location Preference", user.location or "All India"],
    ]
    pt = Table(profile_data, colWidths=[5 * cm, 12 * cm])
    pt.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("TEXTCOLOR", (0, 0), (0, -1), PURPLE),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [WHITE, DARK_ROW]),
        ("GRID", (0, 0), (-1, -1), 0.4, LIGHT_PURPLE),
        ("PADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(pt)
    story.append(Spacer(1, 0.3 * cm))

    # ── Summary ───────────────────────────────────────────────────────────────
    story.append(Paragraph("Path Summary", sec_s))
    story.append(Paragraph(path.summary, body_s))
    story.append(Spacer(1, 0.3 * cm))

    # ── Eligible Paths ────────────────────────────────────────────────────────
    story.append(Paragraph("Eligible Career Paths", sec_s))
    degree_exam_nodes = [n for n in path.nodes if n.type in ("degree", "exam", "stream")]

    for node in degree_exam_nodes:
        highlighted = node.title in selected_titles
        bg = LIGHT_PURPLE if highlighted else WHITE

        block = []
        block.append(Paragraph(
            f"{'★ ' if highlighted else ''}  {node.title}",
            ParagraphStyle("nh", parent=styles["Heading3"], textColor=PURPLE if highlighted else DARK,
                           fontSize=10, spaceBefore=6, spaceAfter=2)
        ))

        meta = [
            ["Type", node.type.capitalize()],
            ["Cost", node.cost],
            ["Eligibility", node.description],
        ]
        if node.exams:
            meta.append(["Entrance Exams", ", ".join(node.exams[:5])])
        if node.colleges:
            meta.append(["Top Colleges", ", ".join(node.colleges[:4])])
        if node.career_outcomes:
            meta.append(["Career Outcomes", ", ".join(node.career_outcomes[:4])])

        mt = Table(meta, colWidths=[4 * cm, 13 * cm])
        mt.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("TEXTCOLOR", (0, 0), (0, -1), VIOLET),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("ROWBACKGROUNDS", (0, 0), (-1, -1), [bg, DARK_ROW]),
            ("GRID", (0, 0), (-1, -1), 0.3, LIGHT_PURPLE),
            ("PADDING", (0, 0), (-1, -1), 4),
        ]))
        block.append(mt)
        story.append(KeepTogether(block))
        story.append(Spacer(1, 0.2 * cm))

    # ── Alternatives ──────────────────────────────────────────────────────────
    if path.alternatives:
        story.append(HRFlowable(width="100%", thickness=0.5, color=PURPLE))
        story.append(Paragraph("Alternative Paths (Stretch Goals)", sec_s))
        story.append(Paragraph(
            "These paths are currently just out of reach — improve your marks or increase budget to unlock them.",
            body_s
        ))
        alt_rows = [["Path", "Cost", "Reason Blocked", "Exams"]]
        for alt in path.alternatives[:8]:
            alt_rows.append([
                Paragraph(alt.title, small_s),
                alt.cost,
                Paragraph(alt.description[:60], small_s),
                ", ".join(alt.exams[:2]),
            ])
        at = Table(alt_rows, colWidths=[5 * cm, 3 * cm, 5 * cm, 4 * cm])
        at.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), DARK),
            ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT_PURPLE]),
            ("GRID", (0, 0), (-1, -1), 0.3, GRAY),
            ("PADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(at)

    # ── Cost Summary ──────────────────────────────────────────────────────────
    story.append(Spacer(1, 0.4 * cm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=PURPLE))
    story.append(Paragraph("Cost Summary", sec_s))

    cost_rows = [["Path", "Cost Range", "Budget Match"]]
    for node in degree_exam_nodes[:10]:
        match = "✓ Within Budget" if node.budget_min <= user.budget else f"✗ Need ₹{node.budget_min:,}"
        cost_rows.append([node.title[:40], node.cost, match])

    ct = Table(cost_rows, colWidths=[8 * cm, 4 * cm, 5 * cm])
    ct.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PURPLE),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT_PURPLE]),
        ("GRID", (0, 0), (-1, -1), 0.3, LIGHT_PURPLE),
        ("PADDING", (0, 0), (-1, -1), 4),
        ("TEXTCOLOR", (2, 1), (2, -1), colors.Color(0.1, 0.5, 0.1)),
    ]))
    story.append(ct)

    # ── Footer ────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 0.5 * cm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=PURPLE))
    story.append(Paragraph(
        "Generated by P.A.T.H. — Personalized Academic & Career Trajectory Hub | All India 2025",
        ParagraphStyle("Ft", parent=styles["Normal"], fontSize=7, textColor=GRAY, alignment=TA_CENTER),
    ))

    doc.build(story)
    buffer.seek(0)
    return buffer.read()
