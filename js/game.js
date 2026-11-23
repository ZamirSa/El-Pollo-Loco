let canvas;
let world;
let startscreen;
let gameStarted = false;
let keyboard = new Keyboard();
let backgroundMusic;
let gameAudio = [];
let soundMuted = false;
let SOUND_MUTED_STORAGE_KEY = 'elPolloLoco.soundMuted';
let MUSIC_VOLUME_STORAGE_KEY = 'elPolloLoco.musicVolume';

/** Initializes the game canvas and audio controls. */
function init() {
    canvas = document.getElementById('canvas');
    soundMuted = localStorage.getItem(SOUND_MUTED_STORAGE_KEY) === 'true';
    backgroundMusic = createGameAudio('./audio/mexican-mariachi.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = loadMusicVolume();
    setupAudioControls();
    setupMobileControls();
    setupImpressumDialog();
}

/** Loads a valid saved music volume, or the default volume. */
function loadMusicVolume() {
    let savedVolume = localStorage.getItem(MUSIC_VOLUME_STORAGE_KEY);
    let parsedVolume = Number(savedVolume);
    let isValidVolume = savedVolume !== null && savedVolume.trim() !== ''
        && Number.isFinite(parsedVolume) && parsedVolume >= 0 && parsedVolume <= 1;
    return isValidVolume ? parsedVolume : 0.3;
}

/** Opens the legal notice as a modal overlay. */
function setupImpressumDialog() {
    let impressumDialog = document.getElementById('impressum-dialog');
    document.querySelectorAll('.impressum-open').forEach((button) => {
        button.addEventListener('click', () => {
            impressumDialog.showModal();
        });
    });
    document.getElementById('impressum-close').addEventListener('click', () => {
        impressumDialog.close();
    });
}

/** Connects the audio buttons and music volume slider. */
function setupAudioControls() {
    setupAudioControlsToggle();
    setupMusicToggle();
    setupMusicVolumeControl();
}

/** Connects the audio panel toggle button. */
function setupAudioControlsToggle() {
    let audioControlsToggle = document.getElementById('audio-controls-toggle');
    let audioControlsPanel = document.getElementById('audio-controls-panel');
    audioControlsToggle.addEventListener('click', () => {
        let isExpanded = audioControlsToggle.getAttribute('aria-expanded') === 'true';
        audioControlsToggle.setAttribute('aria-expanded', !isExpanded);
        audioControlsPanel.classList.toggle('is-open', !isExpanded);
    });
}

/** Connects the music mute toggle and initializes its label. */
function setupMusicToggle() {
    updateMusicToggle();
    document.getElementById('music-toggle').addEventListener('click', toggleMusic);
}

/** Connects the music volume slider and initializes its value. */
function setupMusicVolumeControl() {
    let musicVolume = document.getElementById('music-volume');
    musicVolume.value = backgroundMusic.volume;
    updateMusicVolumeDisplay(backgroundMusic.volume);
    musicVolume.addEventListener('input', handleMusicVolumeChange);
}

/** Applies and saves the music volume selected by the user. */
function handleMusicVolumeChange(event) {
    let volume = Number(event.target.value);
    backgroundMusic.volume = volume;
    localStorage.setItem(MUSIC_VOLUME_STORAGE_KEY, volume);
    updateMusicVolumeDisplay(volume);
}

/** Updates the visible percentage for the music volume slider. */
function updateMusicVolumeDisplay(volume) {
    document.getElementById('music-volume-value').textContent = `${Math.round(volume * 100)}%`;
}

/** Connects touch controls to keyboard state using pointer events. */
function setupMobileControls() {
    document.querySelectorAll('.mobile-controls button').forEach((button) => {
        button.addEventListener('pointerdown', handleMobileControlStart);
        button.addEventListener('pointerup', handleMobileControlEnd);
        button.addEventListener('pointercancel', handleMobileControlEnd);
        button.addEventListener('contextmenu', (event) => event.preventDefault());
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
    button.classList.toggle('is-pressed', isPressed);
}

/** Clears held mobile controls when the window loses focus. */
function resetMobileControls() {
    document.querySelectorAll('.mobile-controls button').forEach((button) => {
        setMobileControlState(button, false);
    });
}

/**
 * Creates and registers an audio element so mute applies to all game sounds.
 * @param {string|string[]} source The audio source.
 * @returns {HTMLAudioElement} The registered audio element.
 */
function createGameAudio(source) {
    let audio = new Audio(source);
    audio.muted = soundMuted;
    gameAudio.push(audio);
    return audio;
}

/** Starts a new game or resumes a completed round. */
function startGame() {
    if (!gameStarted) {
        world = new World(canvas, keyboard);
        gameStarted = true;
    } else if (world && world.gameOver) {
        restartGame();
    } else {
        return;
    }
    showGameScreen();
    playMusic();
}

/** Shows the game and hides the start screen. */
function showGameScreen() {
    document.querySelector('.game-container').classList.add('is-started');
    document.getElementById('start-screen').classList.add('display-none');
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
    localStorage.setItem(SOUND_MUTED_STORAGE_KEY, soundMuted);
    gameAudio.forEach((audio) => {
        audio.muted = soundMuted;
    });
    updateMusicToggle();
}

/** Updates the mute button to reflect the current sound state. */
function updateMusicToggle() {
    let musicToggle = document.getElementById('music-toggle');
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
    if (!world) return;
    world.gameOver = true;
    document.querySelector('.game-container').classList.remove('is-started');
    document.getElementById('start-screen').classList.remove('display-none');
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
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