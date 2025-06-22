// Initialize click counter and sound tracker
let clickCount = 0;
let currentSoundIndex = 0;

// Rapid click detection
let clickTimestamps = [];
let rapidClickAudio = null;

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

// Audio files for button clicks
let audioFiles = [];
let audioLoaded = false;

// Initialize audio files
function initAudioFiles() {
    const soundFiles = [
        'sounds/filadapulta-jovirone.mp3'
        // Add more normal sound files here as you add them to the sounds folder
    ];

    audioFiles = soundFiles.map(file => {
        const audio = new Audio(file);
        audio.preload = 'auto';
        audio.volume = 0.7; // Adjust volume as needed
        return audio;
    });

    // Initialize the special rapid click sound
    rapidClickAudio = new Audio('sounds/para-caralho.mp3');
    rapidClickAudio.preload = 'auto';
    rapidClickAudio.volume = 0.8; // Slightly louder for special effect

    audioLoaded = true;
    console.log(`🔊 Loaded ${audioFiles.length} normal sound file(s) and 1 rapid-click sound from the sounds folder!`);
}

// Play click sounds from the sounds folder
function playClickSound() {
    if (!audioLoaded) {
        initAudioFiles();
    }

    if (audioFiles.length === 0) {
        console.warn('⚠️ No audio files found in the sounds folder!');
        return;
    }

    // Get the current audio file
    const currentAudio = audioFiles[currentSoundIndex % audioFiles.length];
    
    // Reset the audio to the beginning in case it was played before
    currentAudio.currentTime = 0;
    
    // Play the sound
    currentAudio.play().catch(error => {
        console.error('Error playing sound:', error);
    });

    // Add visual feedback for sound type
    bigRedButton.classList.remove('sound-1', 'sound-2', 'sound-3');
    bigRedButton.classList.add(`sound-${(currentSoundIndex % 3) + 1}`);

    // Cycle to next sound (if you have multiple files, they'll cycle through)
    currentSoundIndex = (currentSoundIndex + 1) % Math.max(audioFiles.length, 1);
}

// Remove createNoiseClick function as we're now using actual audio files

// Check for rapid clicking (more than 5 clicks in 1 second)
function checkRapidClicking() {
    const now = Date.now();
    clickTimestamps.push(now);
    
    // Remove timestamps older than 1 second
    clickTimestamps = clickTimestamps.filter(timestamp => now - timestamp <= 1000);
    
    // Check if we have more than 5 clicks in the last second
    if (clickTimestamps.length > 5) {
        playRapidClickSound();
        return true;
    }
    return false;
}

// Play the special rapid click sound
function playRapidClickSound() {
    if (!rapidClickAudio) return;
    
    // Reset and play the special sound
    rapidClickAudio.currentTime = 0;
    rapidClickAudio.play().catch(error => {
        console.error('Error playing rapid click sound:', error);
    });
    
    // Add special visual effect
    bigRedButton.style.boxShadow = '0 20px 60px rgba(255, 0, 0, 0.8), inset 0 5px 20px rgba(255, 255, 255, 0.5)';
    bigRedButton.style.transform = 'scale(1.1)';
    
    // Reset visual effect after a moment
    setTimeout(() => {
        bigRedButton.style.boxShadow = '';
        bigRedButton.style.transform = '';
    }, 500);
    
    console.log('🔥 RAPID CLICKING DETECTED! Playing special sound!');
}

// Handle button click
function handleButtonClick() {
    // Increment click counter
    clickCount++;
    clickCountElement.textContent = clickCount;

    // Check for rapid clicking first
    const isRapidClick = checkRapidClicking();
    
    // Only play normal sound if it's not a rapid click sequence
    if (!isRapidClick) {
        playClickSound();
    }

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

// Play bonus sound for milestones (using the same sound file)
function playBonusSound() {
    if (!audioLoaded || audioFiles.length === 0) return;

    // Play the first sound file for bonus sounds
    const bonusAudio = audioFiles[0].cloneNode();
    bonusAudio.volume = 0.5; // Slightly quieter for bonus sounds
    bonusAudio.currentTime = 0;
    bonusAudio.play().catch(error => {
        console.error('Error playing bonus sound:', error);
    });
}

// Add event listener for button clicks
bigRedButton.addEventListener('click', handleButtonClick);

// Initialize audio files on first user interaction with the page
document.addEventListener('click', initAudioFiles, { once: true });

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