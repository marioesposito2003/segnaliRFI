# 🏗️ Editor Linee Ferroviarie RFI - Sistema Personalizzato

Sistema avanzato per costruire e utilizzare linee ferroviarie personalizzate con segnalamento RFI.

## 🎯 Caratteristiche Principali

### **Editor Drag & Drop**
- **Canvas interattivo** con griglia regolabile
- **Palette completa** di elementi ferroviari
- **Sistema di snap** automatico alla griglia
- **Fallback touch** per dispositivi mobili

### **Elementi Disponibili**
- 🚦 **Segnali vuoti** da configurare
- 🛤️ **Tracciati** (linee dritte, curve, bivi, incroci)
- 🌉 **Infrastrutture** (ponti, gallerie)
- 🔧 **Tronchini** per manutenzione
- ⚡ **Limitatori velocità** (60, 80, 100, 120 km/h)
- 📏 **Marcatori distanza** (500m, 1km, 1.2km, 1.5km)

### **Sistema di Connessioni**
- **Modalità collegamento** tra elementi
- **Calcolo automatico** delle distanze
- **Visualizzazione** connessioni sul canvas
- **Rete ferroviaria** completa e realistica

### **Database Condiviso**
- **💾 Salvataggio locale** con nome e autore
- **📤 Export/Import** file JSON per condivisione
- **👥 Soluzioni collaborative** per stesso percorso
- **📊 Statistiche** utilizzo e progressi

## 🎮 Come Usare

### **1. Modalità Costruzione**
1. **Trascina elementi** dalla palette al canvas
2. **Attiva modalità collegamento** per connettere elementi
3. **Clicca su due elementi** per creare connessioni
4. **Salva la linea** con nome personalizzato

### **2. Modalità Gioco**
1. **Seleziona linea salvata** dalla griglia
2. **Clicca su segnale verde** per partenza
3. **Clicca su segnale rosso** per arrivo
4. **Avvia esercizio** di posizionamento segnali

### **3. Esercizio Segnali**
1. **Posiziona segnali** lungo il percorso
2. **Sistema automatico** partenza/arrivo
3. **Salva soluzione** per confronti
4. **Vedi altre soluzioni** degli utenti

## 🚦 Sistema Segnali RFI

### **Supporto Completo**
- **2 aspetti**: Prima categoria, Avviso
- **3 aspetti**: Segnali accoppiati
- **40+ tipi** di segnali RFI autentici
- **Colorazione** e iconografie corrette

### **Tipologie Disponibili**
- 🔴 **Prima Categoria**: Rosso, Verde, Rosso-Verde, Doppio Giallo
- 🟡 **Avviso**: Giallo, Giallo Lampeggiante, Giallo-Verde variations
- 🔺 **Accoppiati**: Tutti gli aspetti a 3 luci RFI

## 💻 Installazione e Uso

### **Locale**
```bash
# Clona repository
git clone [url-repository]
cd segnali

# Avvia server locale
python -m http.server 8000

# Apri browser
http://localhost:8000
```

### **Online**
1. **Carica files** su server web
2. **Configura** HTTPS per localStorage
3. **Condividi** link con team

## 🗂️ Struttura Files

```
segnali/
├── index.html              # Pagina principale
├── assets/
│   ├── css/
│   │   └── styles.css      # Stili completi responsive
│   ├── js/
│   │   ├── exercises.js    # Editor e gestione linee
│   │   ├── main.js         # Controller principale
│   │   └── signals.js      # Database segnali RFI
│   └── images/
│       └── favicon.ico     # Icona applicazione
└── README.md               # Documentazione
```

## 🔧 Funzionalità Tecniche

### **Canvas Engine**
- **HTML5 Canvas** per rendering veloce
- **Event handling** completo (mouse/touch)
- **Griglia dinamica** e snap intelligente
- **Zoom e pan** (previsto per future versioni)

### **Storage Sistema**
- **localStorage** per salvataggio locale
- **JSON export/import** per backup
- **Compatibilità cross-browser**
- **Gestione errori** robusta

### **Responsive Design**
- **Mobile-first** approach
- **Touch gestures** supportati
- **Layout adattivo** per tablet/desktop
- **Accessibilità** WCAG 2.1

## 📈 Database e Statistiche

### **Linee Ferroviarie**
```json
{
  "id": "railway_123456789",
  "name": "Linea Milano-Roma",
  "elements": [...],
  "createdAt": "2024-01-01T12:00:00Z",
  "createdBy": "Progettista"
}
```

### **Soluzioni Segnali**
```json
{
  "id": "sol_987654321",
  "railwayId": "railway_123456789",
  "startSignal": "elem_abc123",
  "endSignal": "elem_def456",
  "solution": ["verde", "giallo", "rosso"],
  "userName": "Operatore",
  "timestamp": "2024-01-01T12:30:00Z"
}
```

## 🎨 Personalizzazione

### **Elementi Custom**
1. **Modifica** `RAILWAY_ELEMENTS` in `exercises.js`
2. **Aggiungi** nuovi tipi e icone
3. **Estendi** logica di rendering
4. **Aggiorna** CSS per stili

### **Segnali RFI**
1. **Edita** `SIGNAL_TYPES` in `signals.js`
2. **Mantieni** compatibilità aspects 2/3
3. **Usa** colorazione RFI standard
4. **Testa** con sistema esistente

## 🚀 Roadmap Futuro

### **Versione 2.0**
- [ ] **Zoom e pan** canvas
- [ ] **Rotazione elementi** con mouse wheel
- [ ] **Layers sistema** (segnali, tracciati, velocità)
- [ ] **Template linee** predefinite

### **Versione 3.0**
- [ ] **Simulazione dinamica** treni
- [ ] **Logica segnali** automatica
- [ ] **Export CAD/DWG** per uso professionale
- [ ] **Multiplayer** collaborativo real-time

## 📞 Supporto

### **Risoluzione Problemi**
- **Drag & drop non funziona**: Ricarica pagina, verifica console
- **Canvas non responsive**: Verifica CSS e viewport
- **Salvataggio non funziona**: Controlla localStorage browser

### **Debug**
```javascript
// Console browser
window.debugEditor()

// Mostra stato completo sistema
console.log(window.RAILWAY_EDITOR)
console.log(window.APP_STATE)
```

## 📄 Licenza

Sistema sviluppato per **formazione ferroviaria RFI**.
Non per uso commerciale senza autorizzazione.

---

**🚂 Editor Linee Ferroviarie RFI v2.0**  
*Sistema avanzato per costruzione e simulazione linee personalizzate* 