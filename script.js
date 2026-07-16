(() => {
  const LETTER_TEXT =
`I know I hurt you, and there is no excuse for the pain I caused. I am truly, deeply sorry.

You are the most beautiful part of my life — the reason I smile, the reason I dream, the reason I want to be better every single day.

If you give me the chance, I promise to love you louder than my mistakes, to hold you softer than the world ever did, and to spend every tomorrow proving that you are — and always will be — my forever.

I love you. More than words. More than time.`;

  const $ = (id) => document.getElementById(id);
  const stages = {
    envelope: $('stageEnvelope'),
    letter:   $('stageLetter'),
    video:    $('stageVideo'),
    final:    $('stageFinal'),
  };
  const music = $('bgMusic');
  const video = $('romanticVideo');
  let soundOn = false;

  /* ---------- Background particles ---------- */
  function spawn(container, className, count, styler) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = className;
      styler(el, i);
      container.appendChild(el);
    }
  }
  spawn($('particles'), 'particle', 40, (el) => {
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (10 + Math.random() * 14) + 's';
    el.style.animationDelay = (-Math.random() * 20) + 's';
    const s = 2 + Math.random() * 4;
    el.style.width = el.style.height = s + 'px';
  });
  spawn($('petals'), 'petal', 22, (el) => {
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (9 + Math.random() * 10) + 's';
    el.style.animationDelay = (-Math.random() * 15) + 's';
    const s = 14 + Math.random() * 16;
    el.style.width = el.style.height = s + 'px';
  });
  spawn($('sparks'), 'spark', 30, (el) => {
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (6 + Math.random() * 8) + 's';
    el.style.animationDelay = (-Math.random() * 12) + 's';
  });
  spawn($('floatingHearts'), 'fheart', 14, (el) => {
    el.textContent = '❤';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (10 + Math.random() * 12) + 's';
    el.style.animationDelay = (-Math.random() * 14) + 's';
    el.style.fontSize = (10 + Math.random() * 14) + 'px';
  });

  /* ---------- Stage switch ---------- */
  function goTo(name) {
    Object.entries(stages).forEach(([k, el]) => el.classList.toggle('active', k === name));
  }

  /* ---------- Sound ---------- */
  $('soundToggle').addEventListener('click', () => {
    soundOn = !soundOn;
    $('soundIcon').textContent = soundOn ? '🔊' : '🔇';
    if (soundOn) music.play().catch(()=>{}); else music.pause();
  });

  /* ---------- Heart burst ---------- */
  function heartBurst(container, count = 24) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const h = document.createElement('span');
      h.className = 'h';
      h.textContent = Math.random() < 0.6 ? '❤' : '🌹';
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const dist = 120 + Math.random() * (container.classList.contains('big') ? 240 : 140);
      h.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      h.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      h.style.animationDelay = (Math.random() * 0.2) + 's';
      container.appendChild(h);
    }
    setTimeout(() => (container.innerHTML = ''), 1400);
  }

  /* ---------- Envelope tap ---------- */
  const envelope = $('envelope');
  const envWrap = document.querySelector('.envelope-wrap');
  function openEnvelope() {
    if (envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    envWrap.classList.add('zooming');
    heartBurst($('burst'), 20);
    if (soundOn) music.play().catch(()=>{});
    setTimeout(showLetter, 1600);
  }
  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openEnvelope(); });

  /* ---------- Letter typing ---------- */
  const body = $('letterBody');
  const sign = document.querySelector('.letter-sign');
  const btnContinue = $('btnContinue');
  function showLetter() {
    goTo('letter');
    body.textContent = '';
    body.classList.remove('done');
    sign.classList.remove('show');
    btnContinue.classList.remove('show');
    let i = 0;
    const speed = 32;
    const tick = () => {
      if (i <= LETTER_TEXT.length) {
        body.textContent = LETTER_TEXT.slice(0, i++);
        setTimeout(tick, speed);
      } else {
        body.classList.add('done');
        sign.classList.add('show');
        setTimeout(() => btnContinue.classList.add('show'), 700);
      }
    };
    tick();
  }

  /* ---------- Video ---------- */
  const blackout = $('videoBlackout');
  const btnSkip = $('btnSkip');
  function playVideo() {
    goTo('video');
    blackout.classList.remove('hide');
    video.classList.remove('show');
    try { video.currentTime = 0; } catch(_) {}
    const start = () => {
      video.classList.add('show');
      setTimeout(() => blackout.classList.add('hide'), 60);
    };
    const p = video.play();
    if (p && p.then) p.then(start).catch(() => setTimeout(showFinal, 800));
    else start();
  }
  btnContinue.addEventListener('click', playVideo);
  video.addEventListener('ended', showFinal);
  btnSkip.addEventListener('click', showFinal);

  /* ---------- Final ---------- */
  function showFinal() {
    try { video.pause(); } catch(_) {}
    goTo('final');
    setTimeout(() => heartBurst($('finalBurst'), 40), 300);
  }
  $('btnReplay').addEventListener('click', () => {
    envelope.classList.remove('open');
    envWrap.classList.remove('zooming');
    goTo('envelope');
  });
})();
      
