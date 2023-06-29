# Dashboard ROOT//ACCESS

> 🗒️ *Note:* ROOT//ACCESS utilise le système d'utilisateur d'UNIX, il ne fonctionne donc que sur des systèmes UNIX (Linux, macOS, etc.).

Le Dashboard ROOT//ACCESS est une web-app permettant la gestion des membres, des projets. \
Il vous permet d'ajouter, supprimer et mettre à jour facilement les informations des membres, ainsi que de créer, supprimer et modifier les détails des projets. \
Le dashboard vous permet également de lier des dépôts GitHub pour des processus d'intégration continue et de déploiement (CI/CD), tout en offrant un accès FTP, SFTP et SSH pour une collaboration et un déploiement efficaces.

## 📦 Fonctionnalités

- Un dashboard pour gérer les membres et les projets
- Une intégration avec GitHub pour des flux de travail CI/CD
- Des contrôles d'accès avec FTP, SFTP et SSH pour le développement et le déploiement collaboratifs par projet

## 🚀 Installation

### Prérequis

Le projet nécessite Node.js, npm et MongoDB pour fonctionner.

```bash
# Installer Node.js et npm
sudo apt install nodejs npm

# Installer MongoDB
sudo apt install mongodb
```

Il est aussi possible d'installer MongoDB avec Docker.

```bash
# Démarrer un conteneur MongoDB
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root --name root-mongodb mongo

# Web UI (facultatif)
npm install -g mongoku
mongoku start
```

### Création d'un compte administrateur

La création de compte administrateur est nécessaire pour accéder au dashboard. \
Elle doit être effectuée manuellement avec la requête HTTP suivante :

```http
POST /api/auth/register/admin
```

```json
{
    "rootkey": "{{ROOT_KEY}}",
    "realname": "Full Name",
    "email": "full.name@email.com"
}
```

Le paramètre `rootkey` est une clé secrète qui permet de créer un compte administrateur. \
Elle est définie dans le fichier `.env` à la racine du projet.

Les paramètres `realname` et `email` sont les informations du compte administrateur. \
Une fois la requête effectuée, un email de confirmation est envoyé à l'adresse email spécifiée. \
Il contient un lien permettant de finaliser la création du compte, il est valide pendant 24 heures.

## 📄 License

Ce projet est privé et réservé uniquement à un usage interne.\
Toute reproduction, distribution ou modification non autorisée est strictement interdite.
