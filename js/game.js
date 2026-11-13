let canvas;
let world;
let startscreen;
let gameStarted = false;
let keyboard = new Keyboard();
let backgroundMusic;

/** Initializes the game canvas and music controls. */
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

/** Starts a new game or resumes a completed round. */
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

/** Starts the background music and reports playback errors. */
function playMusic() {
    backgroundMusic.play().catch((error) => {
        console.error('Unable to play background music:', error);
    });
}

/** Toggles background music mute state and updates the control. */
function toggleMusic() {
    backgroundMusic.muted = !backgroundMusic.muted;
    const musicToggle = document.getElementById('music-toggle');
    musicToggle.textContent = backgroundMusic.muted ? 'Unmute music' : 'Mute music';
    musicToggle.setAttribute('aria-pressed', backgroundMusic.muted);
}

/** Restarts the current round when the game is over. */
function restartGame() {
    if (!world || !world.gameOver) return;
    keyboard = new Keyboard();
    world = new World(canvas, keyboard, true);
}

/** Stops the current game and returns to the start screen. */
function goToMenu() {
    if (world) {
        world.gameOver = true;
        document.getElementById('start-screen').classList.remove('display-none');
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
}



window.addEventListener('keydown', (e) => updateKeyboard(e, true));
window.addEventListener('keyup', (e) => updateKeyboard(e, false));

/**
 * Updates the keyboard state for a supported key.
 * @param {KeyboardEvent} e The keyboard event.
 * @param {boolean} isPressed Whether the key is pressed.
 */
function updateKeyboard(e, isPressed) {
    if (e.key == "ArrowRight") keyboard.RIGHT = isPressed;
    if (e.key == "ArrowLeft") keyboard.LEFT = isPressed;
    if (e.key == "ArrowUp") keyboard.UP = isPressed;
    if (e.key == "ArrowDown") keyboard.DOWN = isPressed;
    if (e.key == " ") keyboard.SPACE = isPressed;
    if (e.key == "d") keyboard.D = isPressed;
}