# Déployer PerfectSkin en ligne — guide pas à pas

Tu n'as pas besoin de savoir coder pour suivre ces étapes. Compte environ 15 minutes.

## Étape 1 — Récupérer une clé API Anthropic

1. Va sur https://console.anthropic.com et crée un compte (ou connecte-toi).
2. Dans le menu, va dans **"API Keys"** (ou "Clés API").
3. Clique sur **"Create Key"**, donne-lui un nom (ex. "PerfectSkin"), copie la clé qui s'affiche.
   ⚠️ Elle ne s'affichera qu'une seule fois — garde-la de côté (ex. dans une note sur ton téléphone) le temps de l'étape 4.
4. Ajoute un petit crédit sur ton compte (quelques euros suffisent largement pour démarrer — voir nos échanges sur le coût, environ 0,3 à 0,5 centime par analyse).

## Étape 2 — Mettre le projet sur GitHub

1. Crée un compte gratuit sur https://github.com si tu n'en as pas.
2. Clique sur **"New repository"**, nomme-le par exemple `perfectskin`, laisse-le en "Public" ou "Private" (peu importe), clique **"Create repository"**.
3. Sur la page du repository, clique **"uploading an existing file"** (ou glisse-dépose).
4. Glisse-dépose tous les fichiers et dossiers de ce projet (`public/`, `api/`, `package.json`) dans la zone d'upload.
5. Clique **"Commit changes"** en bas de page.

## Étape 3 — Déployer sur Vercel (hébergement gratuit)

1. Va sur https://vercel.com et crée un compte en cliquant **"Sign Up"** → choisis **"Continue with GitHub"** (le plus simple, ça relie directement tes deux comptes).
2. Une fois connecté, clique **"Add New..." → "Project"**.
3. Trouve ton repository `perfectskin` dans la liste et clique **"Import"**.
4. Avant de cliquer sur "Deploy", déplie **"Environment Variables"** :
   - Name : `ANTHROPIC_API_KEY`
   - Value : colle la clé API récupérée à l'étape 1
   - Clique **"Add"**
5. Clique enfin sur **"Deploy"**. Attends 1-2 minutes.
6. Vercel te donne un lien du type `perfectskin-xxxx.vercel.app` — c'est ton appli, en ligne, accessible depuis n'importe quel téléphone ou ordinateur.

## Étape 4 — Tester

Ouvre le lien sur ton téléphone. Cette fois, la demande d'autorisation caméra devrait bien s'afficher (contrairement à l'aperçu dans le chat), car le site est maintenant un vrai site web sécurisé (HTTPS).

## Étape 5 (optionnelle) — Nom de domaine personnalisé

Dans Vercel : **Project → Settings → Domains**, tu peux relier un nom de domaine que tu achètes (ex. perfectskin-abbaye.fr, environ 10-15€/an chez un registrar comme OVH ou Gandi) à la place du lien `.vercel.app`.

## Si quelque chose ne marche pas

Reviens dans notre conversation Claude et dis-moi exactement où tu bloques (quel écran, quel message d'erreur) — je t'aide à débloquer.
