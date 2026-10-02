const opening = document.getElementById("opening");
const invitation = document.getElementById("invitation");
const openButton = document.getElementById("openInvitation");

openButton.addEventListener("click", () => {
  opening.style.transition = "opacity .8s ease";
  opening.style.opacity = "0";

  setTimeout(() => {
    opening.style.display = "none";
    invitation.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, 800);
});

const weddingDate = new Date("2026-12-23T11:28:00+05:30").getTime();

function updateCountdown() {
  const now = Date.now();
  const difference = weddingDate - now;

  if (difference <= 0) {
    document.getElementById("days").textContent = "0";
    document.getElementById("hours").textContent = "0";
    document.getElementById("minutes").textContent = "0";
    document.getElementById("seconds").textContent = "0";
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
