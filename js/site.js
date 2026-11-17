(function () {
  var key = "pico-club-seen";
  var seen = {};
  try { seen = JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) { seen = {}; }

  document.querySelectorAll("[data-lesson]").forEach(function (el) {
    var id = el.getAttribute("data-lesson");
    if (document.body.getAttribute("data-page") === id) {
      seen[id] = 1;
      try { localStorage.setItem(key, JSON.stringify(seen)); } catch (e) {}
    }
    if (seen[id]) {
      var mark = el.querySelector(".seen");
      if (mark) mark.textContent = "열어 봄";
    }
  });

  function copyText(text) {
    function fallback() {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      var ok = document.execCommand("copy");
      area.remove();
      return ok ? Promise.resolve() : Promise.reject();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(fallback);
    }
    return fallback();
  }

  document.querySelectorAll(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pre = btn.parentElement.nextElementSibling;
      var text = pre.innerText.replace(/\n$/, "");
      var old = btn.textContent;
      copyText(text).then(function () {
        btn.textContent = "복사됨";
        setTimeout(function () { btn.textContent = old; }, 1200);
      }).catch(function () {
        var range = document.createRange();
        range.selectNodeContents(pre);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        btn.textContent = "선택됨. Ctrl+C";
        setTimeout(function () { btn.textContent = old; }, 1600);
      });
    });
  });

  document.querySelectorAll(".quiz").forEach(function (quiz) {
    var answer = quiz.getAttribute("data-answer");
    quiz.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (quiz.classList.contains("answered")) return;
        quiz.classList.add("answered");
        quiz.querySelectorAll("button").forEach(function (b) {
          if (b.getAttribute("data-i") === answer) b.classList.add("good");
        });
        if (btn.getAttribute("data-i") !== answer) btn.classList.add("bad");
      });
    });
  });
})();
