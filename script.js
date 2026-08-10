// --- Floating header: logo + hamburger menu ---
const siteHeader = document.querySelector("#siteHeader");
const menuToggle = document.querySelector("#menuToggle");
const mobileNav = document.querySelector("#mobileNav");
const mobileLinks = document.querySelectorAll("[data-mobile-link]");

function setMenuOpen(isOpen) {
  if (!menuToggle || !mobileNav) return;

  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

  if (isOpen) {
    mobileNav.classList.remove("is-closing");
    mobileNav.hidden = false;
    // force reflow so the open transition plays
    void mobileNav.offsetWidth;
    mobileNav.classList.add("is-open");
  } else if (mobileNav.classList.contains("is-open") || !mobileNav.hidden) {
    mobileNav.classList.remove("is-open");
    mobileNav.classList.add("is-closing");
    window.setTimeout(() => {
      if (!mobileNav.classList.contains("is-open")) {
        mobileNav.classList.remove("is-closing");
        mobileNav.hidden = true;
      }
    }, 420);
  }
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (siteHeader && !siteHeader.contains(event.target) && document.body.classList.contains("menu-open")) {
      setMenuOpen(false);
    }
  });
}

// --- Back to top ---
const toTopButton = document.querySelector("#toTop");

if (toTopButton) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const updateToTopVisibility = () => {
    toTopButton.classList.toggle("is-visible", window.scrollY > 600);
  };

  window.addEventListener("scroll", updateToTopVisibility, { passive: true });
  updateToTopVisibility();

  toTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });
}

// --- Existing page logic ---
const searchInput = document.querySelector("#brandSearch");
const filterButtons = document.querySelectorAll(".filter-button");
const cards = document.querySelectorAll(".brand-card");
const revealItems = document.querySelectorAll(".reveal-item, .brand-card");
const goalsStage = document.querySelector(".goals-stage");
const goalCards = document.querySelectorAll(".goal-card");

let activeFilter = "all";
let activeGoalIndex = 0;

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const category = card.dataset.category;
    const matchesQuery = !query || text.includes(query);
    const matchesFilter = activeFilter === "all" || category === activeFilter;

    card.classList.toggle("hidden", !(matchesQuery && matchesFilter));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    applyFilters();
  });
});

searchInput.addEventListener("input", applyFilters);

function setActiveGoal(nextIndex) {
  if (!goalCards.length || nextIndex === activeGoalIndex) {
    return;
  }

  goalCards.forEach((card, index) => {
    card.classList.toggle("is-active", index === nextIndex);
    card.classList.toggle("is-previous", index < nextIndex);
  });

  activeGoalIndex = nextIndex;
}

function updateGoalCards() {
  if (!goalsStage || !goalCards.length) {
    return;
  }

  const rect = goalsStage.getBoundingClientRect();
  const scrollable = rect.height - window.innerHeight;
  const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
  const nextIndex = Math.min(goalCards.length - 1, Math.floor(progress * goalCards.length));

  setActiveGoal(nextIndex);
}

window.addEventListener("scroll", updateGoalCards, { passive: true });
window.addEventListener("resize", updateGoalCards);
updateGoalCards();

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
  item.classList.add("reveal-item");
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
