const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// DOM Elements
const actionInput = document.getElementById('action-input');
const generateBtn = document.getElementById('generate-btn');
const licenseContainer = document.getElementById('license-container');
const licenseText = document.getElementById('license-text');
const licenseDate = document.getElementById('license-date');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');
const loadingElement = document.getElementById('loading');

// Generate the moral license
async function generateLicense(action) {
    const prompt = `Generate a humorous, over-the-top "moral license" for the following action: "${action}". 
    The response should be written in a mock-formal style, using excessive philosophical jargon and tech buzzwords. 
    Include references to at least two of the following: ethical frameworks, Silicon Valley culture, startup mentality, or tech industry trends.
    Make it approximately 150 words long and maintain a satirical tone throughout.
    The response should be a single paragraph justifying why the action is actually morally acceptable.`;

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
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
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to generate license: ' + error.message);
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

// Download license as image
async function downloadLicense() {
    const license = document.getElementById('license');
    try {
        const canvas = await html2canvas(license);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'moral-license.png';
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Error downloading license:', error);
        alert('Failed to download license');
    }
}

// Share license
async function shareLicense() {
    const license = document.getElementById('license');
    try {
        const canvas = await html2canvas(license);
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        const file = new File([blob], 'moral-license.png', { type: 'image/png' });
        
        if (navigator.share) {
            await navigator.share({
                files: [file],
                title: 'My Moral License',
                text: 'Check out my moral license!'
            });
        } else {
            throw new Error('Share not supported');
        }
    } catch (error) {
        console.error('Error sharing:', error);
        alert('Sharing is not supported on this device/browser. Try downloading the image instead.');
    }
}

// Event Listeners
generateBtn.addEventListener('click', async () => {
    const action = actionInput.value.trim();
    if (!action) {
        alert('Please enter an action first!');
        return;
    }

    loadingElement.classList.remove('hidden');
    licenseContainer.classList.add('hidden');

    try {
        const generatedText = await generateLicense(action);
        licenseText.textContent = generatedText;
        licenseDate.textContent = formatDate();
        licenseContainer.classList.remove('hidden');
    } catch (error) {
        alert('Failed to generate license. Please try again.');
    } finally {
        loadingElement.classList.add('hidden');
    }
});

downloadBtn.addEventListener('click', downloadLicense);
shareBtn.addEventListener('click', shareLicense);

// Enter key support for textarea
actionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateBtn.click();
    }
});