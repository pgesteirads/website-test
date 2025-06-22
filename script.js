// Initialize click counter
let clickCount = 0;

// Get DOM elements
const bigRedButton = document.getElementById('bigRedButton');
const clickCountElement = document.getElementById('clickCount');

// Audio context for generating click sound
let audioContext;

// Initialize audio context on first user interaction
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Generate a satisfying click sound using Web Audio API
function playClickSound() {
    if (!audioContext) {
        initAudioContext();
    }

    // Create oscillator for the click sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure the click sound - a short, sharp sound
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // High pitch
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1); // Drop to lower pitch

    // Configure volume envelope for a "pop" effect
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1); // Quick decay

    // Set oscillator type for a punchy sound
    oscillator.type = 'square';

    // Play the sound
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);

    // Add a second layer for richness - a brief noise burst
    createNoiseClick();
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