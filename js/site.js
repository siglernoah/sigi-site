/* Signet Works — shared behaviour */
(function(){
  'use strict';
  var EMAIL = 'hello@sigi.com'; // change to your real inbox
  var root = document.documentElement;
  var RM = root.classList.contains('rm');
  var FINE = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var $ = function(s, c){ return (c || document).querySelector(s); };
  var $$ = function(s, c){ return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function(v, a, b){ return Math.max(a, Math.min(b, v)); };
  var lerp = function(a, b, t){ return a + (b - a) * t; };
  var on = function(el, ev, fn, o){ if (el) el.addEventListener(ev, fn, o); };

  $$('.year').forEach(function(y){ y.textContent = new Date().getFullYear(); });

  /* ---------- theme ---------- */
  var metaTheme = $('meta[name="theme-color"]');
  function applyTheme(t){
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('sw-theme', t); } catch(e){}
    if (metaTheme) metaTheme.setAttribute('content', t === 'light' ? '#F4F1EA' : '#0A0A0A');
    $$('.theme').forEach(function(b){
      b.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
      b.setAttribute('aria-label', t === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    });
  }
  applyTheme(root.getAttribute('data-theme') || 'dark');
  $$('.theme').forEach(function(btn){
    btn.addEventListener('click', function(){
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      if (RM || !document.startViewTransition){ applyTheme(next); return; }
      var r = btn.getBoundingClientRect();
      var x = r.left + r.width / 2, y = r.top + r.height / 2;
      var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.classList.add('vt-theme');
      var vt = document.startViewTransition(function(){ applyTheme(next); });
      vt.ready.then(function(){
        root.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 750, easing: 'cubic-bezier(.76,0,.24,1)', pseudoElement: '::view-transition-new(root)' });
      }).catch(function(){});
      vt.finished.then(function(){ root.classList.remove('vt-theme'); }, function(){ root.classList.remove('vt-theme'); });
    });
  });

  /* ---------- split text into words ---------- */
  function split(el){
    var i = 0;
    (function walk(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(n){
        if (n.nodeType === 3){
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function(p){
            if (!p) return;
            if (/^\s+$/.test(p)){ frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var wi = document.createElement('span'); wi.className = 'wi';
            wi.style.setProperty('--i', i++); wi.textContent = p;
            w.appendChild(wi); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'svg'){ walk(n); }
      });
    })(el);
  }
  var big = $('.big');
  if (!RM){
    $$('[data-split],[data-scrub]').forEach(split);
    if (big){
      var ci = 0;
      Array.prototype.slice.call(big.children).forEach(function(part){
        if (part.classList.contains('word')){
          part.innerHTML = part.textContent.split('').map(function(ch){
            return '<span class="ch" style="--i:' + (ci++) + '">' + ch + '</span>';
          }).join('');
        } else { part.style.setProperty('--i', ci++); }
      });
    }
  }

  /* ---------- intro + first screen ---------- */
  var hasIntro = root.classList.contains('intro');
  try { sessionStorage.setItem('sw-intro', '1'); } catch(e){}
  var heroShown = false, introTimers = [];
  function showHero(){
    if (heroShown) return; heroShown = true;
    $$('.hero, .page-head').forEach(function(h){ h.classList.add('go'); });
    $$('[data-hero]').forEach(function(el){ el.classList.add('in'); });
  }
  var ring3d = null;
  function endIntro(){ if (ring3d) ring3d.stop(); var n = $('#intro'); if (n) n.parentNode.removeChild(n); root.classList.remove('intro', 'skip'); }
  if (hasIntro){
    // Real 3D ring (loaded only for the intro). If WebGL or the module is unavailable, the flat SVG spin stays.
    import('./ring3d.js?v=5').then(function(m){
      if (!root.classList.contains('intro')) return;
      ring3d = m.mountRing($('#intro .spin'), { t0: window.__swT0 || performance.now(), spin: 3 });
      $('#intro').classList.add('has3d');
    }).catch(function(){});
    introTimers.push(setTimeout(showHero, 4900), setTimeout(endIntro, 5500));
    var skipIntro = function(){
      if (!root.classList.contains('intro') || root.classList.contains('skip')) return;
      introTimers.forEach(clearTimeout);
      root.classList.add('skip'); showHero(); setTimeout(endIntro, 500);
      document.removeEventListener('keydown', skipIntro);
    };
    on($('.skip-intro'), 'click', skipIntro);
    document.addEventListener('keydown', skipIntro);
  } else {
    setTimeout(showHero, 60);
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = $$('.reveal, [data-split]:not([data-hero]), .big');
  if ('IntersectionObserver' in window && !RM){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    revealables.forEach(function(el){ io.observe(el); });
  } else {
    revealables.forEach(function(el){ el.classList.add('in'); });
  }
  root.classList.add('ready');

  /* ---------- smooth (but snappy) scroll ---------- */
  var lenis = (!RM && window.Lenis) ? new Lenis({ lerp: 0.17, wheelMultiplier: 1.05, smoothWheel: true }) : null;
  var easeOut = function(t){ return 1 - Math.pow(1 - t, 4); };
  function scrollToTarget(target){
    if (lenis) return lenis.scrollTo(target, { offset: 0, duration: 0.9, easing: easeOut });
    var top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top, behavior: RM ? 'auto' : 'smooth' });
  }
  $$('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if (id === '#main' || id === '#') return;
      var t = id === '#top' ? 0 : $(id);
      if (t === null) return;
      e.preventDefault();
      scrollToTarget(t);
    });
  });
  $$('.top').forEach(function(b){ b.addEventListener('click', function(){ scrollToTarget(0); }); });

  /* ---------- nav: current page pill ---------- */
  var nav = $('#nav'), progress = $('#progress');
  var page = document.body.getAttribute('data-page');
  var curLink = page ? $('.links a.l[data-nav="' + page + '"]') : null;
  var ind = $('.pill-ind');
  $$('[data-nav="' + page + '"]').forEach(function(a){ a.classList.add('cur'); a.setAttribute('aria-current', 'page'); });
  function placePill(){
    if (!ind) return;
    if (!curLink || !curLink.offsetWidth){ ind.style.opacity = 0; return; }
    ind.style.width = curLink.offsetWidth + 'px';
    ind.style.transform = 'translateX(' + curLink.offsetLeft + 'px)';
    ind.style.opacity = 1;
  }
  placePill();

  /* ---------- phone menu ---------- */
  var menuBtn = $('.menu-btn'), menu = $('#menu');
  function setMenu(open){
    root.classList.toggle('menu-open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (menu) menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (lenis){ open ? lenis.stop() : lenis.start(); }
    if (open){ nav.classList.remove('hide'); isHidden = false; }
  }
  on(menuBtn, 'click', function(){ setMenu(!root.classList.contains('menu-open')); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && root.classList.contains('menu-open')){ setMenu(false); menuBtn.focus(); } });
  if (menu) $$('a', menu).forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });

  /* ---------- marquee ---------- */
  var track = $('.track');
  var mx = 0, mDir = 1, mVel = 0, mW = 0;
  if (track){
    track.innerHTML = track.innerHTML + track.innerHTML + track.innerHTML;
    var measureTrack = function(){ mW = track.scrollWidth / 3; };
    measureTrack(); window.addEventListener('resize', measureTrack);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureTrack);
  }

  /* ---------- scrubbed quote ---------- */
  var scrub = $('[data-scrub]'), scrubWords = (scrub && !RM) ? $$('.wi', scrub) : [];
  var scrubVals = scrubWords.map(function(){ return -1; });

  /* ---------- feature preview pan distance ---------- */
  $$('.feature').forEach(function(feature){
    var fview = $('.view', feature), fimg = $('img', feature);
    function setShift(){
      if (!fimg || !fview || !fimg.naturalWidth) return;
      var ih = fview.clientWidth * fimg.naturalHeight / fimg.naturalWidth;
      feature.style.setProperty('--shift', Math.min(0, fview.clientHeight - ih) + 'px');
    }
    if (fimg){ if (fimg.complete) setShift(); fimg.addEventListener('load', setShift); window.addEventListener('resize', setShift); }
  });

  /* ---------- cursor ---------- */
  var cursor = $('.cursor'), cLabel = cursor && $('b', cursor);
  var px = -100, py = -100, cx = px, cy = py;
  var useCursor = FINE && !RM && cursor;
  if (useCursor){
    window.addEventListener('pointermove', function(e){
      if (!cursor.classList.contains('on')){ cx = e.clientX; cy = e.clientY; }
      px = e.clientX; py = e.clientY;
      cursor.classList.add('on');
      var t = e.target && e.target.closest ? e.target : document.body;
      var card = t.closest('[data-cursor]');
      var link = !card && t.closest('a,button,summary,select,input,textarea,label');
      cursor.classList.toggle('view', !!card);
      cursor.classList.toggle('link', !!link);
      cursor.classList.toggle('inv', !!t.closest('footer') && root.getAttribute('data-theme') === 'light');
      if (card) cLabel.textContent = card.getAttribute('data-cursor');
    }, { passive: true });
    root.addEventListener('pointerleave', function(){ cursor.classList.remove('on'); });
    window.addEventListener('pointerdown', function(){ cursor.classList.add('down'); });
    window.addEventListener('pointerup', function(){ cursor.classList.remove('down'); });
  }

  /* ---------- magnetic, tilt, orbs ---------- */
  if (FINE && !RM){
    $$('[data-magnetic]').forEach(function(el){
      var s = el.classList.contains('badge') ? 0.35 : 0.25, r = null;
      el.addEventListener('pointerenter', function(){
        el.style.transform = ''; r = el.getBoundingClientRect();
        el.style.transition = 'transform .25s cubic-bezier(.16,1,.3,1)';
      });
      el.addEventListener('pointermove', function(e){
        if (!r) return;
        var x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + (x * s).toFixed(1) + 'px,' + (y * s).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function(){
        r = null;
        el.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1)';
        el.style.transform = '';
      });
      window.addEventListener('scroll', function(){ r = null; }, { passive: true });
    });
    $$('[data-tilt]').forEach(function(shot){
      var max = +shot.getAttribute('data-tilt'), card = shot.closest('.card'), r = null, raf = 0, ex = 0, ey = 0;
      function measure(){ var t = shot.style.transform; shot.style.transform = ''; r = shot.getBoundingClientRect(); shot.style.transform = t; }
      card.addEventListener('pointerenter', function(){
        measure();
        shot.style.transition = 'transform .3s cubic-bezier(.16,1,.3,1), box-shadow .8s';
      });
      card.addEventListener('pointermove', function(e){
        ex = e.clientX; ey = e.clientY;
        if (raf) return;
        raf = requestAnimationFrame(function(){
          raf = 0;
          if (!r) measure();
          var x = (ex - r.left) / r.width - .5, y = (ey - r.top) / r.height - .5;
          shot.style.transform = 'rotateY(' + (x * max).toFixed(2) + 'deg) rotateX(' + (-y * max).toFixed(2) + 'deg) translateY(-6px)';
        });
      });
      window.addEventListener('scroll', function(){ r = null; }, { passive: true });
      card.addEventListener('pointerleave', function(){ r = null; shot.style.transition = ''; shot.style.transform = ''; });
    });
    $$('.hero, .page-head').forEach(function(h){
      var a = $('.orb.a', h), b = $('.orb.b', h);
      if (!a) return;
      h.addEventListener('pointermove', function(e){
        var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
        a.style.transform = 'translate(' + (x * 70).toFixed(1) + 'px,' + (y * 50).toFixed(1) + 'px)';
        if (b) b.style.transform = 'translate(' + (x * -50).toFixed(1) + 'px,' + (y * -35).toFixed(1) + 'px)';
      });
    });
  }

  /* ---------- FAQ open/close animation ---------- */
  $$('details').forEach(function(d){
    var sum = $('summary', d), ans = $('.ans', d), anim = null;
    if (!sum || !ans) return;
    sum.addEventListener('click', function(e){
      if (RM || !ans.animate) return;
      e.preventDefault();
      if (anim){ anim.cancel(); anim = null; }
      if (!d.open){
        d.open = true;
        anim = ans.animate([{ height: '0px', opacity: 0 }, { height: ans.scrollHeight + 'px', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' });
        anim.onfinish = function(){ anim = null; cache(); };
      } else {
        anim = ans.animate([{ height: ans.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.76,0,.24,1)' });
        anim.onfinish = function(){ d.open = false; anim = null; cache(); };
      }
    });
  });

  /* ---------- enquiry form ---------- */
  var form = $('#form');
  on(form, 'submit', function(e){
    e.preventDefault();
    if (!form.checkValidity()){
      var bad = form.querySelector(':invalid');
      bad.focus();
      if (!RM && bad.animate) bad.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }], { duration: 400 });
      form.reportValidity();
      return;
    }
    var f = new FormData(form);
    var subject = 'Website enquiry — ' + (f.get('business') || f.get('name'));
    var body = 'Name: ' + f.get('name') + '\nEmail: ' + f.get('email') +
               '\nBusiness: ' + (f.get('business') || '-') + '\nCurrent website: ' + (f.get('site') || '-') +
               '\nNeed: ' + (f.get('need') || '-') + '\n\n' + f.get('message');
    $('.sent', form).classList.add('show');
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });


  /* ---------- project questionnaire ---------- */
  var quiz = $('#quiz');
  if (quiz){
    var qf = $('#qform'), steps = $$('.q-step', quiz), qi = 0, total = 4;
    var qNow = $('#qNow'), qBar = $('#qBar'), qBack = $('#qBack'), qNext = $('#qNext'), qNextT = $('.t', qNext), qSum = $('#qSum');
    var LABELS = { need: 'Help with', business: 'Business', about: 'About', when: 'Timing', name: 'Name', email: 'Email' };
    var STEP_OF = { need: 0, business: 1, about: 1, when: 2, name: 3, email: 3 };
    var vals = function(){
      var f = new FormData(qf);
      return { need: f.getAll('need').join(', '), business: (f.get('business') || '').trim(), about: (f.get('about') || '').trim(),
               when: f.get('when') || '', name: (f.get('name') || '').trim(), email: (f.get('email') || '').trim() };
    };
    var check = function(n){
      var st = steps[n], err = $('.q-err', st), msg = '';
      if (n === 0 && !$$('input:checked', st).length) msg = 'Pick at least one option.';
      if (n === 1 && !vals().about) msg = 'Tell me a little about what your business does.';
      if (n === 2 && !$$('input:checked', st).length) msg = 'Choose whichever fits best.';
      if (n === 3){
        var v = vals(), em = $('input[name="email"]', st);
        if (!v.name) msg = 'What should I call you?';
        else if (!v.email || !em.checkValidity()) msg = 'That email address doesn’t look quite right.';
      }
      err.textContent = msg;
      if (msg && !RM && st.animate) st.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 320 });
      return !msg;
    };
    var summary = function(){
      var v = vals();
      qSum.innerHTML = '';
      ['need', 'business', 'about', 'when', 'name', 'email'].forEach(function(k){
        if (!v[k]) return;
        var row = document.createElement('div');
        var dt = document.createElement('dt'); dt.textContent = LABELS[k];
        var dd = document.createElement('dd'); dd.textContent = v[k];
        var ed = document.createElement('button'); ed.type = 'button'; ed.textContent = 'Edit';
        ed.setAttribute('aria-label', 'Edit ' + LABELS[k].toLowerCase());
        ed.addEventListener('click', function(){ show(STEP_OF[k], true); });
        row.appendChild(dt); row.appendChild(dd); row.appendChild(ed); qSum.appendChild(row);
      });
    };
    var show = function(n, back){
      steps[qi].classList.remove('on', 'back');
      qi = n;
      var st = steps[qi];
      st.classList.toggle('back', !!back);
      st.classList.add('on');
      var shown = Math.min(qi + 1, total);
      qNow.textContent = '0' + shown;
      qBar.style.width = (qi >= total ? 100 : shown / total * 100) + '%';
      qBack.hidden = qi === 0;
      qNextT.textContent = qi === total ? 'Send to Signet Works' : (qi === total - 1 ? 'Review' : 'Continue');
      if (qi === total) summary();
      var err = $('.q-err', st); if (err) err.textContent = '';
      var title = $('.q-title', st); if (title) title.focus({ preventScroll: true });
      var first = $('input:not([type=checkbox]):not([type=radio]), textarea', st);
      if (first && FINE) setTimeout(function(){ first.focus({ preventScroll: true }); }, 250);
      cache();
    };
    var send = function(){
      var v = vals();
      var subject = 'Website enquiry — ' + (v.business || v.name);
      var body = 'Name: ' + v.name + '\nEmail: ' + v.email + '\nBusiness: ' + (v.business || '-') +
                 '\nNeeds help with: ' + v.need + '\nTiming: ' + v.when + '\n\nAbout the business:\n' + v.about;
      $('.sent', quiz).classList.add('show');
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    };
    qNext.addEventListener('click', function(){
      if (qi === total){ send(); return; }
      if (check(qi)) show(qi + 1);
    });
    qBack.addEventListener('click', function(){ if (qi > 0) show(qi - 1, true); });
    qf.addEventListener('submit', function(e){ e.preventDefault(); qNext.click(); });
    qf.addEventListener('keydown', function(e){
      var tag = e.target.tagName;
      if (e.key !== 'Enter') return;
      if (tag === 'TEXTAREA' && !(e.metaKey || e.ctrlKey)) return;
      if (tag === 'BUTTON') return;
      e.preventDefault(); qNext.click();
    });
    $$('[data-auto] input', quiz).forEach(function(r){
      r.addEventListener('change', function(){ setTimeout(function(){ if (steps[qi].contains(r)) qNext.click(); }, RM ? 0 : 380); });
    });
    $$('input[type=checkbox]', quiz).forEach(function(c){ c.addEventListener('change', function(){ $('.q-err', steps[0]).textContent = ''; }); });
  }


  /* ---------- start a project: incoming call ---------- */
  var call = $('#call');
  if (call){
    var track = $('#answer'), knob = $('#answerKnob'), body = document.body;
    var fill = document.createElement('span'); fill.className = 'answer-fill'; track.insertBefore(fill, track.firstChild);
    var maxX = 0, x = 0, dragging = false, startX = 0, answered = false;
    if (lenis) lenis.stop();
    var measureTrack = function(){ maxX = track.clientWidth - knob.offsetWidth - 14; };
    measureTrack(); window.addEventListener('resize', measureTrack);
    var setX = function(v){
      x = clamp(v, 0, maxX);
      var p = maxX ? x / maxX : 0;
      knob.style.setProperty('--x', x + 'px');
      track.style.setProperty('--fill', (x + knob.offsetWidth) + 'px');
      track.style.setProperty('--fo', p.toFixed(3));
      track.style.setProperty('--to', (1 - p * 1.6).toFixed(3));
      knob.setAttribute('aria-valuenow', Math.round(p * 100));
    };
    var answer = function(){
      if (answered) return; answered = true;
      setX(maxX); track.classList.add('done');
      knob.setAttribute('aria-valuetext', 'Answered');
      setTimeout(function(){
        body.classList.add('call-done');
        if (lenis) lenis.start();
        window.scrollTo(0, 0);
        $$('.page-head, .page-head .fade').forEach(function(h){ h.classList.remove('go'); });
        setTimeout(function(){ $$('.page-head').forEach(function(h){ h.classList.add('go'); }); $$('.page-head [data-hero]').forEach(function(el){ el.classList.remove('in'); void el.offsetWidth; el.classList.add('in'); }); }, 350);
        setTimeout(function(){ var t = $('.q-step.on .q-title'); if (t) t.focus({ preventScroll: true }); cache(); }, 1000);
      }, RM ? 0 : 420);
    };
    knob.addEventListener('pointerdown', function(e){
      if (answered) return;
      dragging = true; startX = e.clientX - x; knob.classList.remove('springback'); knob.classList.add('dragging');
      knob.setPointerCapture(e.pointerId);
    });
    knob.addEventListener('pointermove', function(e){ if (dragging) setX(e.clientX - startX); });
    var release = function(){
      if (!dragging) return; dragging = false; knob.classList.remove('dragging');
      if (x >= maxX * 0.86) answer();
      else { knob.classList.add('springback'); setX(0); }
    };
    knob.addEventListener('pointerup', release);
    knob.addEventListener('pointercancel', release);
    knob.addEventListener('keydown', function(e){
      if (answered) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'End'){ e.preventDefault(); answer(); }
      else if (e.key === 'ArrowRight'){ e.preventDefault(); knob.classList.add('springback'); setX(x + maxX / 4); if (x >= maxX) answer(); }
      else if (e.key === 'ArrowLeft' || e.key === 'Home'){ e.preventDefault(); knob.classList.add('springback'); setX(e.key === 'Home' ? 0 : x - maxX / 4); }
    });
    on($('#callSkip'), 'click', answer);
    // invite: nudge the knob once if nobody has touched it
    if (!RM) setTimeout(function(){
      if (answered || dragging || x) return;
      knob.classList.add('springback'); setX(Math.min(46, maxX));
      setTimeout(function(){ if (!dragging && !answered) setX(0); }, 420);
    }, 3400);
    // Remind Me: a calendar reminder for tomorrow at 10:00
    var toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); call.appendChild(toast);
    var say = function(t){ toast.textContent = t; toast.classList.add('show'); setTimeout(function(){ toast.classList.remove('show'); }, 2600); };
    on($('#remindMe'), 'click', function(){
      var d = new Date(); d.setDate(d.getDate() + 1); d.setHours(10, 0, 0, 0);
      var pad = function(n){ return (n < 10 ? '0' : '') + n; };
      var fmt = function(t){ return t.getUTCFullYear() + pad(t.getUTCMonth() + 1) + pad(t.getUTCDate()) + 'T' + pad(t.getUTCHours()) + pad(t.getUTCMinutes()) + '00Z'; };
      var end = new Date(d.getTime() + 15 * 60000);
      var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Signet Works//Start a project//EN', 'BEGIN:VEVENT',
        'UID:' + Date.now() + '@signetworks', 'DTSTAMP:' + fmt(new Date()), 'DTSTART:' + fmt(d), 'DTEND:' + fmt(end),
        'SUMMARY:Start your website project with Signet Works', 'URL:' + location.href.split('#')[0],
        'DESCRIPTION:Answer four quick questions: ' + location.href.split('#')[0], 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      a.download = 'signet-works-reminder.ics'; document.body.appendChild(a); a.click(); a.remove();
      this.classList.add('sent'); say('Reminder added for tomorrow at 10:00');
    });
  }

  /* ---------- layout cache ---------- */
  var vh = innerHeight, docMax = 0, scrubTop = 0, scrubH = 0, dirty = true;
  function cache(){
    var sy = window.scrollY;
    vh = innerHeight;
    docMax = document.documentElement.scrollHeight - vh;
    if (scrub){ var q = scrub.getBoundingClientRect(); scrubTop = q.top + sy; scrubH = q.height; }
    placePill();
    dirty = true;
  }
  cache();
  window.addEventListener('resize', cache);
  window.addEventListener('load', cache);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(cache);
  if ('ResizeObserver' in window) new ResizeObserver(function(){ cache(); }).observe(document.body);

  /* ---------- one animation loop: read first, then write ---------- */
  var lastY = window.scrollY, lastT = performance.now(), isScrolled = null, isHidden = false, lastProg = -1;
  function frame(t){
    var dt = Math.min(64, t - lastT); lastT = t;
    if (lenis) lenis.raf(t);
    var y = window.scrollY, dy = y - lastY;

    if (dy !== 0 || dirty){
      dirty = false;
      var prog = docMax > 0 ? Math.round(y / docMax * 1000) / 1000 : 0;
      if (prog !== lastProg){ lastProg = prog; progress.style.transform = 'scaleX(' + prog + ')'; }
      var sc = y > 10;
      if (sc !== isScrolled){ isScrolled = sc; nav.classList.toggle('scrolled', sc); }
      if (Math.abs(dy) > 2 && !root.classList.contains('menu-open')){
        var hd = dy > 0 && y > 320;
        if (hd !== isHidden){ isHidden = hd; nav.classList.toggle('hide', hd); }
      }
      if (scrubWords.length){
        var top = scrubTop - y;
        if (top < vh && top + scrubH > -vh * 0.5){
          var p = clamp((vh * 0.85 - top) / (scrubH + vh * 0.35), 0, 1), n = scrubWords.length;
          for (var k = 0; k < n; k++){
            var o = Math.round((0.14 + clamp(p * n * 1.15 - k, 0, 1) * 0.86) * 100) / 100;
            if (o !== scrubVals[k]){ scrubVals[k] = o; scrubWords[k].style.setProperty('--o', o); }
          }
        }
      }
    }

    if (track && !RM && mW){
      if (Math.abs(dy) > 0.5) mDir = dy > 0 ? 1 : -1;
      mVel = lerp(mVel, clamp(Math.abs(dy) * 0.9, 0, 40), 0.12);
      mx -= (0.55 + mVel) * mDir * (dt / 16.67);
      if (mx <= -mW) mx += mW;
      if (mx > 0) mx -= mW;
      track.style.transform = 'translate3d(' + mx.toFixed(2) + 'px,0,0)';
    }

    if (useCursor && cursor.classList.contains('on')){
      var ncx = lerp(cx, px, 0.24), ncy = lerp(cy, py, 0.24);
      if (Math.abs(ncx - cx) > 0.05 || Math.abs(ncy - cy) > 0.05){
        cx = ncx; cy = ncy;
        cursor.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      }
    }

    lastY = y;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
