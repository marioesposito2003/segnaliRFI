/**
 * SIMULATORE SEGNALI RFI - LOGICA PRINCIPALE
 * ==========================================
 * Gestione completa dell'interfaccia e della logica di gioco
 */

// Variabili globali dello stato dell'applicazione
let currentSystem = 2; // 2 = sistema 2 aspetti, 3 = sistema 3 aspetti
let currentExerciseIndex = 0;
let currentExercise = null;
let currentExercises = [];
let selectedPosition = null;
let selectedSignal = null;
let userSolution = [];
let isChecked = false;
let stats = {
    correct: 0,
    total: 0,
    hints: 0
};

/**
 * ==========================================
 * INIZIALIZZAZIONE APPLICAZIONE
 * ==========================================
 */

// Inizializzazione quando il DOM è caricato
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚂 Inizializzazione Simulatore Segnali RFI...');
    
    // Verifica che tutti i dati siano caricati
    if (typeof SIGNAL_TYPES === 'undefined' || typeof EXERCISES_2_ASPECT === 'undefined' || typeof TRACK_CONFIGS === 'undefined') {
        console.log('⏳ Attendo caricamento dati...');
        setTimeout(() => {
            document.dispatchEvent(new Event('DOMContentLoaded'));
        }, 100);
        return;
    }
    
    initializeApp();
});

function initializeApp() {
    console.log('📊 Dati caricati, inizializzazione in corso...');
    
    // Inizializza sistema 2 aspetti come default
    currentExercises = EXERCISES_2_ASPECT;
    
    // Crea interfaccia
    createSignalGrids();
    updateStats();
    
    // Carica primo esercizio
    loadExercise(0);
    
    console.log('✅ Simulatore inizializzato correttamente');
}

/**
 * ==========================================
 * GESTIONE SISTEMI (2/3 ASPETTI)
 * ==========================================
 */

function switchSystem(system) {
    currentSystem = system;
    currentExerciseIndex = 0;
    currentExercises = system === 2 ? EXERCISES_2_ASPECT : EXERCISES_3_ASPECT;
    
    // Aggiorna pulsanti del sistema
    document.querySelectorAll('.system-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Attiva il pulsante corretto
    const buttons = document.querySelectorAll('.system-btn');
    if (system === 2 && buttons[0]) {
        buttons[0].classList.add('active');
    } else if (system === 3 && buttons[1]) {
        buttons[1].classList.add('active');
    }
    
    // Ricrea interfaccia
    createSignalGrids();
    loadExercise(0);
    
    console.log(`🔄 Cambiato a sistema ${system} aspetti`);
}

/**
 * ==========================================
 * GESTIONE INTERFACCIA SEGNALI
 * ==========================================
 */

function createSignalGrids() {
    const container = document.getElementById('signalCategories');
    if (!container) return;
    
    container.innerHTML = '';

    if (currentSystem === 2) {
        // Sistema 2 aspetti: Prima Categoria + Avviso
        const primaCategory = createSignalCategory('🔴 Segnali di Prima Categoria', 'prima_categoria', 2);
        const avvisoCategory = createSignalCategory('🟡 Segnali di Avviso', 'avviso', 2);
        
        container.appendChild(primaCategory);
        container.appendChild(avvisoCategory);
    } else {
        // Sistema 3 aspetti: Solo Accoppiati
        const accoppiatoCategory = createSignalCategory('🟣 Segnali Accoppiati (3 Aspetti)', 'accoppiato', 3);
        container.appendChild(accoppiatoCategory);
    }
}

function createSignalCategory(title, category, system) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'signal-category';
    
    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    categoryDiv.appendChild(titleElement);
    
    const gridDiv = document.createElement('div');
    gridDiv.className = 'signal-grid';
    
    const signals = Object.values(SIGNAL_TYPES).filter(s => 
        s.category === category && s.system === system
    );
    
    signals.forEach(signal => {
        const option = createSignalOption(signal);
        gridDiv.appendChild(option);
    });
    
    categoryDiv.appendChild(gridDiv);
    return categoryDiv;
}

function createSignalOption(signal) {
    const option = document.createElement('div');
    option.className = 'signal-option';
    option.dataset.signalId = signal.id;
    option.title = `${signal.name} - ${signal.meaning}`;
    
    const icon = document.createElement('div');
    icon.className = `signal-option-icon ${signal.class}`;
    icon.textContent = signal.icon;
    
    const name = document.createElement('div');
    name.className = 'signal-option-name';
    name.textContent = signal.name;
    
    option.appendChild(icon);
    option.appendChild(name);
    
    option.addEventListener('click', () => selectSignal(signal.id));
    
    return option;
}

/**
 * ==========================================
 * GESTIONE ESERCIZI
 * ==========================================
 */

function loadExercise(index) {
    if (index >= currentExercises.length) {
        showCompletionMessage();
        return;
    }

    currentExerciseIndex = index;
    currentExercise = currentExercises[index];
    
    // Reset stato
    selectedPosition = null;
    selectedSignal = null;
    userSolution = new Array(currentExercise.positions).fill(null);
    isChecked = false;
    
    // Aggiorna interfaccia
    updateExerciseInfo();
    updateTrackVisualization();
    createSignalPositions();
    hideResults();
    updateProgress();
    
    console.log(`📋 Caricato esercizio ${index + 1}:`, currentExercise.title);
}

function updateExerciseInfo() {
    // Controllo di sicurezza
    if (!currentExercise) {
        console.log('⚠️ Esercizio non ancora caricato');
        return;
    }
    
    const counterEl = document.getElementById('exerciseCounter');
    const difficultyEl = document.getElementById('difficultyBadge');
    const titleEl = document.getElementById('exerciseTitle');
    const descriptionEl = document.getElementById('exerciseDescription');
    const conditionsGrid = document.getElementById('conditionsGrid');
    
    if (counterEl) {
        counterEl.textContent = `Esercizio ${currentExerciseIndex + 1} di ${currentExercises.length} (${currentSystem} aspetti)`;
    }
    
    if (difficultyEl) {
        difficultyEl.textContent = currentExercise.difficulty.charAt(0).toUpperCase() + currentExercise.difficulty.slice(1);
        difficultyEl.className = `difficulty-badge difficulty-${currentExercise.difficulty}`;
    }
    
    if (titleEl) titleEl.textContent = currentExercise.title;
    if (descriptionEl) descriptionEl.textContent = currentExercise.description;
    
    if (conditionsGrid) {
        conditionsGrid.innerHTML = '';
        currentExercise.conditions.forEach(condition => {
            const conditionItem = document.createElement('div');
            conditionItem.className = 'condition-item';
            conditionItem.textContent = condition;
            conditionsGrid.appendChild(conditionItem);
        });
    }
}

function updateTrackVisualization() {
    // Controllo di sicurezza
    if (!currentExercise) {
        console.log('⚠️ Esercizio non disponibile per visualizzazione tracciato');
        return;
    }
    
    const trackInfo = document.getElementById('trackInfo');
    const railwayLayout = document.getElementById('railwayLayout');
    
    if (trackInfo) {
        trackInfo.textContent = TRACK_CONFIGS[currentExercise.trackConfig] || 'Configurazione standard';
    }
    
    if (railwayLayout) {
        // Rimuovi elementi tracciato precedenti
        const existingElements = railwayLayout.querySelectorAll('.deviation-track, .tronchino-track');
        existingElements.forEach(el => el.remove());
        
        // Aggiungi elementi specifici per tipo tracciato
        if (currentExercise.trackConfig === 'deviation' || 
            currentExercise.trackConfig === 'av_deviation' ||
            currentExercise.trackConfig.includes('deviation')) {
            const deviationTrack = document.createElement('div');
            deviationTrack.className = 'deviation-track';
            railwayLayout.appendChild(deviationTrack);
        }
        
        if (currentExercise.trackConfig === 'tronchino' || 
            currentExercise.trackConfig === 'maintenance_depot') {
            const tronchinoTrack = document.createElement('div');
            tronchinoTrack.className = 'tronchino-track';
            railwayLayout.appendChild(tronchinoTrack);
        }
    }
}

function createSignalPositions() {
    const container = document.getElementById('signalPositions');
    if (!container) return;
    
    // Controllo di sicurezza
    if (!currentExercise || !currentExercise.positions) {
        console.log('⚠️ Esercizio non disponibile per creazione posizioni');
        return;
    }
    
    container.innerHTML = '';
    
    for (let i = 0; i < currentExercise.positions; i++) {
        const position = document.createElement('div');
        position.className = 'signal-position';
        position.dataset.position = i;
        
        const number = document.createElement('div');
        number.className = 'signal-number';
        number.textContent = `${i + 1}`;
        position.appendChild(number);
        
        position.addEventListener('click', () => selectPosition(i));
        container.appendChild(position);
    }
}

/**
 * ==========================================
 * GESTIONE SELEZIONI E POSIZIONAMENTO
 * ==========================================
 */

function selectPosition(positionIndex) {
    if (isChecked) return;
    
    document.querySelectorAll('.signal-position').forEach(pos => {
        pos.classList.remove('selected');
    });
    
    const position = document.querySelector(`[data-position="${positionIndex}"]`);
    if (position) {
        position.classList.add('selected');
        selectedPosition = positionIndex;
        
        console.log(`📍 Posizione ${positionIndex + 1} selezionata`);
    }
}

function selectSignal(signalId) {
    if (isChecked) return;
    
    document.querySelectorAll('.signal-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const option = document.querySelector(`[data-signal-id="${signalId}"]`);
    if (option) {
        option.classList.add('selected');
        selectedSignal = signalId;
        
        if (selectedPosition !== null) {
            placeSignal(selectedPosition, signalId);
        }
        
        console.log(`🚦 Segnale ${signalId} selezionato`);
    }
}

function placeSignal(positionIndex, signalId) {
    const position = document.querySelector(`[data-position="${positionIndex}"]`);
    const signal = Object.values(SIGNAL_TYPES).find(s => s.id === signalId);
    
    if (!position || !signal) return;
    
    const existingIcon = position.querySelector('.signal-icon');
    if (existingIcon) {
        existingIcon.remove();
    }
    
    const icon = document.createElement('div');
    icon.className = `signal-icon ${signal.class}`;
    icon.textContent = signal.icon;
    icon.title = `${signal.name} - ${signal.meaning}`;
    position.appendChild(icon);
    
    position.classList.add('filled');
    position.classList.remove('selected');
    userSolution[positionIndex] = signalId;
    
    // Reset selezioni
    selectedPosition = null;
    selectedSignal = null;
    
    document.querySelectorAll('.signal-position, .signal-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    console.log(`✅ Segnale ${signal.name} inserito in posizione ${positionIndex + 1}`);
}

/**
 * ==========================================
 * AZIONI UTENTE (CONTROLLI)
 * ==========================================
 */

function clearAllSignals() {
    if (isChecked) return;
    
    userSolution = new Array(currentExercise.positions).fill(null);
    
    document.querySelectorAll('.signal-position').forEach(position => {
        const icon = position.querySelector('.signal-icon');
        if (icon) {
            icon.remove();
        }
        position.classList.remove('filled', 'selected', 'correct', 'incorrect');
    });
    
    selectedPosition = null;
    selectedSignal = null;
    
    document.querySelectorAll('.signal-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    console.log('🗑️ Tutti i segnali rimossi');
}

function showHint() {
    if (isChecked) return;
    
    stats.hints++;
    
    const emptyPosition = userSolution.findIndex(signal => signal === null);
    
    if (emptyPosition !== -1) {
        const correctSignal = currentExercise.solution[emptyPosition];
        const signal = Object.values(SIGNAL_TYPES).find(s => s.id === correctSignal);
        
        let contextInfo = '';
        if (currentExercise.trackConfig.includes('deviation')) {
            contextInfo = '\n\n💡 Ricorda: le deviazioni richiedono segnali con lampeggiamenti alternativi.';
        } else if (currentExercise.trackConfig.includes('tronchino')) {
            contextInfo = '\n\n💡 Ricorda: i tronchini richiedono limitazioni severe con lampeggiamenti contemporanei.';
        } else if (currentExercise.trackConfig.includes('av')) {
            contextInfo = '\n\n💡 Ricorda: le linee AV usano segnali accoppiati a 3 aspetti.';
        }
        
        alert(`💡 Suggerimento per posizione ${emptyPosition + 1}:\n\n` +
              `Segnale consigliato: ${signal.name}\n` +
              `Significato: ${signal.meaning}\n\n` +
              `Contesto: ${TRACK_CONFIGS[currentExercise.trackConfig]}${contextInfo}`);
    } else {
        alert('💡 Hai completato tutte le posizioni!\nClicca "Verifica" per controllare la soluzione.');
    }
}

function checkSolution() {
    if (isChecked) return;
    
    isChecked = true;
    stats.total++;
    
    const results = [];
    let correctCount = 0;
    
    for (let i = 0; i < currentExercise.positions; i++) {
        const userSignal = userSolution[i];
        const correctSignal = currentExercise.solution[i];
        const position = document.querySelector(`[data-position="${i}"]`);
        
        const userSignalObj = userSignal ? Object.values(SIGNAL_TYPES).find(s => s.id === userSignal) : null;
        const correctSignalObj = Object.values(SIGNAL_TYPES).find(s => s.id === correctSignal);
        
        if (userSignal === correctSignal) {
            position.classList.add('correct');
            position.classList.remove('incorrect');
            results.push({
                position: i + 1,
                correct: true,
                userSignal: userSignalObj,
                correctSignal: correctSignalObj,
                message: `✅ Corretto: ${correctSignalObj.name}`
            });
            correctCount++;
        } else {
            position.classList.add('incorrect');
            position.classList.remove('correct');
            results.push({
                position: i + 1,
                correct: false,
                userSignal: userSignalObj,
                correctSignal: correctSignalObj,
                message: `❌ Sbagliato: ${userSignalObj ? userSignalObj.name : 'Vuoto'} → ${correctSignalObj.name}`
            });
        }
    }
    
    const isSuccess = correctCount === currentExercise.positions;
    if (isSuccess) {
        stats.correct++;
    }
    
    showResults(results, isSuccess);
    updateStats();
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.style.display = 'inline-block';
    }
    
    console.log(`📊 Esercizio completato: ${correctCount}/${currentExercise.positions} corretti`);
}

function nextExercise() {
    loadExercise(currentExerciseIndex + 1);
}

/**
 * ==========================================
 * GESTIONE RISULTATI E FEEDBACK
 * ==========================================
 */

function showResults(results, isSuccess) {
    const resultsDiv = document.getElementById('results');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsGrid = document.getElementById('resultsGrid');
    const explanation = document.getElementById('explanation');
    
    if (!resultsDiv) return;
    
    resultsDiv.className = 'results show';
    resultsDiv.classList.add(isSuccess ? 'success' : 'error');
    
    if (resultsTitle) {
        resultsTitle.innerHTML = isSuccess ? 
            '🎉 Esercizio Completato Perfettamente!' : 
            '📚 Rivediamo la soluzione corretta';
    }
    
    if (resultsGrid) {
        resultsGrid.innerHTML = '';
        results.forEach(result => {
            const item = document.createElement('div');
            item.className = `result-item ${result.correct ? 'correct' : 'incorrect'}`;
            item.innerHTML = `
                <strong>Posizione ${result.position}</strong><br>
                ${result.message}<br>
                <small><em>${result.correctSignal.meaning}</em></small>
            `;
            resultsGrid.appendChild(item);
        });
    }
    
    if (explanation) {
        explanation.innerHTML = `
            <h4>📖 Spiegazione Tecnica</h4>
            <p><strong>Configurazione:</strong> ${TRACK_CONFIGS[currentExercise.trackConfig]}</p>
            <p><strong>Soluzione:</strong> ${currentExercise.explanation}</p>
            ${!isSuccess ? '<p><strong>💡 Analizza le condizioni specifiche dell\'esercizio per comprendere la logica della sequenza.</strong></p>' : ''}
        `;
    }
    
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function hideResults() {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) return;
    
    resultsDiv.className = 'results';
    resultsDiv.classList.remove('success', 'error');
    isChecked = false;
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.style.display = 'none';
    }
    
    document.querySelectorAll('.signal-position').forEach(position => {
        position.classList.remove('correct', 'incorrect');
    });
}

/**
 * ==========================================
 * GESTIONE STATISTICHE E PROGRESSI
 * ==========================================
 */

function updateStats() {
    const correctCount = document.getElementById('correctCount');
    const totalCount = document.getElementById('totalCount');
    const accuracyPercent = document.getElementById('accuracyPercent');
    
    if (correctCount) correctCount.textContent = stats.correct;
    if (totalCount) totalCount.textContent = stats.total;
    
    if (accuracyPercent) {
        const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        accuracyPercent.textContent = `${accuracy}%`;
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const progress = ((currentExerciseIndex + 1) / currentExercises.length) * 100;
        progressFill.style.width = `${progress}%`;
    }
}

function showCompletionMessage() {
    const accuracy = Math.round((stats.correct / stats.total) * 100);
    let level = '';
    
    if (accuracy >= 95) level = 'ESPERTO RFI CERTIFICATO 🏆';
    else if (accuracy >= 85) level = 'OPERATORE SENIOR 🥇';
    else if (accuracy >= 75) level = 'OPERATORE QUALIFICATO 🥈';
    else if (accuracy >= 60) level = 'OPERATORE BASE 🥉';
    else level = 'IN FORMAZIONE 📚';
    
    const systemName = currentSystem === 2 ? '2 ASPETTI' : '3 ASPETTI';
    
    alert(`🎊 COMPLIMENTI! 🎊\n\n` +
          `Hai completato tutti gli esercizi del sistema ${systemName}!\n\n` +
          `📊 STATISTICHE FINALI:\n` +
          `• Esercizi corretti: ${stats.correct}/${stats.total}\n` +
          `• Precisione: ${accuracy}%\n` +
          `• Suggerimenti usati: ${stats.hints}\n` +
          `• Livello raggiunto: ${level}\n\n` +
          `${currentSystem === 2 ? 'Prova ora il sistema a 3 aspetti!' : 'Hai completato entrambi i sistemi!'}`);
}

/**
 * ==========================================
 * API DEBUG (FUNZIONI DI SVILUPPO)
 * ==========================================
 */

// API Debug per sviluppatori
window.debugRFI = {
    currentExercise: () => currentExercise,
    userSolution: () => userSolution,
    currentSystem: () => currentSystem,
    showSolution: () => {
        console.table(currentExercise.solution.map((signal, i) => ({
            posizione: i + 1,
            segnaleCorretto: signal,
            nomeCorretto: Object.values(SIGNAL_TYPES).find(s => s.id === signal)?.name || 'N/A',
            segnaleUtente: userSolution[i] || 'vuoto',
            nomeUtente: userSolution[i] ? Object.values(SIGNAL_TYPES).find(s => s.id === userSolution[i])?.name || 'N/A' : 'vuoto'
        })));
    },
    stats: () => stats,
    jumpToExercise: (index) => loadExercise(index),
    switchSystem: (system) => switchSystem(system),
    SIGNAL_TYPES,
    EXERCISES_2_ASPECT,
    EXERCISES_3_ASPECT,
    TRACK_CONFIGS
};

console.log('🚂 Simulatore Segnali RFI Completo inizializzato!');
console.log('🔧 Usa window.debugRFI per funzioni di debug avanzate'); 