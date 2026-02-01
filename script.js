// Variables
const lightBox = document.getElementById('lightBox');
const colorPicker = document.getElementById('colorPicker');
const colorDisplay = document.getElementById('colorDisplay');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const colorPickerModal = document.getElementById('colorPickerModal');
const hueSlider = document.getElementById('hueSlider');
const modalSaturationSlider = document.getElementById('modalSaturationSlider');
const modalBrightnessSlider = document.getElementById('modalBrightnessSlider');
const modalSaturationValue = document.getElementById('modalSaturationValue');
const modalBrightnessValue = document.getElementById('modalBrightnessValue');
const colorPreview = document.getElementById('colorPreview');
const closeColorPicker = document.getElementById('closeColorPicker');
const warmBtn = document.getElementById('warmBtn');
const neutralBtn = document.getElementById('neutralBtn');
const coolBtn = document.getElementById('coolBtn');

// Initial values (HSL)
let hue = 200;
let saturation = 80;
let lightness = 50;

// Load saved color from localStorage
function loadSavedColor() {
    const saved = localStorage.getItem('lightboxColor');
    if (saved) {
        const color = JSON.parse(saved);
        hue = color.h;
        saturation = color.s;
        lightness = color.l;
    }
}

// Save color to localStorage
function saveColor() {
    const color = { h: hue, s: saturation, l: lightness };
    localStorage.setItem('lightboxColor', JSON.stringify(color));
}

// Function to update the light box color
function updateLightBoxColor() {
    const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    lightBox.style.backgroundColor = hslColor;
    if (colorDisplay) {
        colorDisplay.textContent = hslColor;
    }
}

// Function to convert HSL to Hex for color picker
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };

    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Function to convert Hex to HSL
function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// Light box click - open color picker
lightBox.addEventListener('click', (e) => {
    colorPickerModal.classList.add('active');
    hueSlider.value = hue;
    modalSaturationSlider.value = saturation;
    modalBrightnessSlider.value = lightness;
    updateModalSliderValues();
});

// Preset color buttons
warmBtn.addEventListener('click', () => {
    selectPresetColor(40, 70, 60);
    console.log('Preset clicado: Quente', { hue, saturation, lightness });
});

neutralBtn.addEventListener('click', () => {
    selectPresetColor(0, 0, 100);
    console.log('Preset clicado: Neutro', { hue, saturation, lightness });
});

coolBtn.addEventListener('click', () => {
    selectPresetColor(200, 70, 65);
    console.log('Preset clicado: Frio', { hue, saturation, lightness });
});

// Function to select preset color
function selectPresetColor(h, s, l) {
    hue = h;
    saturation = s;
    lightness = l;
    
    hueSlider.value = hue;
    modalSaturationSlider.value = saturation;
    modalBrightnessSlider.value = lightness;
    updateModalSliderValues();
    updateColor();
}

// Color picker change
colorPicker.addEventListener('change', (e) => {
    const hsl = hexToHsl(e.target.value);
    hue = hsl.h;
    saturation = hsl.s;
    lightness = hsl.l;
    
    modalSaturationSlider.value = saturation;
    modalBrightnessSlider.value = lightness;
    modalSaturationValue.textContent = saturation;
    modalBrightnessValue.textContent = lightness;
    
    updateLightBoxColor();
});

// Custom color picker - hue slider change
hueSlider.addEventListener('input', (e) => {
    hue = parseInt(e.target.value);
    updateColor();
});

// Modal saturation slider change
modalSaturationSlider.addEventListener('input', (e) => {
    saturation = parseInt(e.target.value);
    modalSaturationValue.textContent = saturation;
    updateColor();
});

// Modal brightness slider change
modalBrightnessSlider.addEventListener('input', (e) => {
    lightness = parseInt(e.target.value);
    modalBrightnessValue.textContent = lightness;
    updateColor();
});

// Update modal slider display values
function updateModalSliderValues() {
    modalSaturationValue.textContent = saturation;
    modalBrightnessValue.textContent = lightness;
}

// Update color in all places
function updateColor() {
    const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colorPreview.style.backgroundColor = hslColor;
    updateLightBoxColor();
    saveColor();
}

// Close color picker modal
closeColorPicker.addEventListener('click', () => {
    colorPickerModal.classList.remove('active');
});

// Close modal when clicking outside
colorPickerModal.addEventListener('click', (e) => {
    if (e.target === colorPickerModal) {
        colorPickerModal.classList.remove('active');
    }
});

// Adjust modal position on window resize
window.addEventListener('resize', () => {
    if (colorPickerModal.classList.contains('active')) {
        const lightBoxRect = lightBox.getBoundingClientRect();
        const modalContent = document.querySelector('.color-picker-content');
        
        let top = lightBoxRect.bottom + 20;
        let left = lightBoxRect.left + (lightBoxRect.width / 2) - 200;
        
        if (left < 10) left = 10;
        if (left + 400 > window.innerWidth) left = window.innerWidth - 410;
        if (top + 300 > window.innerHeight) top = lightBoxRect.top - 320;
        
        modalContent.style.top = top + 'px';
        modalContent.style.left = left + 'px';
    }
});

// Fullscreen button
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        if (lightBox.requestFullscreen) {
            lightBox.requestFullscreen().catch(err => {
                console.error(`Erro ao entrar em tela cheia: ${err.message}`);
            });
        }
    } else {
        document.exitFullscreen();
    }
});

// Initialize
loadSavedColor();
console.log('Cor carregada:', { hue, saturation, lightness });
updateLightBoxColor();
colorPreview.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
