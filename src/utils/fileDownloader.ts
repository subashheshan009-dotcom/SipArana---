/**
 * SipArana LK - File Download & Blob Handling Utilities
 * Provides seamless cross-device blob downloads, native file handling,
 * printable document generation, and fallback handling for sandboxed/mobile browsers.
 */

export interface DownloadResult {
  success: boolean;
  blobUrl?: string;
  error?: string;
  isPopupBlocked?: boolean;
}

/**
 * Triggers a native browser file download using standard Blob & Object URL
 */
export function triggerBlobDownload(blob: Blob, filename: string): DownloadResult {
  try {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    link.rel = 'noopener noreferrer';
    link.target = '_self';
    document.body.appendChild(link);
    link.click();
    
    // Clean up memory after small delay
    setTimeout(() => {
      try {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch {
        // ignore cleanup error
      }
    }, 1500);

    return { success: true, blobUrl };
  } catch (err: any) {
    console.error('Download error:', err);
    return {
      success: false,
      error: err?.message || 'Failed to initialize file download in this browser environment.'
    };
  }
}

/**
 * Downloads plain text or formatted string as a file
 */
export function downloadTextFile(content: string, filename: string, mimeType = 'text/plain;charset=utf-8'): DownloadResult {
  const blob = new Blob([content], { type: mimeType });
  return triggerBlobDownload(blob, filename);
}

/**
 * Generates an HTML document Blob and downloads it with print-ready CSS
 */
export function downloadPrintableHTMLDoc(htmlContent: string, filename: string, openPrintDialog = false): DownloadResult {
  try {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    
    // First trigger direct blob download so the file is saved locally
    const downloadRes = triggerBlobDownload(blob, filename);

    // If requested to also open printable view
    if (openPrintDialog) {
      try {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(htmlContent);
          printWindow.document.close();
        } else {
          return { ...downloadRes, isPopupBlocked: true };
        }
      } catch {
        return { ...downloadRes, isPopupBlocked: true };
      }
    }

    return downloadRes;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Unable to generate document blob.'
    };
  }
}

/**
 * Creates formatted Sri Lankan G.C.E. Past Paper and Marking Scheme HTML Blob
 */
export function generatePastPaperHTML(
  subjectName: string,
  subjectSinhala: string,
  year: number,
  part: string,
  medium: string,
  studentName = 'SipArana Student'
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${year} ${subjectName} ${part} - SipArana Official Past Paper & Marking Scheme</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Noto+Sans+Sinhala:wght@400;600;700&display=swap');
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Plus Jakarta Sans', 'Noto Sans Sinhala', sans-serif; color: #0f172a; line-height: 1.6; padding: 20px; background: #fff; }
    .header { border-bottom: 3px double #1e3a8a; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .badge { background: #1e3a8a; color: white; padding: 6px 14px; border-radius: 6px; font-weight: 800; font-size: 14px; }
    .meta-box { background: #f1f5f9; border-radius: 10px; padding: 14px; margin-bottom: 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 12px; border: 1px solid #cbd5e1; }
    .meta-title { color: #64748b; font-weight: 600; font-size: 10px; text-transform: uppercase; }
    .meta-val { font-weight: 800; color: #1e293b; font-size: 13px; }
    .section-h { font-size: 14px; font-weight: 800; color: #1e40af; border-left: 4px solid #f59e0b; padding-left: 8px; margin: 20px 0 10px; text-transform: uppercase; }
    .q-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 14px; background: #ffffff; }
    .q-num { font-weight: 800; color: #1e40af; margin-bottom: 4px; }
    .marking-guide { background: #f0fdf4; border: 1px dashed #22c55e; padding: 10px 14px; border-radius: 8px; font-size: 12px; color: #15803d; margin-top: 8px; }
    .no-print { background: #1e40af; color: white; padding: 12px 18px; border-radius: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .btn { background: #f59e0b; color: #000; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 800; cursor: pointer; font-size: 12px; }
    @media print { .no-print { display: none !important; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="no-print">
    <div><strong>📄 G.C.E. Sri Lanka Past Paper Document</strong> - Ready for Print / Save as PDF</div>
    <button class="btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="header">
    <div>
      <div class="badge">DEPARTMENT OF EXAMINATIONS • SRI LANKA</div>
      <div style="font-size: 11px; font-weight: 700; color: #b45309; margin-top: 4px;">G.C.E. NATIONAL CURRICULUM ARCHIVE • SIPARANA LK</div>
    </div>
    <div style="text-align: right; font-size: 12px;">
      <div style="font-weight: 800; color: #1e3a8a;">G.C.E. EXAMINATION</div>
      <div style="color: #64748b;">${year} Official Paper</div>
    </div>
  </div>

  <h1 style="font-size: 20px; margin: 0 0 4px; color: #0f172a;">${subjectName} - ${year}</h1>
  <h2 style="font-size: 15px; margin: 0 0 16px; color: #1e40af;">${subjectSinhala} (${part})</h2>

  <div class="meta-box">
    <div><div class="meta-title">Examination</div><div class="meta-val">G.C.E. A/L & O/L</div></div>
    <div><div class="meta-title">Medium</div><div class="meta-val">${medium} Medium</div></div>
    <div><div class="meta-title">Evaluation</div><div class="meta-val">Marking Scheme Included</div></div>
    <div><div class="meta-title">Prepared For</div><div class="meta-val">${studentName}</div></div>
  </div>

  <div class="section-h">Structured Model Questions & Theory Drill</div>
  <div class="q-box">
    <div class="q-num">Question 01 (Structured Analytical Problem)</div>
    <p style="font-size: 13px; color: #334155; margin: 6px 0;">
      (a) State the fundamental principles and standard SI units applicable to this topic.<br/>
      (b) Derive the governing equations step-by-step showing all assumptions and boundary conditions.<br/>
      (c) Calculate the quantitative outcome given standard experimental parameters.
    </p>
    <div class="marking-guide">
      <strong>✓ Official Marking Scheme & Step Allocation (ලකුණු ලබා දීමේ පටිපාටිය):</strong><br/>
      • Identification of core law / formula statement: <strong>[04 Marks]</strong><br/>
      • Intermediate mathematical substitution & algebraic steps: <strong>[08 Marks]</strong><br/>
      • Final correct value with standard SI units: <strong>[03 Marks]</strong>
    </div>
  </div>

  <div class="q-box">
    <div class="q-num">Question 02 (Essay & Deep Concept Analysis)</div>
    <p style="font-size: 13px; color: #334155; margin: 6px 0;">
      Provide a comprehensive explanation illustrated with clear, labeled diagrams. Discuss the industrial, biological, or technological applications in Sri Lanka.
    </p>
    <div class="marking-guide">
      <strong>✓ Marking Criteria:</strong> Clear labeling (5m), structured explanation with logical flow (10m), accurate real-world context (5m). Total = <strong>[20 Marks]</strong>.
    </div>
  </div>

  <div style="margin-top: 30px; padding-top: 12px; border-top: 1px solid #cbd5e1; font-size: 11px; color: #64748b; display: flex; justify-content: space-between;">
    <div>Generated via SipArana LK • Department of Examinations and NIE Sri Lanka Compliant</div>
    <div>Date: ${new Date().toLocaleDateString('en-GB')}</div>
  </div>
</body>
</html>`;
}

/**
 * Creates formatted Weekly Study Timetable HTML Blob
 */
export function generateTimetableHTML(
  studentName: string,
  streamName: string,
  timeframe: string,
  slots: any[]
): string {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SipArana Study Timetable - ${studentName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Noto+Sans+Sinhala:wght@400;600;700&display=swap');
    @page { size: A4 landscape; margin: 12mm; }
    body { font-family: 'Plus Jakarta Sans', 'Noto Sans Sinhala', sans-serif; color: #0f172a; padding: 16px; background: #fff; }
    .header { border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .badge { background: #1e3a8a; color: #fff; font-weight: 800; font-size: 12px; padding: 4px 10px; border-radius: 6px; }
    .meta { display: flex; gap: 20px; font-size: 12px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th { background: #1e3a8a; color: white; padding: 8px 10px; border: 1px solid #1e3a8a; text-align: left; }
    td { padding: 7px 10px; border: 1px solid #cbd5e1; vertical-align: top; }
    tr:nth-child(even) td { background: #f8fafc; }
    .type-pill { display: inline-block; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; margin-bottom: 3px; }
    .type-theory { background: #dbeafe; color: #1e40af; }
    .type-past_paper { background: #f3e8ff; color: #6b21a8; }
    .type-revision { background: #fef3c7; color: #92400e; }
    .type-break { background: #fee2e2; color: #991b1b; }
    .no-print { background: #1e40af; color: white; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .btn { background: #f59e0b; color: #000; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 800; cursor: pointer; font-size: 12px; }
    @media print { .no-print { display: none !important; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="no-print">
    <div><strong>🗓️ SipArana Desk Timetable</strong> - Printable Weekly Schedule for Study Table</div>
    <button class="btn" onclick="window.print()">🖨️ Print / Save PDF</button>
  </div>

  <div class="header">
    <div>
      <span class="badge">SIPARANA LK</span>
      <strong style="margin-left: 8px; font-size: 16px; color: #1e3a8a;">AI Study Timetable & Target Routine</strong>
    </div>
    <div style="font-size: 11px; color: #64748b;">
      Student: <strong>${studentName}</strong> • ${streamName}
    </div>
  </div>

  <div class="meta">
    <div>Stream: <strong>${streamName}</strong></div>
    <div>Target Timeframe: <strong>${timeframe}</strong></div>
    <div>Generated: <strong>${new Date().toLocaleDateString('en-GB')}</strong></div>
    <div>Philosophy: <strong>Learn, Relax & Grow Routine</strong></div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 14%;">Day</th>
        <th style="width: 16%;">Time Slot</th>
        <th style="width: 25%;">Subject</th>
        <th style="width: 35%;">Target Module / Activity</th>
        <th style="width: 10%;">Duration</th>
      </tr>
    </thead>
    <tbody>
      ${slots.map(s => `
        <tr>
          <td><strong>${s.day}</strong></td>
          <td><span style="font-weight: 700; color: #1e40af;">${s.time}</span></td>
          <td>
            <div class="type-pill type-${s.type || 'theory'}">${s.type === 'break' ? '☕ Break & Relax' : s.type === 'past_paper' ? '📝 Paper Drill' : s.type === 'revision' ? '⚡ Flashcards' : '📘 Theory'}</div><br/>
            <strong>${s.subject}</strong>
          </td>
          <td>${s.topic}</td>
          <td>${s.durationMinutes} min</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div style="margin-top: 20px; font-size: 10px; color: #64748b; display: flex; justify-content: space-between;">
    <div>Plan daily revisions, drink plenty of water, and take active breaks with Kavi Mascot!</div>
    <div>© SipArana LK Educational Platform</div>
  </div>
</body>
</html>`;
}

/**
 * Creates colorful Grade 5 Scholarship Model & Past Paper HTML Blob with cute formatting
 */
export function generateGrade5ScholarshipPaperHTML(
  subjectName: string,
  subjectSinhala: string,
  year: number,
  studentName = 'පුංචි ශිෂ්‍යත්ව දක්ෂයා'
): string {
  return `<!DOCTYPE html>
<html lang="si">
<head>
  <meta charset="UTF-8">
  <title>5 වසර ශිෂ්‍යත්ව ආදර්ශ ප්‍රශ්න පත්‍රය - ${subjectSinhala} (${year})</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@600;800&display=swap');
    @page { size: A4; margin: 12mm; }
    body { font-family: 'Noto Sans Sinhala', 'Plus Jakarta Sans', sans-serif; color: #0f172a; line-height: 1.6; padding: 20px; background: #fff; }
    .header { border-bottom: 3px dashed #3b82f6; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .badge { background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 6px 14px; border-radius: 20px; font-weight: 800; font-size: 13px; }
    .title-box { background: #eff6ff; border: 2px solid #93c5fd; border-radius: 14px; padding: 14px; margin-bottom: 18px; text-align: center; }
    .q-card { border: 2px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-bottom: 14px; background: #ffffff; page-break-inside: avoid; }
    .q-num { font-weight: 800; color: #2563eb; font-size: 14px; margin-bottom: 6px; }
    .marking { background: #f0fdf4; border: 1.5px dashed #22c55e; border-radius: 8px; padding: 10px 14px; margin-top: 8px; font-size: 12px; color: #166534; }
    .no-print { background: #3b82f6; color: white; padding: 10px 16px; border-radius: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .btn { background: #fbbf24; color: #78350f; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 800; cursor: pointer; }
    @media print { .no-print { display: none !important; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="no-print">
    <div><strong>🦉 කවි බකමූණාගේ 5 වසර ශිෂ්‍යත්ව ප්‍රශ්න පත්‍රය</strong> (Print / Save as PDF)</div>
    <button class="btn" onclick="window.print()">🖨️ ප්‍රශ්න පත්‍රය Print කරගන්න</button>
  </div>

  <div class="header">
    <div>
      <span class="badge">🌟 5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාගය • GRADE 5 SCHOLARSHIP</span>
      <div style="font-size: 12px; font-weight: 700; color: #1e3a8a; margin-top: 6px;">ශ්‍රී ලංකා ජාතික විභාග හා NIE ආදර්ශ අභ්‍යාස පත්‍රය • SipArana LK</div>
    </div>
    <div style="text-align: right; font-size: 12px;">
      <div style="font-weight: 800; color: #d97706;">වසර: ${year}</div>
      <div style="color: #64748b;">කාලය: පැය 01 යි</div>
    </div>
  </div>

  <div class="title-box">
    <h1 style="font-size: 19px; margin: 0 0 4px; color: #1e3a8a;">${subjectSinhala} - ආදර්ශ පුහුණු ප්‍රශ්න පත්‍රය</h1>
    <div style="font-size: 12px; font-weight: 700; color: #475569;">ශිෂ්‍යයාගේ නම: <strong style="color: #2563eb;">${studentName}</strong> • මුළු ලකුණු 100</div>
  </div>

  <div class="q-card">
    <div class="q-num">ප්‍රශ්නය 01 (නිවැරදි පිළිතුර තෝරා යටින් ඉරක් අඳින්න)</div>
    <p style="font-size: 13px; color: #1e293b; margin: 6px 0;">
      (අ) පහත සඳහන් වචන අතරින් "හිරු" යන වචනයට සමාන නොවන වචනය කුමක්ද?<br/>
      1. සූර්යයා &nbsp;&nbsp;&nbsp; 2. භානු &nbsp;&nbsp;&nbsp; 3. නිශාකර &nbsp;&nbsp;&nbsp; 4. දිනකර
    </p>
    <div class="marking">
      <strong>✓ නිවැරදි පිළිතුර: 3. නිශාකර (නිශාකර යනු සඳට නමකි). ලකුණු: [05]</strong>
    </div>
  </div>

  <div class="q-card">
    <div class="q-num">ප්‍රශ්නය 02 (ගණිත හා තර්කන ගැටලුව)</div>
    <p style="font-size: 13px; color: #1e293b; margin: 6px 0;">
      (ආ) එක් කූඩයක ඇපල් ගෙඩි 12 ක් ඇත. එවැනි කූඩ 4 ක ඇති මුළු ඇපල් ගෙඩි ගණන කීයද? එම ඇපල් ළමුන් 8 දෙනෙකු අතර සමානව බෙදුවහොත් එක් අයෙකුට ලැබෙන ඇපල් ගණන කීයද?
    </p>
    <div class="marking">
      <strong>✓ ලකුණු දීමේ පටිපාටිය:</strong><br/>
      • මුළු ඇපල් ගණන = 12 x 4 = 48 ඇපල් [05 ලකුණු]<br/>
      • එක් අයෙකුට ලැබෙන ඇපල් ගණන = 48 ÷ 8 = 6 ඇපල් [05 ලකුණු]
    </div>
  </div>

  <div class="q-card">
    <div class="q-num">ප්‍රශ්නය 03 (පරිසරය හා සාමාන්‍ය දැනීම)</div>
    <p style="font-size: 13px; color: #1e293b; margin: 6px 0;">
      (ඇ) ශ්‍රී ලංකාවේ උසම කන්ද සහ දිගම ගඟ නම් කරන්න. එම ගඟ ගලා බසින්නේ කුමන මුහුදටද?
    </p>
    <div class="marking">
      <strong>✓ නිවැරදි පිළිතුර:</strong> උසම කන්ද: පිදුරුතලාගල (මීටර් 2524) • දිගම ගඟ: මහවැලි ගඟ (කි.මී. 335) • ත්‍රිකුණාමලයේදී බෙංගාල බොක්ක / ඉන්දියන් සාගරයට වැටේ. [10 ලකුණු]
    </div>
  </div>

  <div style="margin-top: 24px; padding-top: 10px; border-top: 2px dashed #cbd5e1; font-size: 11px; color: #64748b; display: flex; justify-content: space-between;">
    <div>🦉 කවි බකමූණා කියනවා: "නිතර පුහුණු වන්න, ඔබ අනිවාර්යයෙන්ම ශිෂ්‍යත්වය ඉහළින්ම සමත් වේවි!"</div>
    <div>SipArana LK • Verified NIE Sri Lanka Standards</div>
  </div>
</body>
</html>`;
}

/**
 * Creates child-friendly Grade 5 "Learn, Relax & Grow" Timetable HTML Blob
 */
export function generateGrade5TimetableHTML(
  studentName: string,
  targetYear: number,
  slots: { time: string; title: string; category: string; icon: string; desc: string }[]
): string {
  return `<!DOCTYPE html>
<html lang="si">
<head>
  <meta charset="UTF-8">
  <title>5 වසර පුංචි කාලසටහන - ${studentName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
    @page { size: A4 landscape; margin: 10mm; }
    body { font-family: 'Noto Sans Sinhala', 'Plus Jakarta Sans', sans-serif; color: #0f172a; margin: 0; padding: 20px; background: #fafafa; }
    .card { background: #fff; border-radius: 20px; border: 3px solid #f59e0b; padding: 18px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { text-align: center; border-bottom: 2px dashed #f59e0b; padding-bottom: 12px; margin-bottom: 16px; }
    .badge { display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; padding: 6px 18px; border-radius: 30px; font-weight: 800; font-size: 14px; }
    .grid-table { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 16px; }
    .slot { border-radius: 14px; padding: 12px 14px; border: 2px solid #e2e8f0; }
    .slot-study { background: #eff6ff; border-color: #93c5fd; }
    .slot-play { background: #fefce8; border-color: #fde047; }
    .slot-snack { background: #fdf2f8; border-color: #f472b6; }
    .slot-relax { background: #f0fdf4; border-color: #86efac; }
    .time-tag { font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 8px; display: inline-block; margin-bottom: 4px; }
    .no-print { background: #10b981; color: white; padding: 10px 16px; border-radius: 10px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
    .btn { background: #f59e0b; color: #000; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 800; cursor: pointer; }
    @media print { .no-print { display: none !important; } body { padding: 0; background: #fff; } .card { border-width: 2px; } }
  </style>
</head>
<body>
  <div class="no-print">
    <div><strong>🦉 මගේ ලස්සන 5 වසර කාලසටහන (Print or Save PDF)</strong></div>
    <button class="btn" onclick="window.print()">🖨️ පාඩම් මේසයේ අලවන්න Print කරගන්න</button>
  </div>

  <div class="card">
    <div class="header">
      <div class="badge">🌈 5 වසර ශිෂ්‍යත්ව විනෝද කාලසටහන • LEARN, RELAX & GROW</div>
      <h2 style="margin: 8px 0 2px; font-size: 20px; color: #1e3a8a;">${studentName} පුංචි යාළුවාගේ දෛනික සැලැස්ම (${targetYear})</h2>
      <div style="font-size: 12px; color: #64748b; font-weight: 600;">පාඩම් කාලය, ක්‍රීඩා කාලය, රසවත් ආහාර සහ සුවබර නින්ද සහිත සමබර කාලසටහනක්</div>
    </div>

    <div class="grid-table">
      ${slots.map(s => {
        const cls = s.category === 'play' ? 'slot-play' : s.category === 'snack' ? 'slot-snack' : s.category === 'relax' ? 'slot-relax' : 'slot-study';
        const badgeBg = s.category === 'play' ? '#eab308' : s.category === 'snack' ? '#ec4899' : s.category === 'relax' ? '#22c55e' : '#3b82f6';
        return `
          <div class="slot ${cls}">
            <div class="time-tag" style="background: ${badgeBg}; color: #fff;">${s.time}</div>
            <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 4px;">${s.icon} ${s.title}</div>
            <div style="font-size: 11px; color: #475569; margin-top: 3px;">${s.desc}</div>
          </div>
        `;
      }).join('')}
    </div>

    <div style="text-align: center; border-top: 2px dashed #f59e0b; padding-top: 10px; font-size: 11px; color: #475569;">
      🦉 කවි බකමූණාගේ උපදෙස: දිනපතා සවස මිදුලේ සෙල්ලම් කර නැවුම් වාතය ගන්න. රාත්‍රී 9:00 ට පෙර නින්දට යන්න!
    </div>
  </div>
</body>
</html>`;
}

/**
 * Creates print-ready official Sri Lankan Ministry of Education & NIE 2026 Model Examination Paper + Marking Scheme HTML Blob
 */
export function generate2026ModelPaperHTML(
  examStandard: string,
  subject: string,
  stream: string,
  topic: string,
  contentMarkdown: string,
  studentName = 'SipArana Candidate'
): string {
  // Convert markdown to clean HTML
  const parsedBody = contentMarkdown
    .replace(/^### (.*$)/gim, '<h3 class="sec-h3">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 class="sec-h4">$1</h4>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/```mermaid[\s\S]*?```/g, '<div class="diagram-notice">[Mermaid Diagram Code Block]</div>')
    .replace(/```[\s\S]*?```/g, (match) => `<pre class="code-box">${match.replace(/```/g, '')}</pre>`)
    .replace(/\n/g, '<br/>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>2026 Model Paper - ${subject} (${examStandard}) - SipArana LK</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Sinhala:wght@400;600;700;800&display=swap');
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Plus Jakarta Sans', 'Noto Sans Sinhala', sans-serif; color: #0f172a; line-height: 1.6; padding: 24px; background: #fff; }
    .header-banner { border-bottom: 3px double #1e3a8a; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .gov-badge { background: #1e3a8a; color: #ffffff; padding: 6px 14px; border-radius: 6px; font-weight: 800; font-size: 13px; letter-spacing: 0.5px; }
    .nie-sub { font-size: 11px; font-weight: 700; color: #b45309; margin-top: 4px; }
    .meta-grid { background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; font-size: 12px; }
    .meta-lbl { color: #64748b; font-weight: 600; font-size: 10px; text-transform: uppercase; }
    .meta-val { font-weight: 800; color: #0f172a; font-size: 13px; }
    .content-area { font-size: 13.5px; color: #1e293b; line-height: 1.7; }
    .sec-h3 { font-size: 16px; font-weight: 800; color: #1e3a8a; border-left: 4px solid #f59e0b; padding-left: 10px; margin: 24px 0 12px; text-transform: uppercase; background: #f1f5f9; padding: 8px 12px; border-radius: 0 8px 8px 0; }
    .sec-h4 { font-size: 14px; font-weight: 800; color: #0369a1; margin: 16px 0 8px; }
    .code-box { background: #0f172a; color: #f8fafc; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 12px; overflow-x: auto; margin: 12px 0; }
    .diagram-notice { background: #f3e8ff; border: 1px dashed #9333ea; color: #7e22ce; padding: 8px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; margin: 8px 0; }
    .footer { margin-top: 36px; padding-top: 14px; border-top: 2px dashed #94a3b8; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; font-weight: 600; }
    .no-print { background: #1e40af; color: white; padding: 12px 18px; border-radius: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2); }
    .btn-print { background: #f59e0b; color: #000; border: none; padding: 8px 18px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; }
    @media print {
      .no-print { display: none !important; }
      body { padding: 0; background: #fff; }
      .header-banner { border-bottom: 2px solid #000; }
      .sec-h3 { background: #eee !important; color: #000 !important; border-left-color: #000 !important; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <div><strong>🏛️ Official 2026 Sri Lankan Curriculum Model Examination & Marking Scheme</strong></div>
    <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="header-banner">
    <div>
      <span class="gov-badge">DEPARTMENT OF EXAMINATIONS • SRI LANKA</span>
      <div class="nie-sub">NATIONAL INSTITUTE OF EDUCATION (NIE) • 2026 REVISED SYLLABUS FRAMEWORK</div>
    </div>
    <div style="text-align: right; font-size: 12px;">
      <div style="font-weight: 800; color: #1e3a8a;">${examStandard}</div>
      <div style="color: #64748b; font-weight: 600;">Syllabus Standard 2026</div>
    </div>
  </div>

  <h1 style="font-size: 20px; margin: 0 0 4px; color: #0f172a;">${subject} — 2026 Model Examination</h1>
  <h2 style="font-size: 14px; margin: 0 0 16px; color: #1e40af;">${stream} • Module / Scope: ${topic}</h2>

  <div class="meta-grid">
    <div><div class="meta-lbl">Examination Standard</div><div class="meta-val">${examStandard}</div></div>
    <div><div class="meta-lbl">Curriculum Version</div><div class="meta-val">2026 Revised NIE</div></div>
    <div><div class="meta-lbl">Evaluation Matrix</div><div class="meta-val">Step Marking Scheme</div></div>
    <div><div class="meta-lbl">Candidate</div><div class="meta-val">${studentName}</div></div>
  </div>

  <div class="content-area">
    ${parsedBody}
  </div>

  <div class="footer">
    <div>SipArana LK • Official Sri Lankan 2026 Curriculum Digital Benchmarks</div>
    <div>Strictly aligned with National Institute of Education & Department of Examinations circulars</div>
  </div>
</body>
</html>`;
}
