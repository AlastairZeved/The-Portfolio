/* assembly.js — the assembly layer (task t_ec4ab93a).
   Sits ON TOP of the frozen engine (board-engine.js); it never redefines it.
   It gives the five merged pages one shared integration behaviour:

   - On every page: the rail cards the engine renders as dead href="#"
     anchors become real navigation. Two modes:
       * SPA mode (index.html, window.__ASSEMBLY_SPA = true): a rail click
         swaps the board IN PLACE through the §8 260ms crossfade, with NO
         history push (B9 bypassed) and the active card indicated.
       * Deep-link mode (the five static pages): a rail click navigates to
         that board's own page — ordinary navigation, one history entry,
         the same rule any multi-page site follows.
   - On every page: the current board's rail card gets .is-active.

   Page map is data, not magic: keys are the export's board titles, matched
   exactly as stored (the landing title carries a literal newline). */

(function (global) {
  'use strict';

  var PAGES = {
    "Today's To Do09/27/26": 'todays-to-do.html',
    'Portfolio Project Ideas': 'portfolio-project-ideas.html',
    'How does AI inference math work?': 'how-does-ai-inference-math-work.html',
    'Public Space Mini Grant': 'public-space-mini-grant.html',
    'The Life of\nRobert Gregory': 'the-life-of-robert-gregory.html'
  };

  var CROSSFADE_MS = 260; // §8
  var FADE_HALF = CROSSFADE_MS / 2;

  function cardForBoard(board) {
    var el = document.querySelector('.rail-card[data-board-id="' + board.id + '"]');
    return el || null;
  }

  /* Mark exactly one rail card active (aria-current speaks to AT as well). */
  function markActive(board) {
    document.querySelectorAll('.rail-card').forEach(function (a) {
      var on = board && a.getAttribute('data-board-id') === String(board.id);
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  /* ---- SPA mode: crossfade swap, no history push ---- */
  function wireSpa(boards, root, landing) {
    var current = landing;

    function swapTo(board) {
      if (!board || board === current) return;
      current = board;
      markActive(board);
      root.classList.add('is-fading');
      // Half the crossfade out, re-render, half back in.
      window.setTimeout(function () {
        BoardEngine.renderBoard(board, root);
        BoardEngine.fit(root);
        // The landing board's parking-lot entry is the contact form — it is
        // destroyed by every re-render and must come back with the board.
        if (board === landing) mountContactForm(root);
        root.classList.remove('is-fading');
      }, FADE_HALF);
    }

    document.querySelectorAll('.rail-card').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault(); // no history push — B9 bypassed (§8)
        var id = a.getAttribute('data-board-id');
        var board = boards.filter(function (b) { return String(b.id) === id; })[0];
        swapTo(board);
      });
    });

    markActive(current);
    return { swapTo: swapTo };
  }

  /* ---- Deep-link mode: rail cards navigate between the static pages ---- */
  function wireLinks(currentBoard) {
    document.querySelectorAll('.rail-card').forEach(function (a) {
      var id = a.getAttribute('data-board-id');
      var board = window.__boards.filter(function (b) { return String(b.id) === id; })[0];
      var page = board && PAGES[board.title];
      if (!page) return; // an unknown board keeps the engine's inert link
      if (currentBoard && board === currentBoard) return; // this page IS that board
      a.setAttribute('href', page);
    });
  }

  /* ---- The contact form (§12) ----
     The landing board's parking-lot entry is a real <form> POSTing to the
     verified Formspree endpoint. Shared by BOTH modes: the static landing
     page and index.html's SPA (where the landing board can be re-rendered
     by a rail swap — the form is re-mounted after every swap back). */
  var FORMSPREE = 'https://formspree.io/f/mbglkalb';
  var LOT_LEAD = 'Have a question? Ask away:';

  function mountContactForm(root) {
    var row = root.querySelector('#lot-items .lot-item');
    if (!row) throw new Error('Parking-lot entry missing after render');
    row.textContent = '';

    var form = document.createElement('form');
    form.id = 'lot-contact-form';
    form.className = 'lot-form';
    form.action = FORMSPREE;      // the one endpoint; never empty
    form.method = 'POST';

    var label = document.createElement('label');
    label.className = 'lot-form-label';
    label.htmlFor = 'lot-question';
    label.textContent = LOT_LEAD;

    var textarea = document.createElement('textarea');
    textarea.id = 'lot-question';
    textarea.className = 'lot-form-textarea';
    textarea.name = 'question';   // Formspree rejects unnamed fields
    textarea.required = true;     // native validation speaks before any JS

    var actions = document.createElement('div');
    actions.className = 'lot-form-actions';
    var submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'lot-form-submit';
    submit.textContent = 'Submit'; // reads as a button by shape + label, not fill alone
    actions.appendChild(submit);

    // Honeypot per Formspree's own recipe: invisible to people, catnip to bots.
    var gotcha = document.createElement('input');
    gotcha.type = 'text';
    gotcha.name = '_gotcha';
    gotcha.tabIndex = -1;
    gotcha.autocomplete = 'off';
    gotcha.setAttribute('aria-hidden', 'true');
    gotcha.hidden = true;

    form.appendChild(label);
    form.appendChild(textarea);
    form.appendChild(actions);
    form.appendChild(gotcha);

    // §12 toast: a polite status region for the confirmation.
    var status = document.createElement('p');
    status.id = 'lot-form-status';
    status.className = 'lot-form-status';
    status.setAttribute('role', 'status');

    // Fetch first so the reader never leaves the board; if the request
    // cannot complete (offline, blocked), fall back to the form's own
    // native POST — the same endpoint, which navigates to Formspree's
    // /thanks. Constraint validation has already passed by the time this
    // handler runs, so the fallback carries a valid message.
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit.disabled = true;
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (j) {
          if (!j.ok) throw new Error('Formspree rejected the submission');
          form.hidden = true;
          status.textContent = 'Thanks — your question is on its way.';
          status.classList.add('is-visible');
        })
        .catch(function (err) {
          // Native submission is the honest fallback: real POST, real page.
          console.error('Falling back to native form POST:', err);
          form.submit();
        });
    });

    row.appendChild(form);
    row.appendChild(status);
  }

  /* ---- Boot ---- */
  global.Assembly = {
    /* SPA: index.html calls this with the loaded data. */
    bootSpa: function (boards, landingBoard) {
      var root = document.getElementById('board');
      BoardEngine.renderRail(boards);
      BoardEngine.renderBoard(landingBoard, root);
      BoardEngine.fit(root);
      mountContactForm(root);
      window.addEventListener('resize', function () { BoardEngine.fit(root); });
      return wireSpa(boards, root, landingBoard);
    },
    /* Static page: wire the rail after the page's own render, and mark it. */
    wireStaticPage: function (currentBoard) {
      markActive(currentBoard || null);
      wireLinks(currentBoard);
    },
    /* The landing board's parking-lot form — shared by both modes. */
    mountContactForm: mountContactForm,
    findBoard: function (boards, title) {
      var hits = boards.filter(function (b) { return b.title === title; });
      if (hits.length !== 1) throw new Error(
        'Expected exactly one board titled ' + JSON.stringify(title) +
        ', found ' + hits.length);
      return hits[0];
    },
    PAGES: PAGES
  };
})(window);
