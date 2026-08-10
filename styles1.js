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


// ------------------------------------------------------------------
// Cat chatbot mascot — fixed bottom-right, directly above the
// back-to-top arrow. Appears after scrolling down.
// ------------------------------------------------------------------
(function () {
  const chatbot  = document.getElementById("catChatbot");
  const btn      = document.getElementById("catBtn");
  const panel    = document.getElementById("catPanel");
  const closeBtn = document.getElementById("catClose");
  const tooltip  = document.getElementById("catTooltip");
  const dot      = document.getElementById("catDot");
  const messages = document.getElementById("catMessages");
  const form     = document.getElementById("catForm");
  const input    = document.getElementById("catInput");
  const quick    = document.getElementById("catQuick");
  if (!chatbot || !btn || !panel) return;

  let isOpen = false;
  let hasInteracted = false;

  // ---- Show on scroll (same threshold as back-to-top) ----
  function updateVisibility() {
    if (window.scrollY > 400) {
      chatbot.classList.add("cat-visible");
    } else if (!isOpen) {
      chatbot.classList.remove("cat-visible");
    }
  }
  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();

  // ---- Open / close ----
  function openPanel() {
    isOpen = true;
    hasInteracted = true;
    panel.classList.add("panel-open");
    panel.setAttribute("aria-hidden", "false");
    btn.classList.add("cat-open");
    btn.setAttribute("aria-expanded", "true");
    hideTooltip();
    dot.classList.remove("badge-visible");
    setTimeout(() => input && input.focus(), 300);
  }
  function closePanel() {
    isOpen = false;
    panel.classList.remove("panel-open");
    panel.setAttribute("aria-hidden", "true");
    btn.classList.remove("cat-open");
    btn.setAttribute("aria-expanded", "false");
  }
  btn.addEventListener("click", () => isOpen ? closePanel() : openPanel());
  closeBtn.addEventListener("click", closePanel);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanel(); });
  document.addEventListener("click", (e) => {
    if (isOpen && !chatbot.contains(e.target)) closePanel();
  });

  // ---- Tooltip ----
  let tooltipTimer;
  function showTooltip(text) {
    if (isOpen) return;
    if (text) tooltip.querySelector("span").textContent = text;
    tooltip.classList.add("tooltip-visible");
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(hideTooltip, 3500);
  }
  function hideTooltip() { tooltip.classList.remove("tooltip-visible"); }
  btn.addEventListener("mouseenter", () => { if (!isOpen) showTooltip("Click to chat! 🐾"); });
  btn.addEventListener("mouseleave", hideTooltip);

  // ---- Unread dot + first-greet tooltip after cat appears ----
  let greeted = false;
  const greetObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !greeted) {
        greeted = true;
        setTimeout(() => {
          if (!hasInteracted && !isOpen) showTooltip("Meow! Need help? 🐾");
          if (!hasInteracted) {
            dot.classList.add("badge-visible");
            setTimeout(() => dot.classList.remove("badge-visible"), 12000);
          }
        }, 1200);
        greetObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  greetObserver.observe(chatbot);

  // ---- Blinking ----
  function scheduleBlink() {
    const delay = 2200 + Math.random() * 3500;
    setTimeout(() => {
      btn.classList.add("is-blinking");
      setTimeout(() => {
        btn.classList.remove("is-blinking");
        scheduleBlink();
      }, 140);
    }, delay);
  }
  scheduleBlink();

  // ---- Chat replies ----
  const replies = {
    brands: {
      text: "We have 18 Tells brands — from WorldTells, BharatTells & CricketTells to TechTells, FoodTells, HealthTells and more! Scroll to the 'Focused Tells desks' section to see them all. 🐱",
      action: () => smoothScrollTo("brands")
    },
    about: {
      text: "Tellsgroup is the independent parent company behind focused Tells publications. Every brand gets its own voice, while the group keeps standards, visual identity and long-term trust connected. See the 'What we believe' section above!",
      action: () => smoothScrollTo("about")
    },
    contact: {
      text: "Scroll to the Contact section below — there are cards for launching a brand, editorial partnerships, and press. You can also email us directly. 📬",
      action: () => smoothScrollTo("contact")
    },
    pet: [
      "Purrrrrr~ ♥ You found the spot behind the ears!",
      "*stretches* Mrow! More please~ 😺",
      "You're my favourite human now. 🐾"
    ]
  };

  function smoothScrollTo(id) {
    closePanel();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addMsg(text, who = "bot") {
    const wrap = document.createElement("div");
    wrap.className = `cat-msg cat-msg-${who}`;
    const avatar = document.createElement("span");
    avatar.className = "cat-msg-avatar";
    avatar.textContent = who === "bot" ? "🐱" : "🙂";
    const bubble = document.createElement("div");
    bubble.className = "cat-msg-bubble";
    const p = document.createElement("p");
    p.textContent = text;
    bubble.appendChild(p);
    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  function addTyping() {
    const wrap = document.createElement("div");
    wrap.className = "cat-msg cat-msg-bot";
    wrap.id = "catTyping";
    const avatar = document.createElement("span");
    avatar.className = "cat-msg-avatar";
    avatar.textContent = "🐱";
    const bubble = document.createElement("div");
    bubble.className = "cat-msg-bubble";
    bubble.innerHTML = '<span class="cat-typing"><span></span><span></span><span></span></span>';
    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }
  function removeTyping() {
    const t = document.getElementById("catTyping");
    if (t) t.remove();
  }

  function botReply(spec) {
    addTyping();
    setTimeout(() => {
      removeTyping();
      if (Array.isArray(spec)) {
        addMsg(spec[Math.floor(Math.random() * spec.length)]);
      } else if (spec && typeof spec === "object") {
        addMsg(spec.text);
        if (typeof spec.action === "function") {
          setTimeout(spec.action, 400);
        }
      } else {
        addMsg(spec);
      }
    }, 650 + Math.random() * 400);
  }

  function respondTo(text) {
    const t = text.toLowerCase().trim();
    if (!t) return "Meow? (Try typing something!)";
    if (/\b(hi|hello|hey|yo|hola|namaste)\b/.test(t)) {
      const hellos = ["Hi there! 🐾", "Mrow! Hello!", "Hey! Welcome to Tellsgroup 😺"];
      return hellos[Math.floor(Math.random() * hellos.length)];
    }
    if (/\b(brand|network|sites?|websites?|desk)\b/.test(t)) return replies.brands;
    if (/\b(about|who|what|mission|believe|company)\b/.test(t)) return replies.about;
    if (/\b(contact|email|reach|touch|hire|partner|press)\b/.test(t)) return replies.contact;
    if (/\b(pet|scratch|belly|cute|purr|love|aww|petting)\b/.test(t)) return replies.pet;
    if (/\b(bye|goodbye|see ?you|later|cya)\b/.test(t)) return "Paw-bye! Come back for more stories. 🐾";
    if (/\b(cricket|sport|match|game)\b/.test(t)) return "CricketTells covers matches, players, records and leagues — scroll to the brands section to check it out! 🏏";
    if (/\b(cat|kitty|meow|you)\b/.test(t)) return "That's me! 😸 I'm the Tells Cat — I nap 16 hours a day and answer questions the other 8.";
    if (/\b(help|what can|how do)\b/.test(t)) return "I can show you our brands, tell you about Tellsgroup, take you to contact, or happily accept pets. Try the quick-reply buttons!";
    return "Hmm, I'm just a cat and don't know that one yet 😿 Try a quick-reply button, or scroll the page to explore!";
  }

  // ---- Quick replies ----
  quick.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-intent]");
    if (!b) return;
    const intent = b.dataset.intent;
    const labels = { brands: "Show me the brands", about: "What is Tellsgroup?", contact: "Take me to contact", pet: "Pet the cat" };
    addMsg(labels[intent] || intent, "user");
    botReply(replies[intent] || "Meow?");
  });

  // ---- Form submit ----
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    addMsg(val, "user");
    input.value = "";
    botReply(respondTo(val));
  });
})();
