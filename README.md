# 🍇 Vitorga – Interface Web (Frontend)

**Vitorga** est une application web destinée aux exploitations viticoles, visant à faciliter la **gestion des parcelles**, le **suivi des travaux**, et la **centralisation des informations internes**.

Ce dépôt contient le **frontend web** développé avec **Next.js (App Router)**, qui sert d’interface principale pour les gestionnaires et responsables d’exploitation.

---

## 🚀 Objectif du projet

Offrir aux viticulteurs un **tableau de bord moderne et intuitif** permettant de :
- Visualiser les **parcelles** et leurs caractéristiques.
- Suivre les **interventions et travaux viticoles** (taille, traitement, vendanges…).
- Gérer les **machines, bâtiments et documents administratifs**.
- Centraliser la communication interne entre les acteurs de l’exploitation.

---

## 🧠 Stack technique

- **Next.js 16** (App Router, build `standalone`)
- **React 19** + **TypeScript**
- **TailwindCSS** pour le style
- **Recharts** pour les graphiques et statistiques
- **lucide-react** pour les icônes
- **Playwright** pour les tests end-to-end
- **ESLint** (`eslint-config-next`)

---

## 🏗️ Architecture

Le navigateur ne communique **jamais directement** avec l’API NestJS : tous les appels passent par le serveur Next.js, qui ajoute le JWT stocké dans un cookie `httpOnly`.

```
Navigateur ──► Next.js (route handlers + proxy.ts) ──► API NestJS
              cookie httpOnly                          Authorization: Bearer <token>
```

| Élément | Rôle |
|---|---|
| `POST /api/auth/login` | Appelle `POST /auth/login` sur Nest et pose les cookies `vitorga_token` et `vitorga_user` (httpOnly) |
| `POST /api/auth/logout` | Supprime les cookies de session |
| `/api/backend/*` | Relais vers l’API Nest (méthode, query string et body conservés) avec ajout du `Bearer` |
| `src/proxy.ts` | Protège les routes : redirige vers `/login` si le token est absent ou expiré |
| `(protected)/layout.tsx` | Server Component : revérifie le token et fournit l’utilisateur via `SessionProvider` |

« Se souvenir de moi » : cookies valides jusqu’à l’expiration du JWT (24 h) ; sinon cookies de session.

---

## 🧩 Structure du projet

```
vitorga_front/
├── src/
│   ├── app/                          # App Router Next.js
│   │   ├── layout.tsx                # Layout racine (police Inter via next/font, metadata)
│   │   ├── globals.css               # Styles globaux + Tailwind
│   │   ├── page.tsx                  # / → redirige vers /dashboard
│   │   ├── not-found.tsx             # Route inconnue → /login
│   │   ├── login/page.tsx
│   │   ├── (protected)/              # Route group protégé (absent de l'URL)
│   │   │   ├── layout.tsx            # Vérif. session + Sidebar + SessionProvider
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── admin/users/page.tsx
│   │   │   └── logistique/inventaire/page.tsx
│   │   └── api/
│   │       ├── auth/login/route.ts   # Login → cookies httpOnly
│   │       ├── auth/logout/route.ts  # Suppression des cookies
│   │       └── backend/[...path]/route.ts  # Relais authentifié vers l'API Nest
│   ├── proxy.ts                      # Protection des routes (ex-middleware)
│   ├── api/                          # Couche d'appels HTTP (via /api/backend)
│   │   ├── config.ts                 # apiFetch + redirection sur 401
│   │   ├── auth.ts                   # login, register, logout
│   │   ├── ressources.ts             # CRUD ressources
│   │   ├── users.ts                  # CRUD users + toggleActive + updateRole
│   │   ├── roles.ts                  # GET /roles
│   │   ├── parcelles.ts              # CRUD parcelles
│   │   ├── vignes.ts                 # CRUD vignes (avec parcelle_id)
│   │   └── stats.ts                  # dashboard KPIs, stock projections, rendements
│   ├── components/
│   │   ├── Sidebar.tsx               # Navigation + utilisateur connecté + déconnexion
│   │   ├── SessionProvider.tsx       # Contexte utilisateur (hook useSession)
│   │   ├── KPICard.tsx               # Carte indicateur clé
│   │   └── ChartCard.tsx             # Conteneur graphique
│   ├── lib/
│   │   └── session.ts                # Noms des cookies, type AuthUser, validation JWT (exp)
│   └── views/                        # Composants de page (client)
│       ├── Login.tsx                 # Formulaire d'authentification
│       ├── Dashboard.tsx             # KPIs + graphiques + modals parcelle/vigne
│       ├── Inventaire.tsx            # Gestion stocks (rôles Admin/Ouvrier)
│       └── AdminUsers.tsx            # Gestion utilisateurs + rôles
├── test/
│   └── e2e/                          # Tests Playwright
│       ├── setup.ts
│       ├── login.spec.ts
│       ├── dashboard.spec.ts
│       ├── inventaire.spec.ts
│       └── admin-users.spec.ts
├── next.config.ts                    # output: 'standalone'
├── playwright.config.ts
├── tailwind.config.js
├── Dockerfile                        # Multi-stage node:22-alpine, serveur standalone
├── docker-compose.yml
└── .env.example
```

> Le dossier s’appelle `views/` et non `pages/` : Next.js réserve `pages/` au Pages Router.

---

## ⚙️ Variables d’environnement

| Variable | Défaut | Description |
|---|---|---|
| `BACKEND_URL` | `http://localhost:3000` | URL de l’API NestJS, utilisée **côté serveur uniquement** |
| `COOKIE_SECURE` | `false` | Passer à `true` en HTTPS pour ajouter l’attribut `Secure` aux cookies |

Aucune variable n’est exposée au navigateur : `BACKEND_URL` est lue à l’exécution, la même image Docker fonctionne donc dans tous les environnements.

---

## 🔐 Gestion des rôles

| Rôle | Inventaire | Dashboard | Admin Users |
|---|---|---|---|
| **Admin** | Ajouter + Retirer stock, Créer ressources | Créer parcelles + vignes | Accès complet |
| **Ouvrier** | Retirer stock uniquement | Lecture seule | Non accessible |

Le rôle est renvoyé par l’API au login, stocké dans le cookie httpOnly `vitorga_user`, lu côté serveur par le layout protégé et exposé aux composants via le hook `useSession()`. Le JWT n’est jamais accessible au JavaScript du navigateur.

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

## 💻 Développement local

> ⚠️ Le backend NestJS doit tourner sur `http://localhost:3000`

```bash
cd vitorga_front
cp .env.example .env.local
npm ci
npm run dev
```

L’application est disponible sur `http://localhost:3001` (port 3001 pour ne pas entrer en conflit avec l’API).

| Script | Description |
|---|---|
| `npm run dev` | Serveur de développement (port 3001) |
| `npm run build` | Build de production (`.next/standalone`) |
| `npm run start` | Lance le build de production (port 3001) |
| `npm run lint` | ESLint |

---

## 🧪 Tests E2E

```bash
# Backend + BDD doivent tourner
npm run test:e2e          # headless
npm run test:e2e:headed   # avec navigateur visible
npm run test:e2e:ui       # interface Playwright
```

Playwright démarre automatiquement `npm run dev` sur `http://localhost:3001`.

**Couverture :**
- Login (credentials, redirection, toggle password)
- Dashboard (KPIs, dropdown parcelles, modals)
- Inventaire (filtres, ressources, modal stock)
- AdminUsers (liste, recherche, ajout utilisateur)

---

## 🔄 CI/CD

Pipeline GitHub Actions (`.github/workflows/ci.yml`), Node 22 :
lint → build → docker-build → trivy-scan

| Job | Description |
|---|---|
| **lint** | ESLint + `next typegen` + TypeScript check |
| **build** | `npm run build` + upload de l’artifact `.next` (hors cache) |
| **docker-build** | Build de l’image multi-stage |
| **trivy-scan** | Scan vulnérabilités CRITICAL/HIGH |

---

## 🐳 Démarrage avec Docker

> ⚠️ Le backend doit tourner en premier sur `http://localhost:3000`

```bash
git clone https://github.com/JourdanKyllian/vitorga-frontend
cd vitorga-frontend/vitorga_front
docker compose up --build -d
```

L’application est disponible sur `http://localhost:8080`.

Le conteneur joint l’API via `http://host.docker.internal:3000` par défaut ; surcharger avec `BACKEND_URL=... docker compose up` si besoin.

L’image finale (`node:22-alpine`) ne contient que le serveur `standalone` de Next.js, tourne avec un utilisateur non-root, sans npm, avec un healthcheck sur `/login`.

> **Prérequis** : Docker 24+ et Docker Compose v2+
