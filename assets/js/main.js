/**
 * MAIN CONTROLLER - EDITOR LINEE FERROVIARIE RFI
 * ==============================================
 * Sistema per costruire e utilizzare linee ferroviarie personalizzate
 */

// Stato globale dell'applicazione
const APP_STATE = {
    currentMode: 'build', // 'build' o 'play' o 'exercise'
    selectedStartSignal: null,
    selectedEndSignal: null,
    currentExercise: null,
    userSolution: [],
    systemType: 2, // 2 aspetti o 3 aspetti
    isExerciseActive: false
};

/**
 * ==========================================
 * INIZIALIZZAZIONE APPLICAZIONE
 * ==========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Avvio Editor Linee Ferroviarie RFI');
    
    // Carica tipi di segnali
    if (typeof loadSignalTypes === 'function') {
        loadSignalTypes();
    }
    
    // Inizializza editor
    if (typeof initializeRailwayEditor === 'function') {
        initializeRailwayEditor();
    }
    
    console.log('✅ Applicazione inizializzata');
});

/**
 * ==========================================
 * GESTIONE MODALITÀ GIOCO - SELEZIONE SEGNALI
 * ==========================================
 */

function handleSignalSelection(element) {
    if (element.type !== 'signal') {
        console.log('⚠️ Elemento selezionato non è un segnale');
        return;
    }
    
    if (!APP_STATE.selectedStartSignal) {
        // Primo click = segnale di partenza (verde)
        APP_STATE.selectedStartSignal = element;
        element.data.color = '#27ae60'; // Verde
        updateSignalVisual(element, 'start');
        
        console.log('🟢 Segnale di partenza selezionato:', element.id);
        
    } else if (!APP_STATE.selectedEndSignal && element !== APP_STATE.selectedStartSignal) {
        // Secondo click = segnale di arrivo (rosso)
        APP_STATE.selectedEndSignal = element;
        element.data.color = '#e74c3c'; // Rosso
        updateSignalVisual(element, 'end');
        
        console.log('🔴 Segnale di arrivo selezionato:', element.id);
        
        // Mostra pulsante per iniziare esercizio
        showStartExerciseButton();
        
    } else {
        // Reset se clicca su segnali già selezionati
        resetSignalSelection();
    }
    
    // Ridisegna canvas
    if (typeof redrawCanvas === 'function') {
        redrawCanvas();
    }
}

function updateSignalVisual(element, type) {
    if (type === 'start') {
        element.data.icon = '🟢';
        element.data.name = 'PARTENZA';
    } else if (type === 'end') {
        element.data.icon = '🔴';
        element.data.name = 'ARRIVO';
    }
}

function resetSignalSelection() {
    // Reset visuale segnali
    if (APP_STATE.selectedStartSignal) {
        APP_STATE.selectedStartSignal.data.color = '#ddd';
        APP_STATE.selectedStartSignal.data.icon = '⚪';
        APP_STATE.selectedStartSignal.data.name = 'Segnale Vuoto';
    }
    
    if (APP_STATE.selectedEndSignal) {
        APP_STATE.selectedEndSignal.data.color = '#ddd';
        APP_STATE.selectedEndSignal.data.icon = '⚪';
        APP_STATE.selectedEndSignal.data.name = 'Segnale Vuoto';
    }
    
    // Reset stato
    APP_STATE.selectedStartSignal = null;
    APP_STATE.selectedEndSignal = null;
    
    // Nasconde pulsante esercizio
    document.getElementById('startExerciseBtn').style.display = 'none';
    
    // Ridisegna canvas
    if (typeof redrawCanvas === 'function') {
        redrawCanvas();
    }
    
    console.log('🔄 Selezione segnali resettata');
}

function showStartExerciseButton() {
    const btn = document.getElementById('startExerciseBtn');
    if (btn) {
        btn.style.display = 'block';
        btn.innerHTML = `🚀 Esercizio: ${APP_STATE.selectedStartSignal.id} → ${APP_STATE.selectedEndSignal.id}`;
    }
}

/**
 * ==========================================
 * AVVIO ESERCIZIO SEGNALI
 * ==========================================
 */

function startSignalExercise() {
    if (!APP_STATE.selectedStartSignal || !APP_STATE.selectedEndSignal) {
        alert('⚠️ Seleziona prima un segnale di partenza e uno di arrivo!');
        return;
    }
    
    console.log('🚀 Avvio esercizio segnali');
    
    // Prepara esercizio
    const exercise = createExerciseFromRailway();
    
    if (!exercise) {
        alert('❌ Errore nella creazione dell\'esercizio');
        return;
    }
    
    // Cambia modalità a esercizio
    APP_STATE.currentMode = 'exercise';
    APP_STATE.currentExercise = exercise;
    APP_STATE.isExerciseActive = true;
    
    // Nasconde interfaccia di gioco e mostra interfaccia esercizio
    showExerciseInterface(exercise);
}

function createExerciseFromRailway() {
    const railway = RAILWAY_EDITOR.selectedRailway;
    if (!railway) return null;
    
    // Filtra solo i segnali dalla linea
    const signals = railway.elements.filter(el => el.type === 'signal');
    
    if (signals.length < 2) {
        alert('⚠️ La linea deve avere almeno 2 segnali!');
        return null;
    }
    
    // Calcola distanza approssimativa tra partenza e arrivo
    const distance = calculateDistance(APP_STATE.selectedStartSignal, APP_STATE.selectedEndSignal);
    
    // Determina velocità media (parzialmente casuale per varietà)
    const baseSpeed = 80 + Math.random() * 40; // 80-120 km/h
    
    // Calcola complessità
    const complexity = Math.max(4, Math.min(12, Math.ceil(distance / 100) + signals.length));
    
    return {
        id: 'custom_' + Date.now(),
        startSignal: APP_STATE.selectedStartSignal,
        endSignal: APP_STATE.selectedEndSignal,
        railway: railway,
        distance: Math.round(distance),
        averageSpeed: Math.round(baseSpeed),
        signalCount: complexity,
        systemType: APP_STATE.systemType,
        allSignals: signals
    };
}

function calculateDistance(signal1, signal2) {
    // Calcola distanza euclidea e converte in metri (approssimativo)
    const dx = signal1.x - signal2.x;
    const dy = signal1.y - signal2.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Converte pixel in metri (1 pixel ≈ 2 metri)
    return pixelDistance * 2;
}

/**
 * ==========================================
 * INTERFACCIA ESERCIZIO SEGNALI
 * ==========================================
 */

function showExerciseInterface(exercise) {
    const container = document.querySelector('.exercise-info');
    
    container.innerHTML = `
        <div class="exercise-header">
            <h3>🚦 Esercizio Segnali: ${exercise.railway.name}</h3>
            <button class="control-btn secondary" onclick="backToRailwaySelection()">
                ← Torna alla Selezione Linea
            </button>
        </div>
        
        <div class="exercise-info-grid">
            <div class="info-item">
                <span class="info-label">🟢 Partenza:</span>
                <span class="info-value">${exercise.startSignal.id}</span>
            </div>
            <div class="info-item">
                <span class="info-label">🔴 Arrivo:</span>
                <span class="info-value">${exercise.endSignal.id}</span>
            </div>
            <div class="info-item">
                <span class="info-label">📏 Distanza:</span>
                <span class="info-value">${exercise.distance}m</span>
            </div>
            <div class="info-item">
                <span class="info-label">⚡ Velocità Media:</span>
                <span class="info-value">${exercise.averageSpeed} km/h</span>
            </div>
            <div class="info-item">
                <span class="info-label">🚦 Segnali Richiesti:</span>
                <span class="info-value">${exercise.signalCount}</span>
            </div>
            <div class="info-item">
                <span class="info-label">🔄 Sistema:</span>
                <span class="info-value">${exercise.systemType} aspetti</span>
            </div>
        </div>
        
        <div class="track-visualization">
            <h4>🛤️ Binario da Segnalare</h4>
            <div class="track-container">
                <div class="signal-positions" id="signalPositions">
                    <!-- Posizioni segnali generate dinamicamente -->
                </div>
            </div>
        </div>
        
        <div class="controls">
            <div class="signal-selection">
                <h4>🚦 Seleziona Tipo Segnale</h4>
                <div class="signal-grid" id="signalGrid">
                    <!-- Griglia segnali caricata da signals.js -->
                </div>
            </div>
            
            <div class="control-buttons">
                <button class="control-btn primary" onclick="checkSolution()">
                    ✅ Verifica Soluzione
                </button>
                <button class="control-btn secondary" onclick="resetExercise()">
                    🔄 Ricomincia
                </button>
                <button class="control-btn" onclick="saveSolution()">
                    💾 Salva Soluzione
                </button>
                <button class="control-btn" onclick="showOtherSolutions()">
                    👥 Vedi Altre Soluzioni
                </button>
            </div>
        </div>
    `;
    
    // Inizializza l'esercizio
    initializeExercise(exercise);
}

function initializeExercise(exercise) {
    // Crea posizioni per i segnali
    createSignalPositions(exercise.signalCount);
    
    // Popola griglia segnali disponibili
    populateSignalGrid();
    
    // Imposta segnali di partenza e arrivo fissi
    setFixedSignals(exercise);
    
    // Inizializza array soluzione utente
    APP_STATE.userSolution = new Array(exercise.signalCount).fill(null);
    
    console.log('🚦 Esercizio inizializzato:', exercise);
}

function createSignalPositions(count) {
    const container = document.getElementById('signalPositions');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const position = document.createElement('div');
        position.className = 'signal-position';
        position.id = `position-${i}`;
        position.innerHTML = `
            <div class="signal-slot" onclick="selectSignalPosition(${i})">
                <span class="position-number">${i + 1}</span>
                <div class="signal-display" id="signal-${i}">
                    <span class="signal-placeholder">?</span>
                </div>
            </div>
            <div class="position-label">Pos. ${i + 1}</div>
        `;
        
        container.appendChild(position);
    }
}

function populateSignalGrid() {
    const grid = document.getElementById('signalGrid');
    if (!grid || typeof SIGNAL_TYPES === 'undefined') return;
    
    const signalTypes = APP_STATE.systemType === 2 ? 
        Object.values(SIGNAL_TYPES).filter(s => s.aspects === 2) :
        Object.values(SIGNAL_TYPES).filter(s => s.aspects === 3);
    
    grid.innerHTML = signalTypes.map(signal => `
        <div class="signal-option" data-signal-id="${signal.id}" onclick="selectSignalType('${signal.id}')">
            <div class="signal-icon" style="background-color: ${signal.color}">
                ${signal.icon}
            </div>
            <div class="signal-name">${signal.name}</div>
        </div>
    `).join('');
}

function setFixedSignals(exercise) {
    // Primo segnale = partenza (verde)
    const startSignalType = APP_STATE.systemType === 2 ? 'verde' : 'acc_verde';
    APP_STATE.userSolution[0] = startSignalType;
    updateSignalDisplay(0, startSignalType);
    
    // Ultimo segnale = arrivo (rosso)
    const endSignalType = APP_STATE.systemType === 2 ? 'rosso' : 'acc_rosso';
    const lastIndex = exercise.signalCount - 1;
    APP_STATE.userSolution[lastIndex] = endSignalType;
    updateSignalDisplay(lastIndex, endSignalType);
    
    // Disabilita modifica per primo e ultimo
    document.getElementById(`signal-${0}`).classList.add('fixed-signal');
    document.getElementById(`signal-${lastIndex}`).classList.add('fixed-signal');
}

/**
 * ==========================================
 * GESTIONE INTERAZIONE UTENTE
 * ==========================================
 */

let selectedPosition = null;

function selectSignalPosition(position) {
    // Non permette selezione per segnali fissi
    if (position === 0 || position === APP_STATE.currentExercise.signalCount - 1) {
        return;
    }
    
    // Deseleziona posizione precedente
    if (selectedPosition !== null) {
        document.getElementById(`position-${selectedPosition}`).classList.remove('selected');
    }
    
    // Seleziona nuova posizione
    selectedPosition = position;
    document.getElementById(`position-${position}`).classList.add('selected');
    
    console.log(`📍 Posizione ${position + 1} selezionata`);
}

function selectSignalType(signalId) {
    if (selectedPosition === null) {
        alert('⚠️ Seleziona prima una posizione sul binario!');
        return;
    }
    
    // Aggiorna soluzione utente
    APP_STATE.userSolution[selectedPosition] = signalId;
    
    // Aggiorna visualizzazione
    updateSignalDisplay(selectedPosition, signalId);
    
    // Deseleziona posizione
    document.getElementById(`position-${selectedPosition}`).classList.remove('selected');
    selectedPosition = null;
    
    console.log(`🚦 Segnale ${signalId} posizionato in posizione ${selectedPosition + 1}`);
}

function updateSignalDisplay(position, signalId) {
    const display = document.getElementById(`signal-${position}`);
    if (!display || typeof SIGNAL_TYPES === 'undefined') return;
    
    const signal = Object.values(SIGNAL_TYPES).find(s => s.id === signalId);
    if (!signal) return;
    
    display.innerHTML = `
        <div class="signal-icon" style="background-color: ${signal.color}">
            ${signal.icon}
        </div>
    `;
    display.classList.add('filled');
}

/**
 * ==========================================
 * CONTROLLI ESERCIZIO
 * ==========================================
 */

function checkSolution() {
    const solution = APP_STATE.userSolution;
    const emptyPositions = solution.filter(s => s === null).length;
    
    if (emptyPositions > 0) {
        alert(`⚠️ Completa tutti i segnali! Mancano ${emptyPositions} posizioni.`);
        return;
    }
    
    // Per ora mostra solo un messaggio di conferma
    // In futuro si potrebbe implementare una logica di validazione
    alert('✅ Soluzione completata! (Non ci sono risposte "corrette" predefinite)');
    
    console.log('✅ Soluzione verificata:', solution);
}

function resetExercise() {
    if (confirm('🔄 Vuoi ricominciare l\'esercizio?')) {
        initializeExercise(APP_STATE.currentExercise);
        selectedPosition = null;
    }
}

function saveSolution() {
    const solution = APP_STATE.userSolution;
    const emptyPositions = solution.filter(s => s === null).length;
    
    if (emptyPositions > 0) {
        alert('⚠️ Completa prima tutti i segnali per salvare!');
        return;
    }
    
    const userName = prompt('👤 Il tuo nome:', 'Anonimo') || 'Anonimo';
    
    const solutionData = {
        id: generateSolutionId(),
        railwayId: APP_STATE.currentExercise.railway.id,
        railwayName: APP_STATE.currentExercise.railway.name,
        startSignal: APP_STATE.currentExercise.startSignal.id,
        endSignal: APP_STATE.currentExercise.endSignal.id,
        solution: [...solution],
        systemType: APP_STATE.systemType,
        userName: userName,
        timestamp: new Date().toISOString(),
        exercise: APP_STATE.currentExercise
    };
    
    // Salva nel localStorage
    saveSolutionToDatabase(solutionData);
    
    alert(`💾 Soluzione di ${userName} salvata con successo!`);
    console.log('💾 Soluzione salvata:', solutionData);
}

function showOtherSolutions() {
    const exercise = APP_STATE.currentExercise;
    const solutions = getSolutionsForExercise(exercise.railway.id, exercise.startSignal.id, exercise.endSignal.id);
    
    if (solutions.length === 0) {
        alert('📋 Nessuna altra soluzione trovata per questo percorso.');
        return;
    }
    
    displaySolutionsComparison(solutions);
}

function backToRailwaySelection() {
    if (confirm('🔙 Tornare alla selezione della linea? (Il progresso andrà perso)')) {
        APP_STATE.currentMode = 'play';
        APP_STATE.isExerciseActive = false;
        APP_STATE.currentExercise = null;
        
        // Torna all'interfaccia di gioco
        if (typeof switchEditorMode === 'function') {
            switchEditorMode('play');
        }
    }
}

/**
 * ==========================================
 * DATABASE SOLUZIONI
 * ==========================================
 */

function saveSolutionToDatabase(solutionData) {
    let solutions = JSON.parse(localStorage.getItem('rfi_signal_solutions') || '[]');
    solutions.push(solutionData);
    localStorage.setItem('rfi_signal_solutions', JSON.stringify(solutions));
}

function getSolutionsForExercise(railwayId, startSignalId, endSignalId) {
    const solutions = JSON.parse(localStorage.getItem('rfi_signal_solutions') || '[]');
    return solutions.filter(sol => 
        sol.railwayId === railwayId && 
        sol.startSignal === startSignalId && 
        sol.endSignal === endSignalId
    );
}

function displaySolutionsComparison(solutions) {
    // Crea finestra modale per mostrare soluzioni
    const modal = document.createElement('div');
    modal.className = 'solutions-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>👥 Altre Soluzioni (${solutions.length})</h3>
                <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
            </div>
            <div class="solutions-list">
                ${solutions.map((sol, idx) => `
                    <div class="solution-item">
                        <h4>👤 ${sol.userName} - ${new Date(sol.timestamp).toLocaleDateString()}</h4>
                        <div class="solution-signals">
                            ${sol.solution.map((signalId, pos) => {
                                const signal = Object.values(SIGNAL_TYPES).find(s => s.id === signalId);
                                return signal ? `
                                    <div class="mini-signal" style="background-color: ${signal.color}">
                                        ${signal.icon}
                                    </div>
                                ` : '<div class="mini-signal">?</div>';
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function generateSolutionId() {
    return 'sol_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * ==========================================
 * UTILITÀ E HELPERS
 * ==========================================
 */

function switchSystemType() {
    APP_STATE.systemType = APP_STATE.systemType === 2 ? 3 : 2;
    
    if (APP_STATE.isExerciseActive) {
        populateSignalGrid();
        setFixedSignals(APP_STATE.currentExercise);
    }
    
    console.log(`🔄 Sistema cambiato a ${APP_STATE.systemType} aspetti`);
}

// Esporta funzioni globali
window.APP_STATE = APP_STATE;
window.handleSignalSelection = handleSignalSelection;
window.resetSignalSelection = resetSignalSelection;
window.startSignalExercise = startSignalExercise;
window.selectSignalPosition = selectSignalPosition;
window.selectSignalType = selectSignalType;
window.checkSolution = checkSolution;
window.resetExercise = resetExercise;
window.saveSolution = saveSolution;
window.showOtherSolutions = showOtherSolutions;
window.backToRailwaySelection = backToRailwaySelection;
window.switchSystemType = switchSystemType;

console.log('🎮 Main Controller inizializzato'); 