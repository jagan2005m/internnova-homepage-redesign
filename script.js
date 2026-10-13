// InternNova homepage redesign interactions — vanilla JavaScript.
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");

  function closeMenu() {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("open");
    document.body.classList.remove("nav-open");
  }

  menuToggle?.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
    nav.classList.toggle("open", !expanded);
    document.body.classList.toggle("nav-open", !expanded);
  });

  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 820) closeMenu(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });

  // Reveal elements as they enter the viewport; show all if reduced motion is preferred.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Domain selector: update the detail panel with relevant learning information.
  const domains = {
    web: { icon: "⌘", kicker: "CREATE FOR THE WEB", title: "Bring ideas to life online.", description: "Learn how layouts, styles, and interactivity work together to create useful web experiences.", skills: ["HTML", "CSS", "JavaScript"] },
    data: { icon: "▥", kicker: "FIND THE STORY IN DATA", title: "Make data easier to understand.", description: "Explore how spreadsheets, queries, and visualisations can turn information into useful insights.", skills: ["Excel", "SQL", "Power BI"] },
    ai: { icon: "✳", kicker: "EXPLORE INTELLIGENT SYSTEMS", title: "Experiment with AI ideas.", description: "Build an understanding of AI and machine learning through concepts, small experiments, and guided projects.", skills: ["Python", "AI basics", "ML concepts"] },
    security: { icon: "⌁", kicker: "THINK SECURITY FIRST", title: "Understand a safer digital world.", description: "Learn the foundations of networks, security awareness, and responsible digital protection.", skills: ["Networks", "Security", "Awareness"] },
    python: { icon: "Py", kicker: "MAKE TASKS SIMPLER", title: "Create with Python.", description: "Practise programming fundamentals, automate small tasks, and develop your problem-solving approach.", skills: ["Python", "Scripting", "Logic"] },
    java: { icon: "Jv", kicker: "BUILD SOFTWARE FOUNDATIONS", title: "Think in objects and systems.", description: "Explore Java syntax, object-oriented concepts, and the building blocks of structured software.", skills: ["Java", "OOP", "Algorithms"] }
  };
  const tabButtons = document.querySelectorAll(".domain-tab");
  function setDomain(key) {
    const data = domains[key];
    if (!data) return;
    tabButtons.forEach(button => {
      const selected = button.dataset.domain === key;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    document.getElementById("domain-icon").textContent = data.icon;
    document.getElementById("domain-kicker").textContent = data.kicker;
    document.getElementById("domain-title").textContent = data.title;
    document.getElementById("domain-description").textContent = data.description;
    const skills = document.getElementById("domain-skills");
    skills.replaceChildren(...data.skills.map(skill => {
      const span = document.createElement("span");
      span.textContent = skill;
      return span;
    }));
    document.getElementById("domain-explore").setAttribute("href", "#programs");
  }
  tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => setDomain(button.dataset.domain));
    button.addEventListener("keydown", event => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabButtons.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabButtons.length) % tabButtons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabButtons.length - 1;
      tabButtons[next].focus();
      setDomain(tabButtons[next].dataset.domain);
    });
  });
  document.querySelectorAll("[data-domain-link]").forEach(link => {
    link.addEventListener("click", () => setDomain(link.dataset.domainLink));
  });

  // FAQ accordion; only one answer is expanded at a time.
  document.querySelectorAll(".faq-question").forEach(question => {
    question.addEventListener("click", () => {
      const currentItem = question.closest(".faq-item");
      const willOpen = !currentItem.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(item => {
        item.classList.remove("open");
        item.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        currentItem.classList.add("open");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Demo testimonial slider. Replace these examples with real, approved testimonials before launch.
  const quotes = [
    { quote: "I learned best when I stopped waiting to feel ready and started building small projects consistently.", name: "Student perspective", role: "Illustrative sample quote", avatar: "S" },
    { quote: "A clear learning plan can make a big goal feel manageable: learn one concept, practise it, then improve your work.", name: "Learning perspective", role: "Illustrative sample quote", avatar: "L" },
    { quote: "Your portfolio grows one project at a time. Focus on explaining what you built and what you learned along the way.", name: "Project perspective", role: "Illustrative sample quote", avatar: "P" }
  ];
  let quoteIndex = 0;
  function showQuote(index) {
    quoteIndex = (index + quotes.length) % quotes.length;
    const quote = quotes[quoteIndex];
    document.getElementById("quote-text").textContent = quote.quote;
    document.getElementById("quote-name").textContent = quote.name;
    document.getElementById("quote-role").textContent = quote.role;
    document.getElementById("quote-avatar").textContent = quote.avatar;
  }
  document.getElementById("testimonial-prev")?.addEventListener("click", () => showQuote(quoteIndex - 1));
  document.getElementById("testimonial-next")?.addEventListener("click", () => showQuote(quoteIndex + 1));

  // Newsletter form is intentionally a front-end demo: no email is sent or stored.
  const form = document.getElementById("newsletter-form");
  const message = document.getElementById("newsletter-message");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("newsletter-email");
    if (!email.checkValidity()) {
      email.reportValidity();
      return;
    }
    message.textContent = "Thanks! This demo form is not connected yet. Connect a mailing service to enable subscriptions.";
    email.value = "";
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
