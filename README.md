# Exeter Terrain

PWA française de collecte terrain, destinée aux enquêteurs de la campagne Exeter à Kinshasa.

**Application :** https://eldoradodesign1.github.io/exeter-terrain/

**Formulaire de secours :** https://docs.google.com/forms/d/e/1FAIpQLSfDBtWrSrcmU2CnSHIYA0VYFN21nJ1y9gShn4pMOvEzuxvG6g/viewform

## Fonctionnement

- Parcours vendeur et consommateur avec étapes conditionnelles, récapitulatif modifiable et composants personnalisés accessibles au clavier.
- Marchés : Cité verte, Gambela, Liberté, Ngaba, Selembao, UPN, Zando, Zigida et Autre.
- Formats : 198 g, 200 g et 340 g, sans saisie du poids.
- Date automatique ; horodatage serveur indépendant lors de la réception.
- Validation téléphonique RDC selon le regex demandé, côté interface et serveur.
- Brouillon et file d’envoi conservés sur l’appareil ; reprise après rechargement.
- Nouvelle tentative à la reconnexion, au retour dans l’application ou depuis « Mon carnet ».
- Chaque entretien possède un UUID. Google confirme cet identifiant ; un verrou et une recherche d’identifiant évitent les doubles écritures après une réponse réseau perdue.
- Après confirmation, les réponses sont supprimées du reçu local ; seuls le profil, le marché, les dates et l’identifiant restent dans le carnet.

Le GForm et l’application écrivent dans **le même classeur privé**, respectivement dans `Réponses formulaire` et `Réponses PWA`. Le détail des fiches produits est stocké en JSON dans une colonne pour préserver les associations référence/format/prix/stock.

## Installation téléphone

Ouvrir le site une première fois avec du réseau. Sur Android, utiliser « Installer » lorsqu’il est proposé, ou le menu du navigateur. Sur iPhone, Safari → Partager → Sur l’écran d’accueil. L’envoi ne tourne pas en arrière-plan lorsque l’application est fermée : la rouvrir avec du réseau pour synchroniser.

## Développement

Aucune dépendance de production ni étape de compilation.

```sh
npm run dev
npm test
```

Le serveur local écoute sur `http://127.0.0.1:4173`. Les tests vérifient les embranchements, la suppression des réponses masquées, les quantités, les dates et le téléphone.

`schema.js` décrit les questions et conditions. `app.js` contient l’interface et la synchronisation. `config.js` configure l’URL publique du collecteur. `backend/Code.gs` est la source du récepteur Google Apps Script (propriété privée `SHEET_ID` dans le projet Apps Script).

Pour changer le serveur, modifier le script dans Apps Script puis **Déployer → Gérer les déploiements → Modifier → Nouvelle version**. Conserver la même URL de déploiement. Les modifications du frontend sont publiées via GitHub Pages depuis `main`.

Le récepteur est destiné à une collecte ouverte comme Google Forms : il permet l’ajout de réponses, jamais la lecture des résultats. Ne pas stocker de secret dans le frontend. Les quotas Apps Script et l’accès réseau Google s’appliquent. Un accès enquêteur authentifié ou une protection anti-abus supplémentaire pourrait être ajouté si la campagne en a besoin.

## Direction artistique

Palette rouge Exeter, crème et vert ; illustration vectorielle originale, icônes SVG, retours tactiles immédiats, animation à ressort sans blocage et respect de la réduction des animations. Principes du skill [apple-design d’Emil Kowalski](https://github.com/emilkowalski/skills/tree/main/skills/apple-design), installé dans le projet de travail.

## Références des choix concurrents

Vérifiées le 13 novembre 2026. Ces sources attestent la présence au catalogue, pas le classement des ventes ; la personne interrogée choisit les marques.

- [Shoppi S&K – Conserves](https://www.shoppi.cd/collections/option6-4) : Texas, Anglo.
- [Socimex – Produits](https://socimexgroup.com/socimex-product.php?lang=fr) : Anglo, Dolo, Sara.
- [Bon Appétit RDC](https://bonappetit.bnbgroupe.com/fr/) : corned-beef Bon Appétit.

« Autre » et « Ne sait pas » restent disponibles pour éviter les réponses forcées.
