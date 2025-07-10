/**
 * MAIN.JS - COMPATIBILITÀ CON EDITOR MODERNO
 * ==========================================
 * Sistema principale per gestire segnali e esercizi
 * con supporto per la nuova interfaccia dell'editor
 */

// Stato principale dell'applicazione
const APP_STATE = {
    currentMode: 'exercises', // 'exercises' o 'editor'
    selectedSignals: [],
    currentExercise: null,
    solutions: [],
    signalTypes: {}
};

/**
 * ==========================================
 * INIZIALIZZAZIONE PRINCIPALE
 * ==========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inizializzazione Sistema RFI');
    
    // Carica tipi di segnali
    loadSignalTypes();
    
    // Determina modalità basata su URL o contenuto pagina
    if (document.querySelector('.exercise-info')) {
        // Siamo nella pagina dell'editor
        APP_STATE.currentMode = 'editor';
        console.log('📝 Modalità Editor attivata');
    } else {
        // Modalità esercizi classica
        APP_STATE.currentMode = 'exercises';
        initializeExerciseMode();
        console.log('🎮 Modalità Esercizi attivata');
    }
});

/**
 * ==========================================
 * MODALITÀ ESERCIZI CLASSICA
 * ==========================================
 */

function initializeExerciseMode() {
    setupExerciseInterface();
    loadDefaultExercises();
    bindExerciseEvents();
}

function setupExerciseInterface() {
    // Interfaccia per esercizi classici sui segnali
    const exerciseContainer = document.querySelector('.signal-exercise') || 
                             document.querySelector('.exercise-container');
    
    if (!exerciseContainer) {
        console.log('ℹ️ Container esercizi non trovato, creazione automatica...');
        createExerciseContainer();
    }
}

function createExerciseContainer() {
    const container = document.createElement('div');
    container.className = 'signal-exercise';
    container.innerHTML = `
        <div class="exercise-header">
            <h2>🚦 Esercizi Segnali RFI</h2>
            <div class="exercise-stats">
                <span id="exerciseCount">0 esercizi</span>
                <span id="completedCount">0 completati</span>
            </div>
        </div>
        
        <div class="exercise-content">
            <div class="signal-grid" id="signalGrid">
                <!-- Griglia segnali generata dinamicamente -->
            </div>
            
            <div class="exercise-controls">
                <button class="control-btn primary" onclick="checkSolution()">
                    ✅ Verifica Soluzione
                </button>
                <button class="control-btn secondary" onclick="resetExercise()">
                    🔄 Reset
                </button>
                <button class="control-btn secondary" onclick="showHint()">
                    💡 Suggerimento
                </button>
            </div>
            
            <div class="exercise-feedback" id="exerciseFeedback">
                <!-- Feedback dinamico -->
            </div>
        </div>
    `;
    
    document.body.appendChild(container);
}

/**
 * ==========================================
 * GESTIONE SEGNALI
 * ==========================================
 */

function loadSignalTypes() {
    // Carica tipi di segnali dal modulo signals.js
    if (typeof loadSignalTypes === 'function') {
        APP_STATE.signalTypes = loadSignalTypes();
    } else if (typeof SIGNAL_TYPES !== 'undefined') {
        APP_STATE.signalTypes = SIGNAL_TYPES;
    } else {
        console.warn('⚠️ Tipi di segnali non disponibili');
        APP_STATE.signalTypes = {};
    }
    
    console.log('📡 Segnali caricati:', Object.keys(APP_STATE.signalTypes).length);
}

function renderSignalGrid(signals, container) {
    if (!container) return;
    
    container.innerHTML = signals.map(signal => `
        <div class="signal-item" 
             data-signal="${signal.id}"
             data-state="none"
             onclick="toggleSignalState(this, '${signal.id}')">
            <div class="signal-light red"></div>
            <div class="signal-light yellow" style="display: none;"></div>
            <div class="signal-light green"></div>
            <div class="signal-label">${signal.name}</div>
        </div>
    `).join('');
}

function toggleSignalState(element, signalId) {
    const currentState = element.dataset.state;
    const signal = APP_STATE.signalTypes[signalId];
    
    if (!signal) return;
    
    let newState;
    if (signal.aspects === 2) {
        // Segnale 2 aspetti: rosso ↔ verde
        newState = currentState === 'red' ? 'green' : 'red';
    } else {
        // Segnale 3 aspetti: rosso → giallo → verde → rosso
        switch (currentState) {
            case 'none':
            case 'red': newState = 'yellow'; break;
            case 'yellow': newState = 'green'; break;
            case 'green': newState = 'red'; break;
        }
    }
    
    updateSignalDisplay(element, newState);
    updateSelectedSignals(signalId, newState);
}

function updateSignalDisplay(element, state) {
    element.dataset.state = state;
    
    const lights = element.querySelectorAll('.signal-light');
    lights.forEach(light => light.style.display = 'none');
    
    if (state !== 'none') {
        const activeLight = element.querySelector(`.signal-light.${state}`);
        if (activeLight) {
            activeLight.style.display = 'block';
        }
    }
    
    // Feedback visivo
    element.classList.remove('signal-correct', 'signal-wrong');
    element.classList.add('signal-active');
}

function updateSelectedSignals(signalId, state) {
    const existingIndex = APP_STATE.selectedSignals.findIndex(s => s.id === signalId);
    
    if (existingIndex >= 0) {
        if (state === 'none') {
            APP_STATE.selectedSignals.splice(existingIndex, 1);
        } else {
            APP_STATE.selectedSignals[existingIndex].state = state;
        }
    } else if (state !== 'none') {
        APP_STATE.selectedSignals.push({ id: signalId, state: state });
    }
    
    console.log('🎯 Segnali selezionati:', APP_STATE.selectedSignals);
}

/**
 * ==========================================
 * SISTEMA ESERCIZI
 * ==========================================
 */

function loadDefaultExercises() {
    // Esercizi predefiniti per il sistema classico
    const exercises = [
        {
            id: 'basic_2aspect',
            name: 'Segnali Base 2 Aspetti',
            description: 'Imposta i segnali per permettere il transito',
            signals: ['SE_BASE', 'SE_PROTEZIONE'],
            solution: [
                { id: 'SE_BASE', state: 'green' },
                { id: 'SE_PROTEZIONE', state: 'green' }
            ],
            difficulty: 1
        },
        {
            id: 'advanced_3aspect',
            name: 'Segnali Avanzati 3 Aspetti',
            description: 'Configura il percorso con limitazione di velocità',
            signals: ['SE_AVANZATO', 'SE_RIPETITORE'],
            solution: [
                { id: 'SE_AVANZATO', state: 'yellow' },
                { id: 'SE_RIPETITORE', state: 'green' }
            ],
            difficulty: 2
        }
    ];
    
    APP_STATE.exercises = exercises;
    APP_STATE.currentExercise = exercises[0];
    
    renderCurrentExercise();
}

function renderCurrentExercise() {
    if (!APP_STATE.currentExercise) return;
    
    const exercise = APP_STATE.currentExercise;
    const container = document.getElementById('signalGrid');
    
    if (container) {
        const exerciseSignals = exercise.signals.map(id => 
            APP_STATE.signalTypes[id]).filter(Boolean);
        renderSignalGrid(exerciseSignals, container);
    }
    
    // Aggiorna titolo e descrizione
    updateExerciseInfo(exercise);
}

function updateExerciseInfo(exercise) {
    const title = document.querySelector('.exercise-header h2');
    const description = document.querySelector('.exercise-description');
    
    if (title) {
        title.textContent = `🚦 ${exercise.name}`;
    }
    
    if (description) {
        description.textContent = exercise.description;
    }
}

/**
 * ==========================================
 * VERIFICA SOLUZIONI
 * ==========================================
 */

function checkSolution() {
    if (!APP_STATE.currentExercise) {
        showFeedback('Nessun esercizio caricato', 'error');
        return;
    }
    
    const exercise = APP_STATE.currentExercise;
    const solution = exercise.solution;
    const selected = APP_STATE.selectedSignals;
    
    // Verifica completezza
    if (selected.length !== solution.length) {
        showFeedback(`Configurazione incompleta. Richiesti ${solution.length} segnali, configurati ${selected.length}`, 'warning');
        return;
    }
    
    // Verifica correttezza
    let correct = 0;
    const feedback = [];
    
    solution.forEach(expectedSignal => {
        const actualSignal = selected.find(s => s.id === expectedSignal.id);
        
        if (!actualSignal) {
            feedback.push(`❌ Segnale ${expectedSignal.id} non configurato`);
        } else if (actualSignal.state !== expectedSignal.state) {
            feedback.push(`❌ Segnale ${expectedSignal.id}: atteso ${expectedSignal.state}, trovato ${actualSignal.state}`);
        } else {
            feedback.push(`✅ Segnale ${expectedSignal.id}: corretto`);
            correct++;
        }
    });
    
    // Mostra risultato
    if (correct === solution.length) {
        showFeedback('🎉 Soluzione corretta! Esercizio completato.', 'success');
        markExerciseCompleted(exercise.id);
    } else {
        showFeedback(feedback.join('<br>'), 'error');
        highlightSignalErrors(solution, selected);
    }
}

function showFeedback(message, type) {
    const feedbackElement = document.getElementById('exerciseFeedback');
    if (!feedbackElement) return;
    
    feedbackElement.innerHTML = `
        <div class="feedback-message ${type}">
            ${message}
        </div>
    `;
    
    // Auto-hide dopo 5 secondi per successo
    if (type === 'success') {
        setTimeout(() => {
            feedbackElement.innerHTML = '';
        }, 5000);
    }
}

function highlightSignalErrors(solution, selected) {
    solution.forEach(expectedSignal => {
        const actualSignal = selected.find(s => s.id === expectedSignal.id);
        const signalElement = document.querySelector(`[data-signal="${expectedSignal.id}"]`);
        
        if (signalElement) {
            if (!actualSignal || actualSignal.state !== expectedSignal.state) {
                signalElement.classList.add('signal-wrong');
            } else {
                signalElement.classList.add('signal-correct');
            }
        }
    });
}

function markExerciseCompleted(exerciseId) {
    // Salva progresso in localStorage
    let completed = JSON.parse(localStorage.getItem('rfi_completed_exercises') || '[]');
    if (!completed.includes(exerciseId)) {
        completed.push(exerciseId);
        localStorage.setItem('rfi_completed_exercises', JSON.stringify(completed));
    }
    
    updateExerciseStats();
}

function updateExerciseStats() {
    const completed = JSON.parse(localStorage.getItem('rfi_completed_exercises') || '[]');
    const total = APP_STATE.exercises ? APP_STATE.exercises.length : 0;
    
    const exerciseCount = document.getElementById('exerciseCount');
    const completedCount = document.getElementById('completedCount');
    
    if (exerciseCount) {
        exerciseCount.textContent = `${total} esercizi`;
    }
    
    if (completedCount) {
        completedCount.textContent = `${completed.length} completati`;
    }
}

/**
 * ==========================================
 * CONTROLLI ESERCIZIO
 * ==========================================
 */

function resetExercise() {
    APP_STATE.selectedSignals = [];
    
    // Reset visuale segnali
    document.querySelectorAll('.signal-item').forEach(item => {
        item.dataset.state = 'none';
        item.classList.remove('signal-active', 'signal-correct', 'signal-wrong');
        item.querySelectorAll('.signal-light').forEach(light => {
            light.style.display = 'none';
        });
    });
    
    // Pulisci feedback
    const feedbackElement = document.getElementById('exerciseFeedback');
    if (feedbackElement) {
        feedbackElement.innerHTML = '';
    }
    
    showFeedback('Esercizio resettato', 'info');
}

function showHint() {
    if (!APP_STATE.currentExercise) return;
    
    const exercise = APP_STATE.currentExercise;
    const hints = {
        'basic_2aspect': 'Imposta entrambi i segnali su verde per permettere il transito normale.',
        'advanced_3aspect': 'Usa il giallo per indicare limitazione di velocità, verde per via libera.'
    };
    
    const hint = hints[exercise.id] || 'Consulta il manuale RFI per le configurazioni corrette.';
    showFeedback(`💡 Suggerimento: ${hint}`, 'info');
}

/**
 * ==========================================
 * INTEGRAZIONE CON EDITOR MODERNO
 * ==========================================
 */

function switchToEditor() {
    // Passa dalla modalità esercizi all'editor moderno
    APP_STATE.currentMode = 'editor';
    
    // Nasconde interfaccia esercizi
    const exerciseContainer = document.querySelector('.signal-exercise');
    if (exerciseContainer) {
        exerciseContainer.style.display = 'none';
    }
    
    // Attiva editor se non già attivo
    if (typeof initializeRailwayEditor === 'function') {
        initializeRailwayEditor();
    }
    
    console.log('🔄 Passaggio alla modalità Editor');
}

function switchToExercises() {
    // Passa dall'editor alla modalità esercizi
    APP_STATE.currentMode = 'exercises';
    
    // Mostra interfaccia esercizi
    const exerciseContainer = document.querySelector('.signal-exercise');
    if (exerciseContainer) {
        exerciseContainer.style.display = 'block';
    }
    
    // Nasconde editor
    const editorContainer = document.querySelector('.modern-editor-layout');
    if (editorContainer) {
        editorContainer.style.display = 'none';
    }
    
    console.log('🔄 Passaggio alla modalità Esercizi');
}

/**
 * ==========================================
 * COMPATIBILITÀ E UTILITY
 * ==========================================
 */

function bindExerciseEvents() {
    // Event delegation per elementi dinamici
    document.addEventListener('click', function(e) {
        if (e.target.matches('.next-exercise')) {
            loadNextExercise();
        } else if (e.target.matches('.prev-exercise')) {
            loadPrevExercise();
        } else if (e.target.matches('.exercise-selector')) {
            selectExercise(e.target.dataset.exerciseId);
        }
    });
}

function loadNextExercise() {
    if (!APP_STATE.exercises || !APP_STATE.currentExercise) return;
    
    const currentIndex = APP_STATE.exercises.findIndex(ex => ex.id === APP_STATE.currentExercise.id);
    const nextIndex = (currentIndex + 1) % APP_STATE.exercises.length;
    
    APP_STATE.currentExercise = APP_STATE.exercises[nextIndex];
    renderCurrentExercise();
    resetExercise();
}

function loadPrevExercise() {
    if (!APP_STATE.exercises || !APP_STATE.currentExercise) return;
    
    const currentIndex = APP_STATE.exercises.findIndex(ex => ex.id === APP_STATE.currentExercise.id);
    const prevIndex = currentIndex === 0 ? APP_STATE.exercises.length - 1 : currentIndex - 1;
    
    APP_STATE.currentExercise = APP_STATE.exercises[prevIndex];
    renderCurrentExercise();
    resetExercise();
}

function selectExercise(exerciseId) {
    if (!APP_STATE.exercises) return;
    
    const exercise = APP_STATE.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
        APP_STATE.currentExercise = exercise;
        renderCurrentExercise();
        resetExercise();
    }
}

/**
 * ==========================================
 * API PER INTEROPERABILITÀ
 * ==========================================
 */

// Espone funzioni per l'uso da parte dell'editor o altre parti del sistema
window.APP_STATE = APP_STATE;
window.toggleSignalState = toggleSignalState;
window.checkSolution = checkSolution;
window.resetExercise = resetExercise;
window.showHint = showHint;
window.switchToEditor = switchToEditor;
window.switchToExercises = switchToExercises;

/**
 * ==========================================
 * DEBUG UTILITIES
 * ==========================================
 */

function debugMainState() {
    console.log('🔍 DEBUG APP_STATE:', {
        currentMode: APP_STATE.currentMode,
        selectedSignals: APP_STATE.selectedSignals,
        currentExercise: APP_STATE.currentExercise?.name,
        totalExercises: APP_STATE.exercises?.length,
        signalTypesLoaded: Object.keys(APP_STATE.signalTypes).length
    });
}

// Espone debug globalmente
window.debugMain = debugMainState;

console.log('✅ Main.js inizializzato - Sistema RFI pronto'); 