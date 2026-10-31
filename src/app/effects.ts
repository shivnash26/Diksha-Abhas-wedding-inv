// @ts-nocheck
/*
 * All the animations of the invitation, written in plain JavaScript so the
 * code stays independent of Angular.
 *
 *  - scroll reveal ([data-reveal], [data-delay])
 *  - parallax ([data-par]) and the nav bar that fades in after the hero
 *  - countdown ([data-countdown-days|hours|minutes|seconds])
 *  - falling petals on <canvas data-petals>
 *  - sparkle trail behind the cursor (<div data-sparkle>)
 *  - envelope intro (<div data-envelope>) and the soft background music
 */
export function startInvitationEffects(root, options = {}) {
  const opts = { envelopeIntro: true, petalCount: 38, cursorSparkle: true, weddingDate: '2026-12-03T18:00:00+05:30', ...options };
  const cleanups = [];
  const q = (sel) => root.querySelector(sel);

  if (opts.envelopeIntro) document.body.style.overflow = 'hidden';

  /* ---------- scroll reveal ---------- */
  const show = (el) => { el.__shown = true; el.style.opacity = '1'; el.style.transform = 'none'; };
  const revealAll = () => {
    root.querySelectorAll('[data-reveal]').forEach(show);
  };
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const d = parseFloat(el.getAttribute('data-delay') || '0');
      el.__shown = true; // claimed here so the safety net below doesn't cut the stagger short
      setTimeout(() => show(el), d);
      io.unobserve(el);
    });
  }, { threshold: 0, rootMargin: '0px 0px -6% 0px' }) : null;

  // safety net: some phone / in-app browsers drop observer callbacks, which left
  // whole sections (e.g. the events) invisible. Anything already on screen or
  // scrolled past is shown on the next scroll, even if the observer never fired.
  let sweepQueued = false;
  const sweep = () => {
    sweepQueued = false;
    const h = window.innerHeight || document.documentElement.clientHeight;
    root.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el.__shown) return;
      if (el.getBoundingClientRect().top < h * 0.94) { io && io.unobserve(el); show(el); }
    });
  };
  const queueSweep = () => { if (!sweepQueued) { sweepQueued = true; setTimeout(sweep, 400); } };

  const observe = () => {
    if (!io) return revealAll();
    root.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el.__seen) return;
      el.__seen = true;
      io.observe(el);
    });
  };
  if (!io || document.visibilityState === 'hidden') revealAll();
  observe();
  const revealTimer = setTimeout(() => {
    if (!root.querySelector('[data-reveal][style*="opacity: 1"]')) revealAll();
  }, 2500);
  const onVis = () => { if (document.visibilityState === 'hidden') revealAll(); };
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep);
  window.addEventListener('pageshow', queueSweep); // coming back with the browser's back button
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('beforeprint', revealAll);
  cleanups.push(() => {
    io && io.disconnect();
    clearTimeout(revealTimer);
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('beforeprint', revealAll);
    window.removeEventListener('scroll', queueSweep);
    window.removeEventListener('resize', queueSweep);
    window.removeEventListener('pageshow', queueSweep);
  });

  /* ---------- parallax + nav ---------- */
  // runs at most once per frame, however fast the guest scrolls
  let scrollFrame = 0;
  const paintScroll = () => {
    scrollFrame = 0;
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    root.querySelectorAll('[data-par]').forEach((el) => {
      el.style.transform = 'translate3d(0,' + (y * parseFloat(el.getAttribute('data-par'))).toFixed(1) + 'px,0)';
    });
    const nav = q('[data-nav]');
    if (nav) {
      const visible = y > window.innerHeight * 0.7;
      nav.style.opacity = visible ? '1' : '0';
      // while hidden over the hero its links must not catch taps
      nav.style.pointerEvents = visible ? '' : 'none';
      nav.toggleAttribute('inert', !visible);
    }
  };
  const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScroll); };
  window.addEventListener('scroll', onScroll, { passive: true });
  paintScroll();
  cleanups.push(() => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(scrollFrame); });

  /* ---------- countdown ---------- */
  const target = new Date(opts.weddingDate).getTime();
  const pad = (n) => (n < 10 ? '0' : '') + n;
  const paint = () => {
    let ms = Math.max(0, target - Date.now());
    const d = Math.floor(ms / 86400000); ms -= d * 86400000;
    const h = Math.floor(ms / 3600000); ms -= h * 3600000;
    const m = Math.floor(ms / 60000); ms -= m * 60000;
    const s = Math.floor(ms / 1000);
    const set = (sel, v) => { const el = q(sel); if (el) el.textContent = pad(v); };
    set('[data-countdown-days]', d);
    set('[data-countdown-hours]', h);
    set('[data-countdown-minutes]', m);
    set('[data-countdown-seconds]', s);
  };
  paint();
  const tick = setInterval(paint, 1000);
  cleanups.push(() => clearInterval(tick));

  /* ---------- falling petals ---------- */
  // no petals for guests who asked their phone to reduce motion; half as many on small screens
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smallScreen = window.matchMedia && window.matchMedia('(max-width: 700px)').matches;
  const cv = reduceMotion ? null : q('[data-petals]');
  if (cv) {
    const ctx = cv.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const count = Math.max(0, Math.round((opts.petalCount ?? 38) * (smallScreen ? 0.5 : 1)));
    let W = 0, H = 0, raf = 0;
    const petalColors = ['#f2a7bd', '#f6c9d6', '#e8869f', '#fbe0e7'];
    const leafColors = ['#8fbf9f', '#6f9e78', '#b6d3a8'];
    const make = (seed) => {
      const kind = Math.random();
      const type = kind < 0.62 ? 'petal' : (kind < 0.9 ? 'leaf' : 'flutter');
      return {
        type,
        x: Math.random() * W,
        y: seed ? Math.random() * H : -40 - Math.random() * 220,
        r: type === 'flutter' ? 5 + Math.random() * 4 : 3.5 + Math.random() * 6,
        sp: 0.22 + Math.random() * 0.7,
        sw: 0.35 + Math.random() * 1.3,
        ph: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.03,
        a: 0.4 + Math.random() * 0.45,
        c: type === 'leaf' ? leafColors[(Math.random() * leafColors.length) | 0]
          : (type === 'flutter' ? '#7fa7e8' : petalColors[(Math.random() * petalColors.length) | 0]),
      };
    };
    const onResize = () => {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    onResize();
    window.addEventListener('resize', onResize);
    const bits = Array.from({ length: count }, () => make(true));
    let t = 0;
    const loop = () => {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      for (const p of bits) {
        p.y += p.sp;
        p.x += Math.sin(t * p.sw + p.ph) * 0.7;
        p.rot += p.vr;
        if (p.y > H + 40) Object.assign(p, make(false));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.c;
        if (p.type === 'flutter') {
          const flap = Math.abs(Math.sin(t * 6 + p.ph));
          ctx.rotate(Math.sin(t * p.sw + p.ph) * 0.35);
          ctx.beginPath();
          ctx.ellipse(-p.r * 0.55, 0, p.r * 0.55, p.r * (0.25 + flap * 0.7), -0.3, 0, Math.PI * 2);
          ctx.ellipse(p.r * 0.55, 0, p.r * 0.55, p.r * (0.25 + flap * 0.7), 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'leaf') {
          ctx.rotate(p.rot);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 1.5, p.r * 0.42, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.rotate(p.rot);
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2;
            ctx.ellipse(Math.cos(a) * p.r * 0.55, Math.sin(a) * p.r * 0.55, p.r * 0.5, p.r * 0.34, a, 0, Math.PI * 2);
          }
          ctx.fill();
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    cleanups.push(() => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); });
  }

  /* ---------- cursor sparkle ---------- */
  const layer = q('[data-sparkle]');
  const touchOnly = window.matchMedia && window.matchMedia('(hover: none)').matches;
  if (layer && opts.cursorSparkle !== false && !touchOnly) {
    let last = 0;
    const onMove = (e) => {
      const now = Date.now();
      if (now - last < 60) return;
      last = now;
      const s = document.createElement('div');
      const size = 3 + Math.random() * 4;
      s.style.cssText = 'position:absolute;left:' + (e.clientX - size / 2) + 'px;top:' + (e.clientY - size / 2) +
        'px;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:rgba(232,163,190,.9);box-shadow:0 0 9px rgba(240,211,160,.9);pointer-events:none';
      layer.appendChild(s);
      const anim = s.animate(
        [{ opacity: 0.9, transform: 'translate(0,0) scale(1)' },
         { opacity: 0, transform: 'translate(' + ((Math.random() - 0.5) * 24).toFixed(1) + 'px,' + (16 + Math.random() * 20).toFixed(1) + 'px) scale(.2)' }],
        { duration: 750 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.2,1)' }
      );
      anim.onfinish = () => s.remove();
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    cleanups.push(() => document.removeEventListener('mousemove', onMove));
  }

  /* ---------- music (generated softly in the browser, no audio file) ---------- */
  let music = false, ac = null, gain = null, oscs = null;
  const stopMusic = () => {
    if (!ac) return;
    try { gain.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.8); } catch (e) { /* ignore */ }
    const ctx = ac, list = oscs || [];
    setTimeout(() => { list.forEach((o) => { try { o.stop(); } catch (e) { /* ignore */ } }); try { ctx.close(); } catch (e) { /* ignore */ } }, 900);
    ac = null; oscs = null;
  };
  const paintEq = () => {
    const eq = q('[data-music-eq]');
    if (eq) Array.prototype.forEach.call(eq.children, (bar, i) => {
      bar.style.animation = music ? 'floaty ' + (0.6 + i * 0.17) + 's ease-in-out infinite' : 'none';
      bar.style.opacity = music ? '1' : '.45';
    });
  };
  // a song file (opts.musicSrc) plays on a loop; without one, a soft tone is generated
  let song = null;
  const playSong = () => {
    if (!song) {
      song = new Audio(opts.musicSrc);
      song.loop = true;
      song.volume = opts.musicVolume ?? 0.5;
    }
    song.play().catch(() => { music = false; paintEq(); }); // blocked or file missing
  };
  const toggleMusic = () => {
    music = !music;
    paintEq();
    if (opts.musicSrc) return music ? playSong() : song && song.pause();
    if (!music) return stopMusic();
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.045, ac.currentTime + 2.5);
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 950;
    gain.connect(filter); filter.connect(ac.destination);
    oscs = [146.83, 220, 293.66, 440].map((f, i) => {
      const o = ac.createOscillator();
      o.type = i > 1 ? 'triangle' : 'sine';
      o.frequency.value = f;
      const g = ac.createGain();
      g.gain.value = i > 1 ? 0.22 : 0.5;
      const lfo = ac.createOscillator();
      lfo.frequency.value = 0.08 + i * 0.05;
      const lg = ac.createGain(); lg.gain.value = 1.4;
      lfo.connect(lg); lg.connect(o.frequency); lfo.start();
      o.connect(g); g.connect(gain); o.start();
      return o;
    });
  };
  cleanups.push(stopMusic, () => song && song.pause());
  // browsers only allow sound after a tap, so this is called from the envelope tap
  const startMusic = () => { if (!music) toggleMusic(); };

  /* ---------- envelope ---------- */
  let opening = false;
  const openEnvelope = (onDone) => {
    if (opening) return;
    opening = true;
    const env = q('[data-envelope]');
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const scrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = scrollBehavior;
      onDone && onDone();
      paintScroll();
      observe();
    };
    if (env && env.animate) {
      env.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.1)' }],
        { duration: 900, easing: 'cubic-bezier(.6,.05,.2,1)', fill: 'forwards' }).onfinish = finish;
      setTimeout(finish, 1000);
    } else finish();
  };

  return {
    observe,
    openEnvelope,
    toggleMusic,
    startMusic,
    destroy() {
      cleanups.forEach((fn) => fn());
      document.body.style.overflow = '';
    },
  };
}
