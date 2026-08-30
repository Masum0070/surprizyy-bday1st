/* ============================================================
   A LITTLE SOMETHING FOR YOU — main application script

   Sections:
   1. Page navigation
   2. Music
   3. Particles
   4. Scratch letter
   5. Coverflow carousel
   6. Story viewer
   7. Gift animation
   7b. Pick a gift
   8. Final surprise
   ============================================================ */

   /*New System Added*/

/* ==================== SUPABASE ==================== */

const SUPABASE_URL = "https://cvsayoccmdksomajoalu.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_kYT-6Tvgjcl2wmcHbZRuaw_if40dy9D";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


/* ==================== CUSTOMER ==================== */

const params = new URLSearchParams(window.location.search);
const CUSTOMER_ID = params.get("id");

console.log("CUSTOMER_ID:", CUSTOMER_ID);

if (!CUSTOMER_ID) {
  console.error("❌ Customer ID missing from URL");
}
/* ==================== CUSTOMER DATA ==================== */

async function loadCustomerData() {

  if (!CUSTOMER_ID) return;

  try {

    const { data: customer, error } =
  await supabaseClient
    .rpc("get_customer", {
      p_customer_id: CUSTOMER_ID
    });

    if (error) {
      console.error("❌ Customer data error:", error);
      console.error("Full error:", JSON.stringify(error, null, 2));
      return;
    }

    console.log("✅ Customer data loaded:", customer);


    // Customer Name
    const nameEl =
      document.getElementById("customer-name");

    if (nameEl) {
      nameEl.textContent =
        customer.customer_name || "";
    }


    // First Letter
    if (Array.isArray(customer.first_letter)) {

      customer.first_letter.forEach(
        (text, index) => {

          const el =
            document.getElementById(
              `firstLetter-line${index + 1}`
            );

          if (el) {
            el.textContent = text;
          }

        }
      );

    }
    // Memory Dates
if (Array.isArray(customer.memory_dates)) {

    document
        .querySelectorAll("[data-memory-date]")
        .forEach(el => {

            const number =
                Number(el.dataset.memoryDate);

            if (customer.memory_dates[number - 1]) {
                el.textContent =
                    customer.memory_dates[number - 1];
            }

        });
}


// Memory Captions
if (Array.isArray(customer.memory_captions)) {

    document
        .querySelectorAll("[data-memory-caption]")
        .forEach(el => {

            const number =
                Number(el.dataset.memoryCaption);

            if (customer.memory_captions[number - 1]) {
                el.textContent =
                    customer.memory_captions[number - 1];
            }

        });
}


    // Final Letter
    if (Array.isArray(customer.final_letter)) {

      customer.final_letter.forEach(
        (text, index) => {

          const el =
            document.getElementById(
              `finalLetter-line${index + 1}`
            );

          if (el) {
            el.textContent = text;
          }

        }
      );

    }

  } catch (err) {

    console.error(
      "❌ Customer loading error:",
      err
    );

  }
}

loadCustomerData();

/* ==================== PHOTO URL ==================== */

async function getPhotoUrl(filename) {

  if (!CUSTOMER_ID) {
    console.error("❌ No customer ID");
    return "";
  }

  try {

    const path =
      `birthday-surprises/${CUSTOMER_ID}/${filename}`;

    console.log("📸 Loading:", path);

    const { data, error } =
      await supabaseClient
        .storage
        .from("files-main")
        .createSignedUrl(path, 3600);
        console.log("SUPABASE RESPONSE:", { data, error });

    if (error) {
      console.error(
        "❌ Photo loading error:",
        path,
        error
      );
      return "";
    }

    console.log("✅ Photo loaded:", path);

    return data.signedUrl;

  } catch (err) {

    console.error(
      "❌ Photo URL error:",
      err
    );

    return "";
  }
}

/* ==================== MAIN ==================== */

(() => {

  'use strict';

  const REDUCED_MOTION =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  /* =========================================================
     HELPERS
  ========================================================= */

  function attachImageFallback(
    imgEl,
    wrapEl,
    label = 'A Memory ❤️'
  ) {

    if (!imgEl) return;

    imgEl.addEventListener(
      'error',
      () => {

        console.error(
          'Image failed to load:',
          imgEl.src
        );

        if (
          !wrapEl.querySelector(
            '.cf-fallback,.img-fallback'
          )
        ) {

          const fallback =
            document.createElement('div');

          fallback.className =
            'cf-fallback img-fallback';

          fallback.textContent = label;

          imgEl.style.display = 'none';

          wrapEl.appendChild(
            fallback
          );
        }
      }
    );
  }


  function stagger(
    elements,
    delayStart = 250,
    gap = 320
  ) {

    elements.forEach(
      (el, i) => {

        setTimeout(
          () => {
            el.classList.add('shown');
          },
          delayStart + i * gap
        );

      }
    );
  }


  /* =========================================================
     1. PAGE NAVIGATION
  ========================================================= */

  class Navigator {

    constructor(chapterIds) {

      this.chapterIds =
        chapterIds;

      this.chapters =
        chapterIds.map(
          id =>
            document.getElementById(
              `chapter-${id}`
            )
        );

      this.currentIndex = 0;

      this.navDotsEl =
        document.getElementById(
          'chapter-nav'
        );

      this._buildDots();

      this._wireContinueButtons();

      this.goTo(
        chapterIds[0],
        true
      );
    }


    _buildDots() {

      this.chapterIds.forEach(
        (id, i) => {

          const dot =
            document.createElement(
              'button'
            );

          dot.setAttribute(
            'aria-label',
            `Go to chapter ${i + 1}`
          );

          dot.addEventListener(
            'click',
            () => this.goTo(id)
          );

          this.navDotsEl.appendChild(
            dot
          );

        }
      );
    }


    _wireContinueButtons() {

      document
        .querySelectorAll('[data-next]')
        .forEach(
          btn => {

            btn.addEventListener(
              'click',
              () =>
                this.goTo(
                  btn.dataset.next
                )
            );

          }
        );
    }


    goTo(
      id,
      isInitial = false
    ) {

      const index =
        this.chapterIds.indexOf(id);

      if (index === -1) return;

      this.chapters.forEach(
        ch =>
          ch.classList.remove(
            'active'
          )
      );
      musicPlayer.userInteracted = true;
       musicPlayer.setChapter(id);
    

      const target =
        document.getElementById(
          `chapter-${id}`
        );

      if (!target) return;

      target.classList.add(
        'active'
      );

      this.currentIndex =
        index;

      [
        ...this.navDotsEl.children
      ].forEach(
        (dot, i) =>
          dot.classList.toggle(
            'active',
            i === index
          )
      );

      const lines =
        target.querySelectorAll(
          '.reveal-line:not(.manual)'
        );

      lines.forEach(
        l =>
          l.classList.remove(
            'shown'
          )
      );

      target
        .querySelectorAll(
          '.reveal-line.manual'
        )
        .forEach(
          l =>
            l.classList.remove(
              'shown'
            )
        );

      requestAnimationFrame(
        () =>
          stagger([...lines])
      );

      document.dispatchEvent(
        new CustomEvent(
          'chapter:enter',
          {
            detail: { id }
          }
        )
      );

      if (!isInitial) {

        target.scrollTo?.(
          0,
          0
        );

      }
    }
  }


 /* =========================================================
   2. MUSIC — SUPABASE CUSTOMER MUSIC
========================================================= */

class MusicPlayer {

  constructor(audioEl, btnEl) {

    this.audio = audioEl;
    this.btn = btnEl;

    this.song1 = "";
    this.song2 = "";
    this.currentSong = "";

    if (!this.audio || !this.btn) return;

    this.audio.volume = 0.45;

    this.btn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });

    this.audio.addEventListener("play", () => {
      this._updateIcon();
    });

    this.audio.addEventListener("pause", () => {
      this._updateIcon();
    });

    this._updateIcon();
  }


  /* =========================
     LOAD BOTH SONGS
  ========================= */

  async loadMusic() {

    try {

      const params =
        new URLSearchParams(window.location.search);

      const customerId =
        params.get("id");

      if (!customerId) {
        console.error("❌ Customer ID missing");
        return;
      }


      const song1Path =
        `birthday-surprises/${customerId}/song1.mp3`;

      const song2Path =
        `birthday-surprises/${customerId}/song2.mp3`;


      console.log("🎵 Loading Song 1:", song1Path);
      console.log("🎵 Loading Song 2:", song2Path);


      const [song1Response, song2Response] =
        await Promise.all([

          supabaseClient
            .storage
            .from("files-main")
            .createSignedUrl(
              song1Path,
              3600
            ),

          supabaseClient
            .storage
            .from("files-main")
            .createSignedUrl(
              song2Path,
              3600
            )

        ]);


      /* SONG 1 */

      if (
        song1Response.error ||
        !song1Response.data?.signedUrl
      ) {

        console.error(
          "❌ Song 1 error:",
          song1Response.error
        );

      } else {

        this.song1 =
          song1Response.data.signedUrl;

        console.log("✅ Song 1 loaded");

      }


      /* SONG 2 */

      if (
        song2Response.error ||
        !song2Response.data?.signedUrl
      ) {

        console.error(
          "❌ Song 2 error:",
          song2Response.error
        );

      } else {

        this.song2 =
          song2Response.data.signedUrl;

        console.log("✅ Song 2 loaded");

      }


      // Start with NO music
      this.audio.pause();
      this.audio.removeAttribute("src");
      this._updateIcon();


    } catch (err) {

      console.error(
        "❌ Music error:",
        err
      );

    }

  }


  /* =========================
     CHANGE SONG BY CHAPTER
  ========================= */

  setChapter(chapterId) {

    /* PAGE 1 + PAGE 2
       NO MUSIC
    */

    if (
      chapterId === "intro" ||
      chapterId === "letter"
    ) {

      this.audio.pause();

      this.currentSong = "";

      this.audio.removeAttribute("src");

      this._updateIcon();

      return;
    }


    /* PAGE 3
       SONG 1
    */

    if (chapterId === "wishes") {

      if (!this.song1) return;

      this.changeSong(
        this.song1
      );

      this.audio.play()
    .then(() => {
      console.log("🎵 Song 1 started");
    })
    .catch(() => {
      console.log("🔇 Autoplay blocked");
    });

      return;
    }


    /* PAGE 4 → LAST
       SONG 2
    */

    if (
      chapterId === "memories" ||
      chapterId === "special" ||
      chapterId === "more" ||
      chapterId === "gift" ||
      chapterId === "pickgift" ||
      chapterId === "final"
    ) {

      if (!this.song2) return;

      this.changeSong(
        this.song2
      );

    }

  }


  /* =========================
     CHANGE SONG
  ========================= */

  changeSong(url) {

    const wasPlaying =
      !this.audio.paused;

    // Don't reload same song
    if (this.currentSong === url) {
      return;
    }

    this.currentSong = url;

    this.audio.pause();

    this.audio.src = url;

    this.audio.load();

    if (wasPlaying) {

      this.audio.play()
        .catch(err => {
          console.error(
            "❌ Play error:",
            err
          );
        });

    }

    this._updateIcon();
  }


  /* =========================
     ON / OFF BUTTON
  ========================= */

  toggle() {

    if (this.audio.paused) {

      this.audio.play()
        .catch(err => {
          console.error(
            "❌ Play error:",
            err
          );
        });

    } else {

      this.audio.pause();

    }

  }


  /* =========================
     ICON
  ========================= */

  _updateIcon() {

    this.btn.textContent =
      this.audio.paused
        ? "♪"
        : "♫";

    this.btn.classList.toggle(
      "muted",
      this.audio.paused
    );

  }

}


/* =========================================================
   START MUSIC
========================================================= */

const musicPlayer =
  new MusicPlayer(
    document.getElementById("bg-music"),
    document.getElementById("music-toggle")
  );

musicPlayer.loadMusic();
  /* =========================================================
     3. PARTICLES
  ========================================================= */

  class ParticleSystem {

    constructor(canvas) {

      this.canvas =
        canvas;

      if (!this.canvas)
        return;

      this.ctx =
        canvas.getContext('2d');

      this.particles = [];

      this._resize();

      window.addEventListener(
        'resize',
        () => this._resize()
      );

      this._seedAmbient(
        REDUCED_MOTION
          ? 10
          : 26
      );

      this._tick =
        this._tick.bind(this);

      this._running =
        true;

      this._loop();
    }


    _resize() {

      if (!this.canvas)
        return;

      this.canvas.width =
        window.innerWidth;

      this.canvas.height =
        window.innerHeight;
    }


    _seedAmbient(n) {

      for (
        let i = 0;
        i < n;
        i++
      ) {

        this.particles.push({

          x:
            Math.random() *
            window.innerWidth,

          y:
            Math.random() *
            window.innerHeight,

          vx:
            (Math.random() - 0.5) *
            0.12,

          vy:
            -Math.random() *
              0.12 -
            0.03,

          size:
            Math.random() *
              1.8 +
            0.8,

          color:
            Math.random() > 0.5
              ? '216,181,106'
              : '233,166,184',

          opacity:
            Math.random() *
              0.35 +
            0.1,

          life: Infinity,

          type: 'dot'
        });

      }
    }


    burst(
      x,
      y,
      count = 26
    ) {

      const glyphs = [
        '♥',
        '✦',
        '•'
      ];

      for (
        let i = 0;
        i < count;
        i++
      ) {

        const angle =
          Math.random() *
          Math.PI *
          2;

        const speed =
          Math.random() *
            3 +
          1.2;

        this.particles.push({

          x,
          y,

          vx:
            Math.cos(angle) *
            speed,

          vy:
            Math.sin(angle) *
              speed -
            1.4,

          size:
            Math.random() *
              12 +
            9,

          glyph:
            glyphs[
              Math.floor(
                Math.random() *
                glyphs.length
              )
            ],

          color:
            Math.random() > 0.5
              ? '241,211,138'
              : '196,90,120',

          opacity: 1,

          gravity: 0.045,

          age: 0,

          life:
            70 +
            Math.random() *
              40,

          type: 'glyph'
        });

      }
    }


    _tick() {

      if (!this.ctx)
        return;

      const ctx =
        this.ctx;

      ctx.clearRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      this.particles.forEach(
        p => {

          p.x += p.vx;

          p.y += p.vy;

          if (p.gravity) {
            p.vy +=
              p.gravity;
          }

          if (
            p.life !== Infinity
          ) {

            p.age++;

            p.opacity =
              Math.max(
                0,
                1 -
                  p.age /
                    p.life
              );

          } else {

            if (p.y < -10)
              p.y =
                window.innerHeight +
                10;

            if (p.x < -10)
              p.x =
                window.innerWidth +
                10;

            if (
              p.x >
              window.innerWidth +
                10
            )
              p.x = -10;
          }

          ctx.globalAlpha =
            p.opacity;

          ctx.fillStyle =
            `rgb(${p.color})`;

          if (
            p.type === 'glyph'
          ) {

            ctx.font =
              `${p.size}px serif`;

            ctx.fillText(
              p.glyph,
              p.x,
              p.y
            );

          } else {

            ctx.beginPath();

            ctx.arc(
              p.x,
              p.y,
              p.size,
              0,
              Math.PI * 2
            );

            ctx.fill();

          }

        }
      );

      this.particles =
        this.particles.filter(
          p =>
            p.life === Infinity ||
            p.age < p.life
        );

      ctx.globalAlpha = 1;
    }


    _loop() {

      if (!this._running)
        return;

      this._tick();

      if (REDUCED_MOTION) {

        setTimeout(
          () => this._loop(),
          260
        );

      } else {

        requestAnimationFrame(
          () => this._loop()
        );

      }
    }
  }


  /* =========================================================
     4. SCRATCH LETTER
  ========================================================= */

  class ScratchLetter {

    constructor(
      envelopeEl,
      canvasEl,
      hintEl,
      onComplete
    ) {

      this.envelope =
        envelopeEl;

      this.canvas =
        canvasEl;

      if (!this.envelope ||
          !this.canvas)
        return;

      this.ctx =
        canvasEl.getContext('2d');

      this.hintEl =
        hintEl;

      this.onComplete =
        onComplete;

      this.done = false;

      this._resize();

      window.addEventListener(
        'resize',
        () => {

          if (!this.done)
            this._resize();

        }
      );

      this._bind();
    }


    _resize() {

      const r =
        this.envelope
          .getBoundingClientRect();

      this.canvas.width =
        r.width;

      this.canvas.height =
        r.height;

      this._paint();
    }


    _paint() {

      const ctx =
        this.ctx;

      const w =
        this.canvas.width;

      const h =
        this.canvas.height;

      const grad =
        ctx.createLinearGradient(
          0,
          0,
          w,
          h
        );

      grad.addColorStop(
        0,
        '#D8B56A'
      );

      grad.addColorStop(
        1,
        '#5A1633'
      );

      ctx.fillStyle =
        grad;

      ctx.fillRect(
        0,
        0,
        w,
        h
      );

      ctx.fillStyle =
        'rgba(255,248,240,.9)';

      ctx.textAlign =
        'center';

      ctx.textBaseline =
        'middle';

      ctx.font =
        `${Math.max(
          13,
          w * 0.045
        )}px "Cormorant Garamond", serif`;

      ctx.fillText(
        'scratch to reveal',
        w / 2,
        h / 2
      );
    }


    _bind() {

      let drawing = false;

      const posFromEvent =
        e => {

          const r =
            this.canvas
              .getBoundingClientRect();

          return [
            e.clientX - r.left,
            e.clientY - r.top
          ];
        };


      const scratch =
        (x, y) => {

          this.ctx.globalCompositeOperation =
            'destination-out';

          this.ctx.beginPath();

          this.ctx.arc(
            x,
            y,
            Math.max(
              20,
              this.canvas.width *
                0.09
            ),
            0,
            Math.PI * 2
          );

          this.ctx.fill();

          this._checkProgress();
        };


      const start =
        e => {

          if (this.done)
            return;

          drawing = true;

          this.canvas
            .setPointerCapture?.(
              e.pointerId
            );

          const [
            x,
            y
          ] =
            posFromEvent(e);

          scratch(x, y);

          if (this.hintEl)
            this.hintEl.style.opacity =
              '0';
        };


      const move =
        e => {

          if (
            !drawing ||
            this.done
          )
            return;

          const [
            x,
            y
          ] =
            posFromEvent(e);

          scratch(x, y);
        };


      const end =
        () => {
          drawing = false;
        };


      this.canvas.addEventListener(
        'pointerdown',
        start
      );

      this.canvas.addEventListener(
        'pointermove',
        move
      );

      this.canvas.addEventListener(
        'pointerup',
        end
      );

      this.canvas.addEventListener(
        'pointercancel',
        end
      );
    }


    _checkProgress() {

      if (this.done)
        return;

      const {
        width: w,
        height: h
      } = this.canvas;

      if (!w || !h)
        return;

      let cleared = 0;
      let total = 0;

      try {

        const data =
          this.ctx.getImageData(
            0,
            0,
            w,
            h
          ).data;

        for (
          let i = 3;
          i < data.length;
          i += 4 * 6
        ) {

          total++;

          if (data[i] === 0)
            cleared++;

        }

      } catch (err) {

        return;
      }

      if (
        total > 0 &&
        cleared / total > 0.42
      ) {

        this.done = true;

        this.onComplete();
      }
    }


    forceComplete() {

      if (this.done)
        return;

      this.done = true;

      this.onComplete();
    }
  }


  /* =========================================================
     5. COVERFLOW CAROUSEL
  ========================================================= */

  class CoverflowCarousel {

    constructor(
      el,
      images,
      {
        captions = [],
        onOpenCenter = null,
        autoplay = true
      } = {}
    ) {

      this.el = el;

      this.images =
        images || [];

      this.captions =
        captions || [];

      this.onOpenCenter =
        onOpenCenter;

      this.index = 0;

      this.autoplay =
        autoplay &&
        !REDUCED_MOTION;

      this.paused = false;

      this.suppressClick =
        false;

      if (!this.el)
        return;

      this.el.setAttribute(
        'tabindex',
        '0'
      );

      this.el.setAttribute(
        'role',
        'region'
      );

      this.el.setAttribute(
        'aria-label',
        'Photo carousel'
      );

      this._build();

      this._bindPointer();

      this._bindWheel();

      this._bindKeys();

      this._render();

      if (this.autoplay)
        this._startAutoplay();
    }


    _build() {

      this.track =
        document.createElement(
          'div'
        );

      this.track.className =
        'cf-track';

      this.el.appendChild(
        this.track
      );

      this.cards =
        this.images.map(
          (src, i) => {

            const card =
              document.createElement(
                'div'
              );

            card.className =
              'cf-card';

            const img =
              document.createElement(
                'img'
              );

            img.src =
              src || '';

            img.alt =
              this.captions[i] ||
              'A memory';

            img.loading =
              'lazy';

            attachImageFallback(
              img,
              card
            );

            card.appendChild(
              img
            );

            card.addEventListener(
              'click',
              () =>
                this._handleCardClick(i)
            );

            this.track.appendChild(
              card
            );

            return card;
          }
        );
    }


    _render() {

      const n =
        this.cards.length;

      if (!n)
        return;

      const step =
        Math.max(
          90,
          this.el.clientWidth *
            0.26
        );

      this.cards.forEach(
        (card, i) => {

          let offset =
            i - this.index;

          if (offset > n / 2)
            offset -= n;

          if (offset < -n / 2)
            offset += n;

          const abs =
            Math.abs(offset);

          card.classList.toggle(
            'is-center',
            offset === 0
          );

          if (abs > 2) {

            card.style.opacity =
              0;

            card.style.pointerEvents =
              'none';

            card.style.zIndex =
              0;

            card.style.transform =
              `translate(-50%,-50%) translateX(${offset * step * 1.4}px) scale(.3)`;

            return;
          }

          card.style.pointerEvents =
            'auto';

          const rot =
            offset === 0
              ? 0
              : (
                  offset > 0
                    ? -34
                    : 34
                );

          const scale =
            offset === 0
              ? 1
              : (
                  abs === 1
                    ? 0.78
                    : 0.55
                );

          const z =
            offset === 0
              ? 80
              : (
                  abs === 1
                    ? -50
                    : -140
                );

          const opacity =
            offset === 0
              ? 1
              : (
                  abs === 1
                    ? 0.68
                    : 0.32
                );

          card.style.zIndex =
            10 - abs;

          card.style.opacity =
            opacity;

          card.style.transform =
            `translate(-50%,-50%) translateX(${offset * step}px) translateZ(${z}px) rotateY(${rot}deg) scale(${scale})`;
        }
      );
    }


    _handleCardClick(i) {

      if (this.suppressClick) {

        this.suppressClick =
          false;

        return;
      }

      if (i === this.index) {

        if (this.onOpenCenter)
          this.onOpenCenter(
            this.index
          );

      } else {

        this.goTo(i);

      }

      this._resetAutoplay();
    }


    goTo(i) {

      const n =
        this.cards.length;

      if (!n)
        return;

      this.index =
        ((i % n) + n) % n;

      this._render();
    }


    next() {
      this.goTo(
        this.index + 1
      );
    }


    prev() {
      this.goTo(
        this.index - 1
      );
    }


    _bindPointer() {

      let startX = 0;
      let startY = 0;
      let dragging = false;
      let moved = false;

      this.el.addEventListener(
        'pointerdown',
        e => {

          dragging = true;

          moved = false;

          startX =
            e.clientX;

          startY =
            e.clientY;

          this.setPaused(true);
        }
      );


      this.el.addEventListener(
        'pointermove',
        e => {

          if (!dragging)
            return;

          const dx =
            e.clientX - startX;

          const dy =
            e.clientY - startY;

          if (
            Math.abs(dx) > 8 ||
            Math.abs(dy) > 8
          ) {

            moved = true;
          }
        }
      );


      const finish =
        e => {

          if (!dragging)
            return;

          dragging = false;

          const dx =
            (e.clientX ?? startX) -
            startX;

          if (
            Math.abs(dx) > 40
          ) {

            this.suppressClick =
              true;

            if (dx < 0)
              this.next();
            else
              this.prev();
          }

          this._resetAutoplay();

          this.setPaused(false);
        };


      this.el.addEventListener(
        'pointerup',
        finish
      );


      this.el.addEventListener(
        'pointerleave',
        () => {

          if (dragging) {

            dragging = false;

            this.setPaused(false);
          }

        }
      );
    }


    _bindWheel() {

      let lastWheel = 0;

      this.el.addEventListener(
        'wheel',
        e => {

          const now =
            Date.now();

          if (
            now - lastWheel <
            350
          )
            return;

          lastWheel = now;

          const delta =
            Math.abs(e.deltaX) >
            Math.abs(e.deltaY)
              ? e.deltaX
              : e.deltaY;

          if (delta > 15)
            this.next();

          else if (delta < -15)
            this.prev();

          this._resetAutoplay();
        },
        {
          passive: true
        }
      );
    }


    _bindKeys() {

      this.el.addEventListener(
        'keydown',
        e => {

          if (
            e.key ===
            'ArrowRight'
          ) {

            this.next();

            this._resetAutoplay();
          }

          if (
            e.key ===
            'ArrowLeft'
          ) {

            this.prev();

            this._resetAutoplay();
          }

          if (
            e.key === 'Enter' ||
            e.key === ' '
          ) {

            this._handleCardClick(
              this.index
            );
          }
        }
      );
    }


    setPaused(v) {
      this.paused = v;
    }


    _startAutoplay() {

      this._timer =
        setInterval(
          () => {

            if (
              !this.paused &&
              document.visibilityState ===
                'visible'
            ) {

              this.next();
            }

          },
          4000
        );
    }


    _resetAutoplay() {

      if (!this.autoplay)
        return;

      clearInterval(
        this._timer
      );

      this._startAutoplay();
    }
  }


  /* =========================================================
     6. STORY VIEWER
  ========================================================= */

  class StoryViewer {

    constructor(rootEl) {

      this.root =
        rootEl;

      if (!this.root)
        return;

      this.images = [];

      this.captions = [];

      this.index = 0;

      this.duration = 5000;

      this._buildDom();

      this._keyHandler =
        e => {

          if (
            !this.root.classList.contains(
              'open'
            )
          )
            return;

          if (e.key === 'Escape')
            this.close();

          if (
            e.key ===
            'ArrowRight'
          )
            this.next();

          if (
            e.key ===
            'ArrowLeft'
          )
            this.prev();
        };

      document.addEventListener(
        'keydown',
        this._keyHandler
      );
    }


    _buildDom() {

      this.root.innerHTML = `

        <div
          class="story-bars"
          id="story-bars">
        </div>

        <button
          class="story-close"
          aria-label="Close">
          ×
        </button>

        <div class="story-stage">

          <div class="story-img-wrap">
            <img alt="">
          </div>

          <div class="story-nav">

            <button
              aria-label="Previous">
            </button>

            <button
              aria-label="Next">
            </button>

          </div>

          <div class="story-caption">
          </div>

        </div>
      `;


      this.barsEl =
        this.root.querySelector(
          '#story-bars'
        );

      this.imgEl =
        this.root.querySelector(
          '.story-img-wrap img'
        );

      this.imgWrap =
        this.root.querySelector(
          '.story-img-wrap'
        );

      this.captionEl =
        this.root.querySelector(
          '.story-caption'
        );


      this.root
        .querySelector(
          '.story-close'
        )
        .addEventListener(
          'click',
          () => this.close()
        );


      const [
        prevBtn,
        nextBtn
      ] =
        this.root.querySelectorAll(
          '.story-nav button'
        );


      prevBtn.addEventListener(
        'click',
        () => this.prev()
      );

      nextBtn.addEventListener(
        'click',
        () => this.next()
      );
    }


    open(
      images,
      captions,
      startIndex = 0
    ) {

      this.images =
        images || [];

      this.captions =
        captions || [];

      this.index =
        startIndex;

      this.barsEl.innerHTML =
        this.images
          .map(
            () =>
              `<div class="bar"><i></i></div>`
          )
          .join('');

      this.bars =
        [
          ...this.barsEl.children
        ];

      this._show(
        this.index
      );

      this.root.classList.add(
        'open'
      );
    }


    close() {

      this.root.classList.remove(
        'open'
      );

      clearTimeout(
        this._timer
      );
    }


    _show(i) {

      clearTimeout(
        this._timer
      );

      if (
        !this.images.length
      )
        return;


      this.bars.forEach(
        (b, idx) => {

          b.classList.toggle(
            'done',
            idx < i
          );

          b.classList.toggle(
            'active',
            idx === i
          );

          const bar =
            b.querySelector('i');

          bar.style.animation =
            'none';

          bar.offsetHeight;

          bar.style.animation =
            '';
        }
      );


      const activeBar =
        this.bars[i]
          ?.querySelector('i');


      if (
        activeBar &&
        !REDUCED_MOTION
      ) {

        activeBar.style.animationDuration =
          this.duration + 'ms';

        activeBar.style.animationName =
          'storyfill';

        activeBar.style.animationTimingFunction =
          'linear';

        activeBar.style.animationFillMode =
          'forwards';

      } else if (activeBar) {

        activeBar.style.width =
          '100%';
      }


      this.imgWrap.innerHTML =
        '<img alt="">';


      const img =
        this.imgWrap.querySelector(
          'img'
        );


      img.src =
        this.images[i] || '';

      img.alt =
        this.captions[i] ||
        'A memory';


      attachImageFallback(
        img,
        this.imgWrap
      );


      this.captionEl.textContent =
        this.captions[i] ||
        '';


      this._timer =
        setTimeout(
          () => this.next(),
          this.duration
        );
    }


    next() {

      if (
        this.index >=
        this.images.length - 1
      ) {

        this.close();

        return;
      }

      this.index++;

      this._show(
        this.index
      );
    }


    prev() {

      if (this.index <= 0)
        return;

      this.index--;

      this._show(
        this.index
      );
    }
  }


  /* =========================================================
     7. GIFT ANIMATION
  ========================================================= */

  function initGiftChapter(
    particleSystem
  ) {

    const seqLines =
      document.querySelectorAll(
        '#gift-text-seq p'
      );

    const giftBox =
      document.getElementById(
        'gift-box'
      );

    const flyLayer =
      document.getElementById(
        'flying-photos'
      );

    const hint =
      document.getElementById(
        'gift-hint'
      );

    const continueBtn =
      document.getElementById(
        'gift-continue'
      );

    if (
      !giftBox ||
      !flyLayer
    )
      return;


    let opened = false;


    /*
       SUPABASE PHOTO PATHS
    */

    const flyImages = [

      'W1.jpg','O1.jpg',

      'M1.jpg','W4.jpg',

      'S1.jpg','M5.jpg',

      'M2.jpg','S5.jpg',

      'S2.jpg','S6.jpg'

    ];


    const delays = [

      0,

      200,

      400,

      700,

      1000,

      1300,

      1700,

      2000,

      2300,

      2600

    ];


    document.addEventListener(
      'chapter:enter',
      e => {

        if (
          e.detail.id !==
          'gift'
        )
          return;


        opened = false;


        seqLines.forEach(
          p =>
            p.classList.remove(
              'shown'
            )
        );


        giftBox.classList.remove(
          'shown'
        );

        giftBox.classList.remove(
          'open'
        );

        giftBox.classList.remove(
          'shake'
        );


        if (hint)
          hint.style.opacity =
            '';


        setTimeout(
          () =>
            stagger(
              [...seqLines],
              300,
              900
            ),
          50
        );


        setTimeout(
          () =>
            giftBox.classList.add(
              'shown'
            ),
          300 +
            seqLines.length *
              900 +
            200
        );

      }
    );


    giftBox.addEventListener(
      'click',
      () => {

        if (opened)
          return;

        opened = true;


        if (hint)
          hint.style.opacity =
            '0';


        giftBox.classList.add(
          'shake'
        );


        setTimeout(
          () => {

            giftBox.classList.remove(
              'shake'
            );

            giftBox.classList.add(
              'open'
            );


            const r =
              giftBox.getBoundingClientRect();


            if (particleSystem) {

              particleSystem.burst(
                r.left +
                  r.width / 2,

                r.top +
                  r.height / 2,

                46
              );
            }


            flyPhotos();

          },
          REDUCED_MOTION
            ? 50
            : 1500
        );

      }
    );


    async function flyPhotos() {

      flyImages.forEach(
        (src, i) => {

          const delay =
            REDUCED_MOTION
              ? 0
              : (
                  delays[i] ??
                  i * 200
                );


          setTimeout(
            async () => {

              const el =
                document.createElement(
                  'div'
                );

              el.className =
                'flying-photo';


              const img =
                document.createElement(
                  'img'
                );


              img.alt =
                'A memory';


              /*
                 GET SUPABASE URL
              */

              const photoUrl =
                await getPhotoUrl(
                  src
                );


              if (photoUrl) {

                img.src =
                  photoUrl;

              } else {

                console.error(
                  'Could not load gift photo:',
                  src
                );

              }


              attachImageFallback(
                img,
                el
              );


              el.appendChild(
                img
              );

              flyLayer.appendChild(
                el
              );


              const angle =
                Math.random() *
                Math.PI *
                2;


              const dist =
                180;
                Math.random() *
                  160;


              const dx =
                Math.cos(angle) *
                dist *
                (
                  window.innerWidth /
                  700
                );


              const dy =
                Math.sin(angle) *
                  dist *
                  0.7 -
                40;


              const rot =
                (
                  Math.random() -
                  0.5
                ) *
                70;


              const scale =
                0.7 +
                Math.random() *
                  0.5;


              requestAnimationFrame(
                () => {

                  el.style.opacity =
                    '1';

                  el.style.transform =
                    `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot}deg) scale(${scale})`;

                }
              );


              if (
                particleSystem &&
                i % 2 === 0
              ) {

                particleSystem.burst(
                  window.innerWidth /
                    2 +
                    dx * 0.3,

                  window.innerHeight /
                    2 +
                    dy * 0.3,

                  6
                );
              }

            },
            delay
          );

        }
      );


      const totalTime =
        REDUCED_MOTION
          ? 400
          : (
              delays[
                delays.length - 1
              ] + 1600
            );


      if (continueBtn) {

        setTimeout(
          () =>
            continueBtn.classList.add(
              'shown'
            ),
          totalTime
        );
      }
    }
  }


  /* =========================================================
     7b. PICK A GIFT
  ========================================================= */

  function initPickGiftChapter(
    particleSystem
  ) {

    const boxes = [
      ...document.querySelectorAll(
        '.mini-gift'
      )
    ];

    const hint =
      document.getElementById(
        'pick-gift-hint'
      );

    const revealWrap =
      document.getElementById(
        'pick-gift-reveal'
      );

    const frame =
      document.getElementById(
        'pick-gift-frame'
      );

    const img =
      document.getElementById(
        'pick-gift-img'
      );

    const msg =
      document.getElementById(
        'pick-gift-msg'
      );

    const continueBtn =
      document.getElementById(
        'pickgift-continue'
      );


    if (!boxes.length)
      return;


    let chosen = false;


    document.addEventListener(
      'chapter:enter',
      e => {

        if (
          e.detail.id !==
          'pickgift'
        )
          return;


        chosen = false;


        boxes.forEach(
          b => {

            b.classList.remove(
              'locked',
              'open',
              'shake'
            );

          }
        );


        if (hint)
          hint.style.opacity =
            '';


        if (revealWrap)
          revealWrap.classList.remove(
            'shown'
          );

        if (frame)
          frame.classList.remove(
            'shown'
          );

        if (msg)
          msg.classList.remove(
            'shown'
          );

        if (continueBtn)
          continueBtn.classList.remove(
            'shown'
          );

      }
    );


    async function pick(box) {

      if (chosen)
        return;

      chosen = true;


      const n =
        box.dataset.gift;


      if (hint)
        hint.style.opacity =
          '0';


      boxes.forEach(
        b => {

          if (b !== box)
            b.classList.add(
              'locked'
            );

        }
      );


      box.classList.add(
        'shake'
      );


      setTimeout(
        () => {

          box.classList.remove(
            'shake'
          );

          box.classList.add(
            'open'
          );


          const r =
            box.getBoundingClientRect();


          if (particleSystem) {

            particleSystem.burst(
              r.left +
                r.width / 2,

              r.top +
                r.height / 2,

              40
            );
          }


          setTimeout(
            async () => {

              if (
                img &&
                frame
              ) {

                attachImageFallback(
                  img,
                  frame
                );


                const giftUrl =
                  await getPhotoUrl(
                    `G${n}.jpg`
                  );


                if (giftUrl) {

                  img.src =
                    giftUrl;

                } else {

                  console.error(
                    'Gift image not found:',
                    `G${n}.jpg`
                  );

                }

              }


              if (revealWrap)
                revealWrap.classList.add(
                  'shown'
                );


              if (frame)
                frame.classList.add(
                  'shown'
                );


              if (msg) {

                setTimeout(
                  () =>
                    msg.classList.add(
                      'shown'
                    ),
                  500
                );

              }


              if (continueBtn) {

                setTimeout(
                  () =>
                    continueBtn.classList.add(
                      'shown'
                    ),
                  1400
                );

              }

            },
            REDUCED_MOTION
              ? 50
              : 500
          );

        },
        REDUCED_MOTION
          ? 50
          : 1500
      );
    }


    boxes.forEach(
      box => {

        box.addEventListener(
          'click',
          () => pick(box)
        );


        box.addEventListener(
          'keydown',
          e => {

            if (
              e.key === 'Enter' ||
              e.key === ' '
            ) {

              e.preventDefault();

              pick(box);

            }

          }
        );

      }
    );
  }


  /* =========================================================
     8. FINAL SURPRISE
  ========================================================= */

  function initFinalSurprise(
    particleSystem
  ) {

    const btn =
      document.getElementById(
        'final-surprise-btn'
      );

    const frame =
      document.getElementById(
        'surprise-frame'
      );

    const msg =
      document.getElementById(
        'surprise-msg'
      );


    if (!btn)
      return;


    btn.addEventListener(
      'click',
      () => {

        if (frame) {

          frame.classList.add(
            'shown'
          );

        }


        if (msg) {

          setTimeout(
            () =>
              msg.classList.add(
                'shown'
              ),
            500
          );

        }


        const r =
          btn.getBoundingClientRect();


        if (particleSystem) {

          particleSystem.burst(
            r.left +
              r.width / 2,

            r.top,

            24
          );
        }


        btn.style.display =
          'none';

      }
    );
  }


  /* =========================================================
     INIT
  ========================================================= */

  document.addEventListener(
    'DOMContentLoaded',
    async () => {


      /* =========================
         NAVIGATION
      ========================= */

      const chapterOrder = [

        'intro',

        'letter',

        'wishes',

        'memories',

        'special',

        'more',

        'gift',

        'pickgift',

        'final'

      ];


      window.nav =
        new Navigator(
          chapterOrder
        );


      /* =========================
         PARTICLES
      ========================= */

      const particleCanvas =
        document.getElementById(
          'particle-canvas'
        );


      const particles =
        new ParticleSystem(
          particleCanvas
        );




      /* =========================
         SCRATCH LETTER
      ========================= */

      const envelope =
        document.getElementById(
          'envelope'
        );

      const scratchCanvas =
        document.getElementById(
          'scratch-canvas'
        );

      const scratchHint =
        document.getElementById(
          'scratch-hint'
        );

      const letterPaper =
        document.getElementById(
          'letter-paper'
        );

      const letterContinue =
        document.getElementById(
          'letter-continue'
        );


      if (
        envelope &&
        scratchCanvas
      ) {

        new ScratchLetter(
          envelope,
          scratchCanvas,
          scratchHint,
          () => {

            envelope.classList.add(
              'opened'
            );


            if (particles) {

              particles.burst(
                window.innerWidth / 2,
                window.innerHeight / 2,
                20
              );

            }


            setTimeout(
              () => {

                if (letterPaper) {

                  letterPaper.classList.add(
                    'shown'
                  );


                  letterPaper
                    .querySelectorAll(
                      '.reveal-line'
                    )
                    .forEach(
                      l =>
                        l.classList.remove(
                          'shown'
                        )
                    );


                  stagger(
                    [
                      ...letterPaper.querySelectorAll(
                        '.reveal-line'
                      )
                    ],
                    200,
                    260
                  );

                }


                setTimeout(
                  () =>
                    letterContinue?.classList.add(
                      'shown'
                    ),
                  1800
                );

              },
              500
            );

          }
        );

      }


      if (envelope) {

        envelope.addEventListener(
          'dblclick',
          () => {}
        );

      }


      /* =========================
         STORY VIEWER
      ========================= */

      const storyRoot =
        document.getElementById(
          'story-viewer'
        );


      const storyViewer =
        new StoryViewer(
          storyRoot
        );


      /* =====================================================
         ALBUM 4 — OUR MEMORIES
         SUPABASE VERSION
      ===================================================== */

      const polaroids = [

        ...document.querySelectorAll(
          '#chapter-memories .polaroid'
        )

      ];


      const memoriesImages =
        await Promise.all(

          polaroids.map(
            async p => {

              const originalPath =
                p.dataset.img ||
                "";

              if (!originalPath) {

                console.warn(
                  'Missing data-img on polaroid:',
                  p
                );

                return "";

              }


              const filename =
                originalPath
                  .split('/')
                  .pop();


              if (!filename)
                return "";


              return await getPhotoUrl(filename);

            }
          )

        );


      const memoriesCaptions =
        polaroids.map(
          p =>
            p.dataset.caption ||
            'A memory'
        );


      polaroids.forEach(
        (p, i) => {

          const img =
            p.querySelector(
              'img'
            );


          if (
            img &&
            memoriesImages[i]
          ) {

            p.dataset.img =
              memoriesImages[i];

            img.src =
              memoriesImages[i];


            img.onerror =
              () => {

                console.error(
                  "Failed to load album4 image:",
                  memoriesImages[i]
                );

              };

          }


          const deg =
            (
              Math.random() *
                6 -
              3
            ).toFixed(2);


          p.style.transform =
            `rotate(${deg}deg)`;


          p.style.cursor =
            'pointer';


          p.setAttribute(
            'role',
            'button'
          );


          p.setAttribute(
            'tabindex',
            '0'
          );


          p.setAttribute(
            'aria-label',
            `Open photo: ${memoriesCaptions[i]}`
          );


          const openThis =
            () =>
              storyViewer.open(
                memoriesImages,
                memoriesCaptions,
                i
              );


          p.addEventListener(
            'click',
            openThis
          );


          p.addEventListener(
            'keydown',
            e => {

              if (
                e.key ===
                  'Enter' ||
                e.key === ' '
              ) {

                e.preventDefault();

                openThis();

              }

            }
          );

        }
      );


      /* =====================================================
         WISHES CAROUSEL — ALBUM 1
      ===================================================== */

      const wishesImages =
        await Promise.all([

          getPhotoUrl(
            "W1.jpg"
          ),

          getPhotoUrl(
            "W2.jpg"
          ),

          getPhotoUrl(
            "W3.jpg"
          ),

          getPhotoUrl(
            "W4.jpg"
          ),

          getPhotoUrl(
            "W5.jpg"
          )

        ]);


      const wishesCaptions = [

        'A wish made for you.',

        'This one always makes me smile.',

        'Here’s to another year.'

      ];


      new CoverflowCarousel(

        document.getElementById(
          'wishes-carousel'
        ),

        wishesImages,

        {

          captions:
            wishesCaptions,

          onOpenCenter:
            i =>
              storyViewer.open(
                wishesImages,
                wishesCaptions,
                i
              )

        }

      );


      /* =====================================================
         SPECIAL MEMORIES — ALBUM 2
      ===================================================== */

      const specialImages =
        await Promise.all([

          getPhotoUrl(
            "S1.jpg"
          ),

          getPhotoUrl(
            "S2.jpg"
          ),

          getPhotoUrl(
            "S3.jpg"
          ),

          getPhotoUrl(
            "S4.jpg"
          ),

          getPhotoUrl(
            "S5.jpg"
          ),

          getPhotoUrl(
            "S6.jpg"
          ),

          getPhotoUrl(
            "S7.jpg"
          ),

          getPhotoUrl(
            "S8.jpg"
          ),

          getPhotoUrl(
            "S9.jpg"
          )

        ]);


      const specialCaptions =
        specialImages.map(
          () =>
            "A moment I'll always remember."
        );


      new CoverflowCarousel(

        document.getElementById(
          'special-carousel'
        ),

        specialImages,

        {

          captions:
            specialCaptions,

          onOpenCenter:
            i =>
              storyViewer.open(
                specialImages,
                specialCaptions,
                i
              )

        }

      );


      /* =====================================================
         MORE MEMORIES — ALBUM 3
      ===================================================== */

      const moreImages =
        await Promise.all([

          getPhotoUrl(
            "M1.jpg"
          ),

          getPhotoUrl(
            "M2.jpg"
          ),

          getPhotoUrl(
            "M3.jpg"
          ),

          getPhotoUrl(
            "M4.jpg"
          ),

          getPhotoUrl(
            "M5.jpg"
          ),

          getPhotoUrl(
            "M6.jpg"
          ),

          getPhotoUrl(
            "M7.jpg"
          ),

          getPhotoUrl(
            "M8.jpg"
          )

        ]);


      const moreCaptions = [

        '😂',

        '✨',

        '❤️',

        '😂',

        '🥹',

        '✨',

        '❤️',

        '😂'

      ];


      new CoverflowCarousel(

        document.getElementById(
          'more-carousel'
        ),

        moreImages,

        {

          captions:
            moreCaptions,

          onOpenCenter:
            i =>
              storyViewer.open(
                moreImages,
                moreCaptions,
                i
              )

        }

      );


      /* =========================
         GIFT CHAPTER
      ========================= */

      try {

        initGiftChapter(
          particles
        );

      } catch (err) {

        console.error(
          'Gift chapter failed to init:',
          err
        );

      }


      /* =========================
         PICK A GIFT
      ========================= */

      try {

        initPickGiftChapter(
          particles
        );

      } catch (err) {

        console.error(
          'Pick-a-gift chapter failed to init:',
          err
        );

      }


      /* =========================
         FINAL SURPRISE
      ========================= */

      try {

        initFinalSurprise(
          particles
        );

      } catch (err) {

        console.error(
          'Final surprise failed to init:',
          err
        );

      }


      /* =====================================================
         ALBUM 5 — FINAL SPECIAL PHOTO
      ===================================================== */

      const specialPhoto =
        document.querySelector(
          '#special-photo'
        );


      if (specialPhoto) {

        const specialUrl =
          await getPhotoUrl(
            "Special.jpg"
          );


        if (specialUrl) {

          specialPhoto.src =
            specialUrl;

        }

      }


      /* =========================
         INTRO → LETTER
         Already handled by
         data-next in HTML.
      ========================= */

    });


  /* ==========================================================
     HEARTS
  ========================================================== */

  function hearts() {

    for (
      let i = 0;
      i < 5;
      i++
    ) {

      const h =
        document.createElement(
          "div"
        );


      h.className =
        "heart";


      h.textContent =
        [
          "♥",
          "♡",
          "✨"
        ][
          Math.floor(
            Math.random() * 3
          )
        ];


      h.style.left =
        (
          10 +
          Math.random() *
            80
        ) + "%";


      h.style.fontSize =
        (
          13 +
          Math.random() *
            10
        ) + "px";


      document.body.appendChild(
        h
      );


      setTimeout(
        () => {
          h.remove();
        },
        5000
      );

    }
  }


})();