/**
 * SIMULATORE SEGNALI RFI - DEFINIZIONI SEGNALI
 * =============================================
 * Database completo dei segnali ferroviari RFI
 * Sistemi a 2 e 3 aspetti conformi alle normative
 */

// Le configurazioni dei binari sono definite in exercises.js

// Database completo tipi di segnali
const SIGNAL_TYPES = {
    // =========================================
    // SEGNALI DI PRIMA CATEGORIA (2 aspetti)
    // =========================================
    ROSSO: {
        id: 'rosso',
        name: 'Rosso',
        category: 'prima_categoria',
        system: 2,
        aspects: 2,
        class: 'signal-rosso',
        icon: 'R',
        color: '#e74c3c',
        meaning: 'Alt - Fermata assoluta'
    },
    VERDE: {
        id: 'verde',
        name: 'Verde',
        category: 'prima_categoria',
        system: 2,
        aspects: 2,
        class: 'signal-verde',
        icon: 'V',
        color: '#27ae60',
        meaning: 'Via libera'
    },
    ROSSO_VERDE: {
        id: 'rosso_verde',
        name: 'Rosso-Verde',
        category: 'prima_categoria',
        system: 2,
        aspects: 2,
        class: 'signal-rosso-verde',
        icon: 'RV',
        color: '#e67e22',
        meaning: 'Via libera condizionata'
    },
    DOPPIO_GIALLO: {
        id: 'doppio_giallo',
        name: 'Doppio Giallo',
        category: 'prima_categoria',
        system: 2,
        aspects: 2,
        class: 'signal-doppio-giallo',
        icon: 'GG',
        color: '#f39c12',
        meaning: 'Preavviso di fermata'
    },

    // =========================================
    // SEGNALI DI AVVISO (2 aspetti)
    // =========================================
    AVVISO_GIALLO: {
        id: 'avviso_giallo',
        name: 'Avviso Giallo',
        category: 'avviso',
        system: 2,
        aspects: 2,
        class: 'signal-avviso-giallo',
        icon: 'A-G',
        color: '#f39c12',
        meaning: 'Preavviso di aspetto non favorevole'
    },
    AVVISO_GIALLO_LAMPEGGIANTE: {
        id: 'avviso_giallo_lampeggiante',
        name: 'Avviso Giallo Lampeggiante',
        category: 'avviso',
        system: 2,
        class: 'signal-avviso-giallo-lampeggiante',
        icon: 'A-GL',
        meaning: 'Preavviso con prescrizioni speciali'
    },
    AVVISO_GIALLO_VERDE: {
        id: 'avviso_giallo_verde',
        name: 'Avviso Giallo-Verde',
        category: 'avviso',
        system: 2,
        class: 'signal-avviso-giallo-verde',
        icon: 'A-GV',
        meaning: 'Preavviso di via libera con limitazioni'
    },
    AVVISO_GIALLO_VERDE_LAMP_CONTEMP: {
        id: 'avviso_giallo_verde_lamp_contemp',
        name: 'Avviso Giallo-Verde Lampeggianti Contemporaneamente',
        category: 'avviso',
        system: 2,
        class: 'signal-avviso-giallo-verde-lamp-contemp',
        icon: 'A-GVL',
        meaning: 'Preavviso con limitazioni severe'
    },
    AVVISO_GIALLO_VERDE_LAMP_ALT: {
        id: 'avviso_giallo_verde_lamp_alt',
        name: 'Avviso Giallo-Verde Lampeggianti Alternativamente',
        category: 'avviso',
        system: 2,
        class: 'signal-avviso-giallo-verde-lamp-alt',
        icon: 'A-GVA',
        meaning: 'Preavviso deviazione con limitazioni'
    },
    AVVISO_VERDE: {
        id: 'avviso_verde',
        name: 'Avviso Verde',
        category: 'avviso',
        system: 2,
        class: 'signal-avviso-verde',
        icon: 'A-V',
        meaning: 'Preavviso di via libera'
    },

    // =========================================
    // SEGNALI ACCOPPIATI (3 aspetti)
    // =========================================
    ACC_ROSSO: {
        id: 'acc_rosso',
        name: 'Accoppiato Rosso',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-rosso',
        icon: 'AC-R',
        meaning: 'Alt - Fermata assoluta'
    },
    ACC_VERDE: {
        id: 'acc_verde',
        name: 'Accoppiato Verde',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-verde',
        icon: 'AC-V',
        meaning: 'Via libera'
    },
    ACC_GIALLO: {
        id: 'acc_giallo',
        name: 'Accoppiato Giallo',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-giallo',
        icon: 'AC-G',
        meaning: 'Preavviso di fermata'
    },
    ACC_GIALLO_LAMPEGGIANTE: {
        id: 'acc_giallo_lampeggiante',
        name: 'Accoppiato Giallo Lampeggiante',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-giallo-lampeggiante',
        icon: 'AC-GL',
        meaning: 'Preavviso con prescrizioni speciali'
    },
    ACC_GIALLO_GIALLO: {
        id: 'acc_giallo_giallo',
        name: 'Accoppiato Giallo-Giallo',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-giallo-giallo',
        icon: 'AC-GG',
        meaning: 'Preavviso di preavviso'
    },
    ACC_GIALLO_VERDE: {
        id: 'acc_giallo_verde',
        name: 'Accoppiato Giallo-Verde',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-giallo-verde',
        icon: 'AC-GV',
        meaning: 'Via libera con limitazioni'
    },
    ACC_GIALLO_VERDE_LAMP_CONTEMP: {
        id: 'acc_giallo_verde_lamp_contemp',
        name: 'Accoppiato Giallo-Verde Lampeggianti Contemporaneamente',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-giallo-verde-lamp-contemp',
        icon: 'AC-GVL',
        meaning: 'Via libera con limitazioni severe'
    },
    ACC_GIALLO_VERDE_LAMP_ALT: {
        id: 'acc_giallo_verde_lamp_alt',
        name: 'Accoppiato Giallo-Verde Lampeggianti Alternativamente',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-giallo-verde-lamp-alt',
        icon: 'AC-GVA',
        meaning: 'Deviazione con limitazioni'
    },
    ACC_ROSSO_VERDE: {
        id: 'acc_rosso_verde',
        name: 'Accoppiato Rosso-Verde',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-rosso-verde',
        icon: 'AC-RV',
        meaning: 'Via libera condizionata'
    },
    ACC_ROSSO_GIALLO: {
        id: 'acc_rosso_giallo',
        name: 'Accoppiato Rosso-Giallo',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-rosso-giallo',
        icon: 'AC-RG',
        meaning: 'Disposizione per la partenza'
    },
    ACC_ROSSO_GIALLO_LAMP: {
        id: 'acc_rosso_giallo_lamp',
        name: 'Accoppiato Rosso-Giallo con Giallo Lampeggiante',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-rosso-giallo-lamp',
        icon: 'AC-RGL',
        meaning: 'Partenza con prescrizioni'
    },
    ACC_ROSSO_GIALLO_GIALLO: {
        id: 'acc_rosso_giallo_giallo',
        name: 'Accoppiato Rosso-Giallo-Giallo',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-rosso-giallo-giallo',
        icon: 'AC-RGG',
        meaning: 'Partenza con doppia limitazione'
    },
    ACC_ROSSO_GIALLO_VERDE: {
        id: 'acc_rosso_giallo_verde',
        name: 'Accoppiato Rosso-Giallo-Verde',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-rosso-giallo-verde',
        icon: 'AC-RGV',
        meaning: 'Partenza su itinerario deviato'
    },
    ACC_ROSSO_GIALLO_VERDE_LAMP_CONTEMP: {
        id: 'acc_rosso_giallo_verde_lamp_contemp',
        name: 'Accoppiato Rosso-Giallo-Verde Lampeggianti Contemporaneamente',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-rosso-giallo-verde-lamp-contemp',
        icon: 'AC-RGVL',
        meaning: 'Partenza deviata con limitazioni severe'
    },
    ACC_ROSSO_GIALLO_VERDE_LAMP_ALT: {
        id: 'acc_rosso_giallo_verde_lamp_alt',
        name: 'Accoppiato Rosso-Giallo-Verde Lampeggianti Alternativamente',
        category: 'accoppiato',
        system: 3,
        class: 'signal-acc-rosso-giallo-verde-lamp-alt',
        icon: 'AC-RGVA',
        meaning: 'Partenza su tronchino o binario di servizio'
    }
};

/**
 * ==========================================
 * INIZIALIZZAZIONE E COMPATIBILITÀ
 * ==========================================
 */

// Funzione per aggiornare automaticamente i segnali con proprietà mancanti
function enhanceSignalTypes() {
    Object.values(SIGNAL_TYPES).forEach(signal => {
        // Aggiunge aspects se mancante
        if (!signal.aspects) {
            signal.aspects = signal.system;
        }
        
        // Aggiunge colori di default se mancanti
        if (!signal.color) {
            if (signal.id.includes('rosso')) {
                signal.color = '#e74c3c';
            } else if (signal.id.includes('verde')) {
                signal.color = '#27ae60';
            } else if (signal.id.includes('giallo')) {
                signal.color = '#f39c12';
            } else if (signal.category === 'avviso') {
                signal.color = '#3498db';
            } else if (signal.category === 'accoppiato') {
                signal.color = '#9b59b6';
            } else {
                signal.color = '#7f8c8d';
            }
        }
    });
}

// Funzione di caricamento per compatibilità con main.js
function loadSignalTypes() {
    enhanceSignalTypes();
    console.log('🚦 Tipi di segnali caricati:', Object.keys(SIGNAL_TYPES).length);
    return SIGNAL_TYPES;
}

// Utility per ottenere segnali per sistema
function getSignalsBySystem(aspects) {
    return Object.values(SIGNAL_TYPES).filter(signal => signal.aspects === aspects);
}

// Utility per ottenere segnali per categoria
function getSignalsByCategory(category, aspects = null) {
    return Object.values(SIGNAL_TYPES).filter(signal => 
        signal.category === category && 
        (aspects === null || signal.aspects === aspects)
    );
}

// Inizializzazione automatica
enhanceSignalTypes();

// Esporta per uso globale
window.SIGNAL_TYPES = SIGNAL_TYPES;
window.loadSignalTypes = loadSignalTypes;
window.getSignalsBySystem = getSignalsBySystem;
window.getSignalsByCategory = getSignalsByCategory;

console.log('🚦 Sistema segnali RFI inizializzato'); 