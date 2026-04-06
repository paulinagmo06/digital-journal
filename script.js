// JavaScript Document

/* QUOTES */
const quotes = [
    "You are allowed to slow down.",
    "This moment matters.",
    "You are safe here.",
    "Breathe. You're doing better than you think.",
    "Be honest with yourself."
];

/* MOODS */
let selectedMood = "";

/* AUDIO */
let audio = new Audio("music/floating_away.mp3");
audio.loop = true;
audio.volume = 0.5;

let isPlaying = false;
let fadeInterval;

/* INIT */
window.onload = function () {
    // quote
    document.getElementById("quote").innerText =
        quotes[Math.floor(Math.random() * quotes.length)];

    // mood selection
    document.querySelectorAll("#moods span").forEach(m => {
        m.onclick = () => {
            document.querySelectorAll("#moods span").forEach(x => x.classList.remove("selected"));
            m.classList.add("selected");
            selectedMood = m.textContent;
        };
    });

    displayEntries();

    // load saved background
    const savedBg = localStorage.getItem("bg");
    if (savedBg) {
        document.body.style.backgroundImage = `url('${savedBg}')`;
    }

    // load sound
    const savedSound = localStorage.getItem("sound");
    if (savedSound) {
        audio = new Audio(savedSound);
        audio.loop = true;
        audio.volume = 0.5;
    }
};

/* SAVE ENTRY */
function saveEntry() {
    const data = {
        date: document.getElementById("date").value,
        mood: selectedMood,
        gratitude: document.getElementById("gratitude").value,
        entry: document.getElementById("entry").value
    };

    let entries = JSON.parse(localStorage.getItem("journal")) || [];
    entries.push(data);
    localStorage.setItem("journal", JSON.stringify(entries));

    displayEntries();
}

/* DISPLAY */
function displayEntries() {
    const container = document.getElementById("entries");
    container.innerHTML = "";

    const entries = JSON.parse(localStorage.getItem("journal")) || [];

    entries.reverse().forEach(e => {
        const div = document.createElement("div");
        div.classList.add("entry");

        div.innerHTML = `
            <strong>${e.date}</strong> ${e.mood || ""}<br>
            <em>${e.gratitude}</em>
            <p>${e.entry}</p>
        `;

        container.appendChild(div);
    });
}

/* BACKGROUND */
function changeBackground(bg) {
    document.body.style.backgroundImage = `url('${bg}')`;
    localStorage.setItem("bg", bg);
}

/* SOUND */
function toggleSound() {
    const btn = document.getElementById("soundBtn");

    if (!isPlaying) {
        fadeIn();
        btn.innerText = "pause";
    } else {
        fadeOut();
        btn.innerText = "play";
    }

    isPlaying = !isPlaying;
}

function changeSound(src) {
    fadeOut(() => {
        audio = new Audio(src);
        audio.loop = true;
        audio.volume = 0;
        fadeIn();
        localStorage.setItem("sound", src);
    });
}

function setVolume(val) {
    audio.volume = val;
}

/* FADE IN */
function fadeIn() {
    audio.volume = 0;
    audio.play();

    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (audio.volume < 0.5) {
            audio.volume += 0.02;
        } else {
            clearInterval(fadeInterval);
        }
    }, 100);
}

/* FADE OUT */
function fadeOut(callback) {
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (audio.volume > 0.02) {
            audio.volume -= 0.02;
        } else {
            clearInterval(fadeInterval);
            audio.pause();
            if (callback) callback();
        }
    }, 100);
}