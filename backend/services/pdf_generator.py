from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import io
from models.schemas import PathResponse, UserInput


PURPLE = colors.Color(0.44, 0.18, 0.86)
DARK = colors.Color(0.06, 0.06, 0.12)
LIGHT_PURPLE = colors.Color(0.88, 0.78, 1.0)
WHITE = colors.white
GRAY = colors.Color(0.5, 0.5, 0.5)


def generate_pdf(user: UserInput, path: PathResponse) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "Title", parent=styles["Title"],
        textColor=PURPLE, fontSize=26, spaceAfter=4, alignment=TA_CENTER,
    )
    subtitle_style = ParagraphStyle(
        "Sub", parent=styles["Normal"],
        textColor=GRAY, fontSize=11, spaceAfter=16, alignment=TA_CENTER,
    )
    section_style = ParagraphStyle(
        "Section", parent=styles["Heading2"],
        textColor=PURPLE, fontSize=14, spaceBefore=16, spaceAfter=6,
    )
    body_style = ParagraphStyle(
        "Body", parent=styles["Normal"],
        fontSize=10, textColor=DARK, spaceAfter=4, leading=14,
    )
    node_title_style = ParagraphStyle(
        "NodeTitle", parent=styles["Heading3"],
        textColor=DARK, fontSize=11, spaceBefore=10, spaceAfter=2,
    )

    story = []

    # ── Header ────────────────────────────────────────────────────────────────
    story.append(Paragraph("P.A.T.H.", title_style))
    story.append(Paragraph("Personalized Academic & Career Trajectory Hub", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PURPLE))
    story.append(Spacer(1, 0.4 * cm))

    # ── User Profile ──────────────────────────────────────────────────────────
    story.append(Paragraph("Your Profile", section_style))
    profile_data = [
        ["Field", "Value"],
        ["Grade", user.grade],
        ["Marks", f"{user.marks}%"],
        ["Budget", f"₹{int(user.budget):,}/year"],
        ["Location", user.location],
        ["Career Interest", user.career_interest],
    ]
    profile_table = Table(profile_data, colWidths=[6 * cm, 11 * cm])
    profile_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PURPLE),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("BACKGROUND", (0, 1), (-1, -1), LIGHT_PURPLE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT_PURPLE]),
        ("GRID", (0, 0), (-1, -1), 0.5, PURPLE),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(profile_table)
    story.append(Spacer(1, 0.4 * cm))

    # ── Summary ───────────────────────────────────────────────────────────────
    story.append(Paragraph("Path Summary", section_style))
    story.append(Paragraph(path.summary, body_style))
    story.append(Spacer(1, 0.3 * cm))

    # ── Path Nodes ────────────────────────────────────────────────────────────
    story.append(Paragraph("Your Career Roadmap", section_style))
    for node in path.nodes:
        story.append(Paragraph(f"Step {node.id}: {node.title}", node_title_style))
        story.append(Paragraph(node.description, body_style))

        meta_data = [
            ["Cost", node.cost],
            ["Eligibility", node.eligibility],
        ]
        if node.exams:
            meta_data.append(["Exams", ", ".join(node.exams[:4])])
        if node.resources:
            meta_data.append(["Resources", ", ".join(node.resources[:3])])

        meta_table = Table(meta_data, colWidths=[4 * cm, 13 * cm])
        meta_table.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("TEXTCOLOR", (0, 0), (0, -1), PURPLE),
            ("GRID", (0, 0), (-1, -1), 0.3, colors.Color(0.85, 0.85, 0.85)),
            ("PADDING", (0, 0), (-1, -1), 4),
            ("ROWBACKGROUNDS", (0, 0), (-1, -1), [WHITE, colors.Color(0.97, 0.97, 1.0)]),
        ]))
        story.append(meta_table)

        # College list
        if node.colleges:
            story.append(Spacer(1, 0.2 * cm))
            story.append(Paragraph("Recommended Colleges:", ParagraphStyle(
                "CollegeHead", parent=styles["Normal"],
                fontSize=9, textColor=PURPLE, fontName="Helvetica-Bold",
            )))
            college_data = [["College", "District", "Fee/yr", "Avg Package", "Tier"]]
            for c in node.colleges[:5]:
                college_data.append([
                    Paragraph(c.name[:45], ParagraphStyle("cn", parent=styles["Normal"], fontSize=8)),
                    c.district,
                    f"₹{int(c.fee):,}",
                    f"₹{int(c.avg_package):,}",
                    c.tier,
                ])
            col_table = Table(college_data, colWidths=[6.5 * cm, 3 * cm, 2.5 * cm, 3 * cm, 2 * cm])
            col_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), DARK),
                ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("GRID", (0, 0), (-1, -1), 0.3, GRAY),
                ("PADDING", (0, 0), (-1, -1), 4),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT_PURPLE]),
            ]))
            story.append(col_table)
        story.append(Spacer(1, 0.3 * cm))

    # ── Alternative Paths ─────────────────────────────────────────────────────
    if path.alternative_paths:
        story.append(HRFlowable(width="100%", thickness=0.5, color=PURPLE))
        story.append(Paragraph("Alternative Paths", section_style))
        for alt in path.alternative_paths:
            story.append(Paragraph(f"• {alt.label}", node_title_style))
            for node in alt.nodes:
                story.append(Paragraph(node.description, body_style))
                if node.colleges:
                    for c in node.colleges[:3]:
                        story.append(Paragraph(
                            f"  → {c.name} ({c.district}) | ₹{int(c.fee):,}/yr | {c.tier}",
                            ParagraphStyle("ci", parent=styles["Normal"], fontSize=8, textColor=DARK),
                        ))

    # ── Footer ────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 0.5 * cm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=PURPLE))
    story.append(Paragraph(
        "Generated by P.A.T.H. — Personalized Academic & Career Trajectory Hub | Karnataka 2025",
        ParagraphStyle("Footer", parent=styles["Normal"], fontSize=8, textColor=GRAY, alignment=TA_CENTER),
    ))

    doc.build(story)
    buffer.seek(0)
    return buffer.read()
