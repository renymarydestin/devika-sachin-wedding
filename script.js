/* =========================================================
   DEVIKA & SACHIN — LUXURY INVITATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const envelope = document.getElementById("envelope");
  const openSeal = document.getElementById("openSeal");
  const openLabel = document.getElementById("openLabel");
  const invitation = document.getElementById("invitation");
  const petals = document.getElementById("petals");

  const musicButton = document.getElementById("musicButton");
  const musicText = document.getElementById("musicText");
  const youtubeFrame = document.getElementById("youtubePlayer");

  let player = null;
  let musicReady = false;
  let playing = false;

  /* ---------- opening ---------- */

  function openInvitation() {
    if (intro.classList.contains("opened")) return;

    envelope.classList.add("opened");

    setTimeout(() => {
      intro.classList.add("opened");
      invitation.setAttribute("aria-hidden", "false");
      createPetals();
      tryPlayMusic();
    }, 650);
  }

  openSeal.addEventListener("click", openInvitation);
  openLabel.addEventListener("click", openInvitation);

  /* ---------- petals ---------- */

  function createPetals() {
    if (petals.dataset.started === "true") return;
    petals.dataset.started = "true";

    const count = window.innerWidth < 680 ? 22 : 38;

    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "petal";
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${6 + Math.random() * 7}s`;
      p.style.animationDelay = `${Math.random() * 6}s`;
      p.style.transform = `rotate(${Math.random() * 180}deg)`;
      p.style.width = `${6 + Math.random() * 6}px`;
      p.style.height = `${9 + Math.random() * 8}px`;
      petals.appendChild(p);
    }
  }

  /* ---------- YouTube music ---------- */

  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = initPlayer;
  }

  function initPlayer() {
    if (player || !youtubeFrame) return;

    player = new YT.Player("youtubePlayer", {
      events: {
        onReady: () => {
          musicReady = true;
          updateMusicButton();
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) playing = true;
          if (
            event.data === YT.PlayerState.PAUSED ||
            event.data === YT.PlayerState.ENDED
          ) playing = false;
          updateMusicButton();
        }
      }
    });
  }

  function tryPlayMusic() {
    if (!player || !musicReady) return;

    try {
      player.playVideo();
      playing = true;
      updateMusicButton();
    } catch (e) {
      // Browser/YouTube autoplay rules can block this.
    }
  }

  function toggleMusic() {
    if (!player || !musicReady) return;

    if (playing) {
      player.pauseVideo();
      playing = false;
    } else {
      player.playVideo();
      playing = true;
    }

    updateMusicButton();
  }

  function updateMusicButton() {
    musicText.textContent = playing ? "pause music" : "play music";
    musicButton.setAttribute(
      "aria-label",
      playing ? "Pause music" : "Play music"
    );
  }

  musicButton.addEventListener("click", () => {
    if (!player) {
      loadYouTubeAPI();
      setTimeout(toggleMusic, 900);
      return;
    }

    toggleMusic();
  });

  loadYouTubeAPI();

  /* ---------- countdown ---------- */

  const target = new Date("2026-12-23T11:28:00+05:30").getTime();

  function updateCountdown() {
    const distance = target - Date.now();

    const days = Math.max(0, Math.floor(distance / 86400000));
    const hours = Math.max(0, Math.floor((distance / 3600000) % 24));
    const minutes = Math.max(0, Math.floor((distance / 60000) % 60));
    const seconds = Math.max(0, Math.floor((distance / 1000) % 60));

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- save date ---------- */

  document.getElementById("saveDateButton").addEventListener("click", () => {
    const start = "20261223T112800";
    const end = "20261223T120500";

    const url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent("Devika & Sachin — Wedding Ceremony") +
      "&dates=" + start + "/" + end +
      "&details=" + encodeURIComponent("Muhurtham: 11:28 AM – 12:05 PM") +
      "&location=" + encodeURIComponent("Hajimus Convention Centre, Taliparamba, Kannur, Kerala");

    window.open(url, "_blank", "noopener");
  });

  /* ---------- share ---------- */

  document.getElementById("shareButton").addEventListener("click", async () => {
    const shareData = {
      title: "Devika & Sachin — Wedding Invitation",
      text: "Join us for our wedding on 23 December 2026.",
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        const button = document.getElementById("shareButton");
        const original = button.textContent;
        button.textContent = "Link copied ✓";
        setTimeout(() => button.textContent = original, 1600);
      }
    } catch (e) {
      // User cancelled the native share dialog.
    }
  });

  /* ---------- scroll reveals ---------- */

  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
});
