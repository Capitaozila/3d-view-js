// ui.js - Utility functions for UI interaction

// Show a toast notification with a message
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast-notification');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Update the displayed value for range inputs
function updateValueDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Apply preset configurations for common shapes and materials
function applyPreset(presetName) {
    const presets = {
        glossy: {
            materialType: 'physical',
            metalness: 0.9,
            roughness: 0.1,
            color: '#00aaff'
        },
        matte: {
            materialType: 'standard',
            metalness: 0.0,
            roughness: 0.9,
            color: '#ff5500'
        },
        cartoon: {
            materialType: 'toon',
            color: '#ffcc00'
        },
        neon: {
            materialType: 'gradient',
            color: '#ff00ff',
            color2: '#00ffcc'
        }
    };
    
    const preset = presets[presetName];
    if (!preset) return;
    
    // Apply settings to the UI controls
    if (preset.materialType) {
        document.getElementById('materialType').value = preset.materialType;
    }
    
    if (preset.metalness !== undefined) {
        document.getElementById('metalness').value = preset.metalness;
        updateValueDisplay('metalness-value', preset.metalness);
    }
    
    if (preset.roughness !== undefined) {
        document.getElementById('roughness').value = preset.roughness;
        updateValueDisplay('roughness-value', preset.roughness);
    }
    
    if (preset.color) {
        document.getElementById('color').value = preset.color;
    }
    
    if (preset.color2) {
        document.getElementById('color2').value = preset.color2;
    }
    
    // Trigger material update
    const event = new Event('change');
    document.getElementById('materialType').dispatchEvent(event);
    
    showToast(`Applied ${presetName} preset`);
}

// Export the functions
export {
    showToast,
    updateValueDisplay,
    applyPreset
};