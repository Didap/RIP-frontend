# Piano di Implementazione - Sistema Template Landing Page Memoriale (DID-142)

## Panoramica del Progetto

Obiettivo: Implementare un sistema di auto-generazione di landing page per memoriali con 3 template grafici distinti, un feed social interattivo e funzionalità di contributi (fiori, candele, ricordi).

## Fase 1: Struttura Dati e Backend (3-4 giorni)

### 1.1 Estensione Modello API Backend
- [ ] Aggiungere campo `template` al modello `tombstone` (valori: 'template-1', 'template-2', 'template-3')
- [ ] Aggiungere campo `hero_image` per l'immagine principale del memoriale
- [ ] Creare endpoint per upload immagini:
  - `POST /api/upload` - Upload immagini per memoriali
  - Supporto formati: JPEG, PNG, WebP
  - Compressione ottimizzata per web
- [ ] Estendere API per memoriali per includere:
  - Template selezionato
  - URL immagine hero
  - Dati per la preview

### 1.2 Aggiornamento Frontend API
- [ ] Modificare `src/lib/api.ts`:
  - Aggiungere supporto per upload file
  - Estendere funzioni CRUD memoriali con campo template
- [ ] Creare tipo TypeScript per `MemorialWithTemplate`:
  ```typescript
  interface MemorialWithTemplate extends Tombstone {
    template: 'template-1' | 'template-2' | 'template-3';
    hero_image?: string;
  }
  ```

## Fase 2: Implementazione Template (5-6 giorni)

### 2.1 Creazione Struttura Template
- [ ] Creare cartella `src/components/templates/`
- [ ] Creare componente base `BaseMemorialTemplate.vue` con:
  - Props comuni a tutti i template
  - Slot per contenuti dinamici
  - Metodi di base per interazioni
- [ ] Implementare Template 1 - "Elegante Classico":
  - Layout a colonne con foto a sinistra
  - Header con nome e date
  - Sezione biografia
  - Grid per contributi
  - Colore tema: tonalità di blu/argento
- [ ] Implementare Template 2 - "Modern Minimal":
  - Full-width hero image
  - Typografia moderna
  - Spazi bianchi ampi
  - Design a sezioni
  - Colore tema: bianco/nero con accento
- [ ] Implementare Template 3 - "Caldo Familiare":
  - Design arrotondato
  - Tono caldo (marroni, crema)
  - Focus sulla connessione emotiva
  - Layout più organico
  - Include se "Ricordi degli amici"

### 2.2 Sistema di Preview
- [ ] Creare componente `TemplatePreview.vue`:
  - Preview live durante la creazione
  - Switch tra i 3 template
  - Anteprima mobile e desktop
- [ ] Integrare preview in `MemorialDialog.vue`:
  - Aggiungere passo "Preview" finale
  - Possibilità di modificare template prima del salvataggio

## Fase 3: Form di Creazione Modificato (2-3 giorni)

### 3.1 Aggiornamento MemorialDialog
- [ ] Modificare wizard di creazione:
  - Step 1: Identità + Selezione template
  - Step 2: Upload immagine hero
  - Step 3: Dettagli biografia
  - Step 4: Preview e pubblicazione
- [ ] Aggiungere selettore template:
  - Preview mini dei 3 template
  - Selezione con descrizione breve
  - Icone rappresentative per ogni template
- [ ] Implementare upload drag-and-drop:
  - Preview immagine caricata
  - Croppamento immagine opzionale
  - Compressione lato client

### 3.2 Validazione e Salvataggio
- [ ] Aggiungere validazione template obbligatorio
- [ ] Flusso di salvataggio con template selezionato
- [ ] Notifica visiva di salvataggio riuscito

## Fase 4: Routing Pubblico e Visualizzazione (3-4 giorni)

### 4.1 Creazione Rotta Pubblica
- [ ] Aggiungere routing in `src/router.ts`:
  ```typescript
  {
    path: '/memorial/:slug',
    name: 'MemorialPublic',
    component: () => import('@/pages/MemorialPublic.vue'),
    meta: { title: 'Memoriale' }
  }
  ```
- [ ] Creare pagina `src/pages/MemorialPublic.vue`:
  - Fetch dati memoriale basato su slug
  - Render template selezionato
  - Gestione stato non trovato

### 4.2 Componente di Visualizzazione
- [ ] Creare `MemorialPage.vue`:
  - Props: memorial (con template selezionato)
  - Dynamic import del template corretto
  - Loading state e error handling
  - Meta tags SEO dinamici

## Fase 5: Feed Social e Interazioni (4-5 giorni)

### 5.1 Implementazione Feed
- [ ] Creare `MemorialFeed.vue`:
  - Layout a card responsive
  - Filtro per template
  - Ordine per data di creazione
  - Search bar per nome
- [ ] Aggiungere in dashboard pagina dedicata:
  - URL: `/memorial-feed`
  - Statistiche memoriali recenti
  - Trend contributi

### 5.2 Componenti di Interazione
- [ ] Creare `FlowerButton.vue`:
  - Animazione fiori che appaiono
  - Contatore fiori
  - Sound effect opzionale
- [ ] Creare `CandleButton.vue`:
  - Animazione candela che si accende
  - Effetto luminescente
  - Contatore candele
- [ ] Creare `MemoryForm.vue`:
  - Modal per aggiungere ricordo
  - Supporto testo e opzionalmente foto
  - Anteprima prima dell'invio

### 5.3 Gestione Contributi
- [ ] Creare endpoint API per contributi:
  - `POST /api/memorial/:slug/contributions`
  - Tipologie: flower, candle, memory
- [ ] Estendere `ActivityFeed.vue` per:
  - Mostrare nuove interazioni
  - Notifiche in tempo reale (opzionale)

## Fase 6: Ottimizzazioni e Finalizzazione (2-3 giorni)

### 6.1 Performance e SEO
- [ ] Implementare:
  - Lazy loading template
  - Immagini ottimizzate (WebP, AVIF)
  - Meta tags dinamici
  - Structured data per memoriali
- [ ] Aggiungere sitemap automatico

### 6.2 Testing e Qualità
- [ ] Test cross-device:
  - Mobile first design
  - Tablet e desktop
- [ ] Test di accessibilità:
  - Screen reader
  - Contrasto colori
  - Keyboard navigation
- [ ] Test di performance:
  - Lighthouse score >90
  - Core web vitals

### 6.3 Documentazione
- [ ] Creare documentazione interna:
  - Guida all'uso dei template
  - Procedure customizzazione
- [ ] Aggiungere esempi visivi

## Timeline Stimata

- **Fase 1**: 3-4 giorni
- **Fase 2**: 5-6 giorni
- **Fase 3**: 2-3 giorni
- **Fase 4**: 3-4 giorni
- **Fase 5**: 4-5 giorni
- **Fase 6**: 2-3 giorni

**Totale**: 19-25 lavorativi

## Risorse Necessarie

- Sviluppatore Frontend: 1 full-time
- Designer: 1 part-time (per template design)
- Backend Developer: 1 part-time (per API)
- QA Tester: 1 part-time

## Success Criteria

1. ✅ 3 template fully responsive con design distinti
2. ✅ Sistema di selezione template nel form di creazione
3. ✅ Landing page pubbliche accessibili via `/memorial/{slug}`
4. ✅ Feed social con memoriali in formato card
5. ✅ 3 tipi di interazioni: fiori, candele, ricordi
6. ✅ Preview live prima della pubblicazione
7. ✅ Performance >90 Lighthouse score
8. ✅ Mobile-first design con ottimizzazione SEO