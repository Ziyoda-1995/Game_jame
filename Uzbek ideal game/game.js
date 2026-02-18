// ========================================
// AUDIO TIZIMI (Tuzatilgan)
// ========================================
const bgMusic = new Audio('ambient-space-arpeggio.mp3');

bgMusic.loop = true;
bgMusic.volume = 0.4;

const sfxCorrect = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
const sfxWrong = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
sfxWrong.volume = 0.6;

// ========================================
// GAME.JS - Core Gameplay Logic
// ========================================

let scene, camera, renderer, starField, group;
let stars = [], lines = [], accumulatedLines = [], connected = 0;
let isGameActive = false, isScanning = true;
let mouse = { x: 0, y: 0 };
let raycaster = new THREE.Raycaster();

let modeState = {
    // Shape Mode
    dashedStars: [],
    shapeTargets: [],
    selectedShape: null,
    // Trace Mode
    traceStartStar: null,
    traceEndStar: null,
    isTracing: false,
    traceStartPos: null,
    traceGuideLines: [],
    currentFreehandLine: null,
    currentPathPoints: [],
    // Brightness Mode
    brightnessSequence: [],
    brightnessClicked: 0,
    // Odd One Mode
    oddTarget: null,
    decoys: []
};

// ========================================
// INITIALIZATION
// ========================================

function initThree() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('bg-canvas').appendChild(renderer.domElement);

    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 800;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const bgMat = new THREE.PointsMaterial({ size: 1.5, color: 0xffffff, transparent: true, opacity: 0.8 });
    starField = new THREE.Points(starGeo, bgMat);
    scene.add(starField);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (starField) starField.rotation.y += 0.0001;
    renderer.render(scene, camera);
}

// ========================================
// LEVEL SETUP
// ========================================

function setupLevel(idx) {
    if (group) scene.remove(group);
    group = new THREE.Group();
    scene.add(group);

    // Auto-clear lines every 5 levels logic (5-leveldan keyin tozalash)
    accumulatedLines.push(...lines);
    if (idx % 5 === 0) {
        accumulatedLines.forEach(l => scene.remove(l));
        accumulatedLines = [];
    }

    stars = [];
    lines = [];
    connected = 0;

    modeState = {
        dashedStars: [],
        shapeTargets: [],
        selectedShape: null,
        traceStartStar: null,
        traceEndStar: null,
        isTracing: false,
        traceStartPos: null,
        traceGuideLines: [],
        currentFreehandLine: null,
        currentPathPoints: [],
        brightnessSequence: [],
        brightnessClicked: 0,
        oddTarget: null,
        decoys: []
    };

    const data = LEVELS[idx];
    const mode = data.mode;

    switch (mode) {
        case 'classic':
            setupClassicMode(data);
            break;
        case 'shape':
            setupShapeMode(data);
            break;
        case 'trace':
            setupTraceMode(data);
            break;
        case 'brightness':
            setupBrightnessMode(data);
            break;
        case 'odd_one':
            setupOddOneMode(data);
            break;
    }

    camera.rotation.set(0, 0, 0);
}

// ========================================
// MODE A: CLASSIC
// ========================================

function setupClassicMode(data) {
    data.stars.forEach((s, i) => {
        const sprite = createSuperStarTexture();
        sprite.position.set(data.pos.x + s.x * 4, data.pos.y + s.y * 4, data.pos.z);
        sprite.scale.set(6, 6, 1);

        gsap.to(sprite.scale, {
            x: 7, y: 7, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: Math.random()
        });

        sprite.userData = { id: i, mode: 'classic' };
        group.add(sprite);
        stars.push(sprite);
    });
}

// ========================================
// MODE B: SHAPE MATCH
// ========================================

function setupShapeMode(data) {
    const pointCounts = [4, 5, 6, 7, 8];
    const shuffled = pointCounts.sort(() => Math.random() - 0.5);

    shuffled.slice(0, 5).forEach((points, i) => {
        const dashedStar = createDashedStar(points);
        const s = data.stars[i] || { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 };
        dashedStar.position.set(data.pos.x + s.x * 6, data.pos.y + s.y * 6, data.pos.z);
        dashedStar.userData = { id: i, mode: 'shape', points: points, filled: false };
        group.add(dashedStar);
        modeState.dashedStars.push(dashedStar);
        modeState.shapeTargets.push(points);
    });
    setupShapeDragListeners();
}

function setupShapeDragListeners() {
    document.body.removeEventListener('dragover', handleShapeDragOver);
    document.body.removeEventListener('drop', handleShapeDrop);
    document.body.addEventListener('dragover', handleShapeDragOver);
    document.body.addEventListener('drop', handleShapeDrop);
}

function handleShapeDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleShapeDrop(e) {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;

    if (modeState.selectedShape) {
        tryPlaceShape(x, y);
    }
}

function createDashedStar(points) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const outerRadius = 3;
    const innerRadius = 1.5;

    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points;
        vertices.push(radius * Math.cos(angle), radius * Math.sin(angle), 0);
    }
    vertices.push(vertices[0], vertices[1], vertices[2]);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.LineDashedMaterial({ color: 0xffd700, linewidth: 2, scale: 1, dashSize: 0.3, gapSize: 0.2 });
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    return line;
}

// ========================================
// SHAPE PLACEMENT LOGIC
// ========================================

function tryPlaceShape(screenX, screenY) {
    if (!modeState.selectedShape) return;

    const ndcX = (screenX / window.innerWidth) * 2 - 1;
    const ndcY = -(screenY / window.innerHeight) * 2 + 1;

    let closestStar = null;
    let minDist = 150;

    modeState.dashedStars.forEach(dashedStar => {
        if (dashedStar.userData.filled) return;

        const worldPos = new THREE.Vector3();
        dashedStar.getWorldPosition(worldPos);
        const screenPos = worldPos.clone().project(camera);
        const starScreenX = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
        const starScreenY = (screenPos.y * -0.5 + 0.5) * window.innerHeight;

        const dist = Math.sqrt(Math.pow(starScreenX - screenX, 2) + Math.pow(starScreenY - screenY, 2));
        if (dist < minDist) {
            minDist = dist;
            closestStar = dashedStar;
        }
    });

    if (closestStar) {
        if (closestStar.userData.points === modeState.selectedShape) {
            fillDashedStar(closestStar);
        } else {
            const msg = TRANSLATIONS[state.language].NEED_SHAPE_START + closestStar.userData.points + TRANSLATIONS[state.language].NEED_SHAPE_END;
            showCustomAlert(msg, 'error', TRANSLATIONS[state.language].ERROR_TITLE);
        }
    } else {
        showCustomAlert(TRANSLATIONS[state.language].STAR_NOT_FOUND, 'warning', TRANSLATIONS[state.language].WARNING);
    }
    modeState.selectedShape = null;
}

function fillDashedStar(dashedStar) {
    dashedStar.userData.filled = true;
    const realStar = createSuperStarTexture();
    realStar.position.copy(dashedStar.position);
    realStar.scale.set(6, 6, 1);
    realStar.userData = { id: dashedStar.userData.id, mode: 'shape' };
    group.add(realStar);
    gsap.to(realStar.scale, { x: 8, y: 8, duration: 0.3, yoyo: true, repeat: 1 });
    state.coins += 15;
    localStorage.setItem('ul_coins', state.coins);
    updateGlobalUI();

    const worldPos = new THREE.Vector3();
    realStar.getWorldPosition(worldPos);
    const screenPos = worldPos.clone().project(camera);
    const screenX = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
    const screenY = (screenPos.y * -0.5 + 0.5) * window.innerHeight;
    showFloatingCoin(screenX, screenY, 15);

    removeShapeIcon(dashedStar.userData.points);

    if (stars.length > 0) {
        const lastStar = stars[stars.length - 1];
        const geo = new THREE.BufferGeometry().setFromPoints([lastStar.position, realStar.position]);
        const mat = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 3 });
        const line = new THREE.Line(geo, mat);
        scene.add(line);
        lines.push(line);
    }
    stars.push(realStar);

    const allFilled = modeState.dashedStars.every(s => s.userData.filled);
    if (allFilled) {
        isGameActive = false;
        const shapesBar = document.getElementById('shapes-bar');
        if (shapesBar) shapesBar.remove();
        document.body.removeEventListener('dragover', handleShapeDragOver);
        document.body.removeEventListener('drop', handleShapeDrop);
        setTimeout(() => { showVictoryModal(state.currentLevelIndex); }, 500);
    }
}

function removeShapeIcon(points) {
    const bar = document.getElementById('shapes-bar');
    if (!bar) return;
    const icons = bar.querySelectorAll('[data-points]');
    icons.forEach(icon => {
        if (parseInt(icon.dataset.points) === points) {
            icon.style.transition = 'all 0.3s ease';
            icon.style.opacity = '0';
            icon.style.transform = 'scale(0)';
            setTimeout(() => icon.remove(), 300);
        }
    });
}

// ========================================
// MODE C: PRECISION TRACE
// ========================================

function setupTraceMode(data) {
    data.stars.forEach((s, i) => {
        const sprite = createSuperStarTexture();
        sprite.position.set(data.pos.x + s.x * 4, data.pos.y + s.y * 4, data.pos.z);
        sprite.scale.set(6, 6, 1);
        sprite.userData = { id: i, mode: 'trace' };
        group.add(sprite);
        stars.push(sprite);
    });
    createTraceGuideLines();
    if (stars.length > 0) {
        stars[0].material.color.setHex(0x00ff00);
        gsap.to(stars[0].scale, { x: 8, y: 8, duration: 0.5, repeat: -1, yoyo: true });
    }
}

function createTraceGuideLines() {
    if (modeState.traceGuideLines) {
        modeState.traceGuideLines.forEach(line => scene.remove(line));
    }
    modeState.traceGuideLines = [];

    for (let i = 0; i < stars.length - 1; i++) {
        const startPos = stars[i].position;
        const endPos = stars[i + 1].position;
        const points = [startPos.clone(), endPos.clone()];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineDashedMaterial({
            color: 0xffd700, linewidth: 1, scale: 1, dashSize: 0.5, gapSize: 0.3, opacity: 0.25, transparent: true
        });
        const guideLine = new THREE.Line(geometry, material);
        guideLine.computeLineDistances();
        scene.add(guideLine);
        modeState.traceGuideLines.push(guideLine);
        gsap.to(material, { opacity: 0.4, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
}

// ========================================
// MODE D: BRIGHTNESS
// ========================================

function setupBrightnessMode(data) {
    const opacities = [0.3, 0.5, 0.7, 0.9, 1.0];
    const shuffledIndices = opacities.map((_, i) => i).sort(() => Math.random() - 0.5);
    shuffledIndices.slice(0, Math.min(5, data.stars.length)).forEach((idx, i) => {
        const opacity = opacities[idx];
        const sprite = createSuperStarTexture();
        const s = data.stars[i];
        sprite.position.set(data.pos.x + s.x * 4, data.pos.y + s.y * 4, data.pos.z);
        sprite.scale.set(6, 6, 1);
        sprite.material.opacity = opacity;
        sprite.userData = { id: i, mode: 'brightness', opacity: opacity, sortOrder: idx };
        group.add(sprite);
        stars.push(sprite);
    });
    modeState.brightnessSequence = stars
        .map((s, i) => ({ star: s, order: s.userData.sortOrder, index: i }))
        .sort((a, b) => a.order - b.order)
        .map(item => item.index);
}

// ========================================
// MODE E: ODD ONE OUT
// ========================================

function setupOddOneMode(data) {
    const decoyCount = 10 + Math.floor(Math.random() * 6);
    for (let i = 0; i < decoyCount; i++) {
        const sprite = createSuperStarTexture();
        const x = data.pos.x + (Math.random() - 0.5) * 60;
        const y = data.pos.y + (Math.random() - 0.5) * 40;
        const z = data.pos.z + (Math.random() - 0.5) * 10;
        sprite.position.set(x, y, z);
        sprite.scale.set(5, 5, 1);
        sprite.material.color.setHex(0xffffff);
        sprite.userData = { id: i, mode: 'odd_one', isTarget: false };
        group.add(sprite);
        modeState.decoys.push(sprite);
    }
    const target = createRedTargetStar();
    const tx = data.pos.x + (Math.random() - 0.5) * 60;
    const ty = data.pos.y + (Math.random() - 0.5) * 40;
    const tz = data.pos.z + (Math.random() - 0.5) * 10;
    target.position.set(tx, ty, tz);
    target.scale.set(7, 7, 1);
    target.userData = { id: -1, mode: 'odd_one', isTarget: true };
    group.add(target);
    modeState.oddTarget = target;
    stars.push(target);
}

function createRedTargetStar() {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const cx = 64, cy = 64;
    const glow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 60);
    glow.addColorStop(0, "rgba(255, 200, 200, 1)");
    glow.addColorStop(0.3, "rgba(255, 100, 100, 0.8)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = "white"; ctx.shadowColor = "#ff4444"; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.ellipse(cx, cy, 2, 55, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx, cy, 55, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 3);
    ctx.beginPath(); ctx.ellipse(0, 0, 1.5, 35, 0, 0, Math.PI * 2); ctx.fill();
    ctx.rotate(Math.PI / 3);
    ctx.beginPath(); ctx.ellipse(0, 0, 1.5, 35, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fillStyle = "#ffcccc"; ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, color: 0xff8888, transparent: true, blending: THREE.AdditiveBlending }));
}

function createSuperStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const cx = 64, cy = 64;
    const glow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 60);
    glow.addColorStop(0, "rgba(255, 255, 200, 1)");
    glow.addColorStop(0.3, "rgba(255, 215, 0, 0.6)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = "white"; ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.ellipse(cx, cy, 2, 55, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx, cy, 55, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4);
    ctx.beginPath(); ctx.ellipse(0, 0, 1.5, 30, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, 30, 1.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fillStyle = "#ffffff"; ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 20; ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending }));
}

// ========================================
// EVENT HANDLERS
// ========================================

function onMove(e) {
    if (!isGameActive) return;
    if (e.type === 'touchmove') e.preventDefault();
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    const data = LEVELS[state.currentLevelIndex];
    const mode = data.mode;

    if (isScanning) {
        camera.rotation.y += (-mouse.x * 0.8 - camera.rotation.y) * 0.05;
        camera.rotation.x += (mouse.y * 0.6 - camera.rotation.x) * 0.05;

        const targetVec = new THREE.Vector3(data.pos.x, data.pos.y, data.pos.z).normalize();
        const camVec = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

        if (camVec.distanceTo(targetVec) < 0.8) {
            document.getElementById('radar-msg').innerText = TRANSLATIONS[state.language].RADAR_FOUND;
            document.getElementById('radar-msg').style.color = "#00ff00";
        } else {
            document.getElementById('radar-msg').innerText = TRANSLATIONS[state.language].RADAR_SEARCHING;
            document.getElementById('radar-msg').style.color = "gold";
        }
    } else {
        if (mode === 'trace' && modeState.isTracing) {
            handleTraceMove(x, y);
        }
    }
}

function onPointerDown(e) {
    if (!isGameActive) return;
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    const data = LEVELS[state.currentLevelIndex];
    const mode = data.mode;

    if (isScanning) {
        const targetVec = new THREE.Vector3(data.pos.x, data.pos.y, data.pos.z).normalize();
        const camVec = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        if (camVec.distanceTo(targetVec) < 0.9) {
            enterConnectMode(data.pos);
        }
        return;
    }

    switch (mode) {
        case 'classic': handleClassicClick(); break;
        case 'trace': handleTraceStart(); break;
        case 'brightness': handleBrightnessClick(); break;
        case 'odd_one': handleOddOneClick(); break;
    }
}

// ========================================
// CLASSIC MODE HANDLER (RUSCHA)
// ========================================

function handleClassicClick() {
    raycaster.setFromCamera(mouse, camera);
    raycaster.params.Points.threshold = 3.0;
    const intersects = raycaster.intersectObjects(stars);

    if (intersects.length > 0) {
        // Find the correct next star in the intersections
        let hit = null;
        let foundCorrect = false;

        // Priority 1: Check if the *correct next star* is in the clicked pile
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.userData.id === connected) {
                hit = intersects[i].object;
                foundCorrect = true;
                break;
            }
        }

        // Priority 2: If correct star not found, check if we hit a future star (error)
        if (!foundCorrect) {
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object.userData.id > connected) {
                    hit = intersects[i].object; // This will trigger the error logic
                    break;
                }
            }
        }

        // Priority 3: If still nothing, maybe we just clicked old stars (ignore)
        if (!hit && intersects.length > 0) {
            // We only hit old stars, do nothing
            return;
        }

        if (hit && hit.userData.id === connected) {
            if (!isMuted) {
                sfxCorrect.currentTime = 0;
                sfxCorrect.play().catch(e => console.log("Audio error:", e));
            }
            hit.material.color.setHex(0x00ff00);
            gsap.to(hit.scale, { x: 8, y: 8, duration: 0.3, yoyo: true, repeat: 1 });
            state.coins += 10;
            localStorage.setItem('ul_coins', state.coins);
            updateGlobalUI();
            const screenX = (mouse.x * 0.5 + 0.5) * window.innerWidth;
            const screenY = (mouse.y * -0.5 + 0.5) * window.innerHeight;
            showFloatingCoin(screenX, screenY, 10);
            if (connected > 0) {
                const prev = stars[connected - 1].position;
                const geo = new THREE.BufferGeometry().setFromPoints([prev, hit.position]);
                const mat = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 3 });
                const line = new THREE.Line(geo, mat);
                scene.add(line);
                lines.push(line);
            }
            connected++;
            if (connected >= stars.length) {
                isGameActive = false;
                setTimeout(() => { showVictoryModal(state.currentLevelIndex); }, 500);
            }
        } else if (hit) {
            if (hit.userData.id < connected) {
                console.log("Allaqachon ulangan.");
            } else {
                handleGameError();
            }
        }
    }
}

// ========================================
// TRACE MODE HANDLERS
// ========================================

function handleTraceStart() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(stars);

    let validStartStar = null;

    // Iterate to find the correct start star (connected)
    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.userData.id === connected) {
            validStartStar = intersects[i].object;
            break;
        }
    }

    if (validStartStar) {
        modeState.isTracing = true;
        modeState.traceStartStar = validStartStar;
        modeState.traceStartPos = { x: (mouse.x * 0.5 + 0.5) * window.innerWidth, y: (mouse.y * -0.5 + 0.5) * window.innerHeight };
        modeState.currentPathPoints = [];
        const startWorldPos = new THREE.Vector3();
        modeState.traceStartStar.getWorldPosition(startWorldPos);
        modeState.currentPathPoints.push(startWorldPos.clone());
        createFreehandLine();
    }
}

function createFreehandLine() {
    if (modeState.currentFreehandLine) scene.remove(modeState.currentFreehandLine);
    const geometry = new THREE.BufferGeometry().setFromPoints(modeState.currentPathPoints);
    const material = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3, opacity: 0.8, transparent: true });
    modeState.currentFreehandLine = new THREE.Line(geometry, material);
    scene.add(modeState.currentFreehandLine);
}

function updateFreehandLine() {
    if (!modeState.currentFreehandLine || modeState.currentPathPoints.length === 0) return;
    const geometry = new THREE.BufferGeometry().setFromPoints(modeState.currentPathPoints);
    modeState.currentFreehandLine.geometry.dispose();
    modeState.currentFreehandLine.geometry = geometry;
}

function handleTraceMove(x, y) {
    if (!isGameActive) return;
    if (!modeState.isTracing || !modeState.traceStartStar) return;

    const nextIdx = connected + 1;
    if (nextIdx >= stars.length) return;

    const targetStar = stars[nextIdx];
    const mouseNDC = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mouseNDC, camera);
    const startWorldPos = new THREE.Vector3();
    modeState.traceStartStar.getWorldPosition(startWorldPos);
    const targetWorldPos = new THREE.Vector3();
    targetStar.getWorldPosition(targetWorldPos);
    const avgZ = (startWorldPos.z + targetWorldPos.z) / 2;
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -avgZ);
    const intersectPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectPoint);

    if (intersectPoint) {
        const lastPoint = modeState.currentPathPoints[modeState.currentPathPoints.length - 1];
        const distance = lastPoint.distanceTo(intersectPoint);
        if (distance > 0.5) {
            modeState.currentPathPoints.push(intersectPoint.clone());
            updateFreehandLine();
        }
    }

    const startVec = new THREE.Vector3();
    modeState.traceStartStar.getWorldPosition(startVec);
    startVec.project(camera);
    const targetVec = new THREE.Vector3();
    targetStar.getWorldPosition(targetVec);
    targetVec.project(camera);
    const sx = (startVec.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (startVec.y * -0.5 + 0.5) * window.innerHeight;
    const tx = (targetVec.x * 0.5 + 0.5) * window.innerWidth;
    const ty = (targetVec.y * -0.5 + 0.5) * window.innerHeight;
    const lineLength = Math.sqrt((tx - sx) ** 2 + (ty - sy) ** 2);
    const distance = Math.abs((ty - sy) * x - (tx - sx) * y + tx * sy - ty * sx) / lineLength;

    if (distance > 20) {
        failTrace();
        return;
    }

    const distToTarget = Math.sqrt((x - tx) ** 2 + (y - ty) ** 2);
    if (distToTarget < 30) {
        completeTrace(targetStar);
    }
}

function failTrace() {
    showCustomAlert(TRANSLATIONS[state.language].TRACE_FAIL, 'error', TRANSLATIONS[state.language].ERROR_TITLE);
    state.lives = Math.max(0, state.lives - 1);
    localStorage.setItem('ul_lives', state.lives);
    updateGlobalUI();
    if (modeState.currentFreehandLine) {
        scene.remove(modeState.currentFreehandLine);
        modeState.currentFreehandLine = null;
    }
    modeState.isTracing = false;
    modeState.traceStartStar = null;
    modeState.currentPathPoints = [];
    if (state.lives === 0) {
        showCustomAlert(TRANSLATIONS[state.language].LIVES_EMPTY, 'error', TRANSLATIONS[state.language].GAME_OVER);
        setTimeout(backToMap, 2000);
    }
}

function completeTrace(targetStar) {
    if (modeState.currentFreehandLine) {
        gsap.to(modeState.currentFreehandLine.material, {
            opacity: 0, duration: 0.3, onComplete: () => {
                scene.remove(modeState.currentFreehandLine);
                modeState.currentFreehandLine = null;
            }
        });
    }
    const prev = modeState.traceStartStar.position;
    const geo = new THREE.BufferGeometry().setFromPoints([prev, targetStar.position]);
    const mat = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 3 });
    const line = new THREE.Line(geo, mat);
    scene.add(line);
    lines.push(line);

    targetStar.material.color.setHex(0x00ff00);
    gsap.to(targetStar.scale, { x: 8, y: 8, duration: 0.3, yoyo: true, repeat: 1 });
    state.coins += 10;
    localStorage.setItem('ul_coins', state.coins);
    updateGlobalUI();

    const worldPos = new THREE.Vector3();
    targetStar.getWorldPosition(worldPos);
    const screenPos = worldPos.clone().project(camera);
    const tx = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
    const ty = (screenPos.y * -0.5 + 0.5) * window.innerHeight;
    showFloatingCoin(tx, ty, 10);

    connected++;
    modeState.isTracing = false;
    modeState.traceStartStar = null;
    modeState.currentPathPoints = [];

    if (connected >= stars.length - 1) {
        isGameActive = false;
        if (modeState.traceGuideLines) {
            modeState.traceGuideLines.forEach(line => scene.remove(line));
            modeState.traceGuideLines = [];
        }
        setTimeout(() => { showVictoryModal(state.currentLevelIndex); }, 500);
    } else {
        if (stars[connected]) {
            stars[connected].material.color.setHex(0x00ff00);
            gsap.to(stars[connected].scale, { x: 8, y: 8, duration: 0.5, repeat: -1, yoyo: true });
        }
    }
}

document.addEventListener('mouseup', () => { if (modeState.isTracing) { modeState.isTracing = false; modeState.traceStartStar = null; } });
document.addEventListener('touchend', () => { if (modeState.isTracing) { modeState.isTracing = false; modeState.traceStartStar = null; } });

// ========================================
// BRIGHTNESS MODE HANDLER
// ========================================

function handleBrightnessClick() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(stars);

    if (intersects.length > 0) {
        let hit = null;
        let foundCorrect = false;
        const expectedIndex = modeState.brightnessSequence[modeState.brightnessClicked];

        // Priority 1: Check for correct star
        for (let i = 0; i < intersects.length; i++) {
            const hitIndex = stars.indexOf(intersects[i].object);
            if (hitIndex === expectedIndex) {
                hit = intersects[i].object;
                foundCorrect = true;
                break;
            }
        }

        // Priority 2: Check for incorrect star (if correct one wasn't found)
        if (!foundCorrect) {
            // Just take the first one if we missed the correct one, to trigger error
            hit = intersects[0].object;
        }

        // If we found the correct one, hit is set correctly.
        // If we didn't, hit is set to something else (or remains null if empty, but we checked length > 0)

        const hitIndex = stars.indexOf(hit);

        if (hit && hitIndex === expectedIndex) {
            hit.material.color.setHex(0x00ff00);
            gsap.to(hit.scale, { x: 8, y: 8, duration: 0.3, yoyo: true, repeat: 1 });
            state.coins += 10;
            localStorage.setItem('ul_coins', state.coins);
            updateGlobalUI();

            const screenX = (mouse.x * 0.5 + 0.5) * window.innerWidth;
            const screenY = (mouse.y * -0.5 + 0.5) * window.innerHeight;
            showFloatingCoin(screenX, screenY, 10);

            if (modeState.brightnessClicked > 0) {
                const prev = stars[modeState.brightnessSequence[modeState.brightnessClicked - 1]].position;
                const geo = new THREE.BufferGeometry().setFromPoints([prev, hit.position]);
                const mat = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 3 });
                const line = new THREE.Line(geo, mat);
                scene.add(line);
                lines.push(line);
            }
            modeState.brightnessClicked++;
            if (modeState.brightnessClicked >= stars.length) {
                isGameActive = false;
                setTimeout(() => { showVictoryModal(state.currentLevelIndex); }, 800);
            }
        } else {
            showCustomAlert(TRANSLATIONS[state.language].WRONG_ORDER_DESC, 'error', TRANSLATIONS[state.language].ERROR_TITLE);
            state.lives = Math.max(0, state.lives - 1);
            localStorage.setItem('ul_lives', state.lives);
            updateGlobalUI();
            if (state.lives === 0) {
                showCustomAlert(TRANSLATIONS[state.language].LIVES_EMPTY, 'error', TRANSLATIONS[state.language].GAME_OVER);
                setTimeout(backToMap, 2000);
            } else {
                modeState.brightnessClicked = 0;
                stars.forEach(s => { s.material.color.setHex(0xffffff); s.scale.set(6, 6, 1); });
                lines.forEach(l => scene.remove(l));
                lines = [];
            }
        }
    }
}

// ========================================
// ODD ONE MODE HANDLER
// ========================================

function handleOddOneClick() {
    raycaster.setFromCamera(mouse, camera);
    const allObjects = [...modeState.decoys, modeState.oddTarget];
    const intersects = raycaster.intersectObjects(allObjects);
    if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData.isTarget) {
            hit.material.color.setHex(0x00ff00);
            gsap.to(hit.scale, { x: 10, y: 10, duration: 0.5 });
            state.coins += 50;
            localStorage.setItem('ul_coins', state.coins);
            updateGlobalUI();
            const screenX = (mouse.x * 0.5 + 0.5) * window.innerWidth;
            const screenY = (mouse.y * -0.5 + 0.5) * window.innerHeight;
            showFloatingCoin(screenX, screenY, 50);
            isGameActive = false;
            setTimeout(() => { showVictoryModal(state.currentLevelIndex); }, 1000);
        } else {
            showCustomAlert(TRANSLATIONS[state.language].NOT_ODD_ONE, 'error', TRANSLATIONS[state.language].ERROR_TITLE);
            state.lives = Math.max(0, state.lives - 1);
            localStorage.setItem('ul_lives', state.lives);
            updateGlobalUI();
            if (state.lives === 0) {
                showCustomAlert(TRANSLATIONS[state.language].LIVES_EMPTY, 'error', TRANSLATIONS[state.language].GAME_OVER);
                setTimeout(backToMap, 2000);
            }
        }
    }
}

// ========================================
// CAMERA TRANSITION (RUSCHA INSTRUCTIONS)
// ========================================

function enterConnectMode(pos) {
    isScanning = false;
    const data = LEVELS[state.currentLevelIndex];
    const mode = data.mode;

    let instructionText = "";
    switch (mode) {
        case 'classic':
            instructionText = TRANSLATIONS[state.language].MODE_CLASSIC;
            break;
        case 'shape':
            instructionText = TRANSLATIONS[state.language].MODE_SHAPE;
            createShapesBar();
            break;
        case 'trace':
            instructionText = TRANSLATIONS[state.language].MODE_TRACE;
            break;
        case 'brightness':
            instructionText = TRANSLATIONS[state.language].MODE_BRIGHTNESS;
            break;
        case 'odd_one':
            instructionText = TRANSLATIONS[state.language].MODE_ODD_ONE;
            break;
    }

    document.getElementById('radar-msg').innerText = instructionText;
    document.getElementById('radar-msg').style.color = "#00d2ff";

    gsap.to(camera.position, {
        x: pos.x * 0.85, y: pos.y * 0.85, z: pos.z + 40,
        duration: 2.0, ease: "power2.inOut",
        onUpdate: () => camera.lookAt(pos.x, pos.y, pos.z),
        onComplete: () => {
            if (mode === 'classic' || mode === 'trace') {
                if (stars[0]) {
                    stars[0].material.color.setHex(0x00ff00);
                    gsap.to(stars[0].scale, { x: 8, y: 8, duration: 0.5, repeat: -1, yoyo: true });
                }
            }
        }
    });
}

window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

// ========================================
// XATOLIKNI BOSHQARISH (RUSCHA)
// ========================================
function handleGameError() {
    if (!isMuted) {
        sfxWrong.currentTime = 0;
        sfxWrong.play().catch(e => console.log("Audio error:", e));
    }
    state.lives--;
    if (state.lives < 0) state.lives = 0;
    localStorage.setItem('ul_lives', state.lives);
    updateGlobalUI();

    showCustomAlert(TRANSLATIONS[state.language].WRONG_STAR_DESC, "error", TRANSLATIONS[state.language].ERROR_TITLE);

    if (state.lives === 0) {
        isGameActive = false;
        showCustomAlert(TRANSLATIONS[state.language].LIVES_EMPTY, "error", TRANSLATIONS[state.language].GAME_OVER);
        setTimeout(() => { backToMap(); }, 3000);
    }
}