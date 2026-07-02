(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function setAnimationAttributes() {
    document.body.dataset.aosDuration = "760";
    document.body.dataset.aosEasing = "ease-out-cubic";

    const groups = [
      { selector: "section:not(#home) h2", animation: "fade-up", delay: 0 },
      { selector: "#about .grid > div:first-child", animation: "fade-right", delay: 0 },
      { selector: "#about .grid > div:last-child", animation: "fade-left", delay: 0 },
      { selector: "#services .grid > .group", animation: "fade-up", delay: 95 },
      { selector: ".process-step", animation: "zoom-in-up", delay: 135 },
      { selector: "#compliance .grid > div:first-child", animation: "fade-right", delay: 0 },
      { selector: "#compliance .grid > div:last-child", animation: "fade-left", delay: 0 },
      { selector: "#industries .grid > .group, #industries .grid > div", animation: "fade-up", delay: 95 },
      { selector: "#contact .grid > div:first-child", animation: "fade-right", delay: 0 },
      { selector: "#contact .grid > div:last-child", animation: "fade-left", delay: 0 },
      { selector: "#faq .faq-row", animation: "fade-left", delay: 85 },
      { selector: "footer h3, footer a, footer img, footer p", animation: "fade-up", delay: 45 },
    ];

    groups.forEach(({ selector, animation, delay }) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        if (element.dataset.aos) return;
        element.dataset.aos = animation;
        element.dataset.aosDelay = String(Math.min(index * delay, 360));
      });
    });
  }

  function initPremiumMotionLayer() {
    document.body.classList.add("motion-ready");

    document.querySelectorAll("#home .blur-3xl, footer img[aria-hidden='true']").forEach((element, index) => {
      element.classList.add("ambient-drift");
      element.style.setProperty("--drift-delay", `${index * -1.7}s`);
      element.style.setProperty("--drift-distance", `${10 + index * 4}px`);
    });

    document.querySelectorAll("#home .grid.grid-cols-3 > div").forEach((element, index) => {
      element.classList.add("stat-tile-motion");
      element.style.setProperty("--tile-delay", `${index * 110}ms`);
    });

    document
      .querySelectorAll("#services .group, #industries .group, #compliance .group, .faq-row")
      .forEach((element) => element.classList.add("premium-lift"));

    document.querySelectorAll("#services img, #compliance img, #contact img, #about img").forEach((image) => {
      image.classList.add("premium-image");
    });
  }

  function initScrollProgress() {
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);

    function updateProgress() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const value = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      progress.style.transform = `scaleX(${Math.min(Math.max(value, 0), 1)})`;
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  function initMagneticButtons() {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    document.querySelectorAll(".btn-enhanced").forEach((button) => {
      button.addEventListener("mousemove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.setProperty("--magnet-x", `${x * 0.09}px`);
        button.style.setProperty("--magnet-y", `${y * 0.16}px`);
      });

      button.addEventListener("mouseleave", () => {
        button.style.setProperty("--magnet-x", "0px");
        button.style.setProperty("--magnet-y", "0px");
      });
    });
  }

  function initTiltCards() {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    document.querySelectorAll(".premium-lift").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", `${(-y * 2.2).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${(x * 2.2).toFixed(2)}deg`);
      });

      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  function initAOS() {
    setAnimationAttributes();

    if (!window.AOS) {
      initFallbackReveal();
      return;
    }

    window.AOS.init({
      duration: 760,
      easing: "ease-out-cubic",
      offset: 90,
      once: true,
      mirror: false,
      disable: reduceMotion,
    });
  }

  function initFallbackReveal() {
    const animatedElements = document.querySelectorAll("[data-aos]");
    if (!animatedElements.length) return;

    animatedElements.forEach((element) => element.classList.add("aos-init"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const delay = Number(entry.target.dataset.aosDelay) || 0;
          window.setTimeout(() => entry.target.classList.add("aos-animate"), reduceMotion ? 0 : delay);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    animatedElements.forEach((element) => observer.observe(element));
  }

  function animateHero() {
    if (reduceMotion || !window.gsap) return;

    window.gsap.from("#home .max-w-2xl > *", {
      y: 24,
      opacity: 0,
      duration: 0.85,
      stagger: 0.12,
      ease: "power3.out",
    });

    window.gsap.from("#home .hero-card-motion", {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.18,
      ease: "power3.out",
    });
  }

  function initSoftParallax() {
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    document.querySelectorAll("[data-float]").forEach((element) => {
      window.gsap.to(element, {
        y: Number(element.dataset.float) || -24,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    });
  }

  function initCounters() {
    const counters = document.querySelectorAll("[data-count-to]");
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target;
          const target = Number(element.dataset.countTo);
          const suffix = element.dataset.countSuffix || "";
          const duration = reduceMotion ? 1 : 1100;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = `${Math.round(target * eased)}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          }

          requestAnimationFrame(tick);
          observer.unobserve(element);
        });
      },
      { threshold: 0.45 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  function prepareCounters() {
    const statMap = [
      { text: "50+", value: "50", suffix: "+" },
      { text: "98%", value: "98", suffix: "%" },
      { text: "24/7", value: "24", suffix: "/7" },
    ];

    document.querySelectorAll("#home span").forEach((element) => {
      const match = statMap.find((item) => element.textContent.trim() === item.text);
      if (!match) return;
      element.dataset.countTo = match.value;
      element.dataset.countSuffix = match.suffix;
      element.textContent = `0${match.suffix}`;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initIcons();
    initPremiumMotionLayer();
    initScrollProgress();
    prepareCounters();
    initAOS();
    animateHero();
    initSoftParallax();
    initCounters();
    initMagneticButtons();
    initTiltCards();
  });
})();
