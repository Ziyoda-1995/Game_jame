// ========================================
// UI.JS - User Interface & HUD Management
// ========================================

// ========================================
// GLOBAL UI UPDATES (Tuzatilgan)
// ========================================

function updateGlobalUI() {
    // 1. Profil nomini yangilash (Eng muhim qism)
    const nameEl = document.getElementById('profile-name-btn');
    if (nameEl) {
        // Agar ism yo'q bo'lsa yoki faqat bo'sh joydan iborat bo'lsa, "Player" chiqaramiz
        if (state.username && state.username.trim().length > 0) {
            nameEl.innerText = state.username;
        } else {
            nameEl.innerText = "Игрок";
        }
        // Ko'rinishini majburlab yoqish
        nameEl.style.display = 'inline';
        nameEl.style.color = '#d6bf3dff'; // Oq rangda bo'lishini ta'minlash
    }

    // 2. Qolgan ma'lumotlarni yangilash (Xatolar oldini olish uchun tekshiruv bilan)
    const elements = {
        'dash-level': state.unlocked,
        'dash-coins': state.coins,
        'dash-lives': state.lives,
        'dash-titles': (state.titles ? state.titles.length : 0) + '/8',
        'game-coin-num': state.coins,
        'game-lives-num': state.lives,
        'map-coins': state.coins,
        'shop-coins': state.coins
    };

    for (let id in elements) {
        const el = document.getElementById(id);
        if (el) el.innerText = elements[id];
    }

    // 3. Teleskop tugmasi holati
    const teleBtn = document.getElementById('telescope-btn');
    if(teleBtn && state.hasTelescope) {
        teleBtn.disabled = true;
        teleBtn.innerText = "КУПЛЕНО";
    }
}

// ========================================
// FLOATING COIN ANIMATION
// ========================================

function showFloatingCoin(x, y, amount) {
    const coinEl = document.createElement('div');
    coinEl.className = 'floating-coin';
    coinEl.innerText = `+${amount} 💰`;
    coinEl.style.left = x + 'px';
    coinEl.style.top = y + 'px';
    document.body.appendChild(coinEl);

    setTimeout(() => {
        if(coinEl.parentNode) {
            document.body.removeChild(coinEl);
        }
    }, 1500);
}

// ========================================
// SCREEN NAVIGATION
// ========================================

function toLogin() {
    document.getElementById('screen-intro').style.display = 'none';
    document.getElementById('screen-login').style.display = 'flex';
}

function submitName() {
    let val = document.getElementById('username-input').value.trim();
    if(!val) {
        showCustomAlert('Пожалуйста, введите ваше имя!', 'warning', 'ВНИМАНИЕ');
        return;
    }
    state.username = val;
    localStorage.setItem('ul_user', val);
    updateGlobalUI();
    document.getElementById('profile-btn').style.display = 'flex';
    document.getElementById('screen-login').style.display = 'none';
    renderMap();
    document.getElementById('screen-map').style.display = 'flex';
}

// ========================================
// MAP RENDERING
// ========================================

function renderMap() {
    const grid = document.getElementById('level-grid');
    grid.innerHTML = "";
    updateGlobalUI();

    LEVELS.forEach((data, i) => {
        let el = document.createElement('div');
        let levelNum = i + 1;
        
        if(levelNum <= state.unlocked) {
            el.className = "level-node unlocked";
            if(levelNum === state.unlocked) el.classList.add('current');
            
            // Add mode badge
            let modeBadge = '';
            switch(data.mode) {
                case 'shape': modeBadge = '⭐'; break;
                case 'trace': modeBadge = '✏️'; break;
                case 'brightness': modeBadge = '💡'; break;
                case 'odd_one': modeBadge = '🔍'; break;
                default: modeBadge = '';
            }
            
            el.innerHTML = `
                <span style="font-size:1.2rem; color:gold;">${levelNum}</span>
                ${modeBadge ? `<div style="font-size:0.8rem; margin-top:2px;">${modeBadge}</div>` : ''}
            `;
            el.onclick = () => startGame(i);
        } else {
            el.className = "level-node";
            el.innerHTML = `<span style="font-size:1.2rem">🔒</span>`;
        }
        grid.appendChild(el);
    });
}

// ========================================
// GAME START
// ========================================

function startGame(idx) {
    state.currentLevelIndex = idx;
    document.getElementById('screen-map').style.display = 'none';
    document.getElementById('telescope-hud').style.display = 'block';
    document.getElementById('game-lvl-num').innerText = idx + 1;
    document.getElementById('radar-msg').innerText = "Наблюдайте за небом...";
    document.getElementById('radar-msg').style.color = "gold";
    
    updateGlobalUI();
    setupLevel(idx);
    isGameActive = true;
    isScanning = true;
    document.getElementById('back-btn').style.display = 'block';
    
    // Clear any existing shapes bar
    const existingBar = document.getElementById('shapes-bar');
    if(existingBar) {
        existingBar.remove();
    }

    // Musiqani o'yin boshlanganda avtomatik yoqish uchun yordamchi
    // (Kodning bu qismi avvalgi tuzatishda ui.js ga qo'shilgan, agar bo'lmasa quyidagi kerak)
    if(typeof bgMusic !== 'undefined' && !isMuted) {
        bgMusic.play().catch(e => console.log("Musiqa xatosi:", e));
    }
}

// ========================================
// SHAPE MODE: DRAGGABLE ICONS BAR
// ========================================

function createShapesBar() {
    // Remove existing if any
    const existing = document.getElementById('shapes-bar');
    if(existing) existing.remove();
    
    const bar = document.createElement('div');
    bar.id = 'shapes-bar';
    bar.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 20px;
        background: linear-gradient(135deg, rgba(26,26,46,0.95), rgba(15,15,30,0.95));
        padding: 20px 30px;
        border-radius: 25px;
        border: 3px solid #00d2ff;
        box-shadow: 0 10px 40px rgba(0,210,255,0.5);
        z-index: 200;
        backdrop-filter: blur(10px);
    `;
    
    const pointCounts = [4, 5, 6, 7, 8];
    
    pointCounts.forEach(points => {
        const icon = createShinyShapeIcon(points);
        icon.dataset.points = points;
        icon.draggable = true;
        
        // Desktop drag events
        icon.ondragstart = (e) => {
            console.log(`[Shape Mode] Drag started: ${points}-point star`);
            modeState.selectedShape = points;
            
            // Set drag data
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', points.toString());
            
            // Visual feedback
            icon.style.opacity = '0.5';
            icon.style.cursor = 'grabbing';
        };
        
        icon.ondragend = (e) => {
            console.log(`[Shape Mode] Drag ended`);
            icon.style.opacity = '1';
            icon.style.cursor = 'grab';
        };
        
        // Mobile touch events (fallback for devices without drag API)
        let touchStartX, touchStartY;
        
        icon.addEventListener('touchstart', (e) => {
            console.log(`[Shape Mode] Touch started: ${points}-point star`);
            modeState.selectedShape = points;
            
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            
            icon.style.opacity = '0.5';
            
            // Create visual clone that follows finger
            const clone = icon.cloneNode(true);
            clone.id = 'drag-clone';
            clone.style.position = 'fixed';
            clone.style.pointerEvents = 'none';
            clone.style.zIndex = '1000';
            clone.style.left = touchStartX - 40 + 'px';
            clone.style.top = touchStartY - 40 + 'px';
            document.body.appendChild(clone);
        }, {passive: true});
        
        icon.addEventListener('touchmove', (e) => {
            const clone = document.getElementById('drag-clone');
            if(clone) {
                const touch = e.touches[0];
                clone.style.left = touch.clientX - 40 + 'px';
                clone.style.top = touch.clientY - 40 + 'px';
            }
        }, {passive: true});
        
        icon.addEventListener('touchend', (e) => {
            console.log(`[Shape Mode] Touch ended`);
            icon.style.opacity = '1';
            
            // Remove clone
            const clone = document.getElementById('drag-clone');
            if(clone) clone.remove();
            
            // Get final touch position
            const touch = e.changedTouches[0];
            const x = touch.clientX;
            const y = touch.clientY;
            
            console.log(`[Shape Mode] Touch drop at: (${x}, ${y})`);
            
            // Attempt placement
            if(modeState.selectedShape) {
                tryPlaceShape(x, y);
            }
        }, {passive: true});
        
        bar.appendChild(icon);
    });
    
    document.body.appendChild(bar);
    console.log('[Shape Mode] Shapes bar created with drag-and-drop support');
}

function createShinyShapeIcon(points) {
    const container = document.createElement('div');
    container.style.cssText = `
        width: 80px;
        height: 80px;
        cursor: grab;
        position: relative;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    container.onmouseenter = () => {
        container.style.transform = 'scale(1.2) rotate(5deg)';
    };
    
    container.onmouseleave = () => {
        container.style.transform = 'scale(1) rotate(0deg)';
    };
    
    const canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    
    // Draw luxurious 3D-style star
    const cx = 40, cy = 40;
    
    // Glow effect
    const glow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 35);
    glow.addColorStop(0, "rgba(255, 215, 0, 1)");
    glow.addColorStop(0.5, "rgba(255, 215, 0, 0.6)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 80, 80);
    
    // Draw star shape
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    
    const outerRadius = 25;
    const innerRadius = 12;
    
    for(let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        if(i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
    
    // Gradient fill
    const gradient = ctx.createLinearGradient(-25, -25, 25, 25);
    gradient.addColorStop(0, "#FFD700");
    gradient.addColorStop(0.5, "#FFA500");
    gradient.addColorStop(1, "#FF8C00");
    ctx.fillStyle = gradient;
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 15;
    ctx.fill();
    
    // Shiny highlight
    ctx.beginPath();
    ctx.arc(-5, -5, 8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.shadowBlur = 0;
    ctx.fill();
    
    ctx.restore();
    
    // Point count label
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 3;
    ctx.fillText(points, cx, cy);
    
    container.appendChild(canvas);
    return container;
}

// ========================================
// TITLES RENDERING
// ========================================

function renderTitlesGrid() {
    const grid = document.getElementById('titles-grid');
    if(!grid) return;
    
    grid.innerHTML = '';

    TITLES.forEach((title, idx) => {
        const earned = state.titles.includes(title.level);
        const el = document.createElement('div');
        el.className = 'title-item ' + (earned ? 'earned' : 'locked');
        el.innerHTML = `
            <div class="title-item-badge">${earned ? title.badge : '🔒'}</div>
            <div class="title-item-name">${earned ? title.name : 'Закрыто'}</div>
        `;
        grid.appendChild(el);
    });
}

// ========================================
// DASHBOARD
// ========================================

function openDashboard() {
    updateGlobalUI();
    renderTitlesGrid();
    document.getElementById('dashboard-overlay').style.display = 'flex';
}

function closeDashboard() { 
    document.getElementById('dashboard-overlay').style.display = 'none'; 
}

// ========================================
// SHOP
// ========================================

function openShop() {
    updateGlobalUI();
    closeDashboard();
    document.getElementById('shop-overlay').style.display = 'flex';
}

function closeShop() {
    document.getElementById('shop-overlay').style.display = 'none';
}

function buyItem(type) {
    switch(type) {
        case 'life':
            if(state.coins >= 50) {
                state.coins -= 50;
                state.lives += 1;
                localStorage.setItem('ul_coins', state.coins);
                localStorage.setItem('ul_lives', state.lives);
                updateGlobalUI();
                showNotification('✅ +1 Жизнь куплена!<br>Всего жизней: ' + state.lives, 'success');
            } else {
                showNotification('❌ Недостаточно средств!<br><br>Нужно: 50 💰<br>Доступно: ' + state.coins + ' 💰', 'error');
            }
            break;

        case 'hint':
            if(state.coins >= 30) {
                if(!isGameActive) {
                    showNotification('⚠️ Сначала начните игру!', 'warning');
                    return;
                }
                state.coins -= 30;
                localStorage.setItem('ul_coins', state.coins);
                updateGlobalUI();
                closeShop();
                showNotification('✅ Подсказка куплена!<br>💡 Зеленый круг активирован', 'success');
                setTimeout(activateHint, 500);
            } else {
                showNotification('❌ Недостаточно средств!<br><br>Нужно: 30 💰<br>Доступно: ' + state.coins + ' 💰', 'error');
            }
            break;

        case 'telescope':
            if(state.hasTelescope) {
                showNotification('ℹ️ У вас уже есть Супер Телескоп!', 'info');
                return;
            }
            if(state.coins >= 100) {
                state.coins -= 100;
                state.hasTelescope = true;
                localStorage.setItem('ul_coins', state.coins);
                localStorage.setItem('ul_telescope', 'true');
                updateGlobalUI();
                document.getElementById('zoom-control').style.display = 'flex';
                showNotification('✅ Супер Телескоп куплен!<br>🔭 Зум активирован!', 'success');
            } else {
                showNotification('❌ Недостаточно средств!<br><br>Нужно: 100 💰<br>Доступно: ' + state.coins + ' 💰', 'error');
            }
            break;
    }
}

function activateHint() {
    if(!isGameActive || !isScanning) return;
    
    const data = LEVELS[state.currentLevelIndex];
    const hintEl = document.createElement('div');
    hintEl.className = 'hint-highlight';
    
    const vector = new THREE.Vector3(data.pos.x, data.pos.y, data.pos.z);
    vector.project(camera);
    
    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
    
    hintEl.style.left = (x - 100) + 'px';
    hintEl.style.top = (y - 100) + 'px';
    hintEl.style.width = '200px';
    hintEl.style.height = '200px';
    
    document.body.appendChild(hintEl);
    
    setTimeout(() => {
        if(hintEl.parentNode) {
            document.body.removeChild(hintEl);
        }
    }, 3000);
}

function adjustZoom(value) {
    if(!state.hasTelescope) return;
    camera.fov = value;
    camera.updateProjectionMatrix();
}

// ========================================
// EXIT & RATING FLOW
// ========================================

function triggerExitFlow() {
    document.getElementById('exit-modal').style.display = 'flex';
}

function confirmExit(yes) {
    document.getElementById('exit-modal').style.display = 'none';
    if(yes) {
        if(!state.rated) {
            document.getElementById('rating-modal').style.display = 'flex';
        } else {
            backToMap();
        }
    }
}

function rate(n) {
    document.querySelectorAll('.star').forEach((s,i) => {
        s.classList.remove('filled');
        if(i < n) s.classList.add('filled');
    });
    document.getElementById('rate-msg').innerText = "Оценено: " + n;
    state.rated = true;
    localStorage.setItem('ul_rated', 'true');
}

function finishRating() {
    document.getElementById('rating-modal').style.display = 'none';
    backToMap();
}

function backToMap() {
    document.querySelectorAll('.modal-overlay').forEach(e => e.style.display = 'none');
    document.getElementById('telescope-hud').style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('test-overlay').style.display = 'none';
    document.getElementById('title-earned-overlay').style.display = 'none';
    
    // Remove shapes bar if exists
    const shapesBar = document.getElementById('shapes-bar');
    if(shapesBar) shapesBar.remove();
    
    // Clean up trace mode guide lines
    if(modeState.traceGuideLines) {
        modeState.traceGuideLines.forEach(line => scene.remove(line));
        modeState.traceGuideLines = [];
    }
    
    // Clean up freehand line
    if(modeState.currentFreehandLine) {
        scene.remove(modeState.currentFreehandLine);
        modeState.currentFreehandLine = null;
    }
    
    isGameActive = false;
    renderMap();
    document.getElementById('screen-map').style.display = 'flex';
}

// ========================================
// TEST TIZIMI
// ========================================

let currentTest = {
    levelNum: 0,
    questions: [],
    currentQ: 0,
    score: 0
};

// ========================================
// DINAMIK TEST TIZIMI (RUSCHA)
// ========================================

function startTestMode(levelNum) {
    currentTest.levelNum = levelNum;
    currentTest.currentQ = 0;
    currentTest.score = 0;
    currentTest.questions = [];

    // 1. Qaysi levellar bo'yicha savol bo'lishini aniqlash
    const endIndex = levelNum; 
    const startIndex = levelNum - 5; 

    // Xavfsizlik uchun tekshiruv
    if (startIndex < 0 || endIndex > ZIJ_DATA.length) {
        console.error("Недостаточно данных для теста");
        backToMap();
        return;
    }

    // 2. Shu oraliqdagi yulduz turkumlarini olamiz
    const rangeData = ZIJ_DATA.slice(startIndex, endIndex);

    // 3. Har bir turkum uchun bittadan savol generatsiya qilamiz
    rangeData.forEach((data) => {
        // Savol turi: 50% ehtimol bilan TAVSIF yoki QIZIQARLI FAKT tushadi
        const isDesc = Math.random() > 0.5;
        let questionText = "";
        
        if (isDesc) {
            questionText = `Найдите описание: "${data.desc.ru}"`;
        } else {
            let fact = data.funFact.ru;
            questionText = `К какому созвездию относится этот факт?\n"${fact}"`;
        }

        // Javob variantlarini tayyorlash (Ruscha)
        const correctName = data.name.ru;
        let options = [correctName];

        // 3 ta noto'g'ri variant qo'shish (butun bazadan tasodifiy olinadi)
        while (options.length < 4) {
            const randomItem = ZIJ_DATA[Math.floor(Math.random() * ZIJ_DATA.length)];
            const randomName = randomItem.name.ru;
            // Variantlar takrorlanmasligi va to'g'ri javob bilan bir xil bo'lmasligi kerak
            if (!options.includes(randomName)) {
                options.push(randomName);
            }
        }

        // Variantlarni aralashtirish (Shuffle)
        options = options.sort(() => Math.random() - 0.5);

        // To'g'ri javob indeksini aniqlash
        const correctIndex = options.indexOf(correctName);

        // Savolni tizimga qo'shish
        currentTest.questions.push({
            q: questionText,
            options: options,
            correct: correctIndex
        });
    });

    // 4. Savollar ketma-ketligini ham aralashtiramiz
    currentTest.questions = currentTest.questions.sort(() => Math.random() - 0.5);

    // 5. Test oynasini ochish
    document.getElementById('test-overlay').style.display = 'flex';
    showTestQuestion();
}

function showTestQuestion() {
    const q = currentTest.questions[currentTest.currentQ];
    
    document.getElementById('test-progress').innerText = 
        `Вопрос ${currentTest.currentQ + 1}/5`;
    document.getElementById('test-question').innerText = q.q;
    
    const answersDiv = document.getElementById('test-answers');
    answersDiv.innerHTML = '';
    
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'test-answer-btn';
        btn.innerText = opt;
        btn.onclick = () => answerTest(idx, q.correct, btn);
        answersDiv.appendChild(btn);
    });
}

function answerTest(selected, correct, btn) {
    const allBtns = document.querySelectorAll('.test-answer-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');
    
    if(selected === correct) {
        btn.classList.add('correct');
        currentTest.score++;
    } else {
        btn.classList.add('wrong');
        allBtns[correct].classList.add('correct'); // To'g'risini ko'rsatish
    }
    
    setTimeout(() => {
        currentTest.currentQ++;
        if(currentTest.currentQ < 5) {
            showTestQuestion();
        } else {
            finishTest();
        }
    }, 1500);
}

function finishTest() {
    document.getElementById('test-overlay').style.display = 'none';
    
    if(currentTest.score === 5) {
        state.titles.push(currentTest.levelNum);
        localStorage.setItem('ul_titles', JSON.stringify(state.titles));
        
        const titleData = TITLES.find(t => t.level === currentTest.levelNum);
        if(titleData) showTitleEarned(titleData);
    } else {
        showCustomAlert(
            `Тест завершен!\n\n` +
            `Правильных ответов: ${currentTest.score}/5\n\n` +
            `Чтобы получить титул, нужно ответить на все вопросы (5/5)`,
            'warning',
            'РЕЗУЛЬТАТ ТЕСТА'
        );
        setTimeout(backToMap, 2000);
    }
}

function showTitleEarned(titleData) {
    document.getElementById('earned-title-badge').innerText = titleData.badge;
    document.getElementById('earned-title-name').innerText = titleData.name;
    document.getElementById('earned-title-desc').innerText = titleData.desc;
    
    document.getElementById('title-earned-overlay').style.display = 'flex';
    renderTitlesGrid();
    updateGlobalUI();
}

function closeTitleEarned() {
    document.getElementById('title-earned-overlay').style.display = 'none';
    backToMap();
}

// ========================================
// XABARNOMA VA ALERT TIZIMI (RUSCHA)
// ========================================

function showNotification(message, type = 'success') {
    const existing = document.getElementById('notification-modal');
    if(existing) existing.remove();
    
    let icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    let color = type === 'success' ? '#00ff00' : type === 'error' ? '#ff6b6b' : type === 'warning' ? '#FFD700' : '#00d2ff';
    
    const notification = document.createElement('div');
    notification.id = 'notification-modal';
    notification.className = 'notification-modal';
    notification.style.borderColor = color;
    
    notification.innerHTML = `
        <div class="notification-icon" style="color: ${color}">${icon}</div>
        <div class="notification-message">${message}</div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('active'), 10);
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function showCustomAlert(message, type = 'info', title = '') {
    const existing = document.getElementById('custom-alert-overlay');
    if(existing) existing.remove();
    
    let icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    let defaultTitle = type === 'success' ? 'УСПЕХ!' : type === 'error' ? 'ОШИБКА!' : type === 'warning' ? 'ВНИМАНИЕ!' : "ИНФОРМАЦИЯ";
    
    const overlay = document.createElement('div');
    overlay.id = 'custom-alert-overlay';
    overlay.className = 'custom-alert-overlay';
    
    overlay.innerHTML = `
        <div class="custom-alert-box ${type}">
            <span class="alert-icon">${icon}</span>
            <h3 class="alert-title">${title || defaultTitle}</h3>
            <p class="alert-message">${message}</p>
            <button class="alert-button" onclick="closeCustomAlert()">OK</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 10);
    
    if(type === 'success') {
        setTimeout(closeCustomAlert, 3000);
    }
}

function closeCustomAlert() {
    const overlay = document.getElementById('custom-alert-overlay');
    if(overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
}

// ========================================
// LEVEL COMPLETION (RUSCHA VERSIYA)
// ========================================

function showVictoryModal(levelIndex) {
    const currentIndex = (levelIndex !== undefined) ? levelIndex : state.currentLevelIndex;
    
    console.log(`[Victory] Opening win modal for level ${currentIndex + 1}...`);
    
    const hud = document.getElementById('telescope-hud');
    const backBtn = document.getElementById('back-btn');
    if (hud) hud.style.display = 'none';
    if (backBtn) backBtn.style.display = 'none';
    
    const overlay = document.getElementById('level-win-overlay');
    const nameEl = document.getElementById('win-constellation-name');
    const descEl = document.getElementById('win-constellation-desc');
    const factEl = document.getElementById('win-fact-text');
    
    if (!overlay) {
        console.error('[Victory] ERROR: Modal element (level-win-overlay) not found!');
        nextLevel(); 
        return;
    }

    const levelData = LEVELS[currentIndex];
    const zijData = ZIJ_DATA[currentIndex]; 

    // RUS TILI MA'LUMOTLARINI OLISH (.ru)
    if (levelData) {
        if(nameEl) nameEl.innerText = levelData.name.ru || levelData.name.uz; // Fallback
        if(descEl) descEl.innerText = levelData.desc.ru || levelData.desc.uz; // Fallback
    }

    if (factEl) {
        if (zijData && zijData.funFact) {
            factEl.innerText = zijData.funFact.ru || zijData.funFact.uz;
        } else if (levelData && levelData.funFact) {
            factEl.innerText = levelData.funFact.ru || levelData.funFact.uz;
        } else {
            factEl.innerText = "Улугбек наблюдал это созвездие в своей обсерватории.";
        }
    }

    state.coins += 50;
    
    const nextLevelIdx = currentIndex + 1;
    if(nextLevelIdx >= state.unlocked && state.unlocked < 40) {
        state.unlocked = nextLevelIdx + 1; 
        localStorage.setItem('ul_lvl', state.unlocked);
    }
    
    localStorage.setItem('ul_coins', state.coins);
    updateGlobalUI();
    
    isGameActive = false;

    overlay.style.display = 'flex'; 
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);

    const levelNum = currentIndex + 1;
    if(levelNum % 5 === 0 && levelNum <= 40) {
        if(!state.titles.includes(levelNum)) {
            setTimeout(() => {
                overlay.classList.remove('active');
                overlay.style.display = 'none';
                startTestMode(levelNum);
            }, 3000); 
        }
    }
}

function nextLevel() {
    const overlay = document.getElementById('level-win-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.style.display = 'none';
    }
    
    const nextIndex = state.currentLevelIndex + 1;
    
    if(nextIndex >= LEVELS.length) {
        showCustomAlert('Поздравляем! Все уровни пройдены! 🎊', 'success', 'ИДЕАЛЬНО!');
        setTimeout(quitToMap, 2000);
        return;
    }
    
    if(nextIndex + 1 > state.unlocked) {
        state.unlocked = nextIndex + 1;
        localStorage.setItem('ul_lvl', state.unlocked);
    }
    
    startGame(nextIndex);
}

function quitToMap() {
    const overlay = document.getElementById('level-win-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.style.display = 'none';
    }
    backToMap();
}

function showLevelWinModal(idx) { showVictoryModal(idx); }
function continueToNextLevel() { nextLevel(); }

// ========================================
// MUSIQA VA OVOZ SOZLAMALARI
// ========================================

let isMuted = false;

function toggleMusic() {
    isMuted = !isMuted;
    const btn = document.querySelector('.mute-btn');
    
    if(btn) {
        btn.innerText = isMuted ? "🔇" : "🔊";
    }
    
    if(isMuted) {
        if(typeof bgMusic !== 'undefined') bgMusic.pause();
    } else {
        if(typeof bgMusic !== 'undefined' && typeof isGameActive !== 'undefined' && isGameActive) {
            bgMusic.play().catch(e => console.log("Autoplay blocked:", e));
        }
    }
}