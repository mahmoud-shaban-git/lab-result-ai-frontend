# GitHub & Deployment Setup

Da Git in dieser Umgebung nicht verfügbar war, führen Sie bitte folgende Schritte manuell in Ihrem Terminal aus:

## 1. Git Repository erstellen & Code hochladen

Öffnen Sie Ihr Terminal im Projektordner (`c:\Users\mahmo\Desktop\Projects\lab_result_ai_frontend`) und führen Sie aus:

```bash
# Git initialisieren
git init

# Branch 'main' erzwingen
git branch -M main

# Alle Dateien hinzufügen
git add .

# Erster Commit
git commit -m "Initial commit for Lab Result AI Frontend"

# === WICHTIG: Neues Repository auf GitHub erstellen ===
# Gehen Sie auf https://github.com/new
# Repository Name: lab-result-ai-frontend
# Public: Ja
# "Create repository" klicken

# === DANN: Remote hinzufügen und pushen ===
# (Ersetzen Sie <IHR_USERNAME> durch Ihren GitHub Benutzernamen)
git remote add origin https://github.com/<IHR_USERNAME>/lab-result-ai-frontend.git

# Code hochladen
git push -u origin main
```

## 2. Deployment auf Vercel

1. Gehen Sie zu [Vercel Dashboard](https://vercel.com/dashboard).
2. Klicken Sie "Add New..." -> "Project".
3. Importieren Sie das Repository `lab-result-ai-frontend`.
4. **Environment Variables** konfigurieren:
   - Name: `VITE_API_URL`
   - Value: `https://lab-result-ai-backend.onrender.com/api/v1/lab-results/explain`
5. Klicken Sie "Deploy".

Ihr Projekt ist nun live und nutzt die echte Backend-API!
