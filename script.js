import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Constants
const CARD_WIDTH = 3.5;
const CARD_HEIGHT = 2;
const CARD_THICKNESS = 0.001;
const ROTATION_SPEED = 0.002;
const CARD_RADIUS = 0.1;

// Load texture
const textureLoader = new THREE.TextureLoader();
const cardTexture = textureLoader.load('image1.png', (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    // Make texture cover the entire surface
    texture.center.set(0.5, 0.5);
    texture.repeat.set(1, 1);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
});

const backTexture = textureLoader.load('back.png', (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    // Make texture cover the entire surface
    texture.center.set(0.5, 0.5);
    texture.repeat.set(1, 1);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
});

// Text rotation phrases
const phrases = [
    "Questionable Decisions?",
    "Need an Excuse?",
    "Feeling Guilty?",
    "Dubious Actions?",
    "Sinning Today?",
    "Bad Behavior?",
    "Ethical Dilemma?",
    "Moral Flexibility?",
    "Slightly Shady?",
    "Doing Wrong?",
    "Justify Anything?",
    "Guilt-Free Pass?",
    "Instant Justification?",
    "Philosophical Cover?",
    "Want to misbehave?",
    "Need Help Rationalizing?",
    "Ethically Challenged?",
    "Moral Absolution?",
    "Need a Loophole?",
    "Your Free Pass?"
];

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Post processing setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.5,  // bloom strength
    0.4,  // radius
    0.85  // threshold
);
composer.addPass(bloomPass);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false; // Disable panning
controls.enableZoom = false; // Disable zooming
controls.enableDamping = true; // Add smooth damping
controls.dampingFactor = 0.05; // Adjust damping factor
controls.rotateSpeed = 1.5; // Adjust rotation speed
controls.autoRotate = true; // Enable auto-rotation
controls.autoRotateSpeed = 2.0; // Speed of auto-rotation

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create Matrix rain effect
const matrixCanvas = document.createElement('canvas');
matrixCanvas.style.position = 'fixed';
matrixCanvas.style.top = '0';
matrixCanvas.style.left = '0';
matrixCanvas.style.width = '100%';
matrixCanvas.style.height = '100%';
matrixCanvas.style.zIndex = '1';
matrixCanvas.style.opacity = '0';
matrixCanvas.style.transition = 'opacity 0.3s ease';
matrixCanvas.style.pointerEvents = 'none';
document.body.insertBefore(matrixCanvas, document.getElementById('scene-container'));

const ctx = matrixCanvas.getContext('2d');
let matrixWidth, matrixHeight;

function resizeMatrix() {
    matrixWidth = window.innerWidth;
    matrixHeight = window.innerHeight;
    matrixCanvas.width = matrixWidth;
    matrixCanvas.height = matrixHeight;
}
resizeMatrix();
window.addEventListener('resize', resizeMatrix);

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
const fontSize = 14;
const columns = matrixWidth / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, matrixWidth, matrixHeight);
    
    if (Math.random() < 0.1) {
        ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.2})`;
        ctx.fillRect(0, 0, matrixWidth, matrixHeight);
    }
    
    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        const colorType = Math.random();
        if (colorType < 0.8) {
            ctx.fillStyle = `rgba(0, ${155 + Math.random() * 100}, 0, ${Math.random()})`;
        } else if (colorType < 0.9) {
            ctx.fillStyle = `rgba(255, 0, 0, ${Math.random()})`;
        } else {
            ctx.fillStyle = `rgba(0, 255, 255, ${Math.random()})`;
        }
        
        const size = 14 + Math.random() * 8;
        ctx.font = `${size}px monospace`;
        
        const xPos = (i * fontSize) + (Math.random() < 0.1 ? (Math.random() * 10 - 5) : 0);
        ctx.fillText(text, xPos, drops[i] * fontSize);
        
        if (drops[i] * fontSize > matrixHeight && Math.random() > 0.90) {
            drops[i] = 0;
        }
        drops[i] += 1 + Math.random();
    }
}

// Create rounded rectangle shape
const shape = new THREE.Shape();
const x = -CARD_WIDTH / 2;
const y = -CARD_HEIGHT / 2;
const width = CARD_WIDTH;
const height = CARD_HEIGHT;
const radius = CARD_RADIUS;

shape.moveTo(x + radius, y);
shape.lineTo(x + width - radius, y);
shape.quadraticCurveTo(x + width, y, x + width, y + radius);
shape.lineTo(x + width, y + height - radius);
shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
shape.lineTo(x + radius, y + height);
shape.quadraticCurveTo(x, y + height, x, y + height - radius);
shape.lineTo(x, y + radius);
shape.quadraticCurveTo(x, y, x + radius, y);

const extrudeSettings = {
    depth: CARD_THICKNESS,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.02,
    bevelThickness: 0.02
};

// Create a rounded plane for the front face using the same shape
const planeGeometry = new THREE.ShapeGeometry(shape);
// Compute UV coordinates to cover the entire shape
const uvAttribute = planeGeometry.attributes.uv;
const positions = planeGeometry.attributes.position;
for (let i = 0; i < uvAttribute.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const u = (x + CARD_WIDTH/2) / CARD_WIDTH;
    const v = (y + CARD_HEIGHT/2) / CARD_HEIGHT;
    uvAttribute.setXY(i, u, v);
}
const planeMaterial = new THREE.MeshBasicMaterial({
    map: cardTexture,
    side: THREE.DoubleSide,
    transparent: true
});
const backMaterial = new THREE.MeshBasicMaterial({
    map: backTexture,
    side: THREE.DoubleSide,
    transparent: true
});
const frontPlane = new THREE.Mesh(planeGeometry, planeMaterial);
frontPlane.position.z = CARD_THICKNESS / 2 + 0.022; // Slightly in front of the card

const backPlane = new THREE.Mesh(planeGeometry, backMaterial);
backPlane.position.z = -CARD_THICKNESS / 2 - 0.02;

// Create card geometry
const cardGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
const cardMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.1,
    emissive: 0xffffff,
    emissiveIntensity: 0,
});

const card = new THREE.Mesh(cardGeometry, cardMaterial);
card.add(frontPlane); 
card.add(backPlane);


scene.add(card);

// Position camera
camera.position.z = 5;

let matrixAnimationId = null;

// Animation
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    if (isInteracting && matrixAnimationId) {
        drawMatrix();
    }
    composer.render();
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// Add interaction states
let isInteracting = false;

// Add audio setup near the top of the file
const glitchSound = new Audio('glitch.wav');

renderer.domElement.addEventListener('mousedown', () => {
    isInteracting = true;
    controls.autoRotate = false;
    matrixCanvas.style.opacity = '1';
    cardMaterial.emissiveIntensity = 0.5;
    bloomPass.strength = 1.5;
    if (!matrixAnimationId) {
        matrixAnimationId = requestAnimationFrame(drawMatrix);
    }
    rotatingTextElement.style.display = 'none';
    startButton.style.opacity = '0';
    
    // Play glitch sound
    glitchSound.currentTime = 0; // Reset sound to start
    glitchSound.play();
});

renderer.domElement.addEventListener('touchstart', () => {
    isInteracting = true;
    controls.autoRotate = false;
    matrixCanvas.style.opacity = '1';
    cardMaterial.emissiveIntensity = 0.5;
    bloomPass.strength = 1.5;
    if (!matrixAnimationId) {
        matrixAnimationId = requestAnimationFrame(drawMatrix);
    }
    rotatingTextElement.style.display = 'none';
    startButton.style.opacity = '0';
    
    // Play glitch sound
    glitchSound.currentTime = 0; // Reset sound to start
    glitchSound.play();
});

document.addEventListener('mouseup', () => {
    isInteracting = false;
    controls.autoRotate = true;
    matrixCanvas.style.opacity = '0';
    cardMaterial.emissiveIntensity = 0;
    bloomPass.strength = 0.5;
    if (matrixAnimationId) {
        cancelAnimationFrame(matrixAnimationId);
        matrixAnimationId = null;
    }
    rotatingTextElement.style.display = 'block';
    startButton.style.opacity = '1';
    
    // Pause glitch sound
    glitchSound.pause();
});

document.addEventListener('touchend', () => {
    isInteracting = false;
    controls.autoRotate = true;
    matrixCanvas.style.opacity = '0';
    cardMaterial.emissiveIntensity = 0;
    bloomPass.strength = 0.5;
    if (matrixAnimationId) {
        cancelAnimationFrame(matrixAnimationId);
        matrixAnimationId = null;
    }
    rotatingTextElement.style.display = 'block';
    startButton.style.opacity = '1';
    
    // Pause glitch sound
    glitchSound.pause();
});

// Rotating text
const rotatingTextElement = document.getElementById('rotating-text');
let currentPhraseIndex = 0;

function updateRotatingText() {
    rotatingTextElement.style.opacity = 0;
    setTimeout(() => {
        rotatingTextElement.textContent = phrases[currentPhraseIndex];
        rotatingTextElement.style.opacity = 1;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
    }, 100);
}

// Start animations
animate();
updateRotatingText();
setInterval(updateRotatingText, 3000);

// UI Interaction
const startButton = document.getElementById('start-btn');
const inputContainer = document.getElementById('input-container');
const generateBtn = document.getElementById('generate-btn');
const licenseContainer = document.getElementById('license-container');
const licenseText = document.getElementById('license-text');
const licenseDate = document.getElementById('license-date');
const closeBtn = document.getElementById('close-btn');

startButton.addEventListener('click', () => {
    const buttonText = startButton.textContent;
    startButton.textContent = ''; // Clear text immediately
    
    // Start morphing animation
    requestAnimationFrame(() => {
        startButton.classList.add('morphing');
        rotatingTextElement.style.opacity = '0';
    });
    
    // Show input container after button starts morphing
    setTimeout(() => {
        inputContainer.classList.remove('hidden');
        requestAnimationFrame(() => {
            inputContainer.classList.add('visible');
        });
    }, 300);
});

closeBtn.addEventListener('click', () => {
    inputContainer.classList.remove('visible');
    licenseContainer.classList.add('hidden');
    
    setTimeout(() => {
        startButton.classList.remove('morphing');
        startButton.textContent = 'Get Your License';
        rotatingTextElement.style.opacity = '1';
        
        setTimeout(() => {
            inputContainer.classList.add('hidden');
            document.getElementById('action-input').value = '';
            licenseText.textContent = '';
        }, 600);
    }, 250);
});

// Generate the moral license
async function generateLicense(action) {
    if (typeof API_KEY === 'undefined') {
        throw new Error('API_KEY is not available');
    }

    // Generate a random ID number
    const generateId = () => {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `ML-${timestamp}-${random}`;
    };

    const prompt = `Generate a humorous, concise "moral license" for the following action: "${action}". 
    Write it in a mock-formal style, using philosophical jargon and tech buzzwords. Language should be understandable by an 18 year old.
    Include one reference to either ethical frameworks, tiktok brain rot, overly leftist ideology, Silicon Valley culture, startup mentality, or tech industry trends.
    Make it 30 words or less and maintain a satirical tone throughout.
    The response should be a single paragraph justifying why the action is actually morally acceptable. only respond with the text of the license, no other text. start with By the..`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || 'API Error');
        }
        
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return {
                text: data.candidates[0].content.parts[0].text,
                id: generateId(),
                issueDate: formatDate()
            };
        } else {
            console.error('Unexpected API response:', data);
            throw new Error('Invalid API response format');
        }
    } catch (error) {
        console.error('License generation error:', error);
        throw error;
    }
}

// Format current date
function formatDate() {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

generateBtn.addEventListener('click', async () => {
    const action = document.getElementById('action-input').value.trim();
    if (!action) {
        alert('Please enter an action first!');
        return;
    }

    try {
        const license = await generateLicense(action);
        document.getElementById('license-text').textContent = license.text;
        document.getElementById('license-date').textContent = license.issueDate;
        document.getElementById('license-id').textContent = license.id;
        
        // Hide input container and show license
        inputContainer.classList.remove('visible');
        setTimeout(() => {
            inputContainer.classList.add('hidden');
            licenseContainer.classList.remove('hidden');
        }, 300);
    } catch (error) {
        alert('Failed to generate license. Please try again.');
        console.error('Error:', error);
    }
});

// Add download functionality
document.getElementById('download-btn').addEventListener('click', () => {
    const licenseElement = document.querySelector('.license');
    
    // Create a clone of the license for download
    const clone = licenseElement.cloneNode(true);
    clone.style.transform = 'none';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    // Add fixed dimensions for the clone
    clone.style.width = '720px';  // Match original width
    clone.style.height = '420px'; // Match original height
    clone.style.padding = '1.5rem';
    document.body.appendChild(clone);
    
    // Use html2canvas to capture the license
    html2canvas(clone, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        width: 720,
        height: 420,
        windowWidth: 720,
        windowHeight: 420
    }).then(canvas => {
        // Convert to image and download
        const link = document.createElement('a');
        link.download = 'moral-license.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Clean up
        document.body.removeChild(clone);
    });
});

// Move the event listener here and ensure it triggers the generate function
const actionInput = document.getElementById('action-input');
actionInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        const action = actionInput.value.trim();
        if (!action) {
            alert('Please enter an action first!');
            return;
        }

        const loader = document.getElementById('loader');
        loader.classList.add('visible');

        try {
            const license = await generateLicense(action);
            document.getElementById('license-text').textContent = license.text;
            document.getElementById('license-date').textContent = license.issueDate;
            document.getElementById('license-id').textContent = license.id;
            
            loader.classList.remove('visible');
            inputContainer.classList.remove('visible');
            setTimeout(() => {
                inputContainer.classList.add('hidden');
                licenseContainer.classList.remove('hidden');
            }, 300);
        } catch (error) {
            loader.classList.remove('visible');
            alert('Failed to generate license. Please try again.');
            console.error('Error:', error);
        }
    }
});