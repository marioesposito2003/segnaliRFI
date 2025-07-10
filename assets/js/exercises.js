/**
 * SIMULATORE SEGNALI RFI - DATABASE ESERCIZI
 * ==========================================
 * Esercizi completi per sistemi a 2 e 3 aspetti
 * Conformi alle normative RFI per addestramento
 */

// Database completo esercizi sistema 2 aspetti
const EXERCISES_2_ASPECT = [
    // LIVELLO FACILE
    {
        id: 1,
        difficulty: 'facile',
        title: "Linea semplice - Marcia normale",
        description: "Treno regionale su linea semplice non elettrificata, circolazione normale",
        trackConfig: "simple",
        conditions: [
            "Linea semplice banalizzata",
            "Velocità massima 100 km/h",
            "Distanza normale tra segnali (1200m)",
            "Assenza di limitazioni"
        ],
        positions: 4,
        solution: ['avviso_verde', 'verde', 'doppio_giallo', 'rosso'],
        explanation: "Sequenza base per linea semplice: Avviso Verde (preavviso libera) → Verde (via libera) → Doppio Giallo (preavviso fermata) → Rosso (fermata)."
    },
    {
        id: 2,
        difficulty: 'facile',
        title: "Ingresso stazione - Binario di ricevimento",
        description: "Treno merci in ingresso a stazione su binario principale",
        trackConfig: "station",
        conditions: [
            "Stazione di categoria B",
            "Binario di ricevimento I°",
            "Velocità di ingresso 60 km/h",
            "Itinerario predisposto"
        ],
        positions: 3,
        solution: ['avviso_giallo', 'doppio_giallo', 'rosso'],
        explanation: "Ingresso in stazione: Avviso Giallo (preavviso non favorevole) → Doppio Giallo (preavviso fermata) → Rosso (fermata in stazione)."
    },
    {
        id: 3,
        difficulty: 'facile',
        title: "Percorso deviato - Limitazione velocità",
        description: "Deviazione su binario secondario con limitazione 30 km/h",
        trackConfig: "deviation",
        conditions: [
            "Deviatoio per binario secondario",
            "Raggio di curvatura 190m",
            "Velocità massima 30 km/h",
            "Controllo automatico velocità"
        ],
        positions: 4,
        solution: ['avviso_giallo_verde_lamp_alt', 'rosso_verde', 'doppio_giallo', 'rosso'],
        explanation: "Deviazione: Avviso Giallo-Verde Lampeggianti Alternativamente (deviazione con limitazioni) → Rosso-Verde (via libera condizionata) → Doppio Giallo → Rosso."
    },
    {
        id: 4,
        difficulty: 'facile',
        title: "Distanza ridotta - Zona urbana",
        description: "Attraversamento zona urbana con segnali ravvicinati",
        trackConfig: "urban",
        conditions: [
            "Zona urbana densamente abitata",
            "Distanza ridotta tra segnali (600m)",
            "Numerosi passaggi a livello",
            "Velocità urbana 50 km/h"
        ],
        positions: 5,
        solution: ['avviso_verde', 'verde', 'avviso_giallo', 'doppio_giallo', 'rosso'],
        explanation: "Zona urbana con distanza ridotta richiede segnali aggiuntivi per garantire spazio di frenatura adeguato."
    },
    {
        id: 5,
        difficulty: 'facile',
        title: "Tronchino di servizio - Manovra",
        description: "Manovra su tronchino per deposito locomotive",
        trackConfig: "tronchino",
        conditions: [
            "Tronchino lungo 150m",
            "Deposito locomotive",
            "Manovra a spinta",
            "Velocità massima 15 km/h"
        ],
        positions: 3,
        solution: ['avviso_giallo_verde_lamp_contemp', 'rosso_verde', 'rosso'],
        explanation: "Tronchino: Avviso Giallo-Verde Lampeggianti Contemporaneamente (limitazioni severe) → Rosso-Verde (via libera condizionata) → Rosso (fermata)."
    },
    {
        id: 6,
        difficulty: 'medio',
        title: "Binario ingombro - Treno in sosta",
        description: "Binario occupato da treno in sosta, deviazione necessaria",
        trackConfig: "blocked",
        conditions: [
            "Binario principale occupato",
            "Treno merci in sosta tecnica",
            "Deviazione obbligatoria",
            "Attesa autorizzazione"
        ],
        positions: 4,
        solution: ['avviso_giallo', 'rosso', 'rosso_verde', 'verde'],
        explanation: "Binario ingombro: fermata, attesa liberazione, poi autorizzazione condizionata e via libera su percorso alternativo."
    },
    {
        id: 7,
        difficulty: 'medio',
        title: "Distanza anomala - Lavori in corso",
        description: "Lavori di manutenzione con distanza anomala tra segnali",
        trackConfig: "maintenance",
        conditions: [
            "Cantiere di manutenzione attivo",
            "Distanza anomala 2400m",
            "Personale sui binari",
            "Regime di prudenza"
        ],
        positions: 3,
        solution: ['avviso_giallo_lampeggiante', 'rosso_verde', 'doppio_giallo'],
        explanation: "Distanza anomala richiede Avviso Giallo Lampeggiante per prescrizioni speciali, poi marcia condizionata."
    },
    {
        id: 8,
        difficulty: 'medio',
        title: "Limite velocità temporaneo - 60 km/h",
        description: "Limitazione temporanea per verifica armamento",
        trackConfig: "speed_limit",
        conditions: [
            "Limitazione temporanea 60 km/h",
            "Verifica stabilità armamento",
            "Tratto lungo 5 km",
            "Controllo continuo velocità"
        ],
        positions: 5,
        solution: ['avviso_giallo_verde', 'rosso_verde', 'verde', 'verde', 'doppio_giallo'],
        explanation: "Limitazione velocità: preavviso limitazione → autorizzazione condizionata → marcia limitata → preavviso fine limitazione."
    },
    {
        id: 9,
        difficulty: 'difficile',
        title: "Percorso complesso - Stazione grande",
        description: "Ingresso in grande stazione con itinerari multipli",
        trackConfig: "complex_station",
        conditions: [
            "Stazione con 8 binari",
            "Itinerari sovrapposti",
            "Precedenze da coordinare",
            "Traffico intenso"
        ],
        positions: 6,
        solution: ['avviso_verde', 'avviso_giallo_verde_lamp_alt', 'rosso_verde', 'verde', 'doppio_giallo', 'rosso'],
        explanation: "Stazione complessa: sequenza articolata con deviazioni, autorizzazioni condizionate e coordinamento traffico."
    },
    {
        id: 10,
        difficulty: 'difficile',
        title: "Emergenza tecnica - Guasto CTC",
        description: "Guasto al sistema CTC, passaggio a regime telefonico",
        trackConfig: "emergency",
        conditions: [
            "CTC fuori servizio",
            "Regime telefonico attivato",
            "Autorizzazioni manuali",
            "Velocità ridotta 40 km/h"
        ],
        positions: 4,
        solution: ['avviso_giallo_lampeggiante', 'rosso', 'rosso_verde', 'verde'],
        explanation: "Emergenza CTC: preavviso anomalia → fermata per autorizzazione → via libera condizionata → ripresa normale."
    }
];

// Database completo esercizi sistema 3 aspetti
const EXERCISES_3_ASPECT = [
    // LIVELLO FACILE
    {
        id: 1,
        difficulty: 'facile',
        title: "Linea AV - Marcia alta velocità",
        description: "ETR 1000 su linea AV/AC, circolazione normale 300 km/h",
        trackConfig: "high_speed",
        conditions: [
            "Linea Alta Velocità/Alta Capacità",
            "Velocità di linea 300 km/h",
            "ERTMS Level 2 attivo",
            "Distanza standard 1800m"
        ],
        positions: 4,
        solution: ['acc_verde', 'acc_verde', 'acc_giallo', 'acc_rosso'],
        explanation: "AV normale: sequenza standard con segnali accoppiati a 3 aspetti per alta velocità."
    },
    {
        id: 2,
        difficulty: 'facile',
        title: "Stazione AV - Fermata commerciale",
        description: "Fermata Frecciarossa in stazione AV",
        trackConfig: "av_station",
        conditions: [
            "Stazione AV categoria Platinum",
            "Fermata commerciale 2 minuti",
            "Binario dedicato AV",
            "Controllo automatico porte"
        ],
        positions: 3,
        solution: ['acc_giallo', 'acc_rosso_giallo', 'acc_rosso'],
        explanation: "Fermata AV: preavviso fermata → disposizione partenza → fermata per operazioni commerciali."
    },
    {
        id: 3,
        difficulty: 'facile',
        title: "Deviazione AV - Binario lento",
        description: "Deviazione da binario veloce a binario lento 200 km/h",
        trackConfig: "av_deviation",
        conditions: [
            "Deviazione a 200 km/h",
            "Raggio 3000m",
            "Passaggio da AV a linea tradizionale",
            "Cambio sistema segnalamento"
        ],
        positions: 4,
        solution: ['acc_giallo_verde_lamp_alt', 'acc_giallo_verde', 'acc_verde', 'acc_verde'],
        explanation: "Deviazione AV: preavviso deviazione → limitazione → ripresa velocità → marcia normale su linea tradizionale."
    },
    {
        id: 4,
        difficulty: 'medio',
        title: "Interconnessione - AV/Tradizionale",
        description: "Transizione da linea AV a linea tradizionale con cambio sistema",
        trackConfig: "interconnection",
        conditions: [
            "Punto di interconnessione",
            "Cambio da ERTMS a SCMT",
            "Riduzione velocità a 160 km/h",
            "Verifica sistemi di bordo"
        ],
        positions: 5,
        solution: ['acc_verde', 'acc_giallo_verde', 'acc_rosso_verde', 'acc_verde', 'acc_giallo'],
        explanation: "Interconnessione: transizione sistemi → limitazione → autorizzazione condizionata → adattamento nuovo sistema."
    },
    {
        id: 5,
        difficulty: 'medio',
        title: "Cantiere AV - Limitazione 160 km/h",
        description: "Lavori su linea AV con limitazione a 160 km/h per 15 km",
        trackConfig: "av_maintenance",
        conditions: [
            "Lavori di upgrading tecnologico",
            "Limitazione 160 km/h zona cantiere",
            "Distanza anomala per AV",
            "Sorveglianza continua"
        ],
        positions: 6,
        solution: ['acc_verde', 'acc_giallo_verde_lamp_contemp', 'acc_giallo_verde', 'acc_giallo_verde', 'acc_verde', 'acc_giallo'],
        explanation: "Cantiere AV: preavviso limitazione severa → marcia limitata nella zona lavori → ripresa graduale velocità."
    },
    {
        id: 6,
        difficulty: 'medio',
        title: "Tronchino ricovero - ETR in manutenzione",
        description: "Movimento ETR verso tronchino per manutenzione programmata",
        trackConfig: "maintenance_depot",
        conditions: [
            "Tronchino di ricovero ETR",
            "Manutenzione programmata Level 3",
            "Movimento a velocità ridotta",
            "Personale specializzato"
        ],
        positions: 4,
        solution: ['acc_giallo_verde_lamp_contemp', 'acc_rosso_giallo_lamp', 'acc_rosso_verde', 'acc_rosso'],
        explanation: "Movimento verso deposito: limitazioni severe → partenza con prescrizioni → marcia condizionata → fermata."
    },
    {
        id: 7,
        difficulty: 'difficile',
        title: "Blocco parziale AV - Un binario fuori servizio",
        description: "Guasto infrastruttura AV, circolazione su binario unico",
        trackConfig: "av_single_track",
        conditions: [
            "Binario AV Sud fuori servizio",
            "Circolazione promiscua su binario Nord",
            "Senso unico alternato",
            "Velocità ridotta 200 km/h"
        ],
        positions: 6,
        solution: ['acc_giallo_verde_lamp_alt', 'acc_rosso', 'acc_rosso_giallo_verde', 'acc_giallo_verde', 'acc_verde', 'acc_giallo'],
        explanation: "Emergenza AV: preavviso anomalia → fermata → autorizzazione speciale → marcia limitata promiscua."
    },
    {
        id: 8,
        difficulty: 'difficile',
        title: "Ingombro binario AV - Oggetto estraneo",
        description: "Oggetto estraneo sui binari AV, intervento manutenzione",
        trackConfig: "av_obstruction",
        conditions: [
            "Oggetto metallico sui binari",
            "Attivazione squadra intervento",
            "Blocco traffico temporaneo",
            "Verifica danneggiamenti"
        ],
        positions: 5,
        solution: ['acc_verde', 'acc_giallo', 'acc_rosso', 'acc_rosso_verde', 'acc_verde'],
        explanation: "Ingombro AV: avvicinamento normale → preavviso → fermata → liberazione → ripresa circolazione."
    },
    {
        id: 9,
        difficulty: 'esperto',
        title: "Emergenza ERTMS - Fallback mode",
        description: "Guasto ERTMS, passaggio a modalità degradata con segnali fissi",
        trackConfig: "ertms_fallback",
        conditions: [
            "ERTMS Level 2 inoperativo",
            "Fallback a segnalamento fisso",
            "Velocità limitata 160 km/h",
            "Procedure eccezionali"
        ],
        positions: 7,
        solution: ['acc_verde', 'acc_giallo_lampeggiante', 'acc_rosso', 'acc_rosso_giallo_lamp', 'acc_rosso_verde', 'acc_giallo_verde', 'acc_verde'],
        explanation: "Fallback ERTMS: marcia normale → anomalia sistema → fermata → autorizzazione manuale → ripresa graduale."
    },
    {
        id: 10,
        difficulty: 'esperto',
        title: "Prova dinamica AV - Test 350 km/h",
        description: "Prova dinamica infrastruttura con ETR di test a 350 km/h",
        trackConfig: "speed_test",
        conditions: [
            "Prova dinamica infrastruttura",
            "ETR laboratorio Alstom",
            "Velocità test 350 km/h",
            "Linea completamente libera"
        ],
        positions: 5,
        solution: ['acc_rosso_giallo_verde_lamp_alt', 'acc_verde', 'acc_verde', 'acc_verde', 'acc_giallo'],
        explanation: "Test velocità: autorizzazione speciale test → marcia libera alla velocità di prova → rallentamento finale."
    }
];

// Configurazioni specifiche dei tracciati con emoji descrittive
const TRACK_CONFIGS = {
    simple: "🛤️ Linea semplice banalizzata",
    station: "🏢 Stazione intermedia",
    deviation: "↗️ Deviazione binario secondario",
    urban: "🏙️ Zona urbana densamente abitata",
    tronchino: "🔧 Tronchino di servizio",
    blocked: "🚫 Binario principale ingombro",
    maintenance: "⚠️ Lavori di manutenzione",
    speed_limit: "🚧 Limitazione velocità temporanea",
    complex_station: "🏢🏢 Stazione complessa multilivello",
    emergency: "🚨 Regime di emergenza",
    high_speed: "⚡ Linea Alta Velocità",
    av_station: "🏢⚡ Stazione AV",
    av_deviation: "↗️⚡ Deviazione AV",
    interconnection: "🔄 Interconnessione AV/Tradizionale",
    av_maintenance: "⚠️⚡ Cantiere AV",
    maintenance_depot: "🔧⚡ Deposito ETR",
    av_single_track: "⚠️🛤️ AV binario unico",
    av_obstruction: "🚫⚡ Ingombro AV",
    ertms_fallback: "🚨⚡ Fallback ERTMS",
    speed_test: "🏎️⚡ Test velocità"
};

// Esporta per uso globale
window.EXERCISES_2_ASPECT = EXERCISES_2_ASPECT;
window.EXERCISES_3_ASPECT = EXERCISES_3_ASPECT;
window.TRACK_CONFIGS = TRACK_CONFIGS; 