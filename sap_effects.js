
// === SAP PREMIUM BUTTON LOGIC ===
document.addEventListener('DOMContentLoaded', () => {
    const sapBtn = document.getElementById('sapButton');
    const sapIcon = document.getElementById('sapIcon');

    if (sapBtn) {
        // 1. 3D TILT EFFECT
        sapBtn.addEventListener('mousemove', (e) => {
            const rect = sapBtn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (max 15deg)
            const rotateX = ((y - centerY) / centerY) * -15; // Invert Y for correct tilt
            const rotateY = ((x - centerX) / centerX) * 15;

            sapBtn.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        sapBtn.addEventListener('mouseleave', () => {
            sapBtn.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            // Reset icon
            if (sapIcon) {
                sapIcon.classList.remove('fa-lock-open');
                sapIcon.classList.add('fa-key');
            }
        });

        // 2. ICON TRANSITION
        sapBtn.addEventListener('mouseenter', () => {
            if (sapIcon) {
                sapIcon.classList.remove('fa-key');
                sapIcon.classList.add('fa-lock-open');
            }
        });

        // 3. MECHANICAL CLICK SOUND
        sapBtn.addEventListener('click', () => {
            playMechanicalClick();
        });
    }
});

function playMechanicalClick() {
    // Simple synthesized mechanical click using Web Audio API
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
        console.error('Audio play failed', e);
    }
}
