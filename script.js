// Initialize click counter and sound tracker
let clickCount = 0;
let currentSoundIndex = 0;

// Get DOM elements
const bigRedButton = document.getElementById('bigRedButton');
const clickCountElement = document.getElementById('clickCount');
const motivationText = document.getElementById('motivationText');
const body = document.body;

// Motivational quotes array
const motivationalQuotes = [
    "You're doing amazing! 🌟",
    "Keep clicking, you're unstoppable! 🚀",
    "Each click brings you closer to greatness! ⭐",
    "You've got this! Click on! 💪",
    "Fantastic clicking skills! 🎯",
    "You're on fire! 🔥",
    "Incredible persistence! 🏆",
    "Your dedication is inspiring! ✨",
    "Master clicker in action! 🎮",
    "You're breaking records! 📈",
    "Phenomenal clicking power! ⚡",
    "You're a clicking legend! 👑",
    "Outstanding performance! 🎊",
    "Your focus is unmatched! 🎪",
    "Absolutely brilliant! 🌈",
    "You're crushing it! 💎",
    "Spectacular clicking! 🎨",
    "You're in the zone! 🎵",
    "Magnificent work! 🦄",
    "You're a clicking champion! 🏅",
    "Extraordinary dedication! 🌙",
    "You're setting the standard! 📏",
    "Impressive consistency! ⚖️",
    "You're a natural! 🍀",
    "Remarkable persistence! 🗻",
    "You're making magic happen! ✨",
    "Incredible rhythm! 🥁",
    "You're a clicking artist! 🎭",
    "Pure determination! 🔨",
    "You're reaching new heights! 🏔️"
];

// Audio context for generating click sound
let audioContext;

// Initialize audio context on first user interaction
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Generate multiple satisfying click sounds using Web Audio API
function playClickSound() {
    if (!audioContext) {
        initAudioContext();
    }

    // Cycle through different sound types
    const soundTypes = [
        { type: 'pop', freq: 800, endFreq: 400, wave: 'square' },
        { type: 'boing', freq: 600, endFreq: 1200, wave: 'sine' },
        { type: 'click', freq: 1000, endFreq: 200, wave: 'triangle' },
        { type: 'ping', freq: 1500, endFreq: 1500, wave: 'sine' },
        { type: 'thunk', freq: 300, endFreq: 150, wave: 'square' }
    ];

    const currentSound = soundTypes[currentSoundIndex];
    
    // Create oscillator for the click sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure the click sound based on current sound type
    oscillator.frequency.setValueAtTime(currentSound.freq, audioContext.currentTime);
    
    if (currentSound.type === 'boing') {
        // Boing sound goes up in pitch
        oscillator.frequency.exponentialRampToValueAtTime(currentSound.endFreq, audioContext.currentTime + 0.15);
    } else if (currentSound.type === 'ping') {
        // Ping sound stays at same pitch
        oscillator.frequency.setValueAtTime(currentSound.endFreq, audioContext.currentTime + 0.1);
    } else {
        // Most sounds drop in pitch
        oscillator.frequency.exponentialRampToValueAtTime(currentSound.endFreq, audioContext.currentTime + 0.1);
    }

    // Configure volume envelope based on sound type
    const duration = currentSound.type === 'boing' ? 0.15 : 0.1;
    const maxGain = currentSound.type === 'thunk' ? 0.4 : 0.3;
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(maxGain, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    // Set oscillator type
    oscillator.type = currentSound.wave;

    // Play the sound
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);

    // Add visual feedback for sound type
    bigRedButton.classList.remove('sound-1', 'sound-2', 'sound-3');
    bigRedButton.classList.add(`sound-${(currentSoundIndex % 3) + 1}`);

    // Add noise layer for certain sounds
    if (currentSound.type === 'pop' || currentSound.type === 'click') {
        createNoiseClick();
    }

    // Cycle to next sound
    currentSoundIndex = (currentSoundIndex + 1) % soundTypes.length;
}

// Create a brief noise click for added texture
function createNoiseClick() {
    const bufferSize = 4096;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = audioContext.createBufferSource();
    const noiseGain = audioContext.createGain();
    const noiseFilter = audioContext.createBiquadFilter();

    // Filter the noise to make it more like a click
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(2000, audioContext.currentTime);

    noiseSource.buffer = buffer;
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);

    // Quick burst of filtered noise
    noiseGain.gain.setValueAtTime(0, audioContext.currentTime);
    noiseGain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.005);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    noiseSource.start(audioContext.currentTime);
    noiseSource.stop(audioContext.currentTime + 0.05);
}

// Handle button click
function handleButtonClick() {
    // Increment click counter
    clickCount++;
    clickCountElement.textContent = clickCount;

    // Play click sound
    playClickSound();

    // Show motivational quote
    showMotivationalQuote();

    // Add screen shake effect (every 5th click or randomly 10% of the time)
    if (clickCount % 5 === 0 || Math.random() < 0.1) {
        triggerScreenShake();
    }

    // Add visual feedback animations
    bigRedButton.classList.add('clicked');
    bigRedButton.classList.add('ripple');

    // Remove animation classes after animation completes
    setTimeout(() => {
        bigRedButton.classList.remove('clicked');
    }, 300);

    setTimeout(() => {
        bigRedButton.classList.remove('ripple');
    }, 600);

    // Add some fun effects for milestone clicks
    if (clickCount % 10 === 0) {
        celebrateClickMilestone();
    }
}

// Show random motivational quote
function showMotivationalQuote() {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    motivationText.textContent = randomQuote;
    
    // Add visual effect to motivation display
    const motivationDisplay = motivationText.parentElement;
    motivationDisplay.classList.add('new-quote');
    
    setTimeout(() => {
        motivationDisplay.classList.remove('new-quote');
    }, 1000);
}

// Trigger screen shake effect
function triggerScreenShake() {
    body.classList.add('screen-shake');
    
    setTimeout(() => {
        body.classList.remove('screen-shake');
    }, 500);
}

// Celebrate milestone clicks with extra effects
function celebrateClickMilestone() {
    // Change button text temporarily
    const buttonText = bigRedButton.querySelector('.button-text');
    const originalText = buttonText.textContent;
    buttonText.textContent = `${clickCount} CLICKS!`;
    
    // Add special styling
    bigRedButton.style.animation = 'clickPulse 0.5s ease-out 3';
    
    // Reset after 2 seconds
    setTimeout(() => {
        buttonText.textContent = originalText;
        bigRedButton.style.animation = '';
    }, 2000);

    // Play a special sound for milestones
    setTimeout(() => playBonusSound(), 100);
    setTimeout(() => playBonusSound(), 200);
    setTimeout(() => playBonusSound(), 300);
}

// Play bonus sound for milestones
function playBonusSound() {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Higher, more celebratory sound
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1600, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Add event listener for button clicks
bigRedButton.addEventListener('click', handleButtonClick);

// Initialize audio context on first user interaction with the page
document.addEventListener('click', initAudioContext, { once: true });

// Add keyboard support (spacebar and enter)
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        handleButtonClick();
        
        // Add visual indication that the button was activated via keyboard
        bigRedButton.style.transform = 'translateY(2px)';
        setTimeout(() => {
            bigRedButton.style.transform = '';
        }, 100);
    }
});

// Add focus handling for accessibility
bigRedButton.addEventListener('focus', () => {
    bigRedButton.style.outline = '3px solid rgba(255, 255, 255, 0.8)';
    bigRedButton.style.outlineOffset = '5px';
});

bigRedButton.addEventListener('blur', () => {
    bigRedButton.style.outline = 'none';
});

// Console easter egg
console.log('🔴 Welcome to the Big Red Button! Try clicking it and see what happens...');
console.log('💡 Tip: You can also use the spacebar or enter key to click the button!');

// Add some fun messages based on click count
function getClickMessage(count) {
    if (count === 1) return "First click! 🎉";
    if (count === 5) return "You're getting the hang of it! 🚀";
    if (count === 10) return "Double digits! 🎯";
    if (count === 25) return "Quarter century of clicks! 🏆";
    if (count === 50) return "Half a hundred! 🎪";
    if (count === 100) return "CENTURY CLUB! 🎊";
    if (count % 100 === 0) return `${count} clicks! You're unstoppable! 🌟`;
    return null;
}

// Show messages for special click counts
let lastMessage = '';
setInterval(() => {
    const message = getClickMessage(clickCount);
    if (message && message !== lastMessage) {
        console.log(message);
        lastMessage = message;
    }
}, 1000); 