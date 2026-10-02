/* =========================================================
   DEVIKA & SACHIN — WEDDING INVITATION
   Fresh JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const envelope = document.getElementById("envelope");
  const openSeal = document.getElementById("openSeal");
  const openLabel = document.getElementById("openLabel");
  const invitation = document.getElementById("invitation");
  const petalsContainer = document.getElementById("petals");

  const musicButton = document.getElementById("musicButton");
  const musicText = document.getElementById("musicText");
  const youtubeFrame = document.getElementById("youtubePlayer");

  let player = null;
  let musicReady = false;
  let isPlaying = false;

  /* ===================== OPEN INVITATION ===================== */

  function openInvitation() {
    if (intro.classList.contains("opened")) return;

    envelope.classList.add("opened");

    // Let the envelope animation begin before moving the cover away.
    setTimeout(() => {
      intro.classList.add("opened");
      invitation.setAttribute("aria-hidden", "false");
      createPetals();

      // Try to start the selected song after the user's tap.
      playMusic();
    }, 550);
  }

  openSeal.addEventListener("click", openInvitation);
  openLabel.addEventListener("click", openInvitation);

  /* ===================== FALLING PETALS ===================== */

  function createPetals() {
    if (!petalsContainer || petalsContainer.dataset.started === "true") return;

    petalsContainer.dataset.started = "true";

    const count = window.innerWidth < 650 ? 22 : 38;

    for (let i = 0; i < count; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";

      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${6 + Math.random() * 7}s`;
      petal.style.animationDelay = `${Math.random() * 7}s`;
      petal.style.transform = `rotate(${Math.random() * 180}deg)`;
      petal.style.width = `${6 + Math.random() * 7}px`;
      petal.style.height = `${10 + Math.random() * 9}px`;

      petalsContainer.appendChild(petal);
    }
  }

  /* ===================== YOUTUBE MUSIC ===================== */

  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      initialiseYouTubePlayer();
      return;
    }

    const existing = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    );

    if (!existing) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    const oldCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      if (typeof oldCallback === "function") oldCallback();
      initialiseYouTubePlayer();
    };
  }

  function initialiseYouTubePlayer() {
    if (player || !youtubeFrame) return;

    player = new YT.Player("youtubePlayer", {
      events: {
        onReady: () => {
          musicReady = true;
          updateMusicButton();
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            isPlaying = true;
          }

          if (
            event.data === YT.PlayerState.PAUSED ||
            event.data === YT.PlayerState.ENDED
          ) {
            isPlaying = false;
          }

          updateMusicButton();
        }
      }
    });
  }

  function playMusic() {
    if (!player || !musicReady) return;

    try {
      player.playVideo();
      isPlaying = true;
      updateMusicButton();
    } catch (error) {
      console.log("Music could not start automatically.", error);
    }
  }

  function toggleMusic() {
    if (!player || !musicReady) return;

    if (isPlaying) {
      player.pauseVideo();
      isPlaying = false;
    } else {
      player.playVideo();
      isPlaying = true;
    }

    updateMusicButton();
  }

  function updateMusicButton() {
    if (!musicButton || !musicText) return;

    musicButton.classList.toggle("paused", !isPlaying);
    musicText.textContent = isPlaying ? "pause music" : "play music";
    musicButton.setAttribute(
      "aria-label",
      isPlaying ? "Pause music" : "Play music"
    );
  }

  musicButton.addEventListener("click", () => {
    if (!player) {
      loadYouTubeAPI();
      setTimeout(toggleMusic, 800);
      return;
    }

    toggleMusic();
  });

  loadYouTubeAPI();

  /* ===================== COUNTDOWN ===================== */

  const targetDate = new Date("2026-12-23T11:28:00+05:30").getTime();

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {
    const now = Date.now();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance / (1000 * 60 * 60)) % 24
    );
    const minutes = Math.floor(
      (distance / (1000 * 60)) % 60
    );
    const seconds = Math.floor(
      (distance / 1000) % 60
    );

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ===================== SCROLL REVEALS ===================== */

  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => observer.observe(element));
});
