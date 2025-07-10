/**
 * EDITOR LINEE FERROVIARIE RFI - SISTEMA PRIVATO E INTERFACCIA MODERNA
 * =======================================================================
 * Design professionale con gestione privata delle linee
 */

// Gestione routing semplice
const ROUTE_HANDLER = {
    currentRoute: window.location.hash || '#home',
    
    navigate(route) {
        window.location.hash = route;
        this.currentRoute = route;
        this.renderCurrentRoute();
    },
    
    renderCurrentRoute() {
        const container = document.querySelector('.exercise-info');
        
        switch(this.currentRoute) {
            case '#home':
                this.renderHomePage(container);
                break;
            case '#linee':
                this.renderRailwayEditor(container);
                break;
            default:
                this.renderHomePage(container);
        }
    }
};

// Stati dell'editor moderni
const RAILWAY_EDITOR = {
    mode: 'build',
    canvas: null,
    ctx: null,
    elements: [],
    selectedElements: [], // Multi-selezione
    activeTool: 'select', // select, move, connect, draw
    gridSize: 25,
    zoom: 1,
    pan: { x: 0, y: 0 },
    
    // Drag states
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    draggedElements: [],
    
    // Connection states
    connectionStart: null,
    previewConnection: null,
    
    // History per undo/redo
    history: [],
    historyIndex: -1,
    maxHistory: 50,
    
    // UI states
    showGrid: true,
    snapToGrid: true,
    showConnections: true,
    
    // Viewport
    viewport: {
        x: 0, y: 0, width: 800, height: 600
    }
};

// Tools disponibili
const TOOLS = {
    select: { icon: '🔍', name: 'Seleziona' },
    move: { icon: '✋', name: 'Sposta' },
    connect: { icon: '🔗', name: 'Collega' },
    delete: { icon: '🗑️', name: 'Elimina' }
};

// Organizzazione moderna degli elementi con deviate migliorate
const ELEMENT_CATEGORIES = {
    signals: {
        name: '🚦 Segnali',
        color: '#e74c3c',
        elements: {
            signal_empty: {
                id: 'signal_empty', name: 'Segnale Vuoto', icon: '🚥', 
                type: 'signal', color: '#2c3e50'
            },
            signal_stop: {
                id: 'signal_stop', name: 'Segnale Rosso', icon: '🔴', 
                type: 'signal', color: '#e74c3c'
            },
            signal_caution: {
                id: 'signal_caution', name: 'Segnale Giallo', icon: '🟡', 
                type: 'signal', color: '#f39c12'
            },
            signal_go: {
                id: 'signal_go', name: 'Segnale Verde', icon: '🟢', 
                type: 'signal', color: '#27ae60'
            }
        }
    },
    tracks: {
        name: '🛤️ Tracciati',
        color: '#34495e',
        elements: {
            line_straight: {
                id: 'line_straight', name: 'Linea Dritta', icon: '━',
                type: 'track', color: '#34495e'
            },
            line_curve_left: {
                id: 'line_curve_left', name: 'Curva Sinistra', icon: '╭',
                type: 'track', color: '#34495e'
            },
            line_curve_right: {
                id: 'line_curve_right', name: 'Curva Destra', icon: '╮',
                type: 'track', color: '#34495e'
            },
            line_junction: {
                id: 'line_junction', name: 'Bivio', icon: '┣',
                type: 'track', color: '#34495e'
            },
            line_cross: {
                id: 'line_cross', name: 'Incrocio', icon: '╋',
                type: 'track', color: '#34495e'
            }
        }
    },
    deviate: {
        name: '↗️ Deviate',
        color: '#8e44ad',
        elements: {
            deviata_down_right: {
                id: 'deviata_down_right', name: 'Deviata Basso-Destra', icon: '↘',
                type: 'deviata', color: '#8e44ad'
            },
            deviata_down_left: {
                id: 'deviata_down_left', name: 'Deviata Basso-Sinistra', icon: '↙',
                type: 'deviata', color: '#8e44ad'
            },
            deviata_up_right: {
                id: 'deviata_up_right', name: 'Deviata Alto-Destra', icon: '↗',
                type: 'deviata', color: '#8e44ad'
            },
            deviata_up_left: {
                id: 'deviata_up_left', name: 'Deviata Alto-Sinistra', icon: '↖',
                type: 'deviata', color: '#8e44ad'
            }
        }
    },
    infrastructure: {
        name: '🏗️ Infrastrutture',
        color: '#7f8c8d',
        elements: {
            line_bridge: {
                id: 'line_bridge', name: 'Ponte', icon: '🌉',
                type: 'track', color: '#7f8c8d'
            },
            line_tunnel: {
                id: 'line_tunnel', name: 'Galleria', icon: '🕳️',
                type: 'track', color: '#95a5a6'
            },
            tronchino: {
                id: 'tronchino', name: 'Tronchino', icon: '🔧',
                type: 'tronchino', color: '#9b59b6'
            },
            station: {
                id: 'station', name: 'Stazione', icon: '🏪',
                type: 'station', color: '#3498db'
            }
        }
    },
    limits: {
        name: '⚡ Limiti & Distanze',
        color: '#f39c12',
        elements: {
            speed_60: { id: 'speed_60', name: '60 km/h', icon: '60', type: 'speed_limit', color: '#e74c3c' },
            speed_80: { id: 'speed_80', name: '80 km/h', icon: '80', type: 'speed_limit', color: '#f39c12' },
            speed_100: { id: 'speed_100', name: '100 km/h', icon: '100', type: 'speed_limit', color: '#27ae60' },
            speed_120: { id: 'speed_120', name: '120 km/h', icon: '120', type: 'speed_limit', color: '#3498db' },
            dist_500: { id: 'dist_500', name: '500m', icon: '500m', type: 'distance', color: '#2c3e50' },
            dist_1000: { id: 'dist_1000', name: '1km', icon: '1km', type: 'distance', color: '#2c3e50' },
            dist_1200: { id: 'dist_1200', name: '1.2km', icon: '1.2km', type: 'distance', color: '#2c3e50' },
            dist_1500: { id: 'dist_1500', name: '1.5km', icon: '1.5km', type: 'distance', color: '#2c3e50' }
        }
    }
};

// Crea tutti gli elementi flat per compatibilità
const RAILWAY_ELEMENTS = {};
Object.values(ELEMENT_CATEGORIES).forEach(category => {
    Object.assign(RAILWAY_ELEMENTS, category.elements);
});

/**
 * ==========================================
 * HOME PAGE E SISTEMA DI ROUTING
 * ==========================================
 */

ROUTE_HANDLER.renderHomePage = function(container) {
    const savedRailways = JSON.parse(localStorage.getItem('rfi_custom_railways') || '[]');
    
    container.innerHTML = `
        <div class="home-page">
            <div class="home-header">
                <h2>🏠 Sistema Linee Ferroviarie RFI</h2>
                <p>Gestisci le tue linee private e crea nuovi tracciati ferroviari</p>
            </div>
            
            <div class="home-actions">
                <button class="action-btn primary" onclick="ROUTE_HANDLER.navigate('#linee')">
                    🏗️ Nuovo Editor Linee
                </button>
            </div>
            
            <div class="saved-railways-section">
                <h3>📚 Le Tue Linee Salvate</h3>
                ${savedRailways.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-icon">🛤️</div>
                        <h4>Nessuna linea salvata</h4>
                        <p>Crea la tua prima linea ferroviaria usando l'editor</p>
                        <button class="action-btn secondary" onclick="ROUTE_HANDLER.navigate('#linee')">
                            Inizia Ora
                        </button>
                    </div>
                ` : `
                    <div class="railways-grid">
                        ${savedRailways.map((railway, index) => `
                            <div class="railway-card">
                                <div class="railway-header">
                                    <h4>${railway.name || `Linea ${index + 1}`}</h4>
                                    <div class="railway-stats">
                                        <span>📍 ${railway.elements?.length || 0} elementi</span>
                                        <span>📅 ${new Date(railway.created).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div class="railway-actions">
                                    <button class="btn-small primary" onclick="loadRailwayForExercise('${railway.id}')">
                                        🎯 Usa per Esercizio
                                    </button>
                                    <button class="btn-small secondary" onclick="editRailway('${railway.id}')">
                                        ✏️ Modifica
                                    </button>
                                    <button class="btn-small danger" onclick="deleteRailway('${railway.id}')">
                                        🗑️ Elimina
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
};

ROUTE_HANDLER.renderRailwayEditor = function(container) {
    container.innerHTML = `
        <!-- Header moderno -->
        <div class="modern-editor-header">
            <div class="editor-title">
                <button class="back-btn" onclick="ROUTE_HANDLER.navigate('#home')">← Home</button>
                <h2>🏗️ Editor Linee Ferroviarie Private</h2>
                <div class="editor-status">
                    <span id="elementCount">0 elementi</span>
                    <span id="selectionCount"></span>
                </div>
            </div>
            
            <div class="editor-actions">
                <button class="action-btn primary" onclick="saveCurrentRailway()">
                    💾 Salva Linea
                </button>
                <button class="action-btn secondary" onclick="clearCanvas()">
                    🗑️ Pulisci
                </button>
            </div>
        </div>

        <!-- Canvas container -->
        <div class="canvas-section">
            <div class="canvas-container">
                <canvas id="railwayCanvas" width="800" height="600"></canvas>
                <div class="canvas-overlay">
                    <div class="canvas-coords" id="canvasCoords">0, 0</div>
                </div>
            </div>
            
            <!-- Properties Panel -->
            <div class="properties-panel">
                <h3>🔧 Proprietà</h3>
                <div id="propertiesContent">
                    <p class="help-text">Seleziona un elemento per vedere le proprietà</p>
                </div>
                
                <!-- Zoom e Grid Controls -->
                <div class="view-controls">
                    <h4>🔍 Vista</h4>
                    <div class="control-group">
                        <button onclick="zoomIn()">🔍+</button>
                        <button onclick="zoomOut()">🔍-</button>
                        <button onclick="resetView()">📐</button>
                    </div>
                    
                    <div class="toggle-group">
                        <label>
                            <input type="checkbox" id="gridToggle" checked onclick="toggleGrid()">
                            Griglia
                        </label>
                        <label>
                            <input type="checkbox" id="snapToggle" checked onclick="toggleSnap()">
                            Snap
                        </label>
                    </div>
                    
                    <!-- Undo/Redo controls -->
                    <div class="history-controls">
                        <h4>📝 Storia</h4>
                        <div class="control-group">
                            <button onclick="undo()" id="undoBtn">↶ Indietro</button>
                            <button onclick="redo()" id="redoBtn">↷ Avanti</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Toolbar -->
        <div class="modern-toolbar">
            <div class="tool-group">
                <h4>🔧 Strumenti</h4>
                <div class="tools-row">
                    <button class="tool-item active" data-tool="select" title="Seleziona elementi">
                        🔍 Seleziona
                    </button>
                    <button class="tool-item" data-tool="move" title="Sposta elementi">
                        ✋ Sposta
                    </button>
                    <button class="tool-item" data-tool="delete" title="Elimina elementi">
                        🗑️ Elimina
                    </button>
                </div>
            </div>
        </div>

        <!-- Bottom toolbar con elementi -->
        <div class="bottom-toolbar">
            <!-- Connection mode -->
            <div class="connection-controls">
                <button class="connect-btn" id="connectBtn" onclick="toggleConnectionMode()">
                    🔗 Collega Elementi
                </button>
                <div class="connection-help" id="connectionHelp" style="display: none;">
                    <span>Clicca su due elementi per collegarli</span>
                    <button onclick="hideConnectionHelp()">✕</button>
                </div>
            </div>
            
            <!-- Elements dropdown -->
            <div class="elements-dropdown">
                <button class="dropdown-trigger" onclick="toggleElementsDropdown()">
                    ➕ Aggiungi Elementi
                </button>
                <div class="dropdown-content" id="elementsDropdownContent">
                    ${Object.entries(ELEMENT_CATEGORIES).map(([catId, category]) => `
                        <div class="element-category">
                            <h4>${category.name}</h4>
                            <div class="elements-grid">
                                ${Object.entries(category.elements).map(([elemId, element]) => `
                                    <div class="element-item" onclick="addElementToCenter('${elemId}')">
                                        <span class="element-icon">${element.icon}</span>
                                        <span class="element-name">${element.name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- Feedback Area -->
        <div class="feedback-area" id="feedbackArea"></div>
    `;

    // Inizializza editor completo dopo che l'HTML è stato creato
    setTimeout(() => {
        // Inizializza canvas e componenti base
        setupCanvas();
        setupElementsDropdown();
        setupSimpleDragDrop();
        setupToolbar(); // ← QUESTO MANCAVA! Essenziale per tools
        
        // Stato iniziale dell'editor
        RAILWAY_EDITOR.elements = [];
        RAILWAY_EDITOR.selectedElements = [];
        RAILWAY_EDITOR.history = [];
        RAILWAY_EDITOR.historyIndex = -1;
        RAILWAY_EDITOR.showConnections = true;
        RAILWAY_EDITOR.activeTool = 'select';
        RAILWAY_EDITOR.connectionStart = null;
        RAILWAY_EDITOR.previewConnection = null;
        
        // Inizializza griglia e vista
        updateGridDisplay();
        updateElementStats();
        
        // Setup modalità connessione
        setupConnectionMode();
        
        // Aggiorna pannello proprietà
        updatePropertiesPanel();
        
        // Setup keyboard shortcuts se necessario
        // setupKeyboardShortcuts(); // Rimuovo come richiesto dall'utente
        
        // Salva stato iniziale vuoto nella history
        saveStateToHistory();
        
        // Redraw canvas iniziale
        redrawCanvas();
        
        // Feedback di inizializzazione
        showUserFeedback('🎉 Editor linee private inizializzato! Usa "➕ Aggiungi Elementi" per iniziare.', 'success', 4000);
        
        console.log('✅ Editor linee private completamente inizializzato!');
        console.log('📊 Stato iniziale:', {
            elementi: RAILWAY_EDITOR.elements.length,
            zoom: RAILWAY_EDITOR.zoom,
            griglia: RAILWAY_EDITOR.showGrid,
            snap: RAILWAY_EDITOR.snapToGrid,
            tool: RAILWAY_EDITOR.activeTool
        });
        
    }, 100);
};

/**
 * ==========================================
 * FUNZIONI GESTIONE LINEE SALVATE
 * ==========================================
 */

function loadRailwayForExercise(railwayId) {
    const savedRailways = JSON.parse(localStorage.getItem('rfi_custom_railways') || '[]');
    const railway = savedRailways.find(r => r.id === railwayId);
    
    if (railway) {
        // Carica la linea per esercizio (modalità diversa)
        showUserFeedback(`🎯 Linea "${railway.name}" caricata per esercizio!`, 'success');
        // Qui potresti implementare la modalità esercizio
    }
}

function editRailway(railwayId) {
    ROUTE_HANDLER.navigate('#linee');
    
    setTimeout(() => {
        loadRailway(railwayId);
    }, 200);
}

function deleteRailway(railwayId) {
    if (confirm('Sei sicuro di voler eliminare questa linea?')) {
        let savedRailways = JSON.parse(localStorage.getItem('rfi_custom_railways') || '[]');
        savedRailways = savedRailways.filter(r => r.id !== railwayId);
        localStorage.setItem('rfi_custom_railways', JSON.stringify(savedRailways));
        
        // Ricarica la home page
        ROUTE_HANDLER.renderCurrentRoute();
        showUserFeedback('🗑️ Linea eliminata con successo', 'success');
    }
}

/**
 * ==========================================
 * INTERFACCIA MODERNA
 * ==========================================
 */

function createEditorInterface() {
    // Gestione routing basato su hash
    ROUTE_HANDLER.renderCurrentRoute();
    
    // Listen per cambiamenti hash
    window.addEventListener('hashchange', () => {
        ROUTE_HANDLER.currentRoute = window.location.hash || '#home';
        ROUTE_HANDLER.renderCurrentRoute();
    });
}

/**
 * ==========================================
 * DRAG & DROP SEMPLIFICATO
 * ==========================================
 */

function handleCanvasDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    RAILWAY_EDITOR.canvas.style.boxShadow = '0 0 20px rgba(40, 167, 69, 0.5)';
}

function handleCanvasDrop(e) {
    e.preventDefault();
    RAILWAY_EDITOR.canvas.style.boxShadow = '';
    
    const elementId = e.dataTransfer.getData('text/plain');
    if (!elementId || !RAILWAY_ELEMENTS[elementId]) {
        console.error('❌ Elemento non valido per drop:', elementId);
        return;
    }
    
    const rect = RAILWAY_EDITOR.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / RAILWAY_EDITOR.zoom;
    const y = (e.clientY - rect.top) / RAILWAY_EDITOR.zoom;
    
    const snappedPos = RAILWAY_EDITOR.snapToGrid ? snapToGrid(x, y) : { x, y };
    
    addElementToCanvas(RAILWAY_ELEMENTS[elementId], snappedPos.x, snappedPos.y);
    console.log('✅ Elemento aggiunto via drop:', elementId);
}

/**
 * ==========================================
 * MOUSE HANDLERS SEMPLIFICATI
 * ==========================================
 */

function handleCanvasMouseDown(e) {
    if (!RAILWAY_EDITOR.canvas) return;
    
    const rect = RAILWAY_EDITOR.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / RAILWAY_EDITOR.zoom;
    const y = (e.clientY - rect.top) / RAILWAY_EDITOR.zoom;
    
    updateMouseCoords(x, y);
    
    const clickedElement = getElementAtPosition(x, y);
    
    if (RAILWAY_EDITOR.activeTool === 'move' && clickedElement) {
        startMoving(clickedElement, x, y, e);
    } else if (RAILWAY_EDITOR.activeTool === 'delete' && clickedElement) {
        deleteElement(clickedElement);
    }
}

function handleCanvasMouseMove(e) {
    if (!RAILWAY_EDITOR.canvas) return;
    
    const rect = RAILWAY_EDITOR.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / RAILWAY_EDITOR.zoom;
    const y = (e.clientY - rect.top) / RAILWAY_EDITOR.zoom;
    
    updateMouseCoords(x, y);
    
    if (RAILWAY_EDITOR.isDragging && RAILWAY_EDITOR.activeTool === 'move') {
        updateMoving(x, y);
        redrawCanvas();
    }
}

function handleCanvasMouseUp(e) {
    if (RAILWAY_EDITOR.isDragging) {
        stopMoving();
    }
}

/**
 * ==========================================
 * GESTIONE SELEZIONE SEMPLIFICATA
 * ==========================================
 */

function selectElement(element) {
    if (!RAILWAY_EDITOR.selectedElements.includes(element)) {
        RAILWAY_EDITOR.selectedElements.push(element);
        element._selected = true;
    }
    updateSelectionUI();
    console.log('🎯 Elemento selezionato:', element.name);
}

function toggleElementSelection(element) {
    const index = RAILWAY_EDITOR.selectedElements.indexOf(element);
    if (index >= 0) {
        RAILWAY_EDITOR.selectedElements.splice(index, 1);
        element._selected = false;
    } else {
        RAILWAY_EDITOR.selectedElements.push(element);
        element._selected = true;
    }
    updateSelectionUI();
}

function clearSelection() {
    RAILWAY_EDITOR.selectedElements.forEach(el => {
        delete el._selected;
        delete el._isConnectionStart;
    });
    RAILWAY_EDITOR.selectedElements = [];
    firstSelectedElement = null;
    updateSelectionUI();
    console.log('❌ Selezione cancellata');
}

function updateSelectionUI() {
    const selectionCount = document.getElementById('selectionCount');
    if (selectionCount) {
        const count = RAILWAY_EDITOR.selectedElements.length;
        selectionCount.textContent = count > 0 ? `${count} selezionati` : '';
        selectionCount.style.display = count > 0 ? 'inline' : 'none';
    }
    
    updatePropertiesPanel();
    redrawCanvas();
}

/**
 * ==========================================
 * TOOLBAR E TOOL MANAGEMENT
 * ==========================================
 */

function setupToolbar() {
    document.querySelectorAll('.tool-item[data-tool]').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolName = this.dataset.tool;
            setActiveTool(toolName);
        });
    });
}

function setActiveTool(toolName) {
    // Esci dalla modalità connessione se attiva
    if (connectionMode && toolName !== 'connect') {
        connectionMode = false;
        firstSelectedElement = null;
        updateConnectionUI();
    }
    
    RAILWAY_EDITOR.activeTool = toolName;
    
    // Aggiorna UI
    document.querySelectorAll('.tool-item[data-tool]').forEach(item => {
        item.classList.toggle('active', item.dataset.tool === toolName);
    });
    
    updateCanvasCursor();
    console.log('🔧 Tool attivo:', toolName);
}

function updateCanvasCursor() {
    if (!RAILWAY_EDITOR.canvas) return;
    
    const cursors = {
        select: 'default',
        move: RAILWAY_EDITOR.isDragging ? 'grabbing' : 'grab',
        delete: 'not-allowed'
    };
    
    if (connectionMode) {
        RAILWAY_EDITOR.canvas.style.cursor = 'crosshair';
    } else {
        RAILWAY_EDITOR.canvas.style.cursor = cursors[RAILWAY_EDITOR.activeTool] || 'default';
    }
}

/**
 * ==========================================
 * GESTIONE ELEMENTI
 * ==========================================
 */

function deleteElement(element) {
    const index = RAILWAY_EDITOR.elements.indexOf(element);
    if (index >= 0) {
        // Rimuovi connessioni
        removeElementConnections(element);
        
        // Rimuovi dalla selezione
        const selIndex = RAILWAY_EDITOR.selectedElements.indexOf(element);
        if (selIndex >= 0) {
            RAILWAY_EDITOR.selectedElements.splice(selIndex, 1);
        }
        
        // Rimuovi dall'array
        RAILWAY_EDITOR.elements.splice(index, 1);
        
        saveStateToHistory();
        updateElementStats();
        updateSelectionUI();
        redrawCanvas();
        
        console.log('🗑️ Elemento eliminato:', element.name);
    }
}

function duplicateSelected() {
    if (RAILWAY_EDITOR.selectedElements.length === 0) {
        showStatus('Nessun elemento selezionato');
        return;
    }
    
    const offset = 30;
    const newElements = [];
    
    RAILWAY_EDITOR.selectedElements.forEach(element => {
        const newElement = addElementToCanvas(element, element.x + offset, element.y + offset);
        newElements.push(newElement);
    });
    
    // Seleziona i nuovi elementi
    clearSelection();
    newElements.forEach(element => {
        selectElement(element);
    });
    
    console.log('📑 Duplicati', newElements.length, 'elementi');
}

function removeElementConnections(element) {
    RAILWAY_EDITOR.elements.forEach(otherElement => {
        if (otherElement.connections) {
            otherElement.connections = otherElement.connections.filter(conn => 
                conn.to !== element.id && conn.from !== element.id
            );
        }
    });
}

function updateElementStats() {
    const elementCount = document.getElementById('elementCount');
    if (elementCount) {
        const count = RAILWAY_EDITOR.elements.length;
        elementCount.textContent = `${count} elemento${count !== 1 ? 'i' : ''}`;
    }
}

/**
 * ==========================================
 * UTILITY FUNCTIONS
 * ==========================================
 */

function getElementAtPosition(x, y) {
    for (let i = RAILWAY_EDITOR.elements.length - 1; i >= 0; i--) {
        const element = RAILWAY_EDITOR.elements[i];
        const size = getElementSize(element);
        
        if (x >= element.x - size/2 && x <= element.x + size/2 &&
            y >= element.y - size/2 && y <= element.y + size/2) {
            return element;
        }
    }
    return null;
}

function getElementSize(element) {
    switch (element.type) {
        case 'signal': return 30;
        case 'track': return 25;
        case 'speed_limit': return 20;
        case 'distance': return 20;
        case 'tronchino': return 25;
        default: return 20;
    }
}

function snapToGrid(x, y) {
    if (!RAILWAY_EDITOR.snapToGrid) return { x, y };
    
    const grid = RAILWAY_EDITOR.gridSize;
    return {
        x: Math.round(x / grid) * grid,
        y: Math.round(y / grid) * grid
    };
}

function updateMouseCoords(x, y) {
    const coords = document.getElementById('canvasCoords');
    if (coords) {
        coords.textContent = `${Math.round(x)}, ${Math.round(y)}`;
    }
}

function showStatus(message) {
    console.log('ℹ️', message);
    // Potresti aggiungere un toast notification qui
}

/**
 * ==========================================
 * ZOOM E VIEW CONTROLS
 * ==========================================
 */

function zoomIn() {
    RAILWAY_EDITOR.zoom = Math.min(3, RAILWAY_EDITOR.zoom * 1.2);
    redrawCanvas();
    console.log('🔍+ Zoom:', Math.round(RAILWAY_EDITOR.zoom * 100) + '%');
}

function zoomOut() {
    RAILWAY_EDITOR.zoom = Math.max(0.3, RAILWAY_EDITOR.zoom / 1.2);
    redrawCanvas();
    console.log('🔍- Zoom:', Math.round(RAILWAY_EDITOR.zoom * 100) + '%');
}

function resetView() {
    RAILWAY_EDITOR.zoom = 1;
    RAILWAY_EDITOR.pan = { x: 0, y: 0 };
    redrawCanvas();
    console.log('🎯 Vista resettata');
}

function clearCanvas() {
    if (RAILWAY_EDITOR.elements.length === 0) {
        showStatus('Canvas già vuoto');
        return;
    }
    
    if (confirm('🗑️ Cancellare tutti gli elementi?')) {
        RAILWAY_EDITOR.elements = [];
        clearSelection();
        saveStateToHistory();
        updateElementStats();
        redrawCanvas();
        console.log('🗑️ Canvas pulito');
    }
}

/**
 * ==========================================
 * RENDERING OTTIMIZZATO
 * ==========================================
 */

function drawElements(ctx) {
    RAILWAY_EDITOR.elements.forEach(element => {
        drawElement(ctx, element);
    });
}

function drawElement(ctx, element) {
    const size = getElementSize(element);
    const x = element.x;
    const y = element.y;
    
    // Salva il contesto per le trasformazioni
    ctx.save();
    
    // Bordo selezione prima di tutto
    if (element._selected) {
        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - size/2 - 4, y - size/2 - 4, size + 8, size + 8);
    }
    
    // Indicatore primo elemento connessione
    if (element._isConnectionStart) {
        ctx.strokeStyle = '#28a745';
        ctx.lineWidth = 4;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(x - size/2 - 6, y - size/2 - 6, size + 12, size + 12);
        ctx.setLineDash([]);
    }
    
    // Rendering specifico per tipo di elemento
    switch (element.type) {
        case 'signal':
            drawSignal(ctx, x, y, size, element);
            break;
        case 'track':
            drawTrack(ctx, x, y, size, element);
            break;
        case 'deviata':
            drawDeviata(ctx, x, y, size, element);
            break;
        case 'ponte':
            drawPonte(ctx, x, y, size, element);
            break;
        case 'tunnel':
            drawTunnel(ctx, x, y, size, element);
            break;
        case 'station':
            drawStation(ctx, x, y, size, element);
            break;
        default:
            drawGenericElement(ctx, x, y, size, element);
            break;
    }
    
    // Debug: ID elemento in piccolo
    ctx.fillStyle = '#666';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(element.id.slice(-4), x, y + size/2 + 12);
    
    ctx.restore();
}

// Rendering realistico dei segnali ferroviari - SEGNALI PIÙ GRANDI E VERTICALI
function drawSignal(ctx, x, y, size, element) {
    // Aumenta la dimensione del segnale
    const signalSize = size * 1.8; // Segnali più grandi
    
    // Base del segnale (palo centrale più spesso)
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x - 3, y - signalSize/2, 6, signalSize);
    
    // Staffa del segnale più robusta
    ctx.fillStyle = '#34495e';
    ctx.fillRect(x - signalSize/2 - 5, y - signalSize/2.5, signalSize + 10, 12);
    
    // Tre cerchi per le luci del segnale DISPOSTI IN VERTICALE
    const circleRadius = signalSize/6; // Cerchi più grandi
    const verticalSpacing = signalSize/4; // Spaziatura verticale
    
    // Determina i colori delle luci in base al tipo di segnale
    let colors = ['#95a5a6', '#95a5a6', '#95a5a6']; // spento
    
    if (element.id.includes('stop')) {
        colors = ['#e74c3c', '#95a5a6', '#95a5a6']; // rosso in alto
    } else if (element.id.includes('caution')) {
        colors = ['#95a5a6', '#f39c12', '#95a5a6']; // giallo al centro
    } else if (element.id.includes('go')) {
        colors = ['#95a5a6', '#95a5a6', '#27ae60']; // verde in basso
    }
    
    // Disegna i tre cerchi VERTICALMENTE
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        // Posizione verticale: dall'alto (i=0) al basso (i=2)
        const circleY = y - signalSize/3 + (i * verticalSpacing);
        ctx.arc(x + signalSize/2 + 8, circleY, circleRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Bordo dei cerchi più marcato
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Effetto lucido sui cerchi accesi
        if (colors[i] !== '#95a5a6') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(x + signalSize/2 + 8 - circleRadius/3, circleY - circleRadius/3, circleRadius/2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Etichetta più grande e chiara
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(element.name.replace('Segnale ', ''), x, y + signalSize/2 + 15);
}

// Rendering dei binari
function drawTrack(ctx, x, y, size, element) {
    ctx.fillStyle = element.color || '#34495e';
    
    if (element.id.includes('straight')) {
        // Binario dritto
        ctx.fillRect(x - size/2, y - 3, size, 6);
        // Traverse
        for (let i = -size/2; i < size/2; i += 8) {
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(x + i, y - 4, 2, 8);
        }
    } else if (element.id.includes('curve')) {
        // Binario curvo
        ctx.strokeStyle = element.color;
        ctx.lineWidth = 6;
        ctx.beginPath();
        if (element.id.includes('left')) {
            ctx.arc(x + size/2, y + size/2, size/2, Math.PI, Math.PI * 1.5);
        } else {
            ctx.arc(x - size/2, y + size/2, size/2, Math.PI * 1.5, Math.PI * 2);
        }
        ctx.stroke();
    } else if (element.id.includes('junction')) {
        // Bivio
        ctx.fillRect(x - size/2, y - 2, size, 4);
        ctx.fillRect(x - 2, y - size/2, 4, size/2);
    } else if (element.id.includes('cross')) {
        // Incrocio
        ctx.fillRect(x - size/2, y - 2, size, 4);
        ctx.fillRect(x - 2, y - size/2, 4, size);
    }
}

// Rendering delle deviate angolari
function drawDeviata(ctx, x, y, size, element) {
    ctx.strokeStyle = element.color;
    ctx.lineWidth = 4;
    
    // Disegna linea angolare in base alla direzione
    ctx.beginPath();
    
    if (element.id.includes('down_right')) {
        // Linea da centro verso basso-destra
        ctx.moveTo(x - size/3, y - size/3);
        ctx.lineTo(x + size/3, y + size/3);
    } else if (element.id.includes('down_left')) {
        // Linea da centro verso basso-sinistra
        ctx.moveTo(x + size/3, y - size/3);
        ctx.lineTo(x - size/3, y + size/3);
    } else if (element.id.includes('up_right')) {
        // Linea da centro verso alto-destra
        ctx.moveTo(x - size/3, y + size/3);
        ctx.lineTo(x + size/3, y - size/3);
    } else if (element.id.includes('up_left')) {
        // Linea da centro verso alto-sinistra
        ctx.moveTo(x + size/3, y + size/3);
        ctx.lineTo(x - size/3, y - size/3);
    }
    
    ctx.stroke();
    
    // Aggiungi freccia alla fine della linea per indicare direzione
    ctx.fillStyle = element.color;
    ctx.beginPath();
    
    if (element.id.includes('down_right')) {
        // Punta freccia verso basso-destra
        ctx.moveTo(x + size/3, y + size/3);
        ctx.lineTo(x + size/3 - 8, y + size/3 - 3);
        ctx.lineTo(x + size/3 - 3, y + size/3 - 8);
    } else if (element.id.includes('down_left')) {
        // Punta freccia verso basso-sinistra
        ctx.moveTo(x - size/3, y + size/3);
        ctx.lineTo(x - size/3 + 8, y + size/3 - 3);
        ctx.lineTo(x - size/3 + 3, y + size/3 - 8);
    } else if (element.id.includes('up_right')) {
        // Punta freccia verso alto-destra
        ctx.moveTo(x + size/3, y - size/3);
        ctx.lineTo(x + size/3 - 8, y - size/3 + 3);
        ctx.lineTo(x + size/3 - 3, y - size/3 + 8);
    } else if (element.id.includes('up_left')) {
        // Punta freccia verso alto-sinistra
        ctx.moveTo(x - size/3, y - size/3);
        ctx.lineTo(x - size/3 + 8, y - size/3 + 3);
        ctx.lineTo(x - size/3 + 3, y - size/3 + 8);
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Etichetta più visibile
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
        element.id.includes('down_right') ? '↘' : 
        element.id.includes('down_left') ? '↙' : 
        element.id.includes('up_right') ? '↗' : '↖', 
        x, y + size/2 + 12
    );
}

// Rendering ponti
function drawPonte(ctx, x, y, size, element) {
    // Struttura del ponte
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(x - size/2, y - 4, size, 8);
    
    // Piloni
    ctx.fillStyle = '#5d4e75';
    for (let i = -size/3; i <= size/3; i += size/3) {
        ctx.fillRect(x + i - 2, y - size/2, 4, size);
    }
    
    // Binario sopra
    ctx.fillStyle = '#34495e';
    ctx.fillRect(x - size/2, y - 6, size, 2);
}

// Rendering tunnel
function drawTunnel(ctx, x, y, size, element) {
    // Apertura del tunnel
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x - size/2, y - size/4, size, size/2);
    
    // Arco del tunnel
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, size/3, 0, Math.PI, true);
    ctx.stroke();
    
    // Binario che entra
    ctx.fillStyle = '#34495e';
    ctx.fillRect(x - size/2, y - 2, size, 4);
}

// Rendering stazione
function drawStation(ctx, x, y, size, element) {
    // Edificio della stazione
    ctx.fillStyle = '#3498db';
    ctx.fillRect(x - size/2, y - size/3, size, size*2/3);
    
    // Tetto
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.moveTo(x - size/2 - 2, y - size/3);
    ctx.lineTo(x, y - size/2 - 2);
    ctx.lineTo(x + size/2 + 2, y - size/3);
    ctx.closePath();
    ctx.fill();
    
    // Porta
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x - 3, y, 6, size/3);
    
    // Finestre
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(x - size/3, y - size/6, 4, 4);
    ctx.fillRect(x + size/3 - 4, y - size/6, 4, 4);
}

// Rendering generico per altri elementi
function drawGenericElement(ctx, x, y, size, element) {
    // Sfondo elemento
    ctx.fillStyle = element.color || '#ddd';
    ctx.fillRect(x - size/2, y - size/2, size, size);
    
    // Bordo normale
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - size/2, y - size/2, size, size);
    
    // Icona elemento
    ctx.fillStyle = '#333';
    ctx.font = `bold ${Math.max(12, size * 0.6)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(element.icon || '?', x, y);
}

function drawConnections(ctx) {
    const drawnConnections = new Set();
    
    RAILWAY_EDITOR.elements.forEach(element => {
        if (element.connections) {
            element.connections.forEach(connection => {
                const connectionKey = [connection.from, connection.to].sort().join('-');
                
                if (!drawnConnections.has(connectionKey)) {
                    drawRailConnection(ctx, element, connection);
                    drawnConnections.add(connectionKey);
                }
            });
        }
    });
}

function drawRailConnection(ctx, fromElement, connection) {
    const toElement = RAILWAY_EDITOR.elements.find(el => el.id === connection.to);
    if (!toElement) return;
    
    const fromX = fromElement.x;
    const fromY = fromElement.y;
    const toX = toElement.x;
    const toY = toElement.y;
    
    // Calcola l'angolo della connessione
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const distance = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
    
    // Se la distanza è troppo corta, non disegnare la connessione
    if (distance < 40) return;
    
    // Calcola i punti di attacco agli elementi (ai bordi)
    const fromSize = getElementSize(fromElement) / 2;
    const toSize = getElementSize(toElement) / 2;
    
    const startX = fromX + Math.cos(angle) * fromSize;
    const startY = fromY + Math.sin(angle) * fromSize;
    const endX = toX - Math.cos(angle) * toSize;
    const endY = toY - Math.sin(angle) * toSize;
    
    // Salva il contesto
    ctx.save();
    
    // Disegna il binario di connessione
    drawRailwayTrack(ctx, startX, startY, endX, endY);
    
    // Disegna informazioni sulla connessione
    drawConnectionInfo(ctx, startX, startY, endX, endY, connection);
    
    ctx.restore();
}

function drawRailwayTrack(ctx, startX, startY, endX, endY) {
    const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const angle = Math.atan2(endY - startY, endX - startX);
    
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(angle);
    
    // Disegna le traverse del binario
    const traverseSpacing = 12;
    const numTraverses = Math.floor(distance / traverseSpacing);
    
    for (let i = 0; i <= numTraverses; i++) {
        const x = (i * distance) / numTraverses;
        
        // Traversa in legno
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x - 1, -6, 2, 12);
    }
    
    // Disegna i binari (due rotaie parallele)
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 3;
    
    // Rotaia superiore
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(distance, -3);
    ctx.stroke();
    
    // Rotaia inferiore
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.lineTo(distance, 3);
    ctx.stroke();
    
    // Linea centrale più sottile per enfatizzare
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(distance, 0);
    ctx.stroke();
    
    ctx.restore();
}

function drawConnectionInfo(ctx, startX, startY, endX, endY, connection) {
    // Punto medio della connessione
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    
    // Distanza in metri (approssimativa)
    const distanceInMeters = Math.round(connection.distance / 2); // scala approssimativa
    
    // Sfondo per l'etichetta
    ctx.fillStyle = 'rgba(44, 62, 80, 0.9)';
    ctx.fillRect(midX - 20, midY - 10, 40, 20);
    
    // Bordo dell'etichetta
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 1;
    ctx.strokeRect(midX - 20, midY - 10, 40, 20);
    
    // Testo della distanza
    ctx.fillStyle = '#ecf0f1';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${distanceInMeters}m`, midX, midY);
    
    // Piccole frecce per indicare la direzione
    const angle = Math.atan2(endY - startY, endX - startX);
    
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 2;
    
    // Freccia verso la destinazione
    ctx.save();
    ctx.translate(midX + 25, midY);
    ctx.rotate(angle);
    
    ctx.beginPath();
    ctx.moveTo(-5, -3);
    ctx.lineTo(0, 0);
    ctx.lineTo(-5, 3);
    ctx.stroke();
    
    ctx.restore();
}

// Sistema di collegamento binari ferroviari realistico
function createConnectionBetween(elementA, elementB) {
    // Verifica che non sia lo stesso elemento
    if (elementA.id === elementB.id) {
        showConnectionFeedback('❌ Non puoi collegare un elemento a se stesso!', 'warning');
        return;
    }
    
    // Inizializza connections se non esistono
    if (!elementA.connections) elementA.connections = [];
    if (!elementB.connections) elementB.connections = [];
    
    // Verifica se esiste già una connessione DIRETTA tra questi due elementi
    const existingConnection = elementA.connections?.find(conn => 
        conn.to === elementB.id
    );
    
    if (existingConnection) {
        showConnectionFeedback('ℹ️ Binario già esistente tra questi elementi', 'warning');
        return;
    }
    
    // Calcola distanza
    const distance = Math.round(Math.sqrt(
        Math.pow(elementB.x - elementA.x, 2) + 
        Math.pow(elementB.y - elementA.y, 2)
    ));
    
    // Permetti elementi anche molto vicini - è normale per le ferrovie!
    // Solo avviso se distanza estremamente lunga
    if (distance > 400) {
        const distanceInMeters = Math.round(distance / 2);
        const confirm = window.confirm(`Binario molto lungo (${distanceInMeters}m). Vuoi continuare?`);
        if (!confirm) return;
    }
    
    // Determina il tipo di binario in base agli elementi connessi
    let railType = 'standard';
    if (elementA.type === 'ponte' || elementB.type === 'ponte') {
        railType = 'elevated';
    } else if (elementA.type === 'tunnel' || elementB.type === 'tunnel') {
        railType = 'underground';
    } else if (elementA.type === 'deviata' || elementB.type === 'deviata') {
        railType = 'junction';
    }
    
    // Crea connessione bidirezionale
    const connectionId = Date.now() + '_rail_' + Math.random().toString(36).substr(2, 9);
    
    const connectionA = {
        id: connectionId,
        from: elementA.id,
        to: elementB.id,
        distance: distance,
        type: railType,
        created: new Date().toISOString()
    };
    
    const connectionB = {
        id: connectionId,
        from: elementB.id,
        to: elementA.id,
        distance: distance,
        type: railType,
        created: new Date().toISOString()
    };
    
    elementA.connections.push(connectionA);
    elementB.connections.push(connectionB);
    
    saveStateToHistory();
    redrawCanvas(); // Ridisegna per mostrare immediatamente la connessione
    
    const distanceInMeters = Math.round(distance / 2);
    const connectionsCountA = elementA.connections.length;
    const connectionsCountB = elementB.connections.length;
    
    showConnectionFeedback(
        `🚄 Binario costruito! ${elementA.name} ↔ ${elementB.name}<br>` +
        `📏 Lunghezza: ${distanceInMeters}m | 🔗 Connessioni: ${elementA.name}(${connectionsCountA}) - ${elementB.name}(${connectionsCountB})`, 
        'success'
    );
    
    console.log('🛤️ Binario creato:', {
        from: elementA.name,
        to: elementB.name,
        distance: distanceInMeters + 'm',
        type: railType,
        totalConnectionsA: connectionsCountA,
        totalConnectionsB: connectionsCountB
    });
}

function showConnectionFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
        font-size: 0.9rem;
    `;
    
    if (type === 'success') {
        feedback.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        feedback.style.color = 'white';
    } else if (type === 'warning') {
        feedback.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
        feedback.style.color = 'white';
    } else if (type === 'info') {
        feedback.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
        feedback.style.color = 'white';
    } else {
        feedback.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        feedback.style.color = 'white';
    }
    
    feedback.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
            <div style="font-size: 1.2em; margin-top: 0.1rem; flex-shrink: 0;">${type === 'success' ? '🚄' : type === 'warning' ? '⚠️' : type === 'info' ? 'ℹ️' : '❌'}</div>
            <div style="flex: 1; line-height: 1.3;">${message}</div>
        </div>
    `;
    
    document.body.appendChild(feedback);
    
    // Animazione di entrata
    setTimeout(() => {
        feedback.style.transform = 'translateX(0)';
    }, 100);
    
    // Rimozione automatica
    setTimeout(() => {
        feedback.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 4000);
}

/**
 * ==========================================
 * PROPERTIES PANEL SEMPLIFICATO
 * ==========================================
 */

function updatePropertiesPanel() {
    const panel = document.getElementById('propertiesContent');
    if (!panel) return;
    
    if (RAILWAY_EDITOR.selectedElements.length === 0) {
        panel.innerHTML = `
            <p class="help-text">Seleziona un elemento per vedere le proprietà</p>
        `;
        return;
    }
    
    if (RAILWAY_EDITOR.selectedElements.length === 1) {
        const element = RAILWAY_EDITOR.selectedElements[0];
        panel.innerHTML = `
            <div class="property-group">
                <h4>📋 ${element.name}</h4>
                <div class="property-item">
                    <span class="property-label">Tipo:</span>
                    <span class="property-value">${element.type}</span>
                </div>
                <div class="property-item">
                    <span class="property-label">Posizione X:</span>
                    <span class="property-value">${Math.round(element.x)}px</span>
                </div>
                <div class="property-item">
                    <span class="property-label">Posizione Y:</span>
                    <span class="property-value">${Math.round(element.y)}px</span>
                </div>
                <div class="property-item">
                    <span class="property-label">Connessioni:</span>
                    <span class="property-value">${element.connections ? element.connections.length : 0}</span>
                </div>
                <div class="property-item">
                    <span class="property-label">ID:</span>
                    <span class="property-value">${element.id}</span>
                </div>
            </div>
        `;
    } else {
        panel.innerHTML = `
            <div class="property-group">
                <h4>📋 Selezione Multipla</h4>
                <div class="property-item">
                    <span class="property-label">Elementi selezionati:</span>
                    <span class="property-value">${RAILWAY_EDITOR.selectedElements.length}</span>
                </div>
                <div class="property-item">
                    <span class="property-label">Azioni disponibili:</span>
                    <span class="property-value">Sposta, Elimina</span>
                </div>
            </div>
        `;
    }
}

/**
 * ==========================================
 * SISTEMA CONNESSIONI SEMPLIFICATO
 * ==========================================
 */

let connectionMode = false;
let firstSelectedElement = null;

function setupConnectionMode() {
    // Stato iniziale
    updateConnectionUI();
}

function toggleConnectionMode() {
    connectionMode = !connectionMode;
    
    if (connectionMode) {
        firstSelectedElement = null;
        RAILWAY_EDITOR.activeTool = 'connect';
        showConnectionHelp();
    } else {
        firstSelectedElement = null;
        RAILWAY_EDITOR.activeTool = 'select';
        hideConnectionHelp();
    }
    
    updateConnectionUI();
    updateCanvasCursor();
    console.log('🔗 Modalità connessione:', connectionMode ? 'ATTIVA' : 'DISATTIVA');
}

function updateConnectionUI() {
    const btn = document.getElementById('connectBtn');
    const help = document.getElementById('connectionHelp');
    
    if (btn) {
        if (connectionMode) {
            btn.classList.add('active');
            btn.innerHTML = '❌ Annulla Connessione';
            
            if (help) {
                if (firstSelectedElement) {
                    help.querySelector('span').textContent = 'Clicca sul secondo elemento da collegare...';
                    help.style.display = 'flex';
                } else {
                    help.querySelector('span').textContent = 'Clicca sul primo elemento da collegare...';
                    help.style.display = 'flex';
                }
            }
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '🔗 Collega Elementi';
            
            if (help) {
                help.style.display = 'none';
            }
        }
    }
}

function showConnectionHelp() {
    // Mostra help visivo per le connessioni
    const help = document.createElement('div');
    help.id = 'connectionHelp';
    help.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(40, 167, 69, 0.95);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    help.innerHTML = '🔗 MODALITÀ CONNESSIONE ATTIVA<br>Clicca su due elementi per collegarli • Connessioni multiple supportate • Qualsiasi distanza OK';
    
    document.body.appendChild(help);
    
    // Rimuovi dopo 3 secondi
    setTimeout(() => {
        const helpEl = document.getElementById('connectionHelp');
        if (helpEl) helpEl.remove();
    }, 3000);
}

function hideConnectionHelp() {
    const helpEl = document.getElementById('connectionHelp');
    if (helpEl) helpEl.remove();
}

/**
 * ==========================================
 * RIMOZIONE SHORTCUTS - SOLO MOUSE/TOUCH
 * ==========================================
 */

function setupKeyboardShortcuts() {
    // Rimuovo tutti gli shortcuts - ora è tutto mouse-based!
    console.log('⌨️ Shortcuts disabilitati - interfaccia solo mouse/touch');
}

/**
 * ==========================================
 * MODERN CANVAS HANDLING
 * ==========================================
 */

/**
 * ==========================================
 * HISTORY SYSTEM SEMPLIFICATO
 * ==========================================
 */

function saveStateToHistory() {
    // Rimuovi stati futuri se stiamo nel mezzo della history
    if (RAILWAY_EDITOR.historyIndex < RAILWAY_EDITOR.history.length - 1) {
        RAILWAY_EDITOR.history = RAILWAY_EDITOR.history.slice(0, RAILWAY_EDITOR.historyIndex + 1);
    }
    
    // Salva stato corrente (deep copy)
    const state = {
        elements: JSON.parse(JSON.stringify(RAILWAY_EDITOR.elements)),
        timestamp: Date.now()
    };
    
    RAILWAY_EDITOR.history.push(state);
    
    // Mantieni solo gli ultimi stati
    if (RAILWAY_EDITOR.history.length > RAILWAY_EDITOR.maxHistory) {
        RAILWAY_EDITOR.history.shift();
    } else {
        RAILWAY_EDITOR.historyIndex++;
    }
}

function undo() {
    if (RAILWAY_EDITOR.historyIndex > 0) {
        RAILWAY_EDITOR.historyIndex--;
        const state = RAILWAY_EDITOR.history[RAILWAY_EDITOR.historyIndex];
        RAILWAY_EDITOR.elements = JSON.parse(JSON.stringify(state.elements));
        clearSelection();
        redrawCanvas();
        updateElementStats();
        console.log('↶ Undo applicato');
    }
}

function redo() {
    if (RAILWAY_EDITOR.historyIndex < RAILWAY_EDITOR.history.length - 1) {
        RAILWAY_EDITOR.historyIndex++;
        const state = RAILWAY_EDITOR.history[RAILWAY_EDITOR.historyIndex];
        RAILWAY_EDITOR.elements = JSON.parse(JSON.stringify(state.elements));
        clearSelection();
        redrawCanvas();
        updateElementStats();
        console.log('↷ Redo applicato');
    }
}

/**
 * ==========================================
 * CANVAS SETUP MODERNO E ROBUSTO
 * ==========================================
 */

function setupCanvas() {
    const canvas = document.getElementById('railwayCanvas');
    if (!canvas) {
        console.error('❌ Canvas non trovato!');
        return;
    }
    
    RAILWAY_EDITOR.canvas = canvas;
    RAILWAY_EDITOR.ctx = canvas.getContext('2d');
    
    // Dimensionamento dinamico del canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Event listeners essenziali
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    
    // Drag & drop
    canvas.addEventListener('dragover', handleCanvasDragOver);
    canvas.addEventListener('drop', handleCanvasDrop);
    
    // Touch support base
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    
    updateCanvasCursor();
    updateGridDisplay();
    redrawCanvas();
    
    console.log('🖼️ Canvas inizializzato:', canvas.width, 'x', canvas.height);
}

function resizeCanvas() {
    const canvas = RAILWAY_EDITOR.canvas;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    
    // Imposta dimensioni reali del canvas
    canvas.width = rect.width - 20; // margini
    canvas.height = rect.height - 20;
    
    // Aggiorna viewport
    RAILWAY_EDITOR.viewport.width = canvas.width;
    RAILWAY_EDITOR.viewport.height = canvas.height;
    
    console.log('📐 Canvas ridimensionato:', canvas.width, 'x', canvas.height);
    
    // Ridisegna dopo il resize
    if (RAILWAY_EDITOR.ctx) {
        updateGridDisplay();
        redrawCanvas();
    }
}

// Aggiunge elemento al centro del canvas con un click
function addElementToCenter(elementId) {
    const element = RAILWAY_ELEMENTS[elementId];
    if (!element) {
        console.error('❌ Elemento non trovato:', elementId);
        return;
    }
    
    const canvas = RAILWAY_EDITOR.canvas;
    if (!canvas) {
        console.error('❌ Canvas non inizializzato');
        return;
    }
    
    const centerX = canvas.width / (2 * RAILWAY_EDITOR.zoom);
    const centerY = canvas.height / (2 * RAILWAY_EDITOR.zoom);
    
    console.log('➕ Aggiungendo elemento al centro:', element.name, 'at', centerX, centerY);
    
    const newElement = addElementToCanvas(element, centerX, centerY);
    
    // Chiudi dropdown
    const trigger = document.querySelector('.dropdown-trigger');
    const content = document.getElementById('elementsDropdownContent');
    if (trigger && content) {
        trigger.classList.remove('active');
        content.classList.remove('active');
    }
    
    // Mostra feedback
    showUserFeedback(`✅ ${element.name} aggiunto al canvas!`, 'success');
    
    console.log(`✅ Elemento ${element.name} aggiunto con ID:`, newElement.id);
}

function addElementToCanvas(elementData, x, y) {
    const newElement = {
        id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        ...elementData,
        x: x,
        y: y,
        connections: []
    };
    
    RAILWAY_EDITOR.elements.push(newElement);
    saveStateToHistory();
    updateElementStats();
    redrawCanvas();
    
    console.log('✅ Elemento aggiunto:', newElement.name, 'at', x, y, 'ID:', newElement.id);
    console.log('📊 Totale elementi:', RAILWAY_EDITOR.elements.length);
    
    return newElement;
}

function getElementAtPosition(x, y) {
    console.log('🔍 Cercando elemento at:', x, y);
    
    for (let i = RAILWAY_EDITOR.elements.length - 1; i >= 0; i--) {
        const element = RAILWAY_EDITOR.elements[i];
        const size = getElementSize(element);
        
        const left = element.x - size/2;
        const right = element.x + size/2;
        const top = element.y - size/2;
        const bottom = element.y + size/2;
        
        console.log(`  Controllando ${element.name} at (${element.x}, ${element.y}) size:${size} bounds:[${left},${top},${right},${bottom}]`);
        
        if (x >= left && x <= right && y >= top && y <= bottom) {
            console.log('✅ Elemento trovato:', element.name);
            return element;
        }
    }
    
    console.log('❌ Nessun elemento trovato at:', x, y);
    return null;
}

function handleCanvasClick(e) {
    if (!RAILWAY_EDITOR.canvas) return;
    
    const rect = RAILWAY_EDITOR.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / RAILWAY_EDITOR.zoom;
    const y = (e.clientY - rect.top) / RAILWAY_EDITOR.zoom;
    
    console.log('👆 Canvas click at:', x, y, 'tool:', RAILWAY_EDITOR.activeTool, 'connectionMode:', connectionMode);
    
    const clickedElement = getElementAtPosition(x, y);
    
    if (connectionMode) {
        handleConnectionClick(clickedElement);
    } else {
        handleNormalClick(clickedElement, e);
    }
}

function handleNormalClick(element, e) {
    console.log('🎯 Normal click on:', element ? element.name : 'canvas');
    
    // Gestione normale (selezione, etc.)
    if (e.ctrlKey || e.metaKey) {
        if (element) {
            toggleElementSelection(element);
        }
    } else {
        if (element) {
            selectElement(element);
        } else {
            clearSelection();
        }
    }
    updateSelectionUI();
    redrawCanvas();
}

function selectElement(element) {
    if (!RAILWAY_EDITOR.selectedElements.includes(element)) {
        RAILWAY_EDITOR.selectedElements.push(element);
        element._selected = true;
    }
    updateSelectionUI();
    console.log('🎯 Elemento selezionato:', element.name, 'Totale selezionati:', RAILWAY_EDITOR.selectedElements.length);
}

function handleConnectionClick(element) {
    if (!element) {
        console.log('ℹ️ Clicca su un elemento per connettere');
        return;
    }
    
    if (!firstSelectedElement) {
        // Primo elemento
        firstSelectedElement = element;
        element._isConnectionStart = true;
        updateConnectionUI();
        redrawCanvas();
        showConnectionFeedback(`🟢 Primo elemento selezionato: ${element.name}<br>Ora clicca su un altro elemento per collegarlo`, 'info');
        console.log('🟢 Primo elemento selezionato:', element.name);
        
    } else if (firstSelectedElement === element) {
        // Stesso elemento - annulla
        firstSelectedElement._isConnectionStart = false;
        firstSelectedElement = null;
        updateConnectionUI();
        redrawCanvas();
        showConnectionFeedback('❌ Connessione annullata', 'warning');
        console.log('❌ Selezione annullata');
        
    } else {
        // Secondo elemento - crea connessione
        createConnectionBetween(firstSelectedElement, element);
        
        // Reset
        firstSelectedElement._isConnectionStart = false;
        firstSelectedElement = null;
        connectionMode = false;
        updateConnectionUI();
        redrawCanvas();
    }
}

function startMoving(element, x, y, e) {
    RAILWAY_EDITOR.isDragging = true;
    RAILWAY_EDITOR.dragStart = { x, y };
    
    // Se l'elemento non è selezionato, selezionalo
    if (!RAILWAY_EDITOR.selectedElements.includes(element)) {
        if (!(e.ctrlKey || e.metaKey)) {
            clearSelection();
        }
        selectElement(element);
    }
    
    // Prepara elementi per il drag
    RAILWAY_EDITOR.draggedElements = [...RAILWAY_EDITOR.selectedElements];
    
    // Calcola offset per ogni elemento
    RAILWAY_EDITOR.draggedElements.forEach(el => {
        el._dragOffset = {
            x: el.x - x,
            y: el.y - y
        };
    });
    
    RAILWAY_EDITOR.canvas.style.cursor = 'grabbing';
    console.log('🚚 Inizio spostamento:', RAILWAY_EDITOR.draggedElements.length, 'elementi');
}

function updateMoving(x, y) {
    if (!RAILWAY_EDITOR.isDragging) return;
    
    RAILWAY_EDITOR.draggedElements.forEach(element => {
        const newX = x + element._dragOffset.x;
        const newY = y + element._dragOffset.y;
        
        const snappedPos = RAILWAY_EDITOR.snapToGrid ? 
            snapToGrid(newX, newY) : { x: newX, y: newY };
        
        element.x = snappedPos.x;
        element.y = snappedPos.y;
    });
    
    updateElementStats();
}

function stopMoving() {
    if (RAILWAY_EDITOR.draggedElements.length > 0) {
        saveStateToHistory();
        
        // Pulisci offset temporanei
        RAILWAY_EDITOR.draggedElements.forEach(el => {
            delete el._dragOffset;
        });
        
        console.log('✅ Spostamento completato');
    }
    
    RAILWAY_EDITOR.draggedElements = [];
    RAILWAY_EDITOR.isDragging = false;
    updateCanvasCursor();
}

/**
 * ==========================================
 * TOUCH SUPPORT E GRIGLIA
 * ==========================================
 */

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = RAILWAY_EDITOR.canvas.getBoundingClientRect();
        const mouseEvent = {
            clientX: touch.clientX,
            clientY: touch.clientY,
            preventDefault: () => e.preventDefault()
        };
        handleCanvasMouseDown(mouseEvent);
    }
}

function handleTouchMove(e) {
    if (e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = {
            clientX: touch.clientX,
            clientY: touch.clientY
        };
        handleCanvasMouseMove(mouseEvent);
    }
}

function handleTouchEnd(e) {
    handleCanvasMouseUp({});
}

function updateGridDisplay() {
    const canvas = RAILWAY_EDITOR.canvas;
    if (!canvas) return;
    
    if (RAILWAY_EDITOR.showGrid) {
        // Griglia orizzontale definita nel CSS
        canvas.style.backgroundImage = `
            linear-gradient(90deg, #e0e0e0 1px, transparent 1px),
            linear-gradient(0deg, #e0e0e0 1px, transparent 1px)
        `;
        canvas.style.backgroundSize = `${RAILWAY_EDITOR.gridSize}px ${RAILWAY_EDITOR.gridSize}px`;
    } else {
        canvas.style.backgroundImage = 'none';
    }
}

function updateGridSize(newSize) {
    RAILWAY_EDITOR.gridSize = parseInt(newSize);
    updateGridDisplay();
    console.log('📐 Griglia aggiornata:', RAILWAY_EDITOR.gridSize + 'px');
}

function toggleGrid() {
    RAILWAY_EDITOR.showGrid = !RAILWAY_EDITOR.showGrid;
    const gridToggle = document.getElementById('gridToggle');
    if (gridToggle) {
        gridToggle.classList.toggle('active', RAILWAY_EDITOR.showGrid);
    }
    
    updateGridDisplay();
    console.log('⚏ Griglia:', RAILWAY_EDITOR.showGrid ? 'VISIBILE' : 'NASCOSTA');
}

function toggleSnap() {
    RAILWAY_EDITOR.snapToGrid = !RAILWAY_EDITOR.snapToGrid;
    const snapToggle = document.getElementById('snapToggle');
    if (snapToggle) {
        snapToggle.classList.toggle('active', RAILWAY_EDITOR.snapToGrid);
    }
    console.log('🧲 Snap:', RAILWAY_EDITOR.snapToGrid ? 'ATTIVO' : 'DISATTIVO');
}

function setupElementsDropdown() {
    const dropdownContent = document.getElementById('elementsDropdownContent');
    
    Object.entries(ELEMENT_CATEGORIES).forEach(([categoryId, category]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'dropdown-category';
        categoryDiv.innerHTML = `
            <div class="category-header-dropdown">${category.name}</div>
            <div class="category-elements">
                ${Object.values(category.elements).map(element => `
                    <div class="element-item compact" 
                         draggable="true" 
                         data-element="${element.id}"
                         onclick="addElementToCenter('${element.id}')"
                         title="Clicca per aggiungere o trascina sul canvas">
                        <div class="element-icon" style="background: ${element.color}">
                            ${element.icon}
                        </div>
                        <span class="element-name">${element.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
        dropdownContent.appendChild(categoryDiv);
    });

    // Setup drag & drop semplificato
    setupSimpleDragDrop();
}

function setupSimpleDragDrop() {
    document.querySelectorAll('.element-item.compact').forEach(item => {
        item.addEventListener('dragstart', function(e) {
            const elementId = this.dataset.element;
            e.dataTransfer.setData('text/plain', elementId);
            this.style.opacity = '0.5';
            console.log('🚀 Drag avviato:', elementId);
        });
        
        item.addEventListener('dragend', function(e) {
            this.style.opacity = '';
        });
    });
}

function toggleElementsDropdown() {
    const trigger = document.querySelector('.dropdown-trigger');
    const content = document.getElementById('elementsDropdownContent');
    
    const isActive = trigger.classList.toggle('active');
    content.classList.toggle('active', isActive);
    
    // Chiudi dropdown se clicchi fuori
    if (isActive) {
        setTimeout(() => {
            document.addEventListener('click', closeDropdownOnOutsideClick, true);
        }, 0);
    } else {
        document.removeEventListener('click', closeDropdownOnOutsideClick, true);
    }
}

function closeDropdownOnOutsideClick(e) {
    const dropdown = document.querySelector('.elements-dropdown');
    if (!dropdown.contains(e.target)) {
        const trigger = document.querySelector('.dropdown-trigger');
        const content = document.getElementById('elementsDropdownContent');
        
        trigger.classList.remove('active');
        content.classList.remove('active');
        document.removeEventListener('click', closeDropdownOnOutsideClick, true);
    }
}

// Rendering ottimizzato - evita ridisegni inutili
let redrawScheduled = false;

function redrawCanvas() {
    if (redrawScheduled) return;
    
    redrawScheduled = true;
    requestAnimationFrame(() => {
        performRedraw();
        redrawScheduled = false;
    });
}

/**
 * ==========================================
 * RENDERING CON DEBUG
 * ==========================================
 */

function performRedraw() {
    if (!RAILWAY_EDITOR.ctx) {
        console.warn('⚠️ Context non disponibile per rendering');
        return;
    }
    
    const ctx = RAILWAY_EDITOR.ctx;
    const canvas = RAILWAY_EDITOR.canvas;
    
    // Pulisci canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    console.log('🎨 Rendering elementi:', RAILWAY_EDITOR.elements.length);
    
    // Applica trasformazioni
    ctx.save();
    ctx.scale(RAILWAY_EDITOR.zoom, RAILWAY_EDITOR.zoom);
    ctx.translate(RAILWAY_EDITOR.pan.x, RAILWAY_EDITOR.pan.y);
    
    // Disegna connessioni se abilitate
    if (RAILWAY_EDITOR.showConnections !== false) {
        drawConnections(ctx);
    }
    
    // Disegna elementi
    drawElements(ctx);
    
    ctx.restore();
    
    // Debug: disegna info sugli elementi
    if (RAILWAY_EDITOR.elements.length > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(10, canvas.height - 80, 200, 70);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(`Elementi: ${RAILWAY_EDITOR.elements.length}`, 15, canvas.height - 60);
        ctx.fillText(`Selezionati: ${RAILWAY_EDITOR.selectedElements.length}`, 15, canvas.height - 45);
        ctx.fillText(`Zoom: ${Math.round(RAILWAY_EDITOR.zoom * 100)}%`, 15, canvas.height - 30);
        ctx.fillText(`Tool: ${RAILWAY_EDITOR.activeTool}`, 15, canvas.height - 15);
    }
}

/**
 * ==========================================
 * FEEDBACK UTENTE MIGLIORATO
 * ==========================================
 */

function showUserFeedback(message, type = 'info', duration = 3000) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    const colors = {
        success: { bg: '#28a745', color: 'white' },
        warning: { bg: '#ffc107', color: '#212529' },
        error: { bg: '#dc3545', color: 'white' },
        info: { bg: '#17a2b8', color: 'white' }
    };
    
    const color = colors[type] || colors.info;
    feedback.style.background = color.bg;
    feedback.style.color = color.color;
    
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    // Animazione di entrata
    setTimeout(() => {
        feedback.style.transform = 'translateX(0)';
    }, 100);
    
    // Rimozione automatica
    setTimeout(() => {
        feedback.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, duration);
}

/**
 * ==========================================
 * DATABASE E SALVATAGGIO
 * ==========================================
 */

// Database compatibilità
let CUSTOM_RAILWAYS = [];

function loadSavedRailways() {
    try {
        const saved = localStorage.getItem('rfi_custom_railways');
        if (saved) {
            CUSTOM_RAILWAYS = JSON.parse(saved);
            console.log('📚 Caricate', CUSTOM_RAILWAYS.length, 'linee private salvate');
        }
    } catch (error) {
        console.error('❌ Errore caricamento linee salvate:', error);
    }
}

function saveCurrentRailway() {
    if (RAILWAY_EDITOR.elements.length === 0) {
        showUserFeedback('⚠️ Nessun elemento da salvare!', 'warning');
        return;
    }
    
    const name = prompt('💾 Nome della linea:', 'Linea ' + (CUSTOM_RAILWAYS.length + 1));
    if (!name) return;
    
    const railway = {
        id: Date.now(),
        name: name,
        elements: JSON.parse(JSON.stringify(RAILWAY_EDITOR.elements)),
        created: new Date().toISOString(),
        author: 'Utente',
        stats: {
            elementCount: RAILWAY_EDITOR.elements.length,
            connectionCount: RAILWAY_EDITOR.elements.reduce((count, el) => 
                count + (el.connections ? el.connections.length : 0), 0) / 2
        }
    };
    
    CUSTOM_RAILWAYS.push(railway);
    
    try {
        localStorage.setItem('rfi_custom_railways', JSON.stringify(CUSTOM_RAILWAYS));
        showUserFeedback(`✅ Linea "${name}" salvata con successo!`, 'success');
        console.log('💾 Linea privata salvata:', railway);
        
        // Se siamo nella home, ricarica per mostrare la nuova linea
        if (ROUTE_HANDLER.currentRoute === '#home') {
            ROUTE_HANDLER.renderCurrentRoute();
        }
    } catch (error) {
        showUserFeedback('❌ Errore durante il salvataggio: ' + error.message, 'error');
        console.error('❌ Errore salvataggio:', error);
    }
}

function showRailwayGallery() {
    if (CUSTOM_RAILWAYS.length === 0) {
        alert('📚 Nessuna linea salvata. Crea e salva prima una linea!');
        return;
    }
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 8px; padding: 2rem; max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3>📚 Galleria Linee Salvate</h3>
                <button onclick="this.closest('div').parentElement.remove()" 
                        style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 0.5rem 1rem; cursor: pointer;">
                    ✕ Chiudi
                </button>
            </div>
            <div style="display: grid; gap: 1rem;">
                ${CUSTOM_RAILWAYS.map(railway => `
                    <div style="border: 1px solid #e9ecef; border-radius: 6px; padding: 1rem; cursor: pointer; transition: all 0.2s;"
                         onmouseover="this.style.background='#f8f9fa'"
                         onmouseout="this.style.background='white'"
                         onclick="loadRailway('${railway.id}')">
                        <h4 style="margin: 0 0 0.5rem 0; color: #495057;">${railway.name}</h4>
                        <div style="font-size: 0.85rem; color: #6c757d;">
                            📅 ${new Date(railway.created).toLocaleDateString()} | 
                            📊 ${railway.stats.elementCount} elementi | 
                            🔗 ${railway.stats.connectionCount} connessioni
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function loadRailway(railwayId) {
    const railway = CUSTOM_RAILWAYS.find(r => r.id == railwayId);
    if (!railway) {
        showUserFeedback('❌ Linea non trovata!', 'error');
        return;
    }
    
    if (RAILWAY_EDITOR.elements.length > 0) {
        if (!confirm('⚠️ Sostituire la linea corrente?\n(I dati non salvati andranno persi)')) {
            return;
        }
    }
    
    // Carica elementi
    RAILWAY_EDITOR.elements = JSON.parse(JSON.stringify(railway.elements));
    
    // Reset stati dell'editor
    clearSelection();
    RAILWAY_EDITOR.selectedElements = [];
    RAILWAY_EDITOR.connectionStart = null;
    firstSelectedElement = null;
    connectionMode = false;
    
    // Aggiorna interfaccia
    updateElementStats();
    updateConnectionUI();
    
    // Ridisegna canvas
    redrawCanvas();
    
    // Salva nella history
    saveStateToHistory();
    
    // Chiudi modal se presente
    const modal = document.querySelector('[style*="position: fixed"]');
    if (modal) {
        modal.remove();
    }
    
    console.log('📁 Linea caricata:', railway.name);
    showUserFeedback(`✅ Linea "${railway.name}" caricata con successo!`, 'success');
}

// Espone la funzione per onclick nel modal
window.loadRailway = loadRailway;

/**
 * ==========================================
 * SISTEMA INIZIALIZZAZIONE ROBUSTO
 * ==========================================
 */

function initializeRailwayEditor() {
    console.log('🚀 Inizializzazione Sistema Linee Ferroviarie RFI...');
    
    try {
        // Verifica disponibilità DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeRailwayEditor);
            return;
        }
        
        // Carica linee salvate
        loadSavedRailways();
        
        // Crea interfaccia con routing
        createEditorInterface();
        
        console.log('✅ Sistema inizializzato con successo');
        
        // Nascondi messaggio caricamento
        const loadingMsg = document.querySelector('.loading-message');
        if (loadingMsg) {
            loadingMsg.style.display = 'none';
        }
        
    } catch (error) {
        console.error('❌ Errore inizializzazione sistema:', error);
        
        // Mostra errore all'utente
        const container = document.querySelector('.exercise-info');
        if (container) {
            container.innerHTML = `
                <div class="error-state" style="text-align: center; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h3 style="color: #e74c3c; margin-bottom: 1rem;">❌ Errore Inizializzazione</h3>
                    <p style="color: #7f8c8d; margin-bottom: 1rem;">Si è verificato un errore durante l'avvio del sistema:</p>
                    <code style="background: #f8f9fa; padding: 0.5rem; border-radius: 4px; display: inline-block; margin-bottom: 1rem;">${error.message}</code>
                    <br>
                    <button onclick="location.reload()" class="action-btn primary">
                        🔄 Ricarica Pagina
                    </button>
                </div>
            `;
        }
    }
}

/**
 * ==========================================
 * DEBUG E UTILITIES
 * ==========================================
 */

function debugEditor() {
    console.log('🔍 DEBUG RAILWAY_EDITOR:', {
        mode: RAILWAY_EDITOR.mode,
        activeTool: RAILWAY_EDITOR.activeTool,
        elements: RAILWAY_EDITOR.elements.length,
        selected: RAILWAY_EDITOR.selectedElements.length,
        history: RAILWAY_EDITOR.history.length,
        historyIndex: RAILWAY_EDITOR.historyIndex,
        zoom: RAILWAY_EDITOR.zoom,
        showGrid: RAILWAY_EDITOR.showGrid,
        snapToGrid: RAILWAY_EDITOR.snapToGrid,
        connectionMode: connectionMode,
        firstSelected: firstSelectedElement?.name || 'none'
    });
    
    console.log('📊 Elementi dettagli:');
    RAILWAY_EDITOR.elements.forEach((el, i) => {
        console.log(`  ${i}: ${el.name} at (${el.x}, ${el.y}) - connections: ${el.connections?.length || 0}`);
    });
    
    return RAILWAY_EDITOR;
}

// Espone debug globalmente
window.debugEditor = debugEditor;

/**
 * ==========================================
 * AUTO-INIZIALIZZAZIONE
 * ==========================================
 */

// Auto-inizializzazione quando il DOM è pronto
if (typeof document !== 'undefined') {
    // Inizializza solo se siamo nella pagina dell'editor
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeRailwayEditor);
    } else {
        initializeRailwayEditor();
    }
}

console.log('📦 Sistema Linee Ferroviarie RFI - Modulo caricato'); 
console.log('🚀 Sistema privato con routing inizializzato!'); 
console.log('🏗️ Editor Linee Ferroviarie con tracciati inizializzato!'); 