// boot.js — simple boot overlay with random messages
(function () {
  var messages = [
    "Initializing CastaOS...",
    "Unvibing code...",
    "Drinking Milo...",
    "Doing something important...",
    "Say hi to my cat...",
    "Getting rid of foxboy...",
    "Switching to android...",
    "Watching Taskmaster...",
    "Watching Game Changer...",
    "Deleting System64...",
    "Calculating the meaning of life...",
    "Probably doing something important...",
    "Beep boop beep beep",
    "Loading the fun stuff...",
    "Breaking the site on mobile...",
    "Unblocking on school wifi...",
    "Generating random numbers...",
    "Deleting the entire code base...",
    "Accidentally opening 100 tabs...",
    "Refactoring everything...",
    "Optimizing for speed...",
    "Compiling shaders...",
    "Waking up the server...",
    "Contacting my connections...",
    "Finding Waldo...",
    "Hacking the mainframe...",
    "Clearing the foxboy allegations...",
    "Welcome to trench",
    "Boi dup bo dup dop",
    "Kyle.",
    "No one thinks what i think.",
    "Just a moment...",
    "Summoning Adam",
    "More Milo Needed...",
    "Im a kitchen sink",
    "Installing castaOS twice...",
    "Booting into unsafe mode...",
  ];

  function pickRandom() {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  function pickNRandom(n) {
    var copy = messages.slice();
    var out = [];
    n = Math.min(n, copy.length);
    for (var i = 0; i < n; i++) {
      var idx = Math.floor(Math.random() * copy.length);
      out.push(copy.splice(idx, 1)[0]);
    }
    return out;
  }

  function typeText(el, text, speed, callback) {
    el.textContent = "";
    var i = 0;
    var t = setInterval(function () {
      el.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(t);
        if (callback) callback();
      }
    }, speed || 25);
  }

  function typeSequential(spans, index, speed, done) {
    if (!spans || index >= spans.length) {
      if (done) done();
      return;
    }
    // hide all lines and clear text
    for (var i = 0; i < spans.length; i++) {
      spans[i].style.display = 'none';
      spans[i].textContent = '';
    }

    var el = spans[index];
    var text = el.getAttribute('data-text') || '';
    // show only the current line
    el.style.display = 'block';
    typeText(el, text, speed, function () {
      // small pause between lines, then hide current and continue
      setTimeout(function () {
        el.style.display = 'none';
        typeSequential(spans, index + 1, speed, done);
      }, 380);
    });
  }

  function hideOverlay() {
    var ov = document.getElementById('boot-overlay');
    if (!ov) return;
    ov.classList.add('boot-overlay--hide');
    ov.setAttribute('aria-hidden', 'true');
    setTimeout(function () {
      if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
    }, 450);
  }

  function initBoot() {
    var msgEl = document.getElementById('boot-message');
    var ov = document.getElementById('boot-overlay');
    if (!msgEl || !ov) return;

    // pick three unique messages
    var lines = pickNRandom(3);
    // clear and create span for each line
    msgEl.innerHTML = '';
    var spans = [];
    lines.forEach(function (ln, i) {
      var sp = document.createElement('span');
      sp.className = 'boot-line';
      sp.setAttribute('data-text', ln);
      sp.textContent = '';
      msgEl.appendChild(sp);
      spans.push(sp);
    });

    // small delay so the logo fades in first
    setTimeout(function () {
      typeSequential(spans, 0, 28, function () {
        setTimeout(hideOverlay, 1200);
      });
    }, 250);

    // clicking the overlay skips the rest
    ov.addEventListener('click', function () {
      hideOverlay();
    });
    // also allow Escape to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideOverlay();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBoot);
  } else {
    // DOM already parsed — run immediately
    initBoot();
  }
})();
