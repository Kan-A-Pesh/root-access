# Endpoints (API)

Les endpoints sont les points d'entrée de l'API.

Le document suivant liste les endpoints disponibles et leurs paramètres, ainsi que les codes de retour possibles.

> 🗒️ Note: Un astérisque (\*) indique un paramètre obligatoire.\
> 🗒️ Note: Un cadena (🔒) indique que l'endpoint nécessite une authentification.

Les types de paramètres peuvent référencer des types de données spécifiques à l'API.\
À noter que le type `astring` est un type de chaîne de caractères qui ne peut contenir que des caractères alphanumériques, des tirets et des underscores.

Les réponses sont au format JSON, ayant une propriété `status` qui indique le statut de la requête, et une propriété `payload` facultative qui contient les données de la réponse.

```json
{
    "status": "success",
    "payload": {
        "message": "Hello World!"
    }
}
```

## Sommaire

- [Développement](#développement)
  - **GET** /status
  - **GET** /coffee
  - **GET** /protected (🔒)

- [Authentification](#authentification)
  - **POST** /auth/login
  - **POST** /auth/register (🔒)
  - **POST** /auth/register/admin (🔒)
  - **POST** /auth/register/finish (🔒)
  - **POST** /auth/logout (🔒)

- [Utilisateurs](#utilisateurs)
  - **GET** /users/list (🔒)
  - **GET** /users/:handle (🔒)
  - **DELETE** /users/:handle (🔒)
  - **PATCH** /users/:handle (🔒)

- [Projets](#projets)
  - **GET** /projects (🔒)
  - **GET** /projects/:project_id (🔒)
  - **POST** /projects (🔒)
  - **DELETE** /projects/:project_id (🔒)
  - **PATCH** /projects/:project_id (🔒)
  
- [Membres (par projet)](#membres-par-projet)
  - **GET** /projects/:project_id/members (🔒)
  - **POST** /projects/:project_id/members (🔒)
  - **DELETE** /projects/:project_id/members/:handle (🔒)
  - **PATCH** /projects/:project_id/members/:handle (🔒)

## Développement

### GET /status

Retourne le statut du serveur.

#### Paramètres

Aucun.

#### Réponses

| Code | Description           |
| ---- | --------------------- |
| 200  | Succès. Le serveur OK |

### GET /coffee

Retourne une tasse de café.

#### Paramètres

Aucun.

#### Réponses

| Code | Description                            |
| ---- | -------------------------------------- |
| 418  | Succès. Mais le café était un mensonge |

### GET /protected (🔒)

> 🔒 Rôle autorisé: `*`

Permet de tester l'authentification.

#### Paramètres

Aucun.

#### Réponses

| Code | Description                                    |
| ---- | ---------------------------------------------- |
| 200  | Succès.                                        |
| 401  | Non autorisé. L'utilisateur n'est pas connecté |

## Authentification

### POST /auth/login

Crée un token d'authentification pour l'utilisateur.

#### Paramètres

| Nom        | Type    | Description                           |
| ---------- | ------- | ------------------------------------- |
| handle\*   | astring | Le nom d'utilisateur de l'utilisateur |
| password\* | string  | Le mot de passe de l'utilisateur      |

#### Réponses

| Code | Description                                                                  |
| ---- | ---------------------------------------------------------------------------- |
| 200  | Succès. Le token d'authentification est retourné dans le corps de la réponse |
| 400  | Mauvaise requête. Le corps de la requête est invalide                        |
| 401  | Non autorisé. Les identifiants sont incorrects                               |

### POST /auth/register (🔒)

> 🔒 Rôle autorisé: `admin`

Crée un nouvel utilisateur temporaire et envoie un email de confirmation, qui contient un lien vers la page de finalisation de l'inscription.

#### Paramètres

| Nom        | Type   | Description                  |
| ---------- | ------ | ---------------------------- |
| realname\* | string | Le nom réel de l'utilisateur |
| role\*     | role   | Le rôle de l'utilisateur     |
| email\*    | string | L'email de l'utilisateur     |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 200  | Succès. Un mail a été envoyé                          |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 409  | Conflit. L'email est déjà utilisé                     |

### POST /auth/register/admin (🔒)

> 🔒 La clé `rootkey` doit être fournie dans le corps de la requête.

Crée un nouvel administrateur temporaire et envoie un email de confirmation, qui contient un lien vers la page de finalisation de l'inscription.

#### Paramètres

| Nom        | Type   | Description                  |
| ---------- | ------ | ---------------------------- |
| realname\* | string | Le nom réel de l'utilisateur |
| email\*    | string | L'email de l'utilisateur     |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 200  | Succès. Un mail a été envoyé                          |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 401  | Non autorisé. La clé `rootkey` est invalide           |
| 409  | Conflit. L'email est déjà utilisé                     |

### POST /auth/register/finish (🔒)

> 🔒 Le token de fin d'inscription est envoyé par email.

Finalise l'inscription d'un utilisateur temporaire.

#### Paramètres

| Nom        | Type    | Description          |
| ---------- | ------- | -------------------- |
| handle\*   | astring | Le nom d'utilisateur |
| password\* | string  | Le mot de passe      |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 200  | Succès.                                               |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 401  | Non autorisé. Le token est invalide                   |
| 409  | Conflit. Le nom d'utilisateur est déjà utilisé        |

### POST /auth/logout (🔒)

> 🔒 Rôle autorisé: `*`

Déconnecte l'utilisateur.

#### Paramètres

Aucun.

#### Réponses

| Code | Description                                    |
| ---- | ---------------------------------------------- |
| 200  | Succès.                                        |
| 401  | Non autorisé. L'utilisateur n'est pas connecté |

## Utilisateurs

### GET /users/list (🔒)

> 🔒 Rôle autorisé: `*`

Retourne la liste des utilisateurs.\
Les utilisateurs peuvent être filtrés par nom d'utilisateur, nom réel, rôle et email.\
La réponse est automatiquement triée par rôle, puis par nom d'utilisateur.

#### Paramètres

| Nom      | Type    | Description                           |
| -------- | ------- | ------------------------------------- |
| handle   | astring | Le nom d'utilisateur de l'utilisateur |
| realname | string  | Le nom réel de l'utilisateur          |
| role     | role    | Le rôle de l'utilisateur              |
| email    | string  | L'email de l'utilisateur              |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 200  | Succès. La liste des utilisateurs est retournée       |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 401  | Non autorisé. L'utilisateur n'est pas connecté        |

### GET /users/:handle (🔒)

> 🔒 Rôle autorisé: `*`

Retourne les informations d'un utilisateur, ou de l'utilisateur connecté si aucun nom d'utilisateur n'est fourni.

#### Paramètres

| Nom      | Type    | Description                           |
| -------- | ------- | ------------------------------------- |
| handle | astring | Le nom d'utilisateur de l'utilisateur |

#### Réponses

| Code | Description                                               |
| ---- | --------------------------------------------------------- |
| 200  | Succès. Les informations de l'utilisateur sont retournées |
| 401  | Non autorisé. L'utilisateur n'est pas connecté            |
| 404  | Non trouvé. L'utilisateur n'existe pas                    |

### DELETE /users/:handle (🔒)

> 🔒 Rôle autorisé: `admin`

Supprime un utilisateur.

#### Paramètres

| Nom      | Type    | Description                           |
| -------- | ------- | ------------------------------------- |
| handle\* | astring | Le nom d'utilisateur de l'utilisateur |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 200  | Succès. L'utilisateur a été supprimé                  |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 401  | Non autorisé. L'utilisateur n'est pas connecté        |
| 404  | Non trouvé. L'utilisateur n'existe pas                |

### PATCH /users/:handle (🔒)

> 🔒 Rôle autorisé: `admin`

Met à jour les informations d'un utilisateur.

#### Paramètres

| Nom      | Type    | Description                           |
| -------- | ------- | ------------------------------------- |
| handle\* | astring | Le nom d'utilisateur de l'utilisateur |
| role     | role    | Le rôle de l'utilisateur              |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 200  | Succès. L'utilisateur a été mis à jour                |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 401  | Non autorisé. L'utilisateur n'est pas connecté        |
| 404  | Non trouvé. L'utilisateur n'existe pas                |

## Projets

### GET /projects (🔒)

> 🔒 Rôle autorisé: `*`

Retourne la liste des projets.\
Les projets peuvent être filtrés par nom, description, statut, date de début et date de fin.\

#### Paramètres

| Nom         | Type   | Description                |
| ----------- | ------ | -------------------------- |
| name        | string | Le nom du projet           |
| description | string | La description du projet   |
| status      | status | Le statut du projet        |
| start_date  | date   | La date de début du projet |
| end_date    | date   | La date de fin du projet   |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 200  | Succès. La liste des projets est retournée            |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 401  | Non autorisé. L'utilisateur n'est pas connecté        |

### GET /projects/:project_id (🔒)

> 🔒 Rôle autorisé: `admin`, `respo`, `chief`, `dev`

Retourne les informations d'un projet.

#### Paramètres

| Nom          | Type   | Description             |
| ------------ | ------ | ----------------------- |
| project_id\* | number | L'identifiant du projet |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 200  | Succès. Les informations du projet sont retournées    |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 401  | Non autorisé. L'utilisateur n'est pas connecté        |
| 404  | Non trouvé. Le projet n'existe pas                    |

### POST /projects (🔒)

> 🔒 Rôle autorisé: `admin`, `respo`

Crée un projet.

#### Paramètres

| Nom         | Type    | Description                                         |
| ----------- | ------- | --------------------------------------------------- |
| name\*      | astring | Le nom du projet                                    |
| displayname | string  | Le nom d'affichage du projet                        |
| description | string  | La description du projet                            |
| status      | status  | Le statut du projet (`idea` par défaut)             |
| start_date  | date    | La date de début du projet (aujourd'hui par défaut) |
| end_date    | date    | La date de fin du projet (dans 1 mois par défaut)   |
| github_url  | string  | L'URL du dépôt GitHub du projet                     |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 201  | Succès. Le projet a été créé                          |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 401  | Non autorisé. L'utilisateur n'est pas connecté        |
| 409  | Conflit. Le projet existe déjà                        |

### DELETE /projects/:project_id (🔒)

> 🔒 Rôle autorisé: `admin`, `respo`

Supprime un projet.

#### Paramètres

| Nom          | Type   | Description             |
| ------------ | ------ | ----------------------- |
| project_id\* | number | L'identifiant du projet |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 200  | Succès. Le projet a été supprimé                      |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 401  | Non autorisé. L'utilisateur n'est pas connecté        |
| 404  | Non trouvé. Le projet n'existe pas                    |

### PATCH /projects/:project_id (🔒)

> 🔒 Rôle autorisé: `admin`, `respo`

Met à jour les informations d'un projet.

#### Paramètres

| Nom          | Type    | Description                     |
| ------------ | ------- | ------------------------------- |
| project_id\* | number  | L'identifiant du projet         |
| name         | astring | Le nom du projet                |
| displayname  | string  | Le nom d'affichage du projet    |
| description  | string  | La description du projet        |
| status       | status  | Le statut du projet             |
| start_date   | date    | La date de début du projet      |
| end_date     | date    | La date de fin du projet        |
| github_url   | string  | L'URL du dépôt GitHub du projet |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 200  | Succès. Le projet a été mis à jour                    |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 401  | Non autorisé. L'utilisateur n'est pas connecté        |
| 404  | Non trouvé. Le projet n'existe pas                    |

## Membres (par projet)

### GET /projects/:project_id/members (🔒)

> 🔒 Rôle autorisé: `admin`, `respo`, `chief`, `dev`

Retourne la liste des membres d'un projet.

#### Paramètres

| Nom          | Type   | Description             |
| ------------ | ------ | ----------------------- |
| project_id\* | number | L'identifiant du projet |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 200  | Succès. La liste des membres du projet est retournée  |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 401  | Non autorisé. L'utilisateur n'est pas connecté        |
| 404  | Non trouvé. Le projet n'existe pas                    |

### POST /projects/:project_id/members (🔒)

> 🔒 Rôle autorisé: `admin`, `respo`, `chief`

Ajoute un membre à un projet.

#### Paramètres

| Nom          | Type   | Description             |
| ------------ | ------ | ----------------------- |
| project_id\* | number | L'identifiant du projet |
| handle\*     | number | L'identifiant de l'user |
| role\*       | role   | Le rôle du membre       |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 201  | Succès. Le membre a été ajouté au projet              |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 401  | Non autorisé. L'utilisateur n'est pas connecté        |
| 404  | Non trouvé. Le projet/l'utilisateur n'existe pas      |
| 409  | Conflit. Le membre existe déjà                        |

### DELETE /projects/:project_id/members/:handle (🔒)

> 🔒 Rôle autorisé: `admin`, `respo`, `chief`

Supprime un membre d'un projet.

#### Paramètres

| Nom          | Type   | Description             |
| ------------ | ------ | ----------------------- |
| project_id\* | number | L'identifiant du projet |
| handle\*     | number | L'identifiant de l'user |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 200  | Succès. Le membre a été supprimé du projet            |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 401  | Non autorisé. L'utilisateur n'est pas connecté        |
| 404  | Non trouvé. Le projet/l'utilisateur n'existe pas      |

### PATCH /projects/:project_id/members/:handle (🔒)

> 🔒 Rôle autorisé: `admin`, `respo`, `chief`

Met à jour le rôle d'un membre d'un projet.

#### Paramètres

| Nom          | Type   | Description             |
| ------------ | ------ | ----------------------- |
| project_id\* | number | L'identifiant du projet |
| handle\*     | number | L'identifiant de l'user |
| role\*       | role   | Le rôle du membre       |

#### Réponses

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 200  | Succès. Le rôle du membre a été mis à jour            |
| 400  | Mauvaise requête. Le corps de la requête est invalide |
| 401  | Non autorisé. L'utilisateur n'est pas connecté        |
| 404  | Non trouvé. Le projet/l'utilisateur n'existe pas      |
