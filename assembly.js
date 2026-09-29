/* assembly.js — the assembly layer (task t_ec4ab93a; refactored by issue #5
   findings 1+2: one boot path, PAGES keyed on stable board id).
   Sits ON TOP of the frozen engine (board-engine.js); it never redefines it.
   It gives the five merged pages one shared integration behaviour:

   - On every page: the rail cards the engine renders as dead href="#"
     anchors become real navigation. Two modes:
       * SPA mode (index.html): a rail click swaps the board IN PLACE through
         the §8 260ms crossfade, with NO history push (B9 bypassed) and the
         active card indicated.
       * Deep-link mode (the five static pages): a rail click navigates to
         that board's own page — ordinary navigation, one history entry,
         the same rule any multi-page site follows.
   - On every page: the current board's rail card gets .is-active. */

(function (global) {
  'use strict';

  /* Page map is data, not magic: keys are the export's STABLE board ids —
      never the rendered titles (issue #5, finding 2). Titles carry a jammed
      date ("Today's To Do09/27/26") and a literal newline; ids do not. */
   var PAGES = {
     '12d0f2de-6879-43da-ab74-11fdfd054692': 'todays-to-do.html',
     '9e5526ca-9991-4743-9e3e-db65b1572361': 'portfolio-project-ideas.html',
     'b92ceff2-ff76-4280-bc39-9e430ccab19c': 'how-does-ai-inference-math-work.html',
     'ba0c4910-e43e-40fc-886a-d3730c42c897': 'public-space-mini-grant.html',
     'fa246b33-d8c8-4ec2-9073-2915de0d5764': 'the-life-of-robert-gregory.html'
   };

   /* The landing board (the one that carries the §12 contact form in its
      parking lot). Keyed on id, like PAGES. */
   var LANDING_ID = 'fa246b33-d8c8-4ec2-9073-2915de0d5764';

   /* §13.1 B78 rail scaffolding: the four fixed groups BoardEngine.renderRail
         fills. Runtime-built once per page (issue #5, finding 1) so no page
         ships a byte-duplicated <aside> — previously all six pages carried the
         identical block, md5 647b787117c6.

         Issue #43: the rail is rebuilt to match the wireframe drawing — a
         titled panel ("All Boards" bar), each group heading carrying a
         right-aligned "New board" pill, a "‹ Collapse" button at the panel's
         bottom, and inert Export/Import chrome on the board side. All of it is
         INERT chrome (owner ruling, issue comment 5884380115): appearance only,
         no click handlers beyond the ones that already exist. */
     var RAIL_GROUPS = [
       { cat: 'todo', head: 'To Do' },
       { cat: 'note', head: 'Notes' },
       { cat: 'learning', head: 'Learning' },
       { cat: 'idea', head: 'Ideas' }
     ];

     function buildRailScaffolding() {
       if (document.querySelectorAll('.rail-cards').length) return; // already present
       var aside = document.createElement('aside');
       aside.id = 'rail';
       aside.setAttribute('aria-label', 'Board index');

       // The panel's title bar, above the To Do group (issue #43, criterion 1).
       var titleBar = document.createElement('div');
       titleBar.className = 'rail-title';
       titleBar.textContent = 'All Boards';
       aside.appendChild(titleBar);

       RAIL_GROUPS.forEach(function (g) {
         var group = document.createElement('div');
         group.className = 'rail-group';
         group.setAttribute('data-cat', g.cat);
         // Heading row: the group heading with its "New board" pill at the
         // row's right — both sitting on the category-coloured band (the group
         // box itself wears the category ladder via [data-cat] scoping).
         var headRow = document.createElement('div');
         headRow.className = 'rail-head-row';
         var h = document.createElement('h2');
         h.className = 'rail-head';
         h.textContent = g.head;
         var pill = document.createElement('span');
         pill.className = 'rail-new';
         pill.textContent = 'New board';
         headRow.appendChild(h);
         headRow.appendChild(pill);
         var slot = document.createElement('div');
         slot.className = 'rail-cards';
         slot.setAttribute('data-slot', g.cat);
         group.appendChild(headRow);
         group.appendChild(slot);
         aside.appendChild(group);
       });

       // "‹ Collapse" at the sidebar's bottom (issue #43, criterion 5) — inert.
       var collapseRow = document.createElement('div');
       collapseRow.className = 'rail-collapse-row';
       var collapse = document.createElement('button');
       collapse.type = 'button';
       collapse.className = 'rail-collapse';
       collapse.textContent = '\u2039 Collapse';
       collapseRow.appendChild(collapse);
       aside.appendChild(collapseRow);

       // Export/Import chrome on the board side, as drawn just above the
       // Parking Lot band — inert, no handlers (issue #43, criterion 5).
       var chrome = document.createElement('div');
       chrome.id = 'board-chrome';
       ['Export', 'Import'].forEach(function (label) {
         var btn = document.createElement('span');
         btn.className = 'board-chrome-btn';
         btn.textContent = '\u2193 ' + label;
         chrome.appendChild(btn);
       });

       document.body.insertBefore(aside, document.body.firstChild);
       document.body.appendChild(chrome);
     }

     /* ---- Issue #43, criterion 3: every board entry is a CARD ----
        The engine renders each rail entry as a bare title string (frozen —
        renderRail stays untouched). This pass re-shapes the SAME anchor into
        the wireframe's card: the title line, then a "Last Updated: MM/DD/YY"
        line under it, formatted in US order from the board's `updatedAt`
        epoch-ms. The anchor element itself is kept (same identity, so the
        engine's slots, the SPA's click wiring and markActive all keep working);
        only its children are rebuilt. */

  function usDate(ms) {
       var d = new Date(ms);
       var mm = ('0' + (d.getMonth() + 1)).slice(-2);
       var dd = ('0' + d.getDate()).slice(-2);
       var yy = ('' + d.getFullYear()).slice(-2);
       return mm + '/' + dd + '/' + yy;
     }

     function augmentRailCards(boards) {
       document.querySelectorAll('.rail-card').forEach(function (a) {
         var id = a.getAttribute('data-board-id');
         var board = boards.filter(function (b) { return String(b.id) === id; })[0];
         if (!board) return;
         var title = document.createElement('span');
         title.className = 'rail-card-title';
         title.textContent = board.title || '(untitled board)';
         var date = document.createElement('span');
         date.className = 'rail-card-date';
         // Every board carries updatedAt (all five verified in the data); a
         // missing one still gets the line — with an em dash, never a bare card.
         date.textContent = 'Last Updated: ' +
           (board.updatedAt ? usDate(board.updatedAt) : '\u2014');
         a.textContent = '';
         a.appendChild(title);
         a.appendChild(date);
       });
     }

  var CROSSFADE_MS = 260; // §8
  var FADE_HALF = CROSSFADE_MS / 2;

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
        try {
          BoardEngine.renderBoard(board, root);
          BoardEngine.fit(root);
          // The landing board's parking-lot entry is the contact form — it is
          // destroyed by every re-render and must come back with the board.
          if (board === landing) mountContactForm(root);
        } finally {
          // The crossfade must end whether or not the mount succeeds: a board
          // left at .is-fading (opacity: 0) is a blank stage. The throw guard
          // inside mountContactForm is kept — a missing parking-lot row is a
          // real data problem, not noise to swallow.
          root.classList.remove('is-fading');
          if (board === landing && !root.querySelector('#lot-contact-form')) {
            // Surface the failure the way the page-level catchers do: on the
            // title, visibly — not to console alone.
            var t = document.getElementById('board-title');
            if (t) t.textContent = 'Contact form could not be mounted';
          }
        }
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
      var page = board && PAGES[board.id];
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

  /* ---- The jammed-date title split (todays-to-do wireframe) ----
     The export jams the MM/DD/YY date onto the title with no separator
     ("Today's To Do09/27/26"). The wireframe renders it on two lines, date
     beneath. The raw string is NOT repaired — the split is display-only,
     using .band-title's engine-owned pre-wrap. Only boards whose title
     actually ends in MM/DD/YY are affected. */
  var DATE_TAIL = /\d{2}\/\d{2}\/\d{2}$/;

  function applyTitleFormatting(board) {
    var m = String(board.title || '').match(DATE_TAIL);
    if (!m) return;
    var t = document.getElementById('board-title');
    if (!t) return;
    t.textContent = board.title.slice(0, m.index) + '\n' + m[0];
  }

  /* ---- Boot ---- */
  global.Assembly = {
    /* SPA: index.html calls this with the loaded data. */
    bootSpa: function (boards, landingBoard) {
      var root = document.getElementById('board');
      buildRailScaffolding();
      BoardEngine.renderRail(boards);
      augmentRailCards(boards);
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
    /* ---- Static boot (issue #5, finding 1) ----
       The five static pages used to repeat this fetch→find→render→fit→wire
       sequence character for character. Each now calls Assembly.boot(id)
       once; the page's own failure surface is preserved exactly: on any
       error the catch writes 'Failed to load board: …' into #board-title. */
    boot: function (boardId) {
      fetch('assets/content-of-boards.json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var boards = data.boards;
          window.__boards = boards;
          var board = Assembly.findBoardById(boards, boardId);
          buildRailScaffolding();
          var root = document.getElementById('board');
          BoardEngine.renderRail(boards);
          augmentRailCards(boards);
          BoardEngine.renderBoard(board, root);
          applyTitleFormatting(board);
          BoardEngine.fit(root);
          window.addEventListener('resize', function () { BoardEngine.fit(root); });
          if (String(board.id) === LANDING_ID) mountContactForm(root);
          Assembly.wireStaticPage(board);
        })
        .catch(function (err) {
          // Meaningful failure, not a blank board: surface it where a human looks.
          document.getElementById('board-title').textContent =
            'Failed to load board: ' + err.message;
          console.error(err);
        });
    },
    /* The landing board's parking-lot form — shared by both modes. */
    mountContactForm: mountContactForm,
    findBoardById: function (boards, id) {
      var hits = boards.filter(function (b) { return String(b.id) === String(id); });
      if (hits.length !== 1) throw new Error(
        'Expected exactly one board with id ' + JSON.stringify(id) +
        ', found ' + hits.length);
      return hits[0];
    }
  };
})(window);
