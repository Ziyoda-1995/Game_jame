// ========================================
// MAIN.JS - Initialization & Event Setup
// ========================================

function init() {
    generateFixedLevels();
    initThree();
    updateGlobalUI();

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: false });

    if (state.username) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active-screen'));
        document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
        renderMap();
        document.getElementById('screen-map').style.display = 'flex';
        document.getElementById('screen-map').classList.add('active-screen');
        document.getElementById('profile-btn').style.display = 'flex';
    }

    // Ensure UI is updated with correct language even if returning user
    updateGlobalUI();

    if (state.hasTelescope) {
        document.getElementById('zoom-control').style.display = 'flex';
    }

    renderTitlesGrid();
}

window.onload = init;