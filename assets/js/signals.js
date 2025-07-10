/**
 * SIMULATORE SEGNALI RFI - DEFINIZIONI SEGNALI
 * =============================================
 * Database completo dei segnali ferroviari RFI
 * Sistemi a 2 e 3 aspetti conformi alle normative
 */

// Configurazioni dei tipi di binario
const TRACK_CONFIGS = {
    simple: "Linea semplice banalizzata",
    double: "Linea doppia",
    station: "Stazione/Fermata",
    deviation: "Binario deviato",
    tronchino: "Tronchino/Binario di servizio", 
    av: "Linea Alta Velocità",
    av_deviation: "Deviazione AV",
    maintenance_depot: "Deposito/Officina",
    industrial_siding: "Raccordo industriale",
    passing_loop: "Posto di movimento/Bivio"
};

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
        class: 'signal-rosso',
        icon: 'R',
        meaning: 'Alt - Fermata assoluta'
    },
    VERDE: {
        id: 'verde',
        name: 'Verde',
        category: 'prima_categoria',
        system: 2,
        class: 'signal-verde',
        icon: 'V',
        meaning: 'Via libera'
    },
    ROSSO_VERDE: {
        id: 'rosso_verde',
        name: 'Rosso-Verde',
        category: 'prima_categoria',
        system: 2,
        class: 'signal-rosso-verde',
        icon: 'RV',
        meaning: 'Via libera condizionata'
    },
    DOPPIO_GIALLO: {
        id: 'doppio_giallo',
        name: 'Doppio Giallo',
        category: 'prima_categoria',
        system: 2,
        class: 'signal-doppio-giallo',
        icon: 'GG',
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
        class: 'signal-avviso-giallo',
        icon: 'A-G',
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

// Esporta per uso globale
window.SIGNAL_TYPES = SIGNAL_TYPES;
window.TRACK_CONFIGS = TRACK_CONFIGS; 