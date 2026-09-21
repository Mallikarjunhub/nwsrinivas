/* =========================================================================
   Nammaweb AI Research Labs — Fellowship Portal
   app.js — vanilla JS. No framework, no build step, no runtime dependency.
   ========================================================================= */
(function () {
  'use strict';

  var B = NW.brand;
  var KEY = {
    session: 'nw_session_v1',
    progress: 'nw_progress_v1',
    assignments: 'nw_assignments_v1',
    payment: 'nw_payment_v1'
  };

  /* ------------------------------------------------------------ storage */
  function read(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }
  function remove(key) {
    try { window.localStorage.removeItem(key); } catch (e) {}
  }

  /* ------------------------------------------------------------- toasts */
  var toastHost = document.getElementById('toasts');
  function toast(message, isError) {
    if (!toastHost) return;
    var el = document.createElement('div');
    el.className = 'toast' + (isError ? ' err' : '');
    el.setAttribute('role', 'status');
    el.innerHTML = '<span aria-hidden="true">' + (isError ? '⚠' : '✓') + '</span><span></span>';
    el.lastChild.textContent = message;
    toastHost.appendChild(el);
    window.setTimeout(function () {
      el.style.opacity = '0';
      window.setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 250);
    }, 3200);
  }

  function copyText(text, label) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      toast(ok ? (label + ' copied') : ('Copy blocked by the browser. Select it manually: ' + text), !ok);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast(label + ' copied');
      })['catch'](fallback);
    } else { fallback(); }
  }

  /* ------------------------------------------------------------ session */
  function session() { return read(KEY.session, null); }
  function isLoggedIn() { var s = session(); return !!(s && s.isLoggedIn); }

  var VALID_USERS = ['srinivas', 'name'];
  var VALID_PASS = '9241';

  function login(user, pass) {
    var u = String(user || '').trim().toLowerCase();
    if (VALID_USERS.indexOf(u) === -1 || String(pass || '').trim() !== VALID_PASS) return false;
    write(KEY.session, { isLoggedIn: true, user: B.candidate, since: new Date().toISOString() });
    return true;
  }
  function logout() { remove(KEY.session); }

  /* ----------------------------------------------------------- progress */
  function progress() { return read(KEY.progress, {}); }
  function totalWeeks() {
    var n = 0;
    NW.modules.forEach(function (m) { n += m.weeks.length; });
    return n;
  }
  function completedCount() {
    var p = progress(), n = 0, k;
    for (k in p) { if (p[k]) n++; }
    return n;
  }

  /* ---------------------------------------------------------- utilities */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function inr(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

  /* ================================================== SYLLABUS RENDERING */
  var activePhase = 'all';

  function buildSyllabus() {
    var host = $('#syllabus-modules');
    if (!host) return;
    host.innerHTML = '';
    var p = progress();

    NW.modules.forEach(function (mod) {
      if (activePhase !== 'all' && String(mod.phase) !== activePhase) return;

      var wrap = el('div', 'module');
      var head = el('div', 'module-head');
      head.innerHTML =
        '<h3>' + esc(mod.title) + '</h3>' +
        '<span class="span">' + esc(mod.span) + '</span>' +
        '<span class="sub">' + esc(mod.subtitle) + '</span>';
      wrap.appendChild(head);

      mod.weeks.forEach(function (w) {
        var done = !!p[w.id];
        var item = el('article', 'week' + (done ? ' done' : ''));
        item.setAttribute('open-state', '0');
        item.setAttribute('data-week', w.id);

        var tags = '';
        if (w.milestone) tags += '<span class="chip chip-amber"><span class="dot"></span>Milestone</span> ';
        if (w.capstone) tags += '<span class="chip chip-cyan"><span class="dot"></span>Capstone ' + w.capstone + '</span> ';

        var bullets = w.points.map(function (pt) { return '<li>' + pt + '</li>'; }).join('');

        item.innerHTML =
          '<div class="week-head">' +
            '<input type="checkbox" class="week-check" ' + (done ? 'checked' : '') +
              ' aria-label="Mark week ' + w.n + ' complete" data-check="' + w.id + '">' +
            '<button class="week-toggle" type="button" aria-expanded="false">' +
              '<span class="week-no">W' + w.n + '</span>' +
              '<span>' +
                '<span class="week-title">' + esc(w.title) + '</span>' +
                '<span class="week-summary">' + esc(w.summary) + '</span>' +
              '</span>' +
              '<svg class="week-caret" width="16" height="16" viewBox="0 0 24 24" fill="none" ' +
                'stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="week-body">' +
            (tags ? '<div style="margin-bottom:12px">' + tags + '</div>' : '') +
            '<ul>' + bullets + '</ul>' +
            '<div class="deliverable"><b>Deliverable.</b> ' + w.deliverable + '</div>' +
          '</div>';

        wrap.appendChild(item);
      });

      host.appendChild(wrap);
    });

    // expand / collapse
    $$('.week-toggle', host).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var art = btn.closest('.week');
        var open = art.getAttribute('open-state') === '1';
        art.setAttribute('open-state', open ? '0' : '1');
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
    });

    // checkboxes
    $$('.week-check', host).forEach(function (box) {
      box.addEventListener('change', function () {
        var id = box.getAttribute('data-check');
        var p2 = progress();
        if (box.checked) { p2[id] = true; } else { delete p2[id]; }
        write(KEY.progress, p2);
        box.closest('.week').classList.toggle('done', box.checked);
        paintProgress();
      });
    });

    paintProgress();
  }

  function paintProgress() {
    var done = completedCount(), total = totalWeeks();
    var pct = total ? Math.round((done / total) * 100) : 0;
    var fill = $('#progress-fill');
    var label = $('#progress-label');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = done + ' of ' + total + ' weeks marked complete · ' + pct + '%';
  }

  /* ==================================================== JOB HORIZON CARDS */
  function buildRoles() {
    var host = $('#roles-grid');
    if (!host) return;
    NW.roles.forEach(function (r) {
      var c = el('div', 'card role');
      c.innerHTML =
        '<h3 style="margin:0 0 2px;font-size:1.02rem">' + esc(r.title) + '</h3>' +
        '<div class="pay">' + esc(r.range) + '</div>' +
        '<div class="focus">' + esc(r.focus) + '</div>' +
        '<div style="margin-top:8px"><span class="chip chip-emerald"><span class="dot"></span>' +
          esc(r.demand) + ' demand in Bengaluru</span></div>';
      host.appendChild(c);
    });
  }

  /* ======================================================= PAYMENT MODULE */
  var selectedAmount = B.fullFee;

  function upiLink(amount) {
    return 'upi://pay?pa=' + encodeURIComponent(B.upiId) +
      '&pn=' + encodeURIComponent('Nammaweb AI Research Labs') +
      '&am=' + amount +
      '&cu=INR' +
      '&tn=' + encodeURIComponent('Srinivas Mentorship Fellowship');
  }
  function qrUrl(amount, size) {
    return 'https://api.qrserver.com/v1/create-qr-code/?size=' + (size || 250) + 'x' + (size || 250) +
      '&data=' + encodeURIComponent(upiLink(amount));
  }

  function paintPayment() {
    var img = $('#upi-qr');
    if (img) {
      img.src = qrUrl(selectedAmount, 250);
      img.alt = 'UPI QR code to pay ' + inr(selectedAmount) + ' to ' + B.upiId;
    }
    var amt = $('#pay-amount');
    if (amt) amt.textContent = inr(selectedAmount);
    var link = $('#open-upi');
    if (link) link.setAttribute('href', upiLink(selectedAmount));
    var note = $('#qr-note');
    if (note) note.textContent = 'Scan with any UPI app to pay ' + inr(selectedAmount);
    $$('.fee-option').forEach(function (o) {
      var input = $('input', o);
      o.classList.toggle('selected', input.checked);
    });
  }

  function setupPayment() {
    $$('.fee-option input').forEach(function (input) {
      input.addEventListener('change', function () {
        selectedAmount = parseInt(input.value, 10);
        paintPayment();
      });
    });

    var qr = $('#upi-qr');
    if (qr) {
      qr.addEventListener('error', function () {
        var frame = $('.qr-frame');
        if (frame) {
          frame.innerHTML = '<div class="qr-fallback">QR service unreachable. Pay directly to UPI ID ' +
            esc(B.upiId) + ' or GPay / PhonePe number ' + esc(B.phone) + '.</div>';
        }
      });
    }

    var copyUpi = $('#copy-upi');
    if (copyUpi) copyUpi.addEventListener('click', function () { copyText(B.upiId, 'UPI ID'); });

    var copyPhone = $('#copy-phone');
    if (copyPhone) copyPhone.addEventListener('click', function () { copyText(B.phone, 'Mobile number'); });

    var form = $('#utr-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var utr = $('#utr-id').value.trim();
        var payer = $('#utr-name').value.trim();
        if (utr.length < 6) { toast('Enter the full 12-digit UPI transaction / UTR reference.', true); return; }
        var record = {
          utr: utr, payer: payer || B.candidate, amount: selectedAmount,
          at: new Date().toISOString(), status: 'Awaiting verification'
        };
        write(KEY.payment, record);
        paintPaymentRecord();
        form.reset();
        toast('Payment reference recorded. The mentor will verify it within 24 hours.');
      });
    }
    paintPaymentRecord();
    paintPayment();
  }

  function paintPaymentRecord() {
    var host = $('#payment-record');
    if (!host) return;
    var rec = read(KEY.payment, null);
    if (!rec) { host.innerHTML = ''; return; }
    var when = new Date(rec.at);
    host.innerHTML =
      '<div class="card card-accent" style="margin-top:16px">' +
        '<div class="kv"><span>Reference</span><b>' + esc(rec.utr) + '</b></div>' +
        '<div class="kv"><span>Paid by</span><b>' + esc(rec.payer) + '</b></div>' +
        '<div class="kv"><span>Amount</span><b>' + inr(rec.amount) + '</b></div>' +
        '<div class="kv"><span>Submitted</span><b>' + when.toLocaleString('en-IN') + '</b></div>' +
        '<div class="kv"><span>Status</span><b><span class="status-pill status-pending">' + esc(rec.status) + '</span></b></div>' +
        '<button class="btn btn-ghost btn-sm" id="clear-payment" type="button" style="margin-top:14px">Remove this reference</button>' +
      '</div>';
    var clear = $('#clear-payment');
    if (clear) clear.addEventListener('click', function () {
      remove(KEY.payment); paintPaymentRecord(); toast('Payment reference removed');
    });
  }

  /* ========================================================= MENTEE AREA */
  function assignments() { return read(KEY.assignments, NW.assignmentSeed.slice()); }

  function paintAssignments() {
    var body = $('#assign-rows');
    if (!body) return;
    var list = assignments();
    body.innerHTML = '';
    if (!list.length) {
      body.innerHTML = '<tr><td colspan="5" class="faint">No submissions yet. Add the first repository below.</td></tr>';
      return;
    }
    list.forEach(function (a) {
      var tr = document.createElement('tr');
      var pill = a.status === 'Approved' ? 'status-approved' : 'status-pending';
      tr.innerHTML =
        '<td><b>' + esc(a.week) + '</b></td>' +
        '<td>' + esc(a.title) + '</td>' +
        '<td><a href="' + esc(a.repo) + '" target="_blank" rel="noopener noreferrer">Repository</a></td>' +
        '<td class="mono">' + esc(a.metric || '—') + '</td>' +
        '<td><span class="status-pill ' + pill + '">' + esc(a.status) + '</span></td>';
      body.appendChild(tr);
    });
  }

  function setupAssignments() {
    var form = $('#assign-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var week = $('#assign-week').value;
      var title = $('#assign-title').value.trim();
      var repo = $('#assign-repo').value.trim();
      var metric = $('#assign-metric').value.trim();
      if (!title) { toast('Give the submission a title so the review queue stays readable.', true); return; }
      if (!/^https?:\/\//i.test(repo)) { toast('Repository URL must start with http:// or https://', true); return; }
      var list = assignments();
      list.unshift({
        id: 'a' + Date.now(), week: week, title: title, repo: repo,
        metric: metric, status: 'Pending review'
      });
      write(KEY.assignments, list);
      paintAssignments();
      form.reset();
      toast('Submitted for review. The mentor sees it in the Friday queue.');
    });

    var reset = $('#assign-reset');
    if (reset) reset.addEventListener('click', function () {
      write(KEY.assignments, NW.assignmentSeed.slice());
      paintAssignments();
      toast('Submission queue reset to the seeded record');
    });

    var weekSel = $('#assign-week');
    if (weekSel) {
      for (var i = 1; i <= 24; i++) {
        var o = document.createElement('option');
        o.value = 'Week ' + i; o.textContent = 'Week ' + i;
        weekSel.appendChild(o);
      }
    }
  }

  function buildLibrary() {
    var host = $('#library-list');
    if (!host) return;
    NW.library.forEach(function (item, i) {
      var row = el('div', 'lib-item');
      var url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(item.q);
      row.innerHTML =
        '<span class="num">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span>' +
        '<div>' +
          '<div style="font-weight:650">' + esc(item.title) + '</div>' +
          '<div class="muted" style="font-size:.88rem">' + esc(item.note) + '</div>' +
          '<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">' +
            '<a class="btn btn-ghost btn-sm" href="' + url + '" target="_blank" rel="noopener noreferrer">Open video search</a>' +
            '<button class="btn btn-ghost btn-sm" type="button" data-copy-topic="' + esc(item.q) + '">Copy search terms</button>' +
          '</div>' +
        '</div>';
      host.appendChild(row);
    });
    $$('[data-copy-topic]', host).forEach(function (b) {
      b.addEventListener('click', function () { copyText(b.getAttribute('data-copy-topic'), 'Search terms'); });
    });
  }

  function buildNotes() {
    var host = $('#notes-list');
    if (!host) return;
    NW.notes.forEach(function (n) {
      var d = el('div', 'note-item');
      d.innerHTML = '<div class="meta">' + esc(n.week) + ' · ' + esc(n.date) + '</div><p>' + esc(n.body) + '</p>';
      host.appendChild(d);
    });
  }

  function buildSchedule() {
    var body = $('#schedule-rows');
    if (!body) return;
    NW.schedule.forEach(function (s) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><b>' + esc(s.day) + '</b></td>' +
        '<td class="mono">' + esc(s.time) + '</td>' +
        '<td>' + esc(s.kind) + '</td>' +
        '<td>' + esc(s.detail) + '</td>';
      body.appendChild(tr);
    });
  }

  function setupArchTabs() {
    var tabs = $$('#arch-tabs .tab');
    if (!tabs.length) return;
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        t.setAttribute('aria-selected', 'true');
        $$('.arch-panel').forEach(function (p) {
          p.classList.toggle('hidden', p.getAttribute('data-arch') !== t.getAttribute('data-arch'));
        });
      });
    });
  }

  /* ====================================================== CERTIFICATE */
  function hashString(s) {
    var h1 = 0x811c9dc5, h2 = 0x1000193, i;
    for (i = 0; i < s.length; i++) {
      h1 ^= s.charCodeAt(i);
      h1 = (h1 * 16777619) >>> 0;
      h2 = ((h2 << 5) - h2 + s.charCodeAt(i)) >>> 0;
    }
    return (h1.toString(16) + h2.toString(16)).toUpperCase().slice(0, 16);
  }

  function setupCertificate() {
    var seed = B.candidate + '|' + B.programmeCode + '|' + B.dpiit + '|' + B.mentor;
    var hash = 'NW-' + B.programmeCode + '-' + hashString(seed);
    var hashEl = $('#cert-hash');
    if (hashEl) hashEl.textContent = 'Credential verification hash · ' + hash;

    var qr = $('#cert-qr-img');
    if (qr) {
      var verify = 'https://nammaweb.in/verify/' + hash;
      qr.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(verify);
      qr.alt = 'Verification QR for credential ' + hash;
      qr.addEventListener('error', function () {
        qr.style.display = 'none';
      });
    }

    var printBtn = $('#print-cert');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        document.body.classList.add('printing-cert');
        window.setTimeout(function () {
          window.print();
          window.setTimeout(function () { document.body.classList.remove('printing-cert'); }, 600);
        }, 60);
      });
    }

    var copyHash = $('#copy-hash');
    if (copyHash) copyHash.addEventListener('click', function () { copyText(hash, 'Verification hash'); });
  }

  /* ========================================================= AUTH / GATE */
  function paintAuthState() {
    var loggedIn = isLoggedIn();

    var bar = $('#status-bar');
    if (bar) bar.classList.toggle('hidden', !loggedIn);

    $$('[data-when="in"]').forEach(function (n) { n.classList.toggle('hidden', !loggedIn); });
    $$('[data-when="out"]').forEach(function (n) { n.classList.toggle('hidden', loggedIn); });

    var navBtn = $('#nav-auth');
    if (navBtn) navBtn.textContent = loggedIn ? 'Sign out' : 'Mentee 1:1 login';

    if (loggedIn) {
      paintAssignments();
      paintProgress();
    }
  }

  function openModal() {
    var o = $('#login-overlay');
    if (!o) return;
    o.classList.add('open');
    var f = $('#login-user');
    if (f) window.setTimeout(function () { f.focus(); }, 40);
  }
  function closeModal() {
    var o = $('#login-overlay');
    if (o) o.classList.remove('open');
    var err = $('#login-error');
    if (err) err.textContent = '';
  }

  function setupAuth() {
    $$('[data-open-login]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (isLoggedIn()) {
          logout(); paintAuthState(); toast('Signed out. Progress stays saved on this device.');
        } else { openModal(); }
      });
    });

    var closeBtns = $$('[data-close-login]');
    closeBtns.forEach(function (b) { b.addEventListener('click', closeModal); });

    var overlay = $('#login-overlay');
    if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    var form = $('#login-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var u = $('#login-user').value, p = $('#login-pass').value;
        if (login(u, p)) {
          closeModal();
          paintAuthState();
          toast('Signed in as ' + B.candidate + '. Command centre unlocked.');
          form.reset();
          var target = document.getElementById('command-centre');
          if (target && target.scrollIntoView) {
            try { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
            catch (scrollErr) { target.scrollIntoView(true); }
          }
        } else {
          var err = $('#login-error');
          if (err) err.textContent = 'That username and PIN do not match a fellowship record. Check both and try again.';
        }
      });
    }

    var signOut = $('#status-signout');
    if (signOut) signOut.addEventListener('click', function () {
      logout(); paintAuthState(); toast('Signed out');
    });
  }

  /* --------------------------------------------------------- navigation */
  function setupNav() {
    var toggle = $('#nav-toggle');
    var menu = $('#mobile-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      $$('a', menu).forEach(function (a) {
        a.addEventListener('click', function () {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
    var year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  function setupFilters() {
    $$('#syllabus-filters .filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activePhase = btn.getAttribute('data-phase');
        $$('#syllabus-filters .filter').forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        buildSyllabus();
      });
    });

    var resetBtn = $('#reset-progress');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      remove(KEY.progress);
      buildSyllabus();
      toast('Curriculum checklist cleared');
    });
  }

  /* -------------------------------------------------------------- init */
  function init() {
    setupNav();
    buildSyllabus();
    setupFilters();
    buildRoles();
    setupPayment();
    setupAssignments();
    paintAssignments();
    buildLibrary();
    buildNotes();
    buildSchedule();
    setupArchTabs();
    setupCertificate();
    setupAuth();
    paintAuthState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
