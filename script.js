/**
 * ========================================================
 * ROMANTIC 21ST BIRTHDAY WEBSITE - JAVASCRIPT
 * Interactions, Animations, Web Audio Music & Cake Finale
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------
     1. AMBIENT FLOATING PARTICLES (CANVAS)
     Floating hearts, golden shimmers, and delicate petals
     ------------------------------------------------------ */
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class FloatingParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * 0.7 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.45 + 0.2;
      this.type = Math.random() > 0.45 ? 'heart' : 'sparkle'; // heart or sparkle
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.008) * 0.3;
      this.rotation += this.rotationSpeed;

      if (this.y < -30 || this.x < -30 || this.x > canvas.width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'heart') {
        ctx.fillStyle = '#E8A598';
        const d = this.size;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
        ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
        ctx.fill();
      } else {
        // Soft golden sparkle circle
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size / 2);
        gradient.addColorStop(0, 'rgba(255, 230, 200, 0.9)');
        gradient.addColorStop(0.5, 'rgba(232, 180, 184, 0.4)');
        gradient.addColorStop(1, 'rgba(232, 180, 184, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Adjust particle count for screen size
  const particleCount = window.innerWidth < 768 ? 22 : 45;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new FloatingParticle());
  }

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    animationFrameId = requestAnimationFrame(renderParticles);
  }
  renderParticles();


  /* ------------------------------------------------------
     2. BACKGROUND MUSIC CONTROLLER: OUR SONG
     Plays the real our-song.mp3 file from this folder on loop.
     The synthesized melody is only a last resort if the MP3 is
     genuinely missing or cannot be decoded.
     ------------------------------------------------------ */
  const SONG_SRC = 'our-song.mp3';
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const bgAudio = document.getElementById('bg-audio');
  const musicStatusText = document.getElementById('musicStatusText');
  // Background Music State
  let isPlaying = false;
  let isSynthPlaying = false;
  let synthAudioCtx = null;
  let synthTimer = null;
  let synthStep = 0;
  let activePlayPromise = null; // shared by auto-start + button so play() is called once
  let wantsPlaying = false;     // the user's intended state, even while play() is pending
  let mp3Unavailable = false;   // true only when the MP3 itself fails to load/decode

  // Make the real file authoritative and force a fresh read on startup so an
  // MP3 that was just added to (or replaced in) the folder is the one used.
  bgAudio.src = SONG_SRC;
  bgAudio.load();

  // Sultry, romantic pop/R&B chords inspired by "Ruin the Friendship" (F#m - D - A - E / C#m)
  const romanticChords = [
    [185.00, 220.00, 277.18, 369.99], // F# Minor
    [146.83, 220.00, 293.66, 369.99], // D Major
    [220.00, 277.18, 329.63, 440.00], // A Major
    [164.81, 246.94, 329.63, 415.30], // E Major (G#4)
    [185.00, 220.00, 293.66, 369.99], // Dmaj7 / F#
    [220.00, 277.18, 329.63, 554.37]  // A Major 7 (C#5)
  ];

  function playSynthChord(notes) {
    if (!synthAudioCtx) return;
    const now = synthAudioCtx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = synthAudioCtx.createOscillator();
      const gain = synthAudioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      // Warm, lush envelope
      gain.gain.setValueAtTime(0.0001, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.065, now + idx * 0.1 + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 2.9);

      osc.connect(gain);
      gain.connect(synthAudioCtx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 3.1);
    });
  }

  function startSynthesizer() {
    if (!synthAudioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      synthAudioCtx = new AudioContextClass();
    }
    if (synthAudioCtx.state === 'suspended') {
      synthAudioCtx.resume();
    }

    isSynthPlaying = true;
    playSynthChord(romanticChords[synthStep % romanticChords.length]);
    synthStep++;

    synthTimer = setInterval(() => {
      playSynthChord(romanticChords[synthStep % romanticChords.length]);
      synthStep++;
    }, 2800);
  }

  function stopSynthesizer() {
    isSynthPlaying = false;
    if (synthTimer) {
      clearInterval(synthTimer);
      synthTimer = null;
    }
  }

  function setPlayingUI(label) {
    isPlaying = true;
    isSynthPlaying = false;
    musicToggleBtn.classList.add('playing');
    musicStatusText.textContent = label;
  }

  // The element only reports a real load/decode problem via its error event.
  // Track that separately from transient play() rejections.
  bgAudio.addEventListener('error', () => { mp3Unavailable = true; });
  bgAudio.addEventListener('loadeddata', () => { mp3Unavailable = false; });

  // Play the actual MP3 file. Returns a promise resolving to true only when the
  // real file is playing. Concurrent calls share one promise so a second play()
  // can never abort the first and trigger the old misleading fallback.
  function playRealMp3() {
    if (activePlayPromise) return activePlayPromise;

    activePlayPromise = (async () => {
      if (bgAudio.getAttribute('src') !== SONG_SRC) {
        bgAudio.src = SONG_SRC;
      }
      // If the file was missing earlier (e.g. added after loading the page) or
      // was replaced on disk, reload it before playing so we use the real file.
      if (bgAudio.error || bgAudio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        mp3Unavailable = false;
        bgAudio.load();
      }

      try {
        await bgAudio.play();
        return true;
      } catch (err) {
        // The user may have paused while play() was pending (e.g. a duplicate
        // request was aborted) — never restart audio against their intent.
        if (!wantsPlaying) return false;

        // Only a genuine "no supported source / decode failed" error means the
        // MP3 truly cannot be played. Everything else (autoplay policy, an
        // aborted duplicate play request) is transient — retry the real file.
        if (bgAudio.error || (err && err.name === 'NotSupportedError')) {
          mp3Unavailable = true;
          return false;
        }
        console.warn('Retrying our-song.mp3 after play error:', err);
        bgAudio.load();
        try {
          await bgAudio.play();
          return true;
        } catch (retryErr) {
          console.warn('our-song.mp3 could not be played:', retryErr);
          mp3Unavailable = true;
          return false;
        }
      }
    })().finally(() => { activePlayPromise = null; });

    return activePlayPromise;
  }

  // Play music function
  function startMusicPlayback() {
    wantsPlaying = true;
    if (isPlaying && !isSynthPlaying && !bgAudio.paused) return;

    stopSynthesizer();

    playRealMp3().then((ok) => {
      if (!wantsPlaying) return; // user paused while the promise was pending
      if (ok && !mp3Unavailable) {
        setPlayingUI('Playing 💕');
      } else {
        // Last resort only: the real MP3 is missing or unplayable.
        startSynthesizer();
        isPlaying = true;
        musicToggleBtn.classList.add('playing');
        musicStatusText.textContent = 'Playing Melody 💕';
      }
    });
  }

  // Pause music function
  function stopMusicPlayback() {
    wantsPlaying = false;
    bgAudio.pause();
    stopSynthesizer();
    isPlaying = false;
    isSynthPlaying = false;
    musicToggleBtn.classList.remove('playing');
    musicStatusText.textContent = "Paused";
  }

  // Toggle button click
  function toggleMusic(e) {
    if (e) e.stopPropagation();
    if (isPlaying || activePlayPromise) {
      stopMusicPlayback();
    } else {
      startMusicPlayback();
    }
  }

  musicToggleBtn.addEventListener('click', toggleMusic);


  /* ------------------------------------------------------
     3. SCROLL REVEAL ANIMATIONS
     Fades & slides elements smoothly as she scrolls
     ------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ------------------------------------------------------
     4. SCRAPBOOK GALLERY & LIGHTBOX
     Categorized filtering + fullscreen viewer for photos & videos
     ------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const polaroidCards = document.querySelectorAll('.polaroid-card');

  // Filter Categories
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      polaroidCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          card.style.display = 'block';
          // Staggered fade-in with CSS transition
          setTimeout(() => {
            card.style.opacity = '1';
          }, index * 50 + 40);
        } else {
          // Smooth fade-out before hiding
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.display = 'none';
          }, 320);
        }
      });
    });
  });

  // Lightbox Modal Elements
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxMediaContainer = document.getElementById('lightboxMediaContainer');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxDate = document.getElementById('lightboxDate');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let currentGalleryIndex = 0;
  const galleryItems = Array.from(polaroidCards);

  function openLightbox(index) {
    currentGalleryIndex = index;
    const item = galleryItems[currentGalleryIndex];
    const type = item.getAttribute('data-type');
    const caption = item.getAttribute('data-caption') || '';
    const date = item.getAttribute('data-date') || '';

    lightboxMediaContainer.innerHTML = '';

    if (type === 'video') {
      const videoSrc = item.getAttribute('data-video-src');
      const videoEl = document.createElement('video');
      videoEl.src = videoSrc;
      videoEl.controls = true;
      videoEl.autoplay = true;
      videoEl.playsInline = true;
      lightboxMediaContainer.appendChild(videoEl);
    } else {
      const fullImgSrc = item.getAttribute('data-full') || item.querySelector('img').src;
      const imgEl = document.createElement('img');
      imgEl.src = fullImgSrc;
      imgEl.alt = caption;
      lightboxMediaContainer.appendChild(imgEl);
    }

    lightboxCaption.textContent = caption;
    lightboxDate.textContent = date;
    lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryItems.length}`;

    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
    // Stop video if playing
    const video = lightboxMediaContainer.querySelector('video');
    if (video) video.pause();
  }

  function showNextMedia() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  function showPrevMedia() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  polaroidCards.forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(index));
  });

  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrevMedia(); });
  lightboxNextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNextMedia(); });

  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (!lightboxOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextMedia();
    if (e.key === 'ArrowLeft') showPrevMedia();
  });


  /* ------------------------------------------------------
     5. LOVE NOTES & 21 REASONS CAROUSEL
     Interactive 3D Flip Card with 21 curated romantic reasons
     ------------------------------------------------------ */
  const reasonsData = [
    {
      title: "Your Eyes",
      teaser: "The way your eyes catch my attention when you're looking at me.",
    },
    {
      title: "The Comfort That You Bring",
      teaser: "You are the first and only person to ask me how I am doing and genuinely listen.",
      deep: "You possess a rare gentleness that makes everyone around you feel valued, safe, and heard. You inspire me to be a better human every day."
    },
    {
      title: "The Way You Make Me Laugh",
      teaser: "Your silly little jokes bring so much joy to my life, even on the toughest days.",
      deep: "Time stops whenever we talk late into the night. With you, I never run out of things to say, and silence is just as comfortable as laughter."
    },
    {
      title: "You Try Your Best to Understand Me",
      teaser: "For some people, this is just 'bare minimum' but for me, it's everything.",
      deep: "You try to hold it in, but when it happens, it makes me smile without fail. It's one of a million little things that are uniquely, wonderfully you."
    },
    {
      title: "How Passionate You Are",
      teaser: "When you talk about things you love, that's the most attractive thing about you.",
      deep: "Watching you pursue your goals and speak with fire in your heart is one of the most attractive things in the entire world. Never lose that spark."
    },
    {
      title: "Your Comforting Hugs",
      teaser: "Wrapping my arms around you feels exactly like coming home.",
    },
    {
      title: "The Way You Look At Me",
      teaser: "The way your eyes meet mine when you're listening to me.",
      deep: "They look ten times better on you than they ever did on me anyway. Consider them officially yours forever."
    },
    {
      title: "Your Unwavering Support",
      teaser: "You believe in me even when I doubt myself.",
      deep: "Knowing you have my back gives me the confidence to take on anything. You are my greatest anchor and my greatest inspiration."
    },
    {
      title: "Our Random Food Dates",
      teaser: "Eating with you is and will always be an adventure.",
      deep: "It doesn't matter where the destination is; as long as you're in the passenger seat singing along off-key, it's paradise."
    },
    {
      title: "The Way You Say My Name",
      teaser: "The only 'hoy, ivan' that i'll love to hear when I do the most stupid things.",
      
    },
    {
      title: "You Always Make sure That I Get To Eat",
      teaser: "You don't know how much it means to me when you share your food with me even if you're hungry.",
      deep: "From witty comebacks to goofy dance moves in the grocery store aisle, you keep our lives vibrant and full of joy."
    },
    {
      title: "Your Face ( OFCCCCC )",
      teaser: "You never fail to catch my attention. You don't need makeup or fancy dresses to impress me, baby.",
      deep: "You don't need makeup or fancy dresses; to me, you are most breathtaking in your rawest, coziest moments."
    },
    {
      title: "Your Boundless Empathy",
      teaser: "You feel so deeply for others and always choose kindness.",
      deep: "In a world that can often be cynical and cold, your warm heart is a glowing lantern that brings light wherever you walk."
    },
    {
      title: "How Excited You Get Over Small Things",
      teaser: "Even the smallest surprises that I have for you excite you.",
      deep: "Your wonder for life reminds me to slow down and appreciate the simple magic in everyday moments."
    },
    {
      title: "My favorite person to turn to for advice.",
      teaser: "Your words guide me through life's challenges. ALWAYS.",
      deep: "There is no one else I would rather share good news with, complain about petty things to, or just sit quietly beside."
    },
    {
      title: "MY FAVORITE VOICE TO HEAR",
      teaser: "I WILL ALWAYS LOVE YOUR SWEET AND SOOTHING VOICE. Lalo na kapag kumakanta :3",
      deep: "The care and love you put into everything you do for us never goes unnoticed. I treasure every single detail."
    },
    {
      title: "The way we fix things together after an argument",
      teaser: "You always make sure we work through conflicts and come out better.",
      deep: "Even on my most difficult days, you never make me feel like I'm too much. Your patience with me is one of the greatest gifts you've ever given."
    },
    {
      title: "You Never Forget About My 'Birthday'",
      teaser: "This part is more than words can explain, baby.",
      deep: "Just by being you, you push me to dream bigger, work harder, and love deeper. You bring out the best in me simply by existing in my life."
    }
  ];

  let currentReasonIdx = 0;
  const reasonFlipCard = document.getElementById('reasonFlipCard');
  const reasonNumberBadge = document.getElementById('reasonNumberBadge');
  const reasonFrontTitle = document.getElementById('reasonFrontTitle');
  const reasonFrontTeaser = document.getElementById('reasonFrontTeaser');
  const currentReasonIndexEl = document.getElementById('currentReasonIndex');
  const totalReasonsEl = document.getElementById('totalReasons');
  const prevReasonBtn = document.getElementById('prevReasonBtn');
  const nextReasonBtn = document.getElementById('nextReasonBtn');
  const reasonDotsContainer = document.getElementById('reasonDotsContainer');

  // Render Reason Dots
  reasonsData.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('reason-dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => updateReasonCard(idx));
    reasonDotsContainer.appendChild(dot);
  });

  function updateReasonCard(index) {
    currentReasonIdx = index;

    setTimeout(() => {
      const data = reasonsData[currentReasonIdx];
      reasonNumberBadge.textContent = `Reason #${currentReasonIdx + 1} of ${reasonsData.length}`;
      reasonFrontTitle.textContent = data.title;
      reasonFrontTeaser.textContent = data.teaser;
      currentReasonIndexEl.textContent = currentReasonIdx + 1;
      totalReasonsEl.textContent = reasonsData.length;

      // Update dots
      const dots = reasonDotsContainer.querySelectorAll('.reason-dot');
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === currentReasonIdx);
      });
    }, 200);
  }

  prevReasonBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const newIdx = (currentReasonIdx - 1 + reasonsData.length) % reasonsData.length;
    updateReasonCard(newIdx);
  });

  nextReasonBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const newIdx = (currentReasonIdx + 1) % reasonsData.length;
    updateReasonCard(newIdx);
  });

  // Initialize the first reason card on page load
  updateReasonCard(0);

  /* ------------------------------------------------------
     6. NOTES TAB SWITCHER (21 Reasons vs Open When)
     ------------------------------------------------------ */
  const tab21Reasons = document.getElementById('tab21Reasons');
  const tabOpenWhen = document.getElementById('tabOpenWhen');
  const panel21Reasons = document.getElementById('panel21Reasons');
  const panelOpenWhen = document.getElementById('panelOpenWhen');

  tab21Reasons.addEventListener('click', () => {
    tab21Reasons.classList.add('active');
    tabOpenWhen.classList.remove('active');
    panel21Reasons.classList.add('active');
    panelOpenWhen.classList.remove('active');
  });

  tabOpenWhen.addEventListener('click', () => {
    tabOpenWhen.classList.add('active');
    tab21Reasons.classList.remove('active');
    panelOpenWhen.classList.add('active');
    panel21Reasons.classList.remove('active');
  });


  /* ------------------------------------------------------
     7. "OPEN WHEN..." ENVELOPES & LETTER MODAL
     ------------------------------------------------------ */
  const openWhenLetters = {
    "1": {
      title: "Open when we have an argument",
      content: `
        <p><strong>Hiii, my babyyy</strong></p>
        <p>If you’re reading this right now, things probably feel heavy between us.</p>
        <p>Even when we’re both frustrated or far apart from each other, please remember that I am always on your team. 
        Take all the space and time you need to breathe, baby. You don't have to worry about anything because I will always be here for you no matter the circumstances.</p>
        <p>We argue, but that doesn't change how much I love you.</p>
      ` 
    },
    "2": {
      title: "Open when you miss me",
      content: `
        <p>If you're reading this, it means you're missing me or want mo lang basahin ulit isa isa.</p>
        <p>So yea, first of all, I just want you to know that I miss you too so much. Palagi naman po.</p>
        <p>Distance and busy days may physically keep us apart sometimes, but nothing can touch how closely knit our hearts are. I'm probably thinking about you at this exact same second, wishing I could wrap my arms around you and kiss your forehead
        to remind you the thing that I always do.</p>
        <p>Kung hindi pa man tayo legal, we'll get there and you'll always receive my kisses in real-time hehe.</p>
      `
    },
    "3": {
      title: "Open when you're having a rough day",
      content: `
        <p>John 14:27</p>
        <p>"Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.</p>
        <p>This is just simply a reminder that you don't have to carry all your worries by yourself, baby. I know there are times when things get overwhelming, when you overthink, feel uncertain, or worry about things you can't control. 
        But I want you to remember that God never intended for you to face everything on your own.</p>
        <p>And ofc, I will always be here for you even on the toughest days of your life. Let me help you carry the burdens of your day, 
        comfort you when things get overwhelming, and remind you that you never have to face anything alone. </p>
      `
    },
    "4": {
      title: "Open when you can't sleep 🌙",
      content: `
        <p>My sweet angel,</p>
        <p>If your mind is racing and the ceiling is keeping you company, let me remind you of something: tomorrow's worries can wait until tomorrow. Right now, your only job is to be cozy and safe.</p>
        <p>Think about the sound of gentle waves on the shore, the warmth of curling up in blankets after a long shower, and the memory of us laughing until our stomachs ached. Picture me holding your hand and brushing your hair back.</p>
        <p>Close those pretty eyes, let your thoughts drift away, and dream sweet dreams. I love you endlessly.</p>
      `
    },
    "5": {
      title: "Open when you need a reminder of how gorgeous you are 👑",
      content: `
        <p>To the most stunning girl in the room (and in the world):</p>
        <p>If you're ever feeling insecure or having one of those rare moments where you doubt your beauty, let me set the record straight.</p>
        <p>You are effortlessly, breathtakingly gorgeous. It's not just your smile that stops me in my tracks or your eyes that sparkle under the sunlight; it's the warmth, intelligence, and grace that radiate from within you.</p>
        <p>You light up every room you walk into without even trying. Never forget how truly mesmerizing you are to me.</p>
      `
    },
    "6": {
      title: "Open when we're about to pop champagne 🥂",
      content: `
        <p>Cheers to Twenty-One! 🍾✨</p>
        <p>Raise your glass, birthday girl! Today we celebrate you stepping officially into full adulthood with grace, style, and so much excitement for what lies ahead.</p>
        <p>Here's to late-night dance sessions, new milestones, ticking off bucket-list adventures, and cherishing every quiet Sunday morning in between.</p>
        <p>Here's to you, my forever favorite person. Let's make this 21st year unforgettable!</p>
      `
    }
  };

  const envelopeItems = document.querySelectorAll('.envelope-item');
  const letterModalOverlay = document.getElementById('letterModalOverlay');
  const letterModalClose = document.getElementById('letterModalClose');
  const letterModalTitle = document.getElementById('letterModalTitle');
  const letterModalBody = document.getElementById('letterModalBody');

  envelopeItems.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-envelope-id');
      const letterData = openWhenLetters[id];
      if (letterData) {
        letterModalTitle.textContent = letterData.title;
        letterModalBody.innerHTML = letterData.content;
        letterModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  letterModalClose.addEventListener('click', () => {
    letterModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  letterModalOverlay.addEventListener('click', (e) => {
    if (e.target === letterModalOverlay) {
      letterModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });


  /* ------------------------------------------------------
     8. BIRTHDAY CAKE & BLOW OUT THE CANDLES FINALE
     Realistic flame extinguishing + Confetti Explosion + Audio Chime
     ------------------------------------------------------ */
  const blowCandlesBtn = document.getElementById('blowCandlesBtn');
  const birthdayCake = document.getElementById('birthdayCake');
  const candle1 = document.getElementById('candle1');
  const candle2 = document.getElementById('candle2');
  const wishMadeBadge = document.getElementById('wishMadeBadge');
  const blowBtnLabel = document.getElementById('blowBtnLabel');
  const finalLoveLetter = document.getElementById('finalLoveLetter');
  let candlesBlown = false;

  function playCelebrationSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const actx = new AudioContextClass();
      const now = actx.currentTime;

      // Soft wind blow noise
      const bufferSize = actx.sampleRate * 0.4;
      const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = actx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = actx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      const noiseGain = actx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(actx.destination);
      whiteNoise.start(now);

      // Sweet celebratory music box / bells chime arpeggio
      const chimeFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chimeFreqs.forEach((f, i) => {
        const osc = actx.createOscillator();
        const g = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + 0.35 + i * 0.1);
        g.gain.setValueAtTime(0.001, now + 0.35 + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.12, now + 0.35 + i * 0.1 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35 + i * 0.1 + 1.2);
        osc.connect(g);
        g.connect(actx.destination);
        osc.start(now + 0.35 + i * 0.1);
        osc.stop(now + 0.35 + i * 0.1 + 1.3);
      });
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }

  function launchRoseGoldConfetti() {
    if (typeof confetti !== 'function') return;

    // Palette of Rose Gold, Soft Blush, Champagne Gold, and Magenta
    const romanticColors = ['#B76E79', '#E8B4B8', '#D4AF37', '#FFD1DC', '#FFFFFF', '#C97A85'];

    // Left cannon
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors: romanticColors,
      shapes: ['circle', 'square']
    });

    // Right cannon
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors: romanticColors,
      shapes: ['circle', 'square']
    });

    // Center star & heart burst
    setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.6 },
        colors: romanticColors,
        scalar: 1.2
      });
    }, 250);

    // Second celebratory wave
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 90,
        spread: 120,
        origin: { y: 0.5 },
        colors: romanticColors
      });
    }, 600);
  }

  function blowOutCandles() {
    if (candlesBlown) {
      // Relight candles if clicked again
      candlesBlown = false;
      candle1.classList.remove('blown-out');
      candle2.classList.remove('blown-out');
      wishMadeBadge.classList.remove('show');
      blowBtnLabel.textContent = "Blow Out The Candles";
      return;
    }

    candlesBlown = true;
    candle1.classList.add('blown-out');
    candle2.classList.add('blown-out');

    playCelebrationSound();
    launchRoseGoldConfetti();

    wishMadeBadge.classList.add('show');
    blowBtnLabel.textContent = "Relight Candles ✨";

    // Smoothly draw attention to the final love letter
    setTimeout(() => {
      finalLoveLetter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
  }

  blowCandlesBtn.addEventListener('click', blowOutCandles);
  birthdayCake.addEventListener('click', blowOutCandles);


  /* ------------------------------------------------------
     9. BACK TO TOP BUTTON
     ------------------------------------------------------ */
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});


