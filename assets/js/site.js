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

    /* ---- Marquee lightbox (homepage photo viewer) ----
       Tap/click any print to see it large in its true proportions; dismiss by
       clicking the surround, the close control, or Escape. Built once, only
       where a marquee exists, so other pages are untouched. */
    var marquee = document.querySelector(".marquee");
    if (marquee) {
      var lb = document.createElement("div");
      lb.className = "lightbox";
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.setAttribute("aria-label", "Photograph, enlarged");
      lb.innerHTML =
        '<button class="lightbox__close" type="button" aria-label="Close photo">' +
        '<span class="x" aria-hidden="true">×</span></button>' +
        '<img class="lightbox__img" alt="">';
      document.body.appendChild(lb);

      var lbImg = lb.querySelector(".lightbox__img");
      var lbClose = lb.querySelector(".lightbox__close");
      var trigger = null;

      var openLightbox = function (img) {
        trigger = img;
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.getAttribute("alt") || "Meghan and Owen";
        lb.classList.add("is-open");
        document.body.style.overflow = "hidden";
        requestAnimationFrame(function () { lbClose.focus(); });
      };
      var closeLightbox = function () {
        lb.classList.remove("is-open");
        document.body.style.removeProperty("overflow");
        if (trigger && typeof trigger.focus === "function") {
          try { trigger.focus({ preventScroll: true }); } catch (e) { trigger.focus(); }
        }
        trigger = null;
      };

      /* Make the *visible* prints keyboard-operable; the aria-hidden duplicates
         stay out of the tab order but still open on click. */
      marquee.querySelectorAll(".marquee__item img").forEach(function (img) {
        var item = img.closest(".marquee__item");
        if (item && item.getAttribute("aria-hidden") === "true") { return; }
        var label = img.getAttribute("alt");
        img.setAttribute("role", "button");
        img.setAttribute("tabindex", "0");
        img.setAttribute("aria-label", label ? "View photo: " + label : "View photo");
        img.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            openLightbox(img);
          }
        });
      });

      marquee.addEventListener("click", function (e) {
        var img = e.target.closest && e.target.closest(".marquee__item img");
        if (img) { e.preventDefault(); openLightbox(img); }
      });

      lb.addEventListener("click", function (e) {
        if (e.target === lb) { closeLightbox(); }
      });
      lbClose.addEventListener("click", closeLightbox);
      lb.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { e.preventDefault(); closeLightbox(); }
        else if (e.key === "Tab") { e.preventDefault(); lbClose.focus(); }
      });
    }

    /* ---- Film moment: play the slow-mo reveal once when it scrolls into view ----
       Honors reduced-motion (leaves the poster still showing) and never loops,
       so it holds on the final frame. */
    var film = document.querySelector(".film__video");
    if (film && !reduce) {
      if ("IntersectionObserver" in window) {
        var playedFilm = false;
        var filmIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !playedFilm) {
              playedFilm = true;
              var pr = film.play();
              if (pr && pr.catch) { pr.catch(function () {}); }
              filmIO.disconnect();
            }
          });
        }, { threshold: 0.45 });
        filmIO.observe(film);
      } else {
        var prf = film.play();
        if (prf && prf.catch) { prf.catch(function () {}); }
      }
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
  });
})();
