/* Červená panda — local rebuild · shared interactions */
(function () {
  "use strict";

  /* ---- Mobile navigation ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.toggle("open");
      q.setAttribute("aria-expanded", isOpen ? "true" : "false");
      a.style.maxHeight = isOpen ? a.scrollHeight + "px" : null;
    });
  });

  /* ---- Poptávka form (posts to n8n webhook) ---- */
  var WEBHOOK_URL = "https://n8n-production-9b68.up.railway.app/webhook/poptavka";
  var poptavka = document.querySelector("#poptavkaForm");
  if (poptavka) {
    poptavka.addEventListener("submit", async function (e) {
      e.preventDefault();

      var btn = document.querySelector("#submitBtn");
      var errorDiv = document.querySelector("#cfError");
      errorDiv.style.display = "none";
      btn.disabled = true;
      btn.textContent = "Odesílám…";

      var data = {
        firstName: document.querySelector("#firstName").value.trim(),
        lastName: document.querySelector("#lastName").value.trim(),
        email: document.querySelector("#email").value.trim(),
        phone: document.querySelector("#phone").value.trim(),
        city: document.querySelector("#city").value.trim(),
        message: document.querySelector("#message").value.trim(),
        priority: document.querySelector("#priority").checked ? "ano" : "ne",
      };

      try {
        var res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);

        poptavka.style.display = "none";
        document.querySelector("#cfSuccess").style.display = "block";
      } catch (err) {
        errorDiv.style.display = "block";
        btn.disabled = false;
        btn.textContent = "Odeslat";
      }
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Footer year ---- */
  var year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
