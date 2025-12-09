# Lab Result AI Frontend

Ein modernes React-Frontend für die Lab Result AI API. Entwickelt mit Vite, React, TypeScript und Tailwind CSS.

## Voraussetzungen

*   Node.js (Version 16 oder neuer)
*   Lokales Backend läuft auf `http://localhost:8080`

## Installation

```bash
npm install
```

## Starten

Starten Sie den Entwicklungsserver:

```bash
npm run dev
```

### Windows PowerShell Fehlerbehebung

Falls Sie in der PowerShell einen Fehler wie `Die Datei ... kann nicht geladen werden` erhalten, blockiert Ihre Ausführungsrichtlinie Skripte. Verwenden Sie stattdessen:

```bash
cmd /c npm run dev
```

oder

```bash
npx vite
```

## Funktionen

*   **Eingabeformular**: Erfassung von Blutwerten (Parameter, Wert, Einheit, Alter, Geschlecht).
*   **Live Analyse**: Sendet Daten an das Spring Boot Backend.
*   **Ergebnis-Visualisierung**: Zeigt Risiko-Level (Normal, Leicht Erhöht, Kritisch) mit passenden Farben und Icons.
*   **Responsives Design**: Optimiert für Desktop und Mobile Geräte.

## Technologien

*   [Vite](https://vitejs.dev/) - Schnelles Build-Tool und Dev-Server
*   [React](https://reactjs.org/) - UI Bibliothek
*   [TypeScript](https://www.typescriptlang.org/) - Typensicherheit
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework
