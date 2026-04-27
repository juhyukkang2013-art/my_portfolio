const docEl = document.documentElement;

function getTheme() {
  return docEl.classList.contains("dark") ? "dark" : "light";
}

function setTheme(theme) {
  docEl.classList.remove("light", "dark");
  docEl.classList.add(theme);
  try { localStorage.setItem("theme", theme); } catch {}
  const icon = document.querySelector("[data-theme-icon]");
  if (icon) icon.textContent = theme === "dark" ? "🌙" : "☀️";
}

function initThemeToggle() {
  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;
  btn.addEventListener("click", () => setTheme(getTheme() === "dark" ? "light" : "dark"));
  const stored = (() => { try { return localStorage.getItem("theme"); } catch { return null; } })();
  setTheme(stored === "dark" || stored === "light" ? stored : getTheme());
}

function initScrollProgress() {
  const bar = document.querySelector("[data-progress]");
  if (!bar) return;
  const update = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / max))})`;
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function scrollToTarget(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      if (href.length <= 1) return;
      e.preventDefault();
      scrollToTarget(href);
      history.replaceState(null, "", href);
    });
  });
}

function initSideNav() {
  const buttons = Array.from(document.querySelectorAll("[data-nav-btn]"));
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => scrollToTarget(btn.getAttribute("data-target") || ""));
  });

  const sectionIds = ["#hero", "#my-information", "#skills", "#projects", "#contact"];
  const sections = sectionIds.map((s) => document.querySelector(s)).filter(Boolean);
  if (!("IntersectionObserver" in window) || !sections.length) return;

  const byTarget = new Map(buttons.map((b) => [b.getAttribute("data-target"), b]));
  const setActive = (id) => {
    buttons.forEach((b) => b.removeAttribute("aria-current"));
    const active = byTarget.get(`#${id}`);
    if (active) active.setAttribute("aria-current", "true");
  };

  const io = new IntersectionObserver(
    (entries) => {
      const best = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (best) setActive(best.target.id);
    },
    { threshold: [0.2, 0.5, 0.8] }
  );

  sections.forEach((s) => io.observe(s));
  setActive("hero");
}

function initScrollNext() {
  document.querySelectorAll("[data-scroll-next]").forEach((btn) => {
    btn.addEventListener("click", () => scrollToTarget(btn.getAttribute("data-scroll-next") || ""));
  });
}

function initYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initHamburger() {
  const btn = document.querySelector("[data-hamburger]");
  const nav = document.getElementById("mobile-nav");
  if (!btn || !nav) return;

  const open = () => { btn.setAttribute("aria-expanded", "true"); nav.hidden = false; };
  const close = () => { btn.setAttribute("aria-expanded", "false"); nav.hidden = true; };

  btn.addEventListener("click", () => {
    btn.getAttribute("aria-expanded") === "true" ? close() : open();
  });

  nav.querySelectorAll("[data-mobile-nav-link]").forEach((a) => {
    a.addEventListener("click", close);
  });

  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !nav.contains(e.target)) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") close();
  });
}

function initScrollAnimations() {
  const els = document.querySelectorAll("[data-animate]");
  if (!els.length || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );

  els.forEach((el) => io.observe(el));
}

const PROJECTS = {
  'our-class-website': {
    type: 'WEB',
    title: '우리반 웹사이트',
    desc: '우리 반, 우리 학교의 모든 정보가 한곳에! 급식, 시간표, 학사일정을 한눈에 확인할 수 있어요. NEIS API를 사용해 프론트엔드로 불러오는 방식, 다양한 기능을 지원합니다.',
    siteUrl: 'https://eungaram-1-2.github.io/eungaram-1-2-integration/#home',
    githubUrl: 'https://github.com/eungaram-1-2/eungaram-1-2-integration',
    mainImage: './img/our-class-website.png',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
    period: '2026년~2026년',
    projectType: '개인 프로젝트',
    detail: '급식·시간표·학사일정을 실시간으로 제공',
    features: [
      '급식 메뉴 실시간 조회',
      '시간표 확인 기능',
      '학사일정 달력',
      '다크 모드 지원',
      '모바일 맞춤형 디자인',
      'PWA 설치 지원',
    ],
  },
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const openModal = (key) => {
    const p = PROJECTS[key];
    if (!p) return;

    modal.querySelector('[data-pmodal-type]').textContent = p.type;
    modal.querySelector('[data-pmodal-title]').textContent = p.title;
    modal.querySelector('[data-pmodal-desc]').textContent = p.desc;
    modal.querySelector('[data-pmodal-site]').href = p.siteUrl;
    modal.querySelector('[data-pmodal-github]').href = p.githubUrl;

    const heroImg = modal.querySelector('[data-pmodal-hero-img]');
    heroImg.src = p.mainImage;
    heroImg.alt = p.title + ' 메인 화면';

    modal.querySelector('[data-pmodal-tags]').innerHTML =
      p.tags.map(t => `<span class="tag">${t}</span>`).join('');

    modal.querySelector('[data-pmodal-features]').innerHTML =
      p.features.map(f => `<div class="pmodal__feature"><span class="pmodal__feature-dot" aria-hidden="true"></span>${f}</div>`).join('');

    modal.querySelector('[data-pmodal-period]').textContent = p.period;
    modal.querySelector('[data-pmodal-projtype]').textContent = p.projectType;
    modal.querySelector('[data-pmodal-detail]').textContent = p.detail;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-project]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-project')));
  });

  document.getElementById('pmodalClose').addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
}

initThemeToggle();
initScrollProgress();
initSmoothAnchors();
initSideNav();
initScrollNext();
initYear();
initHamburger();
initScrollAnimations();
initProjectModal();
