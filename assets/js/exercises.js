/**
 * EDITOR LINEE FERROVIARIE RFI - SISTEMA PERSONALIZZATO
 * =====================================================
 * Costruisci la tua linea ferroviaria da zero
 */

// Elementi disponibili per costruire la linea
const RAILWAY_ELEMENTS = {
    // Segnali vuoti da riempire
    SIGNAL_EMPTY: {
        id: 'signal_empty',
        name: 'Segnale Vuoto',
        type: 'signal',
        icon: '⚪',
        color: '#ddd',
        draggable: true
    },
    
    // Tronchini
    TRONCHINO: {
        id: 'tronchino',
        name: 'Tronchino',
        type: 'tronchino',
        icon: '🔧',
        color: '#9b59b6',
        draggable: true
    },
    
    // Limitatori di velocità
    SPEED_LIMIT_60: {
        id: 'speed_60',
        name: 'Limite 60 km/h',
        type: 'speed_limit',
        icon: '60',
        color: '#e74c3c',
        value: 60,
        draggable: true
    },
    
    SPEED_LIMIT_80: {
        id: 'speed_80',
        name: 'Limite 80 km/h',
        type: 'speed_limit',
        icon: '80',
        color: '#f39c12',
        value: 80,
        draggable: true
    },
    
    SPEED_LIMIT_100: {
        id: 'speed_100',
        name: 'Limite 100 km/h',
        type: 'speed_limit',
        icon: '100',
        color: '#27ae60',
        value: 100,
        draggable: true
    },
    
    SPEED_LIMIT_120: {
        id: 'speed_120',
        name: 'Limite 120 km/h',
        type: 'speed_limit',
        icon: '120',
        color: '#3498db',
        value: 120,
        draggable: true
    },
    
    // Marcatori di distanza
    DISTANCE_500: {
        id: 'dist_500',
        name: 'Distanza 500m',
        type: 'distance',
        icon: '500m',
        color: '#2c3e50',
        value: 500,
        draggable: true
    },
    
    DISTANCE_1000: {
        id: 'dist_1000',
        name: 'Distanza 1000m',
        type: 'distance',
        icon: '1km',
        color: '#2c3e50',
        value: 1000,
        draggable: true
    },
    
    DISTANCE_1200: {
        id: 'dist_1200',
        name: 'Distanza 1200m',
        type: 'distance',
        icon: '1.2km',
        color: '#2c3e50',
        value: 1200,
        draggable: true
    },
    
    DISTANCE_1500: {
        id: 'dist_1500',
        name: 'Distanza 1500m',
        type: 'distance',
        icon: '1.5km',
        color: '#2c3e50',
        value: 1500,
        draggable: true
    },
    
    // NUOVI ELEMENTI: LINEE E TRACCIATI
    LINE_STRAIGHT: {
        id: 'line_straight',
        name: 'Linea Dritta',
        type: 'track',
        icon: '━',
        color: '#34495e',
        trackType: 'straight',
        draggable: true
    },
    
    LINE_CURVE_LEFT: {
        id: 'line_curve_left',
        name: 'Curva Sinistra',
        type: 'track',
        icon: '╭',
        color: '#34495e',
        trackType: 'curve_left',
        draggable: true
    },
    
    LINE_CURVE_RIGHT: {
        id: 'line_curve_right',
        name: 'Curva Destra',
        type: 'track',
        icon: '╮',
        color: '#34495e',
        trackType: 'curve_right',
        draggable: true
    },
    
    LINE_JUNCTION: {
        id: 'line_junction',
        name: 'Bivio',
        type: 'track',
        icon: '┣',
        color: '#34495e',
        trackType: 'junction',
        draggable: true
    },
    
    LINE_CROSS: {
        id: 'line_cross',
        name: 'Incrocio',
        type: 'track',
        icon: '╋',
        color: '#34495e',
        trackType: 'crossing',
        draggable: true
    },
    
    LINE_BRIDGE: {
        id: 'line_bridge',
        name: 'Ponte',
        type: 'track',
        icon: '🌉',
        color: '#7f8c8d',
        trackType: 'bridge',
        draggable: true
    },
    
    LINE_TUNNEL: {
        id: 'line_tunnel',
        name: 'Galleria',
        type: 'track',
        icon: '🕳️',
        color: '#95a5a6',
        trackType: 'tunnel',
        draggable: true
    }
};

// Database delle linee create dagli utenti
let CUSTOM_RAILWAYS = [];
let currentRailwayEditor = null;

// Stato dell'editor
const RAILWAY_EDITOR = {
    mode: 'build', // 'build' o 'play'
    canvas: null,
    elements: [],
    selectedElement: null,
    draggedElement: null,
    gridSize: 50,
    isDrawing: false,
    currentLine: null,
    savedRailways: [],
    selectedRailway: null,
    isConnecting: false,
    connectionStart: null
};

/**
 * ==========================================
 * INIZIALIZZAZIONE EDITOR
 * ==========================================
 */

function initializeRailwayEditor() {
    console.log('🏗️ Inizializzazione Editor Linee Ferroviarie');
    
    loadSavedRailways();
    createEditorInterface();
    
    // Attendiamo che il DOM sia aggiornato prima di setupare tutto
    setTimeout(() => {
        console.log('🔧 Setup canvas e drag & drop...');
        setupCanvas();
        setupDragAndDrop();
        
        // Debug iniziale
        console.log('🔍 Debug iniziale:');
        console.log('Canvas trovato:', !!document.getElementById('railwayCanvas'));
        console.log('Elementi palette:', document.querySelectorAll('.element-item').length);
        console.log('RAILWAY_EDITOR state:', RAILWAY_EDITOR);
        
        console.log('✅ Editor inizializzato');
    }, 500); // Aumento timeout a 500ms
}

function createEditorInterface() {
    const container = document.querySelector('.exercise-info');
    
    container.innerHTML = `
        <div class="editor-header">
            <h3>🏗️ Editor Linee Ferroviarie RFI</h3>
            <div class="editor-modes">
                <button class="mode-btn active" onclick="switchEditorMode('build')">
                    🔧 Costruisci Linea
                </button>
                <button class="mode-btn" onclick="switchEditorMode('play')">
                    🎮 Usa Linea
                </button>
            </div>
        </div>
        
        <!-- Modalità Costruzione -->
        <div class="build-mode" id="buildMode">
            <div class="editor-toolbar">
                <div class="toolbar-section">
                    <h4>📋 Azioni:</h4>
                    <button class="tool-btn" onclick="clearCanvas()">🗑️ Pulisci</button>
                    <button class="tool-btn" onclick="saveCurrentRailway()">💾 Salva Linea</button>
                    <button class="tool-btn" onclick="exportRailways()">📤 Esporta DB</button>
                    <input type="file" id="importFile" onchange="importRailways(this)" style="display: none;">
                    <button class="tool-btn" onclick="document.getElementById('importFile').click()">📥 Importa DB</button>
                </div>
                
                <div class="toolbar-section">
                    <h4>📏 Griglia:</h4>
                    <label>
                        <input type="checkbox" id="showGrid" checked onchange="toggleGrid()"> Mostra Griglia
                    </label>
                    <label>
                        <input type="range" id="gridSize" min="25" max="100" value="50" onchange="updateGridSize(this.value)"> Dimensione
                    </label>
                </div>
                
                <div class="toolbar-section">
                    <h4>🔗 Modalità:</h4>
                    <button class="tool-btn" id="connectMode" onclick="toggleConnectionMode()">
                        🔗 Collega Elementi
                    </button>
                </div>
            </div>
            
            <div class="editor-workspace">
                <div class="elements-palette">
                    <h4>🎨 Elementi Disponibili</h4>
                    
                    <div class="element-category">
                        <h5>🚦 Segnali</h5>
                        <div class="element-item" draggable="true" data-element="signal_empty">
                            <span class="element-icon">⚪</span>
                            <span class="element-name">Segnale Vuoto</span>
                        </div>
                    </div>
                    
                    <div class="element-category">
                        <h5>🛤️ Tracciati</h5>
                        <div class="element-item" draggable="true" data-element="line_straight">
                            <span class="element-icon track">━</span>
                            <span class="element-name">Linea Dritta</span>
                        </div>
                        <div class="element-item" draggable="true" data-element="line_curve_left">
                            <span class="element-icon track">╭</span>
                            <span class="element-name">Curva Sinistra</span>
                        </div>
                        <div class="element-item" draggable="true" data-element="line_curve_right">
                            <span class="element-icon track">╮</span>
                            <span class="element-name">Curva Destra</span>
                        </div>
                        <div class="element-item" draggable="true" data-element="line_junction">
                            <span class="element-icon track">┣</span>
                            <span class="element-name">Bivio</span>
                        </div>
                        <div class="element-item" draggable="true" data-element="line_cross">
                            <span class="element-icon track">╋</span>
                            <span class="element-name">Incrocio</span>
                        </div>
                        <div class="element-item" draggable="true" data-element="line_bridge">
                            <span class="element-icon track">🌉</span>
                            <span class="element-name">Ponte</span>
                        </div>
                        <div class="element-item" draggable="true" data-element="line_tunnel">
                            <span class="element-icon track">🕳️</span>
                            <span class="element-name">Galleria</span>
                        </div>
                    </div>
                    
                    <div class="element-category">
                        <h5>🔧 Tronchini</h5>
                        <div class="element-item" draggable="true" data-element="tronchino">
                            <span class="element-icon">🔧</span>
                            <span class="element-name">Tronchino</span>
                        </div>
                    </div>
                    
                    <div class="element-category">
                        <h5>⚡ Limitatori Velocità</h5>
                        <div class="element-item" draggable="true" data-element="speed_60">
                            <span class="element-icon speed-limit">60</span>
                            <span class="element-name">60 km/h</span>
                        </div>
                        <div class="element-item" draggable="true" data-element="speed_80">
                            <span class="element-icon speed-limit">80</span>
                            <span class="element-name">80 km/h</span>
                        </div>
                        <div class="element-item" draggable="true" data-element="speed_100">
                            <span class="element-icon speed-limit">100</span>
                            <span class="element-name">100 km/h</span>
                        </div>
                        <div class="element-item" draggable="true" data-element="speed_120">
                            <span class="element-icon speed-limit">120</span>
                            <span class="element-name">120 km/h</span>
                        </div>
                    </div>
                    
                    <div class="element-category">
                        <h5>📏 Distanze</h5>
                        <div class="element-item" draggable="true" data-element="dist_500">
                            <span class="element-icon distance">500m</span>
                            <span class="element-name">500 metri</span>
                        </div>
                        <div class="element-item" draggable="true" data-element="dist_1000">
                            <span class="element-icon distance">1km</span>
                            <span class="element-name">1000 metri</span>
                        </div>
                        <div class="element-item" draggable="true" data-element="dist_1200">
                            <span class="element-icon distance">1.2km</span>
                            <span class="element-name">1200 metri</span>
                        </div>
                        <div class="element-item" draggable="true" data-element="dist_1500">
                            <span class="element-icon distance">1.5km</span>
                            <span class="element-name">1500 metri</span>
                        </div>
                    </div>
                </div>
                
                <div class="canvas-container">
                    <canvas id="railwayCanvas" width="800" height="400"></canvas>
                    <div class="canvas-info">
                        <span id="canvasCoords">Coordinate: (0, 0)</span>
                        <span id="elementsCount">Elementi: 0</span>
                        <span id="connectionStatus">Modalità: Posizionamento</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modalità Gioco -->
        <div class="play-mode" id="playMode" style="display: none;">
            <div class="saved-railways">
                <h4>📚 Linee Salvate</h4>
                <div class="railways-grid" id="railwaysGrid">
                    <!-- Popolato dinamicamente -->
                </div>
            </div>
            
            <div class="selected-railway" id="selectedRailway" style="display: none;">
                <h4>🚂 Linea Selezionata</h4>
                <div class="railway-preview" id="railwayPreview"></div>
                <div class="start-exercise">
                    <p>Clicca su un segnale per la <strong style="color: #27ae60;">PARTENZA</strong>, poi su un altro per l'<strong style="color: #e74c3c;">ARRIVO</strong></p>
                    <button class="control-btn primary" onclick="startSignalExercise()" style="display: none;" id="startExerciseBtn">
                        🚀 Inizia Esercizio Segnali
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * ==========================================
 * GESTIONE CANVAS E DRAG & DROP
 * ==========================================
 */

function setupCanvas() {
    const canvas = document.getElementById('railwayCanvas');
    console.log('🖼️ Setup canvas:', canvas);
    
    if (!canvas) {
        console.error('❌ Canvas non trovato!');
        // Proviamo a cercarlo diversamente
        const allCanvas = document.querySelectorAll('canvas');
        console.log('Canvas presenti:', allCanvas.length);
        return;
    }
    
    RAILWAY_EDITOR.canvas = canvas;
    const ctx = canvas.getContext('2d');
    console.log('Canvas context:', ctx);
    
    // Event listeners per il canvas
    canvas.addEventListener('drop', handleCanvasDrop);
    canvas.addEventListener('dragover', handleCanvasDragOver);
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    
    console.log('🎯 Event listeners aggiunti al canvas');
    
    // Test: disegna qualcosa per vedere se il canvas funziona
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.fillText('Canvas Attivo - Trascinare qui gli elementi', 50, 200);
    
    // Disegna griglia iniziale
    drawGrid();
    updateCanvasInfo();
    
    console.log('🖼️ Canvas inizializzato con successo');
}

function setupDragAndDrop() {
    // Aspetta che gli elementi siano nel DOM
    const elementItems = document.querySelectorAll('.element-item');
    console.log(`🖱️ Setup drag & drop per ${elementItems.length} elementi`);
    
    if (elementItems.length === 0) {
        console.error('❌ Nessun elemento .element-item trovato!');
        // Retry dopo un altro timeout
        setTimeout(setupDragAndDrop, 1000);
        return;
    }
    
    elementItems.forEach((item, index) => {
        const elementId = item.dataset.element;
        console.log(`🔧 Setup elemento ${index}: ${elementId}`);
        
        // Drag eventi
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        
        // Backup click per test
        item.addEventListener('click', function(e) {
            console.log('🖱️ Click su elemento:', elementId);
            // Test: aggiungi direttamente al centro del canvas
            if (RAILWAY_ELEMENTS[elementId]) {
                console.log('📍 Aggiunta elemento al centro canvas');
                addElementToCanvas(RAILWAY_ELEMENTS[elementId], 400, 200);
            }
        });
        
        // Mouse events come fallback
        item.addEventListener('mousedown', handleMouseDown);
    });
    
    console.log('✅ Drag & drop configurato');
}

function handleDragStart(e) {
    const item = e.target.closest('.element-item');
    const elementId = item ? item.dataset.element : null;
    
    console.log('🖱️ DRAG START:', elementId);
    console.log('Elemento dati:', RAILWAY_ELEMENTS[elementId]);
    
    if (elementId && RAILWAY_ELEMENTS[elementId]) {
        RAILWAY_EDITOR.draggedElement = RAILWAY_ELEMENTS[elementId];
        e.dataTransfer.setData('text/plain', elementId);
        e.target.style.opacity = '0.5';
        console.log('✅ Drag avviato correttamente');
    } else {
        console.error('❌ Elemento non trovato per drag:', elementId);
    }
}

function handleDragEnd(e) {
    console.log('🖱️ DRAG END');
    e.target.style.opacity = '';
    // Non resettiamo draggedElement qui - lo facciamo nel drop
}

function handleMouseDown(e) {
    const item = e.target.closest('.element-item');
    if (item) {
        const elementId = item.dataset.element;
        console.log('🖱️ Mouse down fallback:', elementId);
        
        item.classList.add('dragging');
        RAILWAY_EDITOR.draggedElement = RAILWAY_ELEMENTS[elementId];
        
        // Aggiungi listener temporaneo per il rilascio
        const handleMouseUp = (mouseEvent) => {
            console.log('🖱️ Mouse up - rilascio elemento');
            item.classList.remove('dragging');
            
            // Se siamo sopra il canvas, aggiungi elemento
            const canvas = RAILWAY_EDITOR.canvas;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const x = mouseEvent.clientX - rect.left;
                const y = mouseEvent.clientY - rect.top;
                
                if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
                    console.log('📍 Rilascio sopra canvas:', x, y);
                    const snappedX = Math.round(x / RAILWAY_EDITOR.gridSize) * RAILWAY_EDITOR.gridSize;
                    const snappedY = Math.round(y / RAILWAY_EDITOR.gridSize) * RAILWAY_EDITOR.gridSize;
                    addElementToCanvas(RAILWAY_EDITOR.draggedElement, snappedX, snappedY);
                }
            }
            
            RAILWAY_EDITOR.draggedElement = null;
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mouseup', handleMouseUp);
    }
}

function handleCanvasDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    console.log('🖱️ Drag over canvas');
}

function handleCanvasDrop(e) {
    e.preventDefault();
    console.log('🖱️ DROP su canvas!');
    console.log('Elemento trascinato:', RAILWAY_EDITOR.draggedElement);
    
    if (!RAILWAY_EDITOR.draggedElement) {
        console.log('⚠️ Nessun elemento da trascinare - provo con dataTransfer');
        const elementId = e.dataTransfer.getData('text/plain');
        console.log('Element ID da dataTransfer:', elementId);
        
        if (elementId && RAILWAY_ELEMENTS[elementId]) {
            RAILWAY_EDITOR.draggedElement = RAILWAY_ELEMENTS[elementId];
            console.log('✅ Elemento recuperato da dataTransfer');
        } else {
            console.error('❌ Impossibile ottenere elemento per drop');
            return;
        }
    }
    
    const rect = RAILWAY_EDITOR.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    console.log('📍 Posizione drop:', x, y);
    
    // Snap alla griglia
    const snappedX = Math.round(x / RAILWAY_EDITOR.gridSize) * RAILWAY_EDITOR.gridSize;
    const snappedY = Math.round(y / RAILWAY_EDITOR.gridSize) * RAILWAY_EDITOR.gridSize;
    
    console.log('📍 Posizione snapped:', snappedX, snappedY);
    
    addElementToCanvas(RAILWAY_EDITOR.draggedElement, snappedX, snappedY);
    RAILWAY_EDITOR.draggedElement = null;
    
    // Remove dragging class
    document.querySelectorAll('.element-item.dragging').forEach(item => {
        item.classList.remove('dragging');
    });
    
    console.log('✅ Drop completato');
}

function handleCanvasClick(e) {
    const rect = RAILWAY_EDITOR.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    console.log('🖱️ Click canvas:', x, y);
    
    // Se abbiamo un elemento trascinato dal mouse, lo posizioniamo
    if (RAILWAY_EDITOR.draggedElement) {
        console.log('📍 Posizionamento elemento da click');
        const snappedX = Math.round(x / RAILWAY_EDITOR.gridSize) * RAILWAY_EDITOR.gridSize;
        const snappedY = Math.round(y / RAILWAY_EDITOR.gridSize) * RAILWAY_EDITOR.gridSize;
        
        addElementToCanvas(RAILWAY_EDITOR.draggedElement, snappedX, snappedY);
        RAILWAY_EDITOR.draggedElement = null;
        
        // Remove dragging class
        document.querySelectorAll('.element-item.dragging').forEach(item => {
            item.classList.remove('dragging');
        });
        return;
    }
    
    // Trova elemento cliccato
    const clickedElement = findElementAtPosition(x, y);
    
    if (clickedElement) {
        console.log('🎯 Elemento cliccato:', clickedElement.id);
        if (RAILWAY_EDITOR.mode === 'build') {
            if (RAILWAY_EDITOR.isConnecting) {
                handleConnectionClick(clickedElement);
            } else {
                selectElement(clickedElement);
            }
        } else if (RAILWAY_EDITOR.mode === 'play') {
            handleSignalSelection(clickedElement);
        }
    }
}

function handleCanvasMouseMove(e) {
    const rect = RAILWAY_EDITOR.canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / RAILWAY_EDITOR.gridSize) * RAILWAY_EDITOR.gridSize;
    const y = Math.round((e.clientY - rect.top) / RAILWAY_EDITOR.gridSize) * RAILWAY_EDITOR.gridSize;
    
    const coordsElement = document.getElementById('canvasCoords');
    if (coordsElement) {
        coordsElement.textContent = `Coordinate: (${x}, ${y})`;
    }
}

/**
 * ==========================================
 * GESTIONE ELEMENTI SUL CANVAS
 * ==========================================
 */

function addElementToCanvas(elementType, x, y) {
    console.log('➕ Aggiunta elemento al canvas:');
    console.log('Tipo:', elementType);
    console.log('Posizione:', x, y);
    console.log('Canvas:', RAILWAY_EDITOR.canvas);
    console.log('Elementi attuali:', RAILWAY_EDITOR.elements.length);
    
    const newElement = {
        id: generateElementId(),
        type: elementType.type,
        elementId: elementType.id,
        x: x,
        y: y,
        data: { ...elementType },
        signalType: null, // Per i segnali vuoti
        selected: false,
        connections: [], // Per tracciati collegati
        rotation: 0 // Per ruotare gli elementi
    };
    
    RAILWAY_EDITOR.elements.push(newElement);
    console.log('📝 Elemento aggiunto:', newElement);
    console.log('📊 Totale elementi:', RAILWAY_EDITOR.elements.length);
    
    redrawCanvas();
    updateCanvasInfo();
    
    console.log('✅ Elemento aggiunto con successo');
}

function removeElement(element) {
    const index = RAILWAY_EDITOR.elements.indexOf(element);
    if (index > -1) {
        // Rimuove anche le connessioni
        RAILWAY_EDITOR.elements.forEach(el => {
            el.connections = el.connections.filter(conn => conn.elementId !== element.id);
        });
        
        RAILWAY_EDITOR.elements.splice(index, 1);
        redrawCanvas();
        updateCanvasInfo();
    }
}

function selectElement(element) {
    // Deseleziona tutti
    RAILWAY_EDITOR.elements.forEach(el => el.selected = false);
    
    // Seleziona il nuovo
    element.selected = true;
    RAILWAY_EDITOR.selectedElement = element;
    
    redrawCanvas();
    showElementProperties(element);
}

function findElementAtPosition(x, y) {
    return RAILWAY_EDITOR.elements.find(element => {
        const distance = Math.sqrt(Math.pow(x - element.x, 2) + Math.pow(y - element.y, 2));
        return distance <= 25; // Raggio di 25px per la selezione
    });
}

function generateElementId() {
    return 'elem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * ==========================================
 * SISTEMA CONNESSIONI
 * ==========================================
 */

function toggleConnectionMode() {
    RAILWAY_EDITOR.isConnecting = !RAILWAY_EDITOR.isConnecting;
    const btn = document.getElementById('connectMode');
    const status = document.getElementById('connectionStatus');
    
    if (RAILWAY_EDITOR.isConnecting) {
        btn.textContent = '✋ Modalità Normale';
        btn.style.background = '#e74c3c';
        status.textContent = 'Modalità: Collegamento';
        RAILWAY_EDITOR.connectionStart = null;
    } else {
        btn.textContent = '🔗 Collega Elementi';
        btn.style.background = '';
        status.textContent = 'Modalità: Posizionamento';
        RAILWAY_EDITOR.connectionStart = null;
    }
    
    redrawCanvas();
}

function handleConnectionClick(element) {
    if (!RAILWAY_EDITOR.connectionStart) {
        // Primo elemento della connessione
        RAILWAY_EDITOR.connectionStart = element;
        element.selected = true;
        console.log('🔗 Inizio connessione da:', element.id);
    } else {
        // Secondo elemento - crea connessione
        if (element !== RAILWAY_EDITOR.connectionStart) {
            createConnection(RAILWAY_EDITOR.connectionStart, element);
            RAILWAY_EDITOR.connectionStart.selected = false;
            RAILWAY_EDITOR.connectionStart = null;
        }
    }
    
    redrawCanvas();
}

function createConnection(element1, element2) {
    // Aggiunge connessione bidirezionale
    if (!element1.connections.find(c => c.elementId === element2.id)) {
        element1.connections.push({
            elementId: element2.id,
            type: 'track',
            distance: calculateDistance({ x: element1.x, y: element1.y }, { x: element2.x, y: element2.y })
        });
    }
    
    if (!element2.connections.find(c => c.elementId === element1.id)) {
        element2.connections.push({
            elementId: element1.id,
            type: 'track',
            distance: calculateDistance({ x: element1.x, y: element1.y }, { x: element2.x, y: element2.y })
        });
    }
    
    console.log(`🔗 Connessione creata: ${element1.id} ↔ ${element2.id}`);
}

/**
 * ==========================================
 * RENDERING CANVAS
 * ==========================================
 */

function drawGrid() {
    const showGridElement = document.getElementById('showGrid');
    if (!showGridElement || !showGridElement.checked) return;
    
    const canvas = RAILWAY_EDITOR.canvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const gridSize = RAILWAY_EDITOR.gridSize;
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Linee verticali
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Linee orizzontali
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function redrawCanvas() {
    const canvas = RAILWAY_EDITOR.canvas;
    if (!canvas) {
        console.error('❌ Canvas non disponibile per ridisegno');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    console.log('🖼️ Ridisegno canvas - elementi:', RAILWAY_EDITOR.elements.length);
    
    // Pulisce canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sfondo
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Ridisegna griglia
    drawGrid();
    
    // Disegna connessioni prima degli elementi
    drawConnections(ctx);
    
    // Disegna tutti gli elementi
    RAILWAY_EDITOR.elements.forEach((element, index) => {
        console.log(`🎨 Disegno elemento ${index}:`, element.id, 'pos:', element.x, element.y);
        drawElement(ctx, element);
    });
    
    // Se non ci sono elementi, mostra messaggio
    if (RAILWAY_EDITOR.elements.length === 0) {
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Trascina elementi qui dal pannello laterale', canvas.width / 2, canvas.height / 2);
        ctx.fillText('oppure clicca su un elemento e poi qui per posizionarlo', canvas.width / 2, canvas.height / 2 + 25);
    }
    
    console.log('✅ Canvas ridisegnato');
}

function drawConnections(ctx) {
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 3;
    
    RAILWAY_EDITOR.elements.forEach(element => {
        if (element.connections) {
            element.connections.forEach(connection => {
                const target = RAILWAY_EDITOR.elements.find(el => el.id === connection.elementId);
                if (target) {
                    ctx.beginPath();
                    ctx.moveTo(element.x, element.y);
                    ctx.lineTo(target.x, target.y);
                    ctx.stroke();
                }
            });
        }
    });
}

function drawElement(ctx, element) {
    const x = element.x;
    const y = element.y;
    
    console.log(`🎨 Disegno elemento ${element.id} a (${x}, ${y})`);
    
    // Cerchio/forma di base
    let radius = 20;
    let shape = 'circle';
    
    if (element.type === 'track') {
        radius = 15;
        shape = 'square';
    }
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((element.rotation || 0) * Math.PI / 180);
    
    if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    } else {
        ctx.beginPath();
        ctx.rect(-radius, -radius, radius * 2, radius * 2);
    }
    
    if (element.selected) {
        ctx.fillStyle = '#fff3cd';
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 3;
    } else if (RAILWAY_EDITOR.isConnecting && element === RAILWAY_EDITOR.connectionStart) {
        ctx.fillStyle = '#d4edda';
        ctx.strokeStyle = '#28a745';
        ctx.lineWidth = 3;
    } else {
        ctx.fillStyle = element.data.color || '#ccc';
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
    }
    
    ctx.fill();
    ctx.stroke();
    
    // Icona/testo
    ctx.fillStyle = element.type === 'track' ? 'white' : '#2c3e50';
    ctx.font = element.type === 'track' ? 'bold 14px Arial' : 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (element.type === 'signal' && element.signalType) {
        const signal = Object.values(SIGNAL_TYPES).find(s => s.id === element.signalType);
        ctx.fillText(signal ? signal.icon : '?', 0, 0);
    } else {
        ctx.fillText(element.data.icon || '?', 0, 0);
    }
    
    ctx.restore();
    
    // Label sotto l'elemento
    ctx.font = '10px Arial';
    ctx.fillStyle = '#7f8c8d';
    ctx.textAlign = 'center';
    ctx.fillText(element.data.name || 'Elemento', x, y + 35);
    
    console.log(`✅ Elemento ${element.id} disegnato`);
}

/**
 * ==========================================
 * CONTROLLI EDITOR
 * ==========================================
 */

function switchEditorMode(mode) {
    RAILWAY_EDITOR.mode = mode;
    
    // Aggiorna pulsanti
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Mostra/nasconde sezioni
    document.getElementById('buildMode').style.display = mode === 'build' ? 'block' : 'none';
    document.getElementById('playMode').style.display = mode === 'play' ? 'block' : 'none';
    
    if (mode === 'play') {
        updateRailwaysGrid();
    }
    
    console.log(`🔄 Modalità cambiata a: ${mode}`);
}

function clearCanvas() {
    if (confirm('🗑️ Sei sicuro di voler cancellare tutto?')) {
        RAILWAY_EDITOR.elements = [];
        RAILWAY_EDITOR.selectedElement = null;
        redrawCanvas();
        updateCanvasInfo();
    }
}

function toggleGrid() {
    redrawCanvas();
}

function updateGridSize(newSize) {
    RAILWAY_EDITOR.gridSize = parseInt(newSize);
    redrawCanvas();
}

function updateCanvasInfo() {
    const elementsCount = document.getElementById('elementsCount');
    if (elementsCount) {
        elementsCount.textContent = `Elementi: ${RAILWAY_EDITOR.elements.length}`;
    }
}

function showElementProperties(element) {
    console.log('🔧 Proprietà elemento:', element);
    
    // TODO: Aggiungere pannello proprietà per modificare elemento
    // (rotazione, tipo segnale per segnali vuoti, ecc.)
}

/**
 * ==========================================
 * SALVATAGGIO E CARICAMENTO
 * ==========================================
 */

function saveCurrentRailway() {
    if (RAILWAY_EDITOR.elements.length === 0) {
        alert('⚠️ Aggiungi almeno un elemento prima di salvare!');
        return;
    }
    
    const name = prompt('📝 Nome della linea ferroviaria:', `Linea_${Date.now()}`);
    if (!name) return;
    
    const railway = {
        id: generateRailwayId(),
        name: name,
        elements: [...RAILWAY_EDITOR.elements],
        createdAt: new Date().toISOString(),
        createdBy: prompt('👤 Il tuo nome:', 'Progettista') || 'Anonimo'
    };
    
    CUSTOM_RAILWAYS.push(railway);
    saveRailwaysToStorage();
    
    alert(`💾 Linea "${name}" salvata con successo!`);
    console.log('💾 Linea salvata:', railway);
}

function loadSavedRailways() {
    const saved = localStorage.getItem('rfi_custom_railways');
    if (saved) {
        try {
            CUSTOM_RAILWAYS = JSON.parse(saved);
        } catch (e) {
            console.error('❌ Errore caricamento linee salvate:', e);
            CUSTOM_RAILWAYS = [];
        }
    }
    console.log(`📚 Caricate ${CUSTOM_RAILWAYS.length} linee personalizzate`);
}

function saveRailwaysToStorage() {
    localStorage.setItem('rfi_custom_railways', JSON.stringify(CUSTOM_RAILWAYS));
}

function exportRailways() {
    const dataStr = JSON.stringify(CUSTOM_RAILWAYS, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'linee_ferroviarie_personalizzate.json';
    link.click();
    
    console.log('📤 Database linee esportato');
}

function importRailways(fileInput) {
    const file = fileInput.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedRailways = JSON.parse(e.target.result);
            CUSTOM_RAILWAYS = [...CUSTOM_RAILWAYS, ...importedRailways];
            saveRailwaysToStorage();
            
            alert(`📥 Importate ${importedRailways.length} linee!`);
            if (RAILWAY_EDITOR.mode === 'play') {
                updateRailwaysGrid();
            }
        } catch (error) {
            alert('❌ Errore durante l\'importazione del file');
            console.error('Errore importazione:', error);
        }
    };
    reader.readAsText(file);
}

function generateRailwayId() {
    return 'railway_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function calculateDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * ==========================================
 * MODALITÀ GIOCO
 * ==========================================
 */

function updateRailwaysGrid() {
    const grid = document.getElementById('railwaysGrid');
    if (!grid) return;
    
    if (CUSTOM_RAILWAYS.length === 0) {
        grid.innerHTML = '<p class="no-railways">🚧 Nessuna linea salvata. Vai in modalità "Costruisci" per crearne una!</p>';
        return;
    }
    
    grid.innerHTML = CUSTOM_RAILWAYS.map(railway => `
        <div class="railway-card" onclick="selectRailway('${railway.id}')">
            <h5>${railway.name}</h5>
            <p>📅 ${new Date(railway.createdAt).toLocaleDateString()}</p>
            <p>👤 ${railway.createdBy}</p>
            <p>🔧 ${railway.elements.length} elementi</p>
        </div>
    `).join('');
}

function selectRailway(railwayId) {
    const railway = CUSTOM_RAILWAYS.find(r => r.id === railwayId);
    if (!railway) return;
    
    RAILWAY_EDITOR.selectedRailway = railway;
    showRailwayPreview(railway);
    
    const selectedSection = document.getElementById('selectedRailway');
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    console.log('🚂 Linea selezionata:', railway.name);
}

function showRailwayPreview(railway) {
    const preview = document.getElementById('railwayPreview');
    if (!preview) return;
    
    preview.innerHTML = `
        <h5>${railway.name}</h5>
        <div class="preview-canvas-container">
            <canvas id="previewCanvas" width="400" height="200"></canvas>
        </div>
        <p><strong>Elementi:</strong> ${railway.elements.length}</p>
        <p><strong>Segnali:</strong> ${railway.elements.filter(e => e.type === 'signal').length}</p>
        <p><strong>Tracciati:</strong> ${railway.elements.filter(e => e.type === 'track').length}</p>
        <p><strong>Creata da:</strong> ${railway.createdBy}</p>
    `;
    
    // Disegna preview
    setTimeout(() => drawRailwayPreview(railway), 100);
}

function drawRailwayPreview(railway) {
    const canvas = document.getElementById('previewCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Scala gli elementi per il preview
    const scaleX = canvas.width / 800;
    const scaleY = canvas.height / 400;
    
    // Disegna connessioni
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    railway.elements.forEach(element => {
        if (element.connections) {
            element.connections.forEach(connection => {
                const target = railway.elements.find(el => el.id === connection.elementId);
                if (target) {
                    ctx.beginPath();
                    ctx.moveTo(element.x * scaleX, element.y * scaleY);
                    ctx.lineTo(target.x * scaleX, target.y * scaleY);
                    ctx.stroke();
                }
            });
        }
    });
    
    // Disegna elementi
    railway.elements.forEach(element => {
        const x = element.x * scaleX;
        const y = element.y * scaleY;
        
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = element.data.color;
        ctx.fill();
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Icona piccola
        ctx.fillStyle = element.type === 'track' ? 'white' : '#2c3e50';
        ctx.font = '6px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(element.data.icon, x, y + 1);
    });
}

// Esporta funzioni globali
window.RAILWAY_ELEMENTS = RAILWAY_ELEMENTS;
window.RAILWAY_EDITOR = RAILWAY_EDITOR;
window.initializeRailwayEditor = initializeRailwayEditor;
window.switchEditorMode = switchEditorMode;
window.clearCanvas = clearCanvas;
window.toggleGrid = toggleGrid;
window.updateGridSize = updateGridSize;
window.toggleConnectionMode = toggleConnectionMode;
window.saveCurrentRailway = saveCurrentRailway;
window.exportRailways = exportRailways;
window.importRailways = importRailways;
window.selectRailway = selectRailway;

console.log('🏗️ Editor Linee Ferroviarie con tracciati inizializzato!'); 