import type { SyllabusItem } from '@/data/syllabusData';
import { downloadPrintableHTMLDoc, triggerBlobDownload } from './fileDownloader';

/**
 * Generates and triggers browser download or high-quality printable view for NIE syllabus notes
 */
export function generateSyllabusPDF(item: SyllabusItem, studentName = 'SipArana Student', directBlobOnly = false) {
  const filename = `SipArana_NIE_${item.grade}_${item.subjectName.replace(/\s+/g, '_')}_${item.yearPublished}.html`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${item.title} - SipArana Official PDF</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Noto+Sans+Sinhala:wght@400;600;700&display=swap');
    
    @page {
      size: A4;
      margin: 15mm 15mm 20mm 15mm;
    }

    body {
      font-family: 'Plus Jakarta Sans', 'Noto Sans Sinhala', sans-serif;
      color: #1e293b;
      line-height: 1.6;
      background: #ffffff;
      margin: 0;
      padding: 24px;
    }

    .header-table {
      width: 100%;
      border-bottom: 3px solid #1e40af;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    .logo-badge {
      display: inline-block;
      background: #1e40af;
      color: #ffffff;
      font-weight: 900;
      font-size: 18px;
      padding: 6px 14px;
      border-radius: 8px;
      letter-spacing: 1px;
    }

    .sub-brand {
      color: #b45309;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 4px;
    }

    .meta-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .meta-item {
      font-size: 12px;
    }
    .meta-label {
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 10px;
    }
    .meta-value {
      color: #0f172a;
      font-weight: 800;
      font-size: 13px;
    }

    h1 {
      font-size: 22px;
      color: #0f172a;
      margin: 0 0 6px 0;
      font-weight: 800;
    }

    h2 {
      font-size: 16px;
      color: #1e40af;
      margin: 0 0 16px 0;
      font-weight: 700;
    }

    .section-title {
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #1e3a8a;
      border-left: 4px solid #f59e0b;
      padding-left: 10px;
      margin: 24px 0 12px 0;
    }

    .competency-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 12px;
    }

    .competency-table th {
      background: #1e40af;
      color: #ffffff;
      text-align: left;
      padding: 10px 12px;
      font-weight: 700;
      border: 1px solid #1e40af;
    }

    .competency-table td {
      padding: 9px 12px;
      border: 1px solid #e2e8f0;
      vertical-align: top;
    }

    .competency-table tr:nth-child(even) {
      background: #f8fafc;
    }

    .formula-pill {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 8px 14px;
      margin-bottom: 8px;
      font-family: monospace;
      font-size: 12px;
      font-weight: 700;
      color: #1e40af;
    }

    .footer-note {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #cbd5e1;
      font-size: 11px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }

    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background: #1e40af; color: white; padding: 14px 20px; border-radius: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <strong>📄 SipArana Offline Study Guide Ready for Download / Print</strong>
      <div style="font-size: 12px; opacity: 0.9;">Click the button on the right or press Ctrl+P (Cmd+P) to Save as PDF.</div>
    </div>
    <button onclick="window.print()" style="background: #f59e0b; color: #0f172a; border: none; font-weight: 800; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
      🖨️ Save as PDF / Print Now
    </button>
  </div>

  <table class="header-table">
    <tr>
      <td>
        <div class="logo-badge">SIPARANA LK</div>
        <div class="sub-brand">Sri Lanka National Digital Education Platform</div>
      </td>
      <td style="text-align: right;">
        <div style="font-size: 12px; font-weight: 700; color: #1e40af;">Official NIE Syllabus Guide</div>
        <div style="font-size: 11px; color: #64748b;">G.C.E. Sri Lankan National Curriculum</div>
      </td>
    </tr>
  </table>

  <h1>${item.title}</h1>
  <h2>${item.titleSinhala}</h2>

  <div class="meta-box">
    <div class="meta-item">
      <div class="meta-label">Subject</div>
      <div class="meta-value">${item.subjectName} (${item.subjectSinhala})</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Target Level</div>
      <div class="meta-value">Grade ${item.grade} • ${item.stream}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Document Type</div>
      <div class="meta-value">${item.fileType}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Published / Edition</div>
      <div class="meta-value">${item.yearPublished} Edition</div>
    </div>
  </div>

  <div class="section-title">1. Curriculum Overview & Competency Framework</div>
  <p style="font-size: 13px; color: #334155; margin-bottom: 16px;">
    ${item.summary}
  </p>
  <p style="font-size: 13px; color: #475569; margin-bottom: 16px;">
    <em>${item.summarySinhala}</em>
  </p>

  <div class="section-title">2. Prescribed Competencies & Periods Allocation</div>
  <table class="competency-table">
    <thead>
      <tr>
        <th style="width: 15%;">Competency</th>
        <th style="width: 45%;">English Description</th>
        <th style="width: 30%;">සිංහල මාතෘකාව</th>
        <th style="width: 10%; text-align: center;">Periods</th>
      </tr>
    </thead>
    <tbody>
      ${item.competencies.map(c => `
        <tr>
          <td><strong>${c.competencyNo}</strong></td>
          <td>${c.description}</td>
          <td>${c.descriptionSinhala}</td>
          <td style="text-align: center; font-weight: 700; color: #1e40af;">${c.periods}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="section-title" style="margin-top: 28px;">3. Key Master Formulas, Laws & High-Yield Summary</div>
  <div>
    ${item.keyFormulasAndConcepts.map(f => `
      <div class="formula-pill">⚡ ${f}</div>
    `).join('')}
  </div>

  <div class="footer-note">
    <div>Generated by SipArana LK Educational Web App for student: <strong>${studentName}</strong></div>
    <div>National Institute of Education (NIE) & Ministry of Education Compliant</div>
  </div>

  <script>
    // Auto-trigger print dialog after small rendering delay if not standalone
    setTimeout(() => {
      if (window.opener) {
        window.print();
      }
    }, 600);
  </script>
</body>
</html>
  `;

  if (directBlobOnly) {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    return triggerBlobDownload(blob, filename);
  }

  return downloadPrintableHTMLDoc(htmlContent, filename, true);
}

