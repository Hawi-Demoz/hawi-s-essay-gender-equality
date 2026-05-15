const langToggle = document.getElementById("langToggle");
const themeToggle = document.getElementById("themeToggle");
const progressFill = document.getElementById("progressFill");
const panels = document.querySelectorAll(".lang-panel");
const titleSpans = document.querySelectorAll(".title-lang");
const heroTextSpans = document.querySelectorAll(".lang-swap");
const fadeItems = document.querySelectorAll(".fade");
const root = document.documentElement;

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

setTheme("dark");
