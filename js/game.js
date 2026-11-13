let canvas;
let world;
let startscreen;
let gameStarted = false;
let keyboard = new Keyboard();
let backgroundMusic;
let gameAudio = [];
let soundMuted = false;

/** Initializes the game canvas and audio controls. */
function init() {
    canvas = document.getElementById('canvas');
    backgroundMusic = createGameAudio('./audio/mexican-mariachi.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    setupAudioControls();
    setupMobileControls();
    //world = new World(canvas, keyboard);
}

/** Connects the audio buttons and music volume slider. */
function setupAudioControls() {
    document.getElementById('music-toggle').addEventListener('click', toggleMusic);
    document.getElementById('music-volume').addEventListener('input', (event) => {
        const volume = Number(event.target.value);
        backgroundMusic.volume = volume;
        document.getElementById('music-volume-value').textContent = `${Math.round(volume * 100)}%`;
    });
}

/** Connects touch controls to keyboard state using pointer events. */
function setupMobileControls() {
    document.querySelectorAll('.mobile-controls button').forEach((button) => {
        button.addEventListener('pointerdown', handleMobileControlStart);
        button.addEventListener('pointerup', handleMobileControlEnd);
        button.addEventListener('pointercancel', handleMobileControlEnd);
    });
    window.addEventListener('blur', resetMobileControls);
}

/**
 * Presses a mobile control and captures the active pointer.
 * @param {PointerEvent} event The control pointer event.
 */
function handleMobileControlStart(event) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setMobileControlState(event.currentTarget, true);
}

/**
 * Releases a mobile control after pointer interaction ends.
 * @param {PointerEvent} event The control pointer event.
 */
function handleMobileControlEnd(event) {
    event.preventDefault();
    setMobileControlState(event.currentTarget, false);
}

/**
 * Applies the pressed state of a mobile button to the keyboard.
 * @param {HTMLButtonElement} button The control button.
 * @param {boolean} isPressed Whether the control is pressed.
 */
function setMobileControlState(button, isPressed) {
    keyboard[button.dataset.key] = isPressed;
}

/** Clears held mobile controls when the window loses focus. */
function resetMobileControls() {
    document.querySelectorAll('.mobile-controls button').forEach((button) => {
        keyboard[button.dataset.key] = false;
    });
}

/**
 * Creates and registers an audio element so mute applies to all game sounds.
 * @param {string|string[]} source The audio source.
 * @returns {HTMLAudioElement} The registered audio element.
 */
function createGameAudio(source) {
    const audio = new Audio(source);
    audio.muted = soundMuted;
    gameAudio.push(audio);
    return audio;
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

/** Toggles all game sounds and updates the audio control. */
function toggleMusic() {
    soundMuted = !soundMuted;
    gameAudio.forEach((audio) => {
        audio.muted = soundMuted;
    });
    const musicToggle = document.getElementById('music-toggle');
    musicToggle.textContent = soundMuted ? 'Unmute' : 'Mute';
    musicToggle.setAttribute('aria-pressed', soundMuted);
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