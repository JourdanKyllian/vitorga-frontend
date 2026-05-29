# 🍇 Vitorga – Interface Web (Frontend)

**Vitorga** est une application web destinée aux exploitations viticoles, visant à faciliter la **gestion des parcelles**, le **suivi des travaux**, et la **centralisation des informations internes**.

Ce dépôt contient le **frontend web** développé avec **React**, qui sert d’interface principale pour les gestionnaires et responsables d’exploitation.

---

## 🚀 Objectif du projet

Offrir aux viticulteurs un **tableau de bord moderne et intuitif** permettant de :
- Visualiser les **parcelles** et leurs caractéristiques.
- Suivre les **interventions et travaux viticoles** (taille, traitement, vendanges…).
- Gérer les **machines, bâtiments et documents administratifs**.
- Centraliser la communication interne entre les acteurs de l’exploitation.

---

## 🧠 Stack technique

- **React**
- **TypeScript**
- **TailwindCSS** pour le style
- **Recharts** pour les graphiques et statistiques
- **Axios** pour la communication avec l’API backend
- **React Router** pour la navigation
- **Vite** pour le build (rapide et simple)
- **leafletjs avec maptiler** pour la carte interactive

---

## 🧩 Structure du projet
vitorga_front/
├── src/
│   ├── api/                  # Couche d'appels HTTP vers le backend
│   │   ├── config.ts         # apiFetch avec intercepteur 401
│   │   ├── auth.ts           # login, register, getCurrentUser, getCurrentUserRole
│   │   ├── ressources.ts     # CRUD ressources
│   │   ├── users.ts          # CRUD users + toggleActive + updateRole
│   │   ├── roles.ts          # GET /roles
│   │   ├── parcelles.ts      # CRUD parcelles
│   │   ├── vignes.ts         # CRUD vignes (avec parcelle_id)
│   │   └── stats.ts          # dashboard KPIs, stock projections, rendements
│   ├── components/
│   │   ├── Layout.tsx        # Sidebar + navigation principale
│   │   ├── ProtectedRoute.tsx # Validation JWT (expiry check)
│   │   ├── KPICard.tsx       # Carte indicateur clé
│   │   └── ChartCard.tsx     # Conteneur graphique
│   ├── pages/
│   │   ├── Login.tsx         # Authentification JWT
│   │   ├── Dashboard.tsx     # KPIs + graphiques + modals parcelle/vigne
│   │   ├── Inventaire.tsx    # Gestion stocks (rôles Admin/Ouvrier)
│   │   └── AdminUsers.tsx    # Gestion utilisateurs + rôles
│   ├── App.tsx               # Routes protégées
│   └── main.tsx
├── test/
│   └── e2e/                  # Tests Playwright
│       ├── setup.ts
│       ├── login.spec.ts
│       ├── dashboard.spec.ts
│       ├── inventaire.spec.ts
│       └── admin-users.spec.ts
├── playwright.config.ts
├── Dockerfile                # Multi-stage + nginx:1.27-alpine + distroless
├── docker-compose.yml
├── nginx.conf                # Config SPA routing
└── .github/workflows/ci.yml

---

## 🔐 Gestion des rôles

| Rôle | Inventaire | Dashboard | Admin Users |
|---|---|---|---|
| **Admin** | Ajouter + Retirer stock, Créer ressources | Créer parcelles + vignes | Accès complet |
| **Ouvrier** | Retirer stock uniquement | Lecture seule | Non accessible |

Le rôle est extrait directement du **payload JWT** stocké dans `localStorage`.

---

## 📊 Logique métier affichée

### YieldCalculator
Calcule le rendement par parcelle selon :
- Âge de la vigne (`< 5 ans` : -30%, `5-15 ans` : -10%, `> 15 ans` : -5%)
- Exposition (`SUD` : +10%, `EST` : +5%, `NORD` : -15%, `OUEST` : neutre)
- Densité et poids moyen de grappe

### StockProjectionCalculator
Projette le stock après interventions `PLANIFIEE` et `EN_COURS` :
- Affiche stock actuel vs stock projeté
- Calcule une criticité (0-100%)
- Déclenche une alerte si stock projeté ≤ seuil

---

## 🧪 Tests E2E

```bash
# Backend + BDD doivent tourner
npm run test:e2e          # headless
npm run test:e2e:headed   # avec navigateur visible
npm run test:e2e:ui       # interface Playwright
```

**Couverture :**
- Login (credentials, redirection, toggle password)
- Dashboard (KPIs, dropdown parcelles, modals)
- Inventaire (filtres, ressources, modal stock)
- AdminUsers (liste, recherche, ajout utilisateur)

---

## 🔄 CI/CD

Pipeline GitHub Actions (`.github/workflows/ci.yml`) :
lint → build → e2e → docker-build → trivy-scan

| Job | Description |
|---|---|
| **lint** | ESLint + TypeScript check |
| **build** | `npm run build` + upload artifact |
| **e2e** | Tests Playwright avec backend + PostgreSQL en service |
| **docker-build** | Build image multi-stage |
| **trivy-scan** | Scan vulnérabilités CRITICAL/HIGH |
## 🚀 Démarrage rapide

> ⚠️ Le backend doit tourner en premier sur `http://localhost:80`

git clone https://github.com/JourdanKyllian/vitorga-frontend
cd vitorga-frontend/vitorga_front
cp .env.example .env
docker compose up --build -d
```

**C'est tout.** L'application est disponible sur `http://localhost:8080`

> **Prérequis** : Docker 24+ et Docker Compose v2+
