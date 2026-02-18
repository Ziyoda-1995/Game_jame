// ========================================
// MAIN.JS - Initialization & Event Setup
// ========================================

function init() {
    generateFixedLevels();
    initThree();
    updateGlobalUI();
    
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, {passive: false});
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, {passive: false});

    if(state.username) {
        document.getElementById('screen-intro').style.display = 'none';
        renderMap();
        document.getElementById('screen-map').style.display = 'flex';
        document.getElementById('profile-btn').style.display = 'flex';
    }

    if(state.hasTelescope) {
        document.getElementById('zoom-control').style.display = 'flex';
    }

    renderTitlesGrid();
}

window.onload = init;