const intro = document.getElementById("intro");
const envelope = document.getElementById("envelope");
const openSeal = document.getElementById("openSeal");
const openLabel = document.getElementById("openLabel");
const invitation = document.getElementById("invitation");
const petals = document.getElementById("petals");

const musicButton = document.getElementById("musicButton");
const musicText = document.getElementById("musicText");
const weddingMusic = document.getElementById("weddingMusic");

let opened = false;
let musicAvailable = true;

function createPetals() {
  if (!petals) return;

  const colors = ["#b65a65", "#c47a82", "#8b9770", "#a8ad89", "#d6b56c"];
  const count = window.innerWidth < 600 ? 22 : 34;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";

    const size = 5 + Math.random() * 8;
    const x = Math.random() * 100;
    const duration = 9 + Math.random() * 10;
    const delay = -Math.random() * duration;
    const drift1 = `${-45 + Math.random() * 90}px`;
    const drift2 = `${-70 + Math.random() * 140}px`;
    const rotation = Math.random() * 360;
    const opacity = .3 + Math.random() * .45;

    petal.style.setProperty("--size", `${size}px`);
    petal.style.setProperty("--x", `${x}%`);
    petal.style.setProperty("--duration", `${duration}s`);
    petal.style.setProperty("--delay", `${delay}s`);
    petal.style.setProperty("--drift1", drift1);
    petal.style.setProperty("--drift2", drift2);
    petal.style.setProperty("--start-rotation", `${rotation}deg`);
    petal.style.setProperty("--opacity", opacity);
    petal.style.setProperty(
      "--petal-color",
      colors[Math.floor(Math.random() * colors.length)]
    );

    petals.appendChild(petal);
  }
}

function revealSections() {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.14 }
  );

  elements.forEach((element) => observer.observe(element));
}

function openInvitation() {
  if (opened) return;
  opened = true;

  envelope.classList.add("opening");

  setTimeout(() => {
    invitation.setAttribute("aria-hidden", "false");
    intro.classList.add("opened");
    document.body.classList.add("invitation-open");
    createPetals();
    revealSections();

    // Browsers allow audio after the user has interacted with the page.
    playMusic();
  }, 850);
}

async function playMusic() {
  if (!weddingMusic) return;

  try {
    await weddingMusic.play();
    musicButton.classList.remove("paused");
    musicText.textContent = "music on";
  } catch (error) {
    // music.mp3 may not exist yet, or the browser may block it.
    musicAvailable = false;
    musicButton.classList.add("paused");
    musicText.textContent = "music";
  }
}

function toggleMusic() {
  if (!musicAvailable) {
    musicText.textContent = "add music.mp3";
    setTimeout(() => {
      musicText.textContent = "music";
    }, 1800);
    return;
  }

  if (weddingMusic.paused) {
    playMusic();
  } else {
    weddingMusic.pause();
    musicButton.classList.add("paused");
    musicText.textContent = "music off";
  }
}

openSeal.addEventListener("click", openInvitation);
openLabel.addEventListener("click", openInvitation);
musicButton.addEventListener("click", toggleMusic);

// Countdown to the muhurtham: 23 Dec 2026, 11:28 AM.
// The timezone is the visitor's local timezone so the countdown remains
// consistent for guests viewing the invitation from different locations.
const weddingDate = new Date("2026-12-23T11:28:00");

function updateCountdown() {
  const now = new Date();
  const difference = weddingDate.getTime() - now.getTime();

  const values = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  if (difference > 0) {
    values.days = Math.floor(difference / (1000 * 60 * 60 * 24));
    values.hours = Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    );
    values.minutes = Math.floor(
      (difference / (1000 * 60)) % 60
    );
    values.seconds = Math.floor(
      (difference / 1000) % 60
    );
  }

  document.getElementById("days").textContent = String(values.days).padStart(2, "0");
  document.getElementById("hours").textContent = String(values.hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(values.minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(values.seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
