let canvas;
let world;
let startscreen;
let gameStarted = false;
let keyboard = new Keyboard();
let backgroundMusic;

function init() {
    canvas = document.getElementById('canvas');
    backgroundMusic = new Audio('./audio/mexican-mariachi.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    document.getElementById('music-toggle').addEventListener('click', toggleMusic);
    document.getElementById('music-volume').addEventListener('input', (event) => {
        const volume = Number(event.target.value);
        backgroundMusic.volume = volume;
        document.getElementById('music-volume-value').textContent = `${Math.round(volume * 100)}%`;
    });
    //world = new World(canvas, keyboard);
}

function startGame() {
    if (gameStarted == false) {
        world = new World(canvas, keyboard);
        gameStarted = true;
        document.getElementById('start-screen').classList.add('display-none');
        playMusic();
    } else if (world && world.gameOver) {
        restartGame();
        document.getElementById('start-screen').classList.add('display-none');
        playMusic();
    }
}

function playMusic() {
    backgroundMusic.play().catch((error) => {
        console.error('Unable to play background music:', error);
    });
}

function toggleMusic() {
    backgroundMusic.muted = !backgroundMusic.muted;
    const musicToggle = document.getElementById('music-toggle');
    musicToggle.textContent = backgroundMusic.muted ? 'Unmute music' : 'Mute music';
    musicToggle.setAttribute('aria-pressed', backgroundMusic.muted);
}

function restartGame() {
    if (!world || !world.gameOver) return;
    keyboard = new Keyboard();
    world = new World(canvas, keyboard, true);
}

function goToMenu() {
    if (world) {
        world.gameOver = true;
        document.getElementById('start-screen').classList.remove('display-none');
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
}



window.addEventListener('keydown', (e) => {
    if (e.key == "ArrowRight") {
        keyboard.RIGHT = true;
    }

    if (e.key == "ArrowLeft") {
        keyboard.LEFT = true;
    }

    if (e.key == "ArrowUp") {
        keyboard.UP = true;
    }

    if (e.key == "ArrowDown") {
        keyboard.DOWN = true;
    }

    if (e.key == " ") {
        keyboard.SPACE = true;
    }

    if (e.key == "d") {
        keyboard.D = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key == "ArrowRight") {
        keyboard.RIGHT = false;
    }

    if (e.key == "ArrowLeft") {
        keyboard.LEFT = false;
    }

    if (e.key == "ArrowUp") {
        keyboard.UP = false;
    }

    if (e.key == "ArrowDown") {
        keyboard.DOWN = false;
    }

    if (e.key == " ") {
        keyboard.SPACE = false;
    }

    if (e.key == "d") {
        keyboard.D = false;
    }
});