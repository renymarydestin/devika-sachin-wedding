/* =========================================================
   DEVIKA & SACHIN — WEDDING INVITATION
   SCRIPT MATCHED TO CURRENT index.html
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const intro = document.getElementById("intro");
    const openSeal = document.getElementById("openSeal");
    const openLabel = document.getElementById("openLabel");

    const invitation = document.getElementById("invitation");

    const petalsContainer = document.getElementById("petals");

    const musicButton = document.getElementById("musicButton");
    const musicText = document.getElementById("musicText");
    const youtubePlayer = document.getElementById("youtubePlayer");

    let youtubeReady = false;
    let musicPlaying = false;


    /* =====================================================
       OPEN INVITATION
       ===================================================== */

    function openInvitation() {

        if (!intro) return;

        // Start opening animation
        intro.classList.add("opened");

        // Make invitation accessible
        if (invitation) {
            invitation.setAttribute("aria-hidden", "false");
        }

        // Create falling petals
        createPetals();

        // Start music after the user's tap
        startMusic();

        // Trigger reveal animation
        setTimeout(function () {
            revealVisibleSections();
        }, 500);
    }


    if (openSeal) {
        openSeal.addEventListener("click", openInvitation);
    }

    if (openLabel) {
        openLabel.addEventListener("click", openInvitation);
    }


    /* =====================================================
       YOUTUBE MUSIC
       ===================================================== */

    /*
       The iframe contains the official Pesamale YouTube video.

       We use the YouTube IFrame API to control it.
    */

    function loadYouTubeAPI() {

        if (window.YT && window.YT.Player) {
            createYouTubePlayer();
            return;
        }

        const tag = document.createElement("script");

        tag.src = "https://www.youtube.com/iframe_api";

        document.head.appendChild(tag);
    }


    window.onYouTubeIframeAPIReady = function () {
        createYouTubePlayer();
    };


    function createYouTubePlayer() {

        if (!youtubePlayer) return;

        if (youtubeReady) return;

        try {

            window.pesamalePlayer = new YT.Player(
                "youtubePlayer",
                {
                    events: {
                        onReady: function () {
                            youtubeReady = true;
                        }
                    }
                }
            );

        } catch (error) {
            console.log("YouTube player could not be created.");
        }
    }


    function startMusic() {

        if (!youtubeReady || !window.pesamalePlayer) {

            // The API may not have loaded yet.
            // Try again shortly.
            setTimeout(function () {
                if (youtubeReady && window.pesamalePlayer) {
                    startMusic();
                }
            }, 1000);

            return;
        }

        try {

            window.pesamalePlayer.playVideo();

            musicPlaying = true;

            updateMusicButton();

        } catch (error) {

            console.log("Music could not be started.");

        }
    }


    function stopMusic() {

        if (
            !youtubeReady ||
            !window.pesamalePlayer
        ) {
            return;
        }

        try {

            window.pesamalePlayer.pauseVideo();

            musicPlaying = false;

            updateMusicButton();

        } catch (error) {

            console.log("Music could not be paused.");

        }
    }


    function updateMusicButton() {

        if (!musicButton || !musicText) return;

        if (musicPlaying) {

            musicText.textContent = "music on";

            musicButton.classList.add("playing");

            musicButton.setAttribute(
                "aria-label",
                "Pause music"
            );

        } else {

            musicText.textContent = "play music";

            musicButton.classList.remove("playing");

            musicButton.setAttribute(
                "aria-label",
                "Play music"
            );
        }
    }


    if (musicButton) {

        musicButton.addEventListener("click", function () {

            if (musicPlaying) {

                stopMusic();

            } else {

                startMusic();

            }

        });

    }


    // Load YouTube API immediately
    loadYouTubeAPI();


    /* =====================================================
       FALLING PETALS
       ===================================================== */

    function createPetals() {

        if (!petalsContainer) return;

        // Prevent duplicate petals
        if (
            petalsContainer.dataset.created === "true"
        ) {
            return;
        }

        petalsContainer.dataset.created = "true";

        const numberOfPetals = 30;

        for (let i = 0; i < numberOfPetals; i++) {

            const petal =
                document.createElement("span");

            petal.classList.add("petal");

            // Random starting position
            petal.style.left =
                Math.random() * 100 + "%";

            // Random delay
            petal.style.animationDelay =
                Math.random() * 9 + "s";

            // Random falling speed
            petal.style.animationDuration =
                7 + Math.random() * 7 + "s";

            // Random size
            const size =
                5 + Math.random() * 5;

            petal.style.width =
                size + "px";

            petal.style.height =
                size * 1.5 + "px";

            // Random starting rotation
            petal.style.transform =
                "rotate(" +
                Math.random() * 360 +
                "deg)";

            petalsContainer.appendChild(petal);
        }
    }


    /* =====================================================
       COUNTDOWN
       ===================================================== */

    /*
       Wedding:
       23 December 2026
       Muhurtham:
       11:28 AM
       India Standard Time (+05:30)
    */

    const weddingDate =
        new Date(
            "2026-12-23T11:28:00+05:30"
        ).getTime();


    function updateCountdown() {

        const now =
            new Date().getTime();

        const difference =
            weddingDate - now;

        const days =
            document.getElementById("days");

        const hours =
            document.getElementById("hours");

        const minutes =
            document.getElementById("minutes");

        const seconds =
            document.getElementById("seconds");


        if (
            !days ||
            !hours ||
            !minutes ||
            !seconds
        ) {
            return;
        }


        // Wedding time has arrived
        if (difference <= 0) {

            days.textContent = "00";
            hours.textContent = "00";
            minutes.textContent = "00";
            seconds.textContent = "00";

            return;
        }


        const dayValue =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        const hourValue =
            Math.floor(
                (difference /
                    (1000 * 60 * 60)) % 24
            );


        const minuteValue =
            Math.floor(
                (difference /
                    (1000 * 60)) % 60
            );


        const secondValue =
            Math.floor(
                (difference / 1000) % 60
            );


        days.textContent =
            String(dayValue).padStart(2, "0");

        hours.textContent =
            String(hourValue).padStart(2, "0");

        minutes.textContent =
            String(minuteValue).padStart(2, "0");

        seconds.textContent =
            String(secondValue).padStart(2, "0");
    }


    updateCountdown();

    setInterval(
        updateCountdown,
        1000
    );


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    function revealVisibleSections() {

        revealElements.forEach(function (element) {

            const rect =
                element.getBoundingClientRect();

            const visible =
                rect.top <
                window.innerHeight * 0.9;

            if (visible) {
                element.classList.add("visible");
            }

        });
    }


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            function (element) {
                observer.observe(element);
            }
        );

    } else {

        revealElements.forEach(
            function (element) {
                element.classList.add("visible");
            }
        );

    }


    /* =====================================================
       SMOOTH SCROLL
       ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* =====================================================
       INITIAL STATE
       ===================================================== */

    if (invitation) {
        invitation.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    updateMusicButton();

});
