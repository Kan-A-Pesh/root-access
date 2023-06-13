# Liste des rôles

## Rôles globaux

### Administrateur (admin)

- Peut ajouter, modifier et supprimer des utilisateurs et des projets
- A accès à toutes les fonctionnalités de l'application

### Responsable (respo)

- Peut ajouter, modifier et supprimer des projets
- A accès à toutes les fonctionnalités de dévellopement et de déploiement

### Membre (member)

- Peut consulter les informations des membres et des projets
- N'a aucun accès par défaut

## Rôles par projet

Les rôles `Administrateur` et `Responsable` sont automatiquement ajoutés à chaque projet et ne peuvent pas être modifiés.
Les `Membres` ne sont par défaut pas ajoutés à un projet, ils doivent être ajoutés manuellement.

### Chef de projet (chief)

- A accès à toutes les fonctionnalités du projet
- Ne peut pas supprimer le projet

### Développeur (dev)

- A accès aux fonctionnalités de développement du projet
