/* Meghan & Owen — Quiet Editorial. Restrained, progressive-enhancement JS. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mark hero ready (entrance animation) once the document paints */
  requestAnimationFrame(function () {
    document.documentElement.classList.add("is-ready");
  });

  document.addEventListener("DOMContentLoaded", function () {
    /* ---- Mobile nav toggle ---- */
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (toggle && nav) {
      var close = function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.style.removeProperty("overflow");
      };
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        nav.classList.toggle("is-open", !open);
        if (!open) { document.body.style.overflow = "hidden"; }
        else { document.body.style.removeProperty("overflow"); }
      });
      nav.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", close);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && nav.classList.contains("is-open")) { close(); toggle.focus(); }
      });
      /* reset when resizing back to desktop */
      var mq = window.matchMedia("(min-width: 881px)");
      (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(function (e) {
        if (e.matches) { close(); }
      });
    }

    /* ---- Sticky header hairline on scroll ---- */
    var header = document.querySelector(".site-header");
    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-stuck", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* ---- Scroll reveal ---- */
    var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (reduce || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    }

    /* ---- RSVP form (non-functional, graceful) ---- */
    var form = document.getElementById("rsvp-form");
    var success = document.getElementById("rsvp-success");
    if (form && success) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var nameField = form.querySelector('[name="full-name"]');
        var name = nameField && nameField.value ? nameField.value.trim().split(/\s+/)[0] : "";
        var who = success.querySelector("[data-name]");
        if (who) { who.textContent = name ? name : "friend"; }
        form.hidden = true;
        success.classList.add("is-visible");
        success.setAttribute("tabindex", "-1");
        success.focus();
        success.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      });
    }

    /* ---- Marquee center-feature drift ----
       The photo crossing the viewport centre grows to full size and full
       opacity; its neighbours scale down and soften with distance. Driven by
       rAF (transform + opacity only, so it stays on the compositor), gated to
       when the band is on-screen, and skipped entirely under reduced-motion. */
    var marquee = document.querySelector(".marquee");
    if (marquee && !reduce) {
      var mItems = Array.prototype.slice.call(marquee.querySelectorAll(".marquee__item"));
      var mRaf = null, mRunning = false;
      var mFrame = function () {
        var r = marquee.getBoundingClientRect();
        var cx = r.left + r.width / 2;
        var falloff = r.width * 0.40;
        for (var i = 0; i < mItems.length; i++) {
          var ir = mItems[i].getBoundingClientRect();
          var d = Math.min(Math.abs((ir.left + ir.width / 2) - cx) / falloff, 1);
          var e = d * d * (3 - 2 * d); // smoothstep
          mItems[i].style.transform = "scale(" + (1 - 0.15 * e).toFixed(4) + ")";
          mItems[i].style.opacity = (1 - 0.40 * e).toFixed(3);
        }
        mRaf = requestAnimationFrame(mFrame);
      };
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting && !mRunning) { mRunning = true; mFrame(); }
            else if (!en.isIntersecting && mRunning) { mRunning = false; cancelAnimationFrame(mRaf); }
          });
        }, { threshold: 0 }).observe(marquee);
      } else { mFrame(); }
    }
  });
})();
