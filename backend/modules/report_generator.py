from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from datetime import datetime
from rdkit import Chem
from rdkit.Chem import Draw

def generate_pdf(data):
    """
    Creates a professional PDF Lab Report with Molecule Image.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()

    # --- 1. Custom Styles ---
    title_style = ParagraphStyle('MainTitle', parent=styles['Heading1'], fontSize=24, textColor=colors.HexColor("#2A2A2A"), alignment=1, spaceAfter=20)
    subtitle_style = ParagraphStyle('SubTitle', parent=styles['Normal'], fontSize=12, textColor=colors.gray, alignment=1)
    header_style = ParagraphStyle('Header', parent=styles['Heading2'], fontSize=14, textColor=colors.HexColor("#0055aa"), spaceBefore=15)
    normal_style = styles['BodyText']
    
    # --- 2. Header Section ---
    elements.append(Paragraph("BIOGRAPH ENTERPRISE", title_style))
    elements.append(Paragraph("AI-POWERED DRUG REPURPOSING REPORT", subtitle_style))
    elements.append(Spacer(1, 10))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.lightgrey))
    elements.append(Spacer(1, 20))

    # --- 3. Interaction Analysis (Main Result) ---
    elements.append(Paragraph("1. INTERACTION ANALYSIS", header_style))
    
    score = data.get('score', 0)
    status = "ACTIVE" if score > 7.5 else "INACTIVE"
    status_color = colors.green if score > 7.5 else colors.red

    interaction_data = [
        ["Target Protein ID", data.get('target_id', 'Unknown').upper()],
        ["Candidate Name", data.get('name', 'Unknown')],
        ["AI Binding Score", f"{score} pKd"],
        ["Prediction Status", status]
    ]

    t1 = Table(interaction_data, colWidths=[200, 250])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.whitesmoke),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.gray),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (1, 3), (1, 3), status_color),
        ('GRID', (0, 0), (-1, -1), 1, colors.white),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(t1)
    elements.append(Spacer(1, 20))

    # --- 4. Safety Profile (ADMET) ---
    admet = data.get('admet', {})
    if admet:
        elements.append(Paragraph("2. SAFETY & MOLECULAR PROFILE (ADMET)", header_style))
        
        is_safe = admet.get('is_safe', False)
        verdict = "APPROVED FOR TESTING" if is_safe else "WARNING: SAFETY RISKS DETECTED"
        verdict_color = colors.green if is_safe else colors.red

        safety_data = [
            ["Molecular Weight", f"{admet.get('mw', 'N/A')} g/mol"],
            ["LogP (Lipophilicity)", admet.get('logp', 'N/A')],
            ["Lipinski Violations", f"{admet.get('violations', 0)} / 4"],
            ["QED (Drug-likeness)", f"{admet.get('qed', 'N/A')}"],
            ["Safety Verdict", verdict]
        ]

        t2 = Table(safety_data, colWidths=[200, 250])
        t2.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.whitesmoke),
            ('TEXTCOLOR', (1, 4), (1, 4), verdict_color),
            ('GRID', (0, 0), (-1, -1), 1, colors.white),
            ('PADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(t2)
        elements.append(Spacer(1, 15))

        # ADMET Detailed Profile
        elements.append(Paragraph("3. ADMET PHARMACOKINETICS", header_style))
        
        admet_detail = [
            ["Category", "Property", "Value"],
            ["Absorption", "Caco-2 Permeability", admet.get('caco2_permeability', 'N/A')],
            ["Absorption", "Intestinal Absorption", admet.get('intestinal_absorption', 'N/A')],
            ["Absorption", "Oral Bioavailability", admet.get('oral_bioavailability', 'N/A')],
            ["Distribution", "BBB Penetration", admet.get('bbb', 'N/A')],
            ["Distribution", "Plasma Protein Binding", admet.get('ppb', 'N/A')],
            ["Metabolism", "CYP450 Substrate", admet.get('cyp_substrate', 'N/A')],
            ["Metabolism", "Metabolic Stability", admet.get('metabolism_stability', 'N/A')],
            ["Excretion", "Clearance Route", admet.get('clearance_route', 'N/A')],
            ["Excretion", "Half-life", admet.get('half_life', 'N/A')],
            ["Toxicity", "hERG Cardiotoxicity", admet.get('herg_risk', 'N/A')],
            ["Toxicity", "Hepatotoxicity", admet.get('hepatotoxicity', 'N/A')],
        ]

        t3 = Table(admet_detail, colWidths=[100, 160, 190])
        t3.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0055aa")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BACKGROUND', (0, 1), (0, -1), colors.whitesmoke),
            ('TEXTCOLOR', (0, 1), (0, -1), colors.gray),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ('PADDING', (0, 0), (-1, -1), 6),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
        ]))
        elements.append(t3)

    elements.append(Spacer(1, 30))

    # --- 5. Chemical Structure (Image + Code) ---
    elements.append(Paragraph("4. CHEMICAL STRUCTURE", header_style))
    
    smiles_text = data.get('smiles', '')

    # ✅ GENERATE MOLECULE IMAGE
    try:
        mol = Chem.MolFromSmiles(smiles_text)
        if mol:
            # RDKit se image memory mein banayi
            img = Draw.MolToImage(mol, size=(400, 200)) # Width, Height
            
            img_buffer = BytesIO()
            img.save(img_buffer, format='PNG')
            img_buffer.seek(0)
            
            # ReportLab Image Object
            rl_image = Image(img_buffer, width=300, height=150)
            elements.append(rl_image)
            elements.append(Spacer(1, 10))
    except Exception as e:
        print(f"Image Error: {e}")
        elements.append(Paragraph("[Image Generation Failed]", normal_style))

    # Add SMILES Text below image
    if len(smiles_text) > 80: smiles_text = smiles_text[:80] + "..."
    elements.append(Paragraph(f"SMILES Code: {smiles_text}", ParagraphStyle('Code', fontSize=8, fontName='Courier', textColor=colors.darkgrey)))
    
    # --- 6. Footer ---
    elements.append(Spacer(1, 50))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.lightgrey))
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    footer_text = f"Report Generated: {timestamp} | BioGraph Enterprise AI | For Research Use Only"
    elements.append(Paragraph(footer_text, ParagraphStyle('Footer', fontSize=8, textColor=colors.gray, alignment=1)))

    doc.build(elements)
    buffer.seek(0)
    return buffer