const langToggle = document.getElementById("langToggle");
const themeToggle = document.getElementById("themeToggle");
const progressFill = document.getElementById("progressFill");
const panels = document.querySelectorAll(".lang-panel");
const titleSpans = document.querySelectorAll(".title-lang");
const heroTextSpans = document.querySelectorAll(".lang-swap");
const fadeItems = document.querySelectorAll(".fade");
const root = document.documentElement;

const buildPdfHeader = (lang) => {
  const titleText = document.querySelector(`.title-lang[data-lang="${lang}"]`)?.textContent?.trim();
  const subtitleText = document.querySelector(`.subtitle .lang-swap[data-lang="${lang}"]`)?.textContent?.trim();
  const metaText = document.querySelector(`.meta .lang-swap[data-lang="${lang}"]`)?.textContent?.trim();
  const submissionText = document.querySelector(`.submission .lang-swap[data-lang="${lang}"]`)?.textContent?.trim();
  const authorText = document.querySelector(`.author .lang-swap[data-lang="${lang}"]`)?.textContent?.trim();

  const header = document.createElement("header");
  header.className = "pdf-header";

  if (titleText) {
    const title = document.createElement("h1");
    title.className = "pdf-title";
    title.textContent = titleText;
    header.appendChild(title);
  }

  if (subtitleText) {
    const subtitle = document.createElement("p");
    subtitle.className = "pdf-subtitle";
    subtitle.textContent = subtitleText;
    header.appendChild(subtitle);
  }

  if (metaText) {
    const meta = document.createElement("p");
    meta.className = "pdf-meta";
    meta.textContent = metaText;
    header.appendChild(meta);
  }

  if (submissionText) {
    const submission = document.createElement("p");
    submission.className = "pdf-submission";
    submission.textContent = submissionText;
    header.appendChild(submission);
  }

  if (authorText) {
    const author = document.createElement("p");
    author.className = "pdf-author";
    author.textContent = authorText;
    header.appendChild(author);
  }

  return header;
};

const sanitizeForPdf = (container) => {
  container.querySelectorAll(".pdf-download").forEach((btn) => btn.remove());
  container.querySelectorAll(".fade").forEach((node) => node.classList.remove("fade", "is-visible"));
  // Only avoid page breaks on small blocks; large blocks can exceed a page and break rendering.
  container.querySelectorAll(".pdf-header, .panel-head, h2").forEach((node) => node.classList.add("pdf-avoid"));
};

const buildPrintablePanel = (lang) => {
  const panel = document.querySelector(`.lang-panel[data-lang="${lang}"]`);
  if (!panel) return null;

  const panelClone = panel.cloneNode(true);
  panelClone.hidden = false;

  // Remove UI header and button from export.
  panelClone.querySelectorAll(".panel-head, .pdf-download").forEach((n) => n.remove());

  // Remove animation classes so nothing is invisible.
  panelClone.querySelectorAll(".fade").forEach((n) => n.classList.remove("fade", "is-visible"));

  // Drop cap floating can render badly in print/PDF.
  panelClone.querySelectorAll(".dropcap").forEach((n) => n.classList.add("pdf-dropcap-off"));

  return panelClone;
};

const openPrintPdf = async (lang) => {
  const titleText = document.querySelector(`.title-lang[data-lang="${lang}"]`)?.textContent?.trim() || document.title;
  const subtitleText = document.querySelector(`.subtitle .lang-swap[data-lang="${lang}"]`)?.textContent?.trim() || "";
  const metaText = document.querySelector(`.meta .lang-swap[data-lang="${lang}"]`)?.textContent?.trim() || "";
  const submissionText = document.querySelector(`.submission .lang-swap[data-lang="${lang}"]`)?.textContent?.trim() || "";
  const authorText = document.querySelector(`.author .lang-swap[data-lang="${lang}"]`)?.textContent?.trim() || "";

  const panelClone = buildPrintablePanel(lang);
  if (!panelClone) return;

  const win = window.open("", "_blank");
  if (!win) {
    alert("Pop-up blocked. Please allow pop-ups to download the PDF.");
    return;
  }

  const fontLink = document.querySelector('link[href*="fonts.googleapis.com"]')?.outerHTML || "";
  const pageTitle = `${titleText} (${lang === "am" ? "Amharic" : "English"})`;

  win.document.open();
  win.document.write(`<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pageTitle.replace(/</g, "&lt;")}</title>
  ${fontLink}
  <style>
    :root {
      --serif: "Playfair Display", "Times New Roman", serif;
      --sans: "Manrope", Arial, sans-serif;
      --ethiopic: "Noto Sans Ethiopic", var(--sans);
    }
    @page { margin: 0.75in; }
    body { margin: 0; font-family: ${lang === "am" ? "var(--ethiopic)" : "var(--sans)"}; color: #111; line-height: 1.65; }
    h1 { font-family: var(--serif); font-size: 26px; line-height: 1.1; margin: 0 0 10px; }
    .sub { margin: 0 0 8px; color: #444; }
    .meta { margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.06em; color: #555; font-size: 12px; }
    .submission { margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.12em; color: #666; font-size: 11px; }
    .author { margin: 0 0 18px; text-transform: uppercase; letter-spacing: 0.1em; color: #333; font-size: 12px; }
    .rule { height: 1px; background: #ddd; margin: 14px 0 18px; }
    p { margin: 0 0 14px; font-size: 13.5px; }
    a { color: #111; text-decoration: underline; }
    .pdf-dropcap-off::first-letter { float: none !important; font-size: inherit !important; padding: 0 !important; }
    h2, .references { break-inside: avoid; page-break-inside: avoid; }
    @media print {
      a { color: #111; }
    }
  </style>
</head>
<body>
  <main>
    <h1>${(titleText || "").replace(/</g, "&lt;")}</h1>
    ${subtitleText ? `<p class="sub">${subtitleText.replace(/</g, "&lt;")}</p>` : ""}
    ${metaText ? `<p class="meta">${metaText.replace(/</g, "&lt;")}</p>` : ""}
    ${submissionText ? `<p class="submission">${submissionText.replace(/</g, "&lt;")}</p>` : ""}
    ${authorText ? `<p class="author">${authorText.replace(/</g, "&lt;")}</p>` : ""}
    <div class="rule"></div>
    <div id="content"></div>
  </main>
</body>
</html>`);
  win.document.close();

  const mount = win.document.getElementById("content");
  if (mount) mount.appendChild(panelClone);

  // Wait for fonts/layout in the new window, then open print dialog.
  if (win.document.fonts && win.document.fonts.ready) {
    await win.document.fonts.ready;
  }
  await new Promise((resolve) => win.requestAnimationFrame(() => win.requestAnimationFrame(resolve)));

  win.focus();
  win.print();
};

const downloadPanelPdf = async (lang) => {
  // html2canvas/html2pdf can produce blank PDFs in Chrome for long, complex pages.
  // Printing uses Chrome's native PDF generation and is far more reliable.
  await openPrintPdf(lang);
};

const setTheme = (theme) => {
  root.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-pressed", theme === "dark");
  themeToggle.querySelector(".theme-text").textContent = theme === "dark" ? "Dark" : "Light";
};

const toggleTheme = () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(next);
};

const toggleLanguage = () => {
  const isEnglish = !panels[0].hasAttribute("hidden");
  panels.forEach((panel) => {
    const isTarget = panel.getAttribute("data-lang") === (isEnglish ? "am" : "en");
    panel.hidden = !isTarget;
  });
  titleSpans.forEach((span) => {
    const isTarget = span.getAttribute("data-lang") === (isEnglish ? "am" : "en");
    span.hidden = !isTarget;
  });
  heroTextSpans.forEach((span) => {
    const isTarget = span.getAttribute("data-lang") === (isEnglish ? "am" : "en");
    span.hidden = !isTarget;
  });
  langToggle.textContent = isEnglish ? "English" : "አማርኛ";
  langToggle.setAttribute("aria-pressed", String(isEnglish));
  document.querySelector("article").scrollIntoView({ behavior: "smooth", block: "start" });
};

const updateProgress = () => {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progressFill.style.height = `${progress}%`;
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.15 }
);

fadeItems.forEach((item) => observer.observe(item));

langToggle.addEventListener("click", toggleLanguage);
themeToggle.addEventListener("click", toggleTheme);
window.addEventListener("scroll", updateProgress);
window.addEventListener("load", updateProgress);

document.querySelectorAll("[data-pdf-lang]").forEach((btn) => {
  btn.addEventListener("click", () => downloadPanelPdf(btn.getAttribute("data-pdf-lang")));
});

setTheme("dark");
