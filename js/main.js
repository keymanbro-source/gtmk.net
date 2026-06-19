(function () {
  "use strict";

  // ─── Mobile nav ───────────────────────────────────────────────
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("#site-nav");
  var navLinks = document.querySelectorAll(".site-nav a[href^=\"#\"]");

  if (toggle && nav && header) {
    function setMenuOpen(open) {
      header.classList.toggle("menu-open", open);
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      document.body.style.overflow = open ? "hidden" : "";
    }

    toggle.addEventListener("click", function () {
      setMenuOpen(!nav.classList.contains("is-open"));
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 768px)").matches) {
          setMenuOpen(false);
        }
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 769px)").matches) {
        setMenuOpen(false);
      }
    });
  }

  // ─── Scroll animations (IntersectionObserver) ─────────────────
  var animatedEls = document.querySelectorAll("[data-animate]");

  if ("IntersectionObserver" in window && animatedEls.length) {
    var scrollObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.dataset.delay || "0", 10);
          setTimeout(function () {
            el.classList.add("is-visible");
          }, delay);
          scrollObserver.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    animatedEls.forEach(function (el) {
      scrollObserver.observe(el);
    });
  } else {
    animatedEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // ─── Number counter animation ─────────────────────────────────
  function animateCount(el) {
    var target = parseInt(el.dataset.count, 10);
    var duration = 1400;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var countEls = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && countEls.length) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    countEls.forEach(function (el) {
      countObserver.observe(el);
    });
  }

  // ─── Ripple effect on buttons ─────────────────────────────────
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement("span");
      ripple.className = "btn-ripple";
      ripple.style.left = (e.clientX - rect.left) + "px";
      ripple.style.top  = (e.clientY - rect.top)  + "px";
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", function () {
        ripple.remove();
      });
    });
  });

})();
