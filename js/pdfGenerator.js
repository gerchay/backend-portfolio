// Clean one-page CV generator (jsPDF). Pulls from the same /data JSON the site uses.

document.addEventListener('DOMContentLoaded', () => {
  // The download button is created by data-loader after fetch — wait for it.
  const observer = new MutationObserver((mutations, obs) => {
    const btn = document.getElementById('download-cv-btn');
    if (!btn) return;
    obs.disconnect();

    btn.addEventListener('click', async () => {
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;
      try {
        const urls = ['profile', 'about', 'resume', 'honors'].map(n => `data/${n}.json`);
        const [profile, about, resume, honors] = await Promise.all(
          urls.map(u => fetch(u).then(r => {
            if (!r.ok) throw new Error(`Failed to fetch ${u}`);
            return r.json();
          }))
        );
        if (typeof window.jspdf === 'undefined') throw new Error('jsPDF not loaded');
        await generatePdf({ profile, about, resume, honors }, window.jspdf.jsPDF);
      } catch (err) {
        console.error('Error generating PDF:', err);
        alert('Failed to generate the CV. Please try again.');
      } finally {
        btn.innerHTML = original;
        btn.disabled = false;
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
});

// Load an image and return a circular-cropped PNG data URL (same-origin → not tainted).
function circleAvatar(url, size = 256) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = c.height = size;
        const ctx = c.getContext('2d');
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
        const r = Math.max(size / img.width, size / img.height);
        const w = img.width * r, h = img.height * r;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        resolve(c.toDataURL('image/png'));
      } catch (e) { reject(e); }
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function generatePdf(data, jsPDF) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();   // 210
  const H = doc.internal.pageSize.getHeight();  // 297
  const M = 16;                                 // page margin
  const CW = W - 2 * M;                          // content width

  const TEAL = '#0E7C66';   // accent (print-legible)
  const INK = '#1f2430';    // primary text
  const MUTE = '#6b7280';   // secondary text
  const RULE = '#d8dce2';   // hairline

  let y = M;
  const font = (size, style = 'normal') => { doc.setFont('helvetica', style); doc.setFontSize(size); };
  const mm = (size, lh = 1) => size * 0.3528 * lh; // pt → mm line height

  // Wrapped paragraph; advances y.
  function para(text, { size = 9.5, color = MUTE, style = 'normal', x = M, w = CW, lh = 1.32, gap = 0 } = {}) {
    if (!text) return;
    font(size, style); doc.setTextColor(color);
    const lines = doc.splitTextToSize(String(text), w);
    const step = mm(size, lh);
    lines.forEach((ln, i) => doc.text(ln, x, y + i * step));
    y += lines.length * step + gap;
  }

  // Section header: small uppercase label + hairline rule.
  function section(label) {
    y += 4.5;
    font(9.5, 'bold'); doc.setTextColor(TEAL);
    doc.text(label.toUpperCase(), M, y);
    y += 1.8;
    doc.setDrawColor(RULE); doc.setLineWidth(0.3);
    doc.line(M, y, W - M, y);
    y += 5;
  }

  const clean = s => String(s || '').replace(/\s*\([^)]*\)/g, '').trim();
  const trim = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, s.lastIndexOf(' ', n)) + '…' : s; };

  // ---- Header ---------------------------------------------------------
  const ci = (data.profile.contactInfo || []);
  const find = key => (ci.find(c => (c.icon || '').includes(key)) || {}).text;
  const li = (data.profile.socialLinks || []).find(s => (s.icon || '').includes('linkedin'));
  const contactBits = [
    find('fa-envelope'), find('fa-phone'), find('fa-map-marker'),
    li && li.url.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    'asadalbadi.dev'
  ].filter(Boolean);

  let avatar = null;
  try { avatar = await circleAvatar(data.profile.avatar); } catch (e) { /* photo optional */ }
  const AV = 26;
  const headW = avatar ? CW - AV - 8 : CW;
  if (avatar) doc.addImage(avatar, 'PNG', W - M - AV, y, AV, AV);

  font(23, 'bold'); doc.setTextColor(INK);
  doc.text(data.profile.name, M, y + 7);
  font(11.5, 'normal'); doc.setTextColor(TEAL);
  doc.text(data.profile.title, M, y + 14);
  y += 19;
  para(contactBits.join('  ·  '), { size: 8.5, color: MUTE, w: headW, lh: 1.3 });
  y += 2;
  doc.setDrawColor(TEAL); doc.setLineWidth(0.6);
  doc.line(M, y, W - M, y);
  y += 1.5;

  // ---- Summary --------------------------------------------------------
  if (data.about && data.about.description) {
    section('Summary');
    para(trim(data.about.description, 240), { size: 9.5, color: INK, lh: 1.34 });
  }

  // ---- Experience -----------------------------------------------------
  const jobs = (data.resume.experience || []).slice(0, 3);
  if (jobs.length) {
    section('Experience');
    jobs.forEach((job, i) => {
      font(10.5, 'bold'); doc.setTextColor(INK);
      doc.text(job.title, M, y);
      font(8.5, 'normal'); doc.setTextColor(MUTE);
      doc.text(job.period || '', W - M, y, { align: 'right' });
      y += mm(10.5, 1.15);
      para(job.company, { size: 9.5, color: TEAL, lh: 1.2 });
      if (job.description) para(trim(job.description, 200), { size: 9, color: MUTE, lh: 1.3 });
      if (i < jobs.length - 1) y += 3;
    });
  }

  // ---- Skills ---------------------------------------------------------
  const groups = (data.resume.technicalSkills || []).filter(g => g && Array.isArray(g.skills));
  if (groups.length) {
    section('Skills');
    groups.forEach(g => {
      const label = g.category + ':';
      const names = g.skills.map(s => clean(s.name)).join(', ');
      font(9, 'bold'); doc.setTextColor(INK);
      const lw = doc.getTextWidth(label) + 2.2;
      doc.text(label, M, y);
      // names wrap after the label, then full width on continuation lines
      font(9, 'normal'); doc.setTextColor(MUTE);
      const first = doc.splitTextToSize(names, CW - lw);
      doc.text(first[0] || '', M + lw, y);
      let used = 1;
      if (first.length > 1) {
        const rest = doc.splitTextToSize(first.slice(1).join(' '), CW);
        rest.forEach((ln, i) => doc.text(ln, M, y + mm(9, 1.3) * (i + 1)));
        used += rest.length;
      }
      y += mm(9, 1.3) * used + 1.5;
    });
  }

  // ---- Education + Languages (two columns) ----------------------------
  section('Education');
  const colR = M + CW / 2 + 6;
  const yStart = y;
  const edu = (data.resume.education || [])[0];
  if (edu) {
    font(9.5, 'bold'); doc.setTextColor(INK);
    doc.text(edu.degree, M, y); y += mm(9.5, 1.3);
    font(9, 'normal'); doc.setTextColor(MUTE);
    doc.text([edu.institution, edu.period].filter(Boolean).join(' · '), M, y);
  }
  // Languages in the right column, aligned to the education block
  let yR = yStart;
  const langs = (data.resume.languages || []).map(l => `${l.language} (${String(l.proficiency).replace(/\s*proficiency/i, '')})`);
  if (langs.length) {
    font(9, 'bold'); doc.setTextColor(INK);
    doc.text('Languages', colR, yR); yR += mm(9, 1.35);
    font(9, 'normal'); doc.setTextColor(MUTE);
    const ll = doc.splitTextToSize(langs.join(' · '), W - M - colR);
    ll.forEach((ln, i) => doc.text(ln, colR, yR + mm(9, 1.3) * i));
    yR += ll.length * mm(9, 1.3);
  }
  y = Math.max(y, yR) + 3;

  // Certifications condensed to issuing bodies
  const issuers = [...new Set(
    (data.resume.certifications || [])
      .flatMap(c => c.items || [])
      .map(it => { const p = it.split('–'); return (p.length > 1 ? p[p.length - 1] : '').trim(); })
      .filter(Boolean)
  )];
  if (issuers.length) {
    y += mm(9, 1.3);
    font(9, 'bold'); doc.setTextColor(INK);
    const lab = 'Certifications:';
    doc.text(lab, M, y);
    const lw = doc.getTextWidth(lab) + 2.2;
    font(9, 'normal'); doc.setTextColor(MUTE);
    doc.text(doc.splitTextToSize(issuers.join(', '), CW - lw)[0], M + lw, y);
  }

  // ---- Selected awards ------------------------------------------------
  const awards = (data.honors && data.honors.awards) || [];
  if (awards.length) {
    section('Selected Awards');
    awards.slice(0, 3).forEach(a => {
      para(`${a.title} — ${a.organization} (${a.date})`, { size: 9, color: INK, lh: 1.25, gap: 1.5 });
    });
    if (awards.length > 3) {
      para(`+ ${awards.length - 3} more at asadalbadi.dev`, { size: 8.5, color: MUTE, style: 'italic' });
    }
  }

  // ---- Footer ---------------------------------------------------------
  doc.setDrawColor(RULE); doc.setLineWidth(0.3);
  doc.line(M, H - M, W - M, H - M);
  font(8.5, 'bold'); doc.setTextColor(TEAL);
  doc.text('Full portfolio & projects — asadalbadi.dev', W - M, H - M + 4, { align: 'right' });

  doc.save('Asad_Al_Badi_CV.pdf');
}
