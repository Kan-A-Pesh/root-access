# Services (root.config)

Les services d'un projet sont stockés dans le fichier `root.config` à la racine du projet ou dans le dossier `git-repo` du projet. \
Ce fichier est au format `YAML` et contient la liste des services nécessaires au fonctionnement du projet.

## Structure

```yaml
service: <service_name>
path: <service_path>
ports:
  <port_name>:
    env_name: <env_name>
    exposed: <exposed>
    force: <force>
    proxy: <nginx_config>
```

### service

Le nom du service utilisé pour le déploiement. \
Les services disponibles sont :

- `docker-compose`: Utilise un fichier `docker-compose.yml` pour le déploiement
- `docker`: Utilise un fichier `Dockerfile` ou une commande `docker` pour le déploiement
- `web-static`: Utilise un serveur web pour le déploiement d'un site statique

### path

Le chemin vers le fichier de configuration du service. \
Ce champ doit renseigner un fichier `docker-compose.yml` ou `Dockerfile` selon le service utilisé. \
Pour le service `web-static`, ce champ doit renseigner le chemin vers le dossier contenant les fichiers du site statique.

### ports

La liste des ports utilisés par le service. \
Chaque port doit être défini avec les champs suivants :

- `env_name`: Le nom de la variable d'environnement contenant le port utilisé par le service séléctionné aléatoirement.
- `exposed`: Si le port doit être exposé publiquement ou non. (optionnel, défaut: `false`)
- `force`: Force le port à une valeur spécifique. (optionnel, défaut: Port aléatoire)
- `proxy`: La configuration du proxy au format `nginx` utilisé pour le port (défini par la variable `$PORT`). \
  Ce champ est facultatif et n'est utilisé que pour des cas spécifiques.

## Exemples

### Site web avec base de données

Un projet nécessitant un serveur web et une base de données :

```yaml
service: "docker-compose"
ports:
  web:
    env_name: "WEB_PORT"
    exposed: true
  database:
    env_name: "DB_PORT"
    exposed: false
```

### Site statique

Un projet nécessitant contenant un site statique, les fichiers sont stockés dans le dossier `mon-site` placé à la racine du projet :

```yaml
service: "web-static"
path: "mon-site"
```

### Serveur de jeu (Minecraft)

Un serveur de jeu nécessitant un port spécifique :

```yaml
service: "docker"
path: "ci/Dockerfile"
ports:
  game:
    env_name: "GAME_PORT"
    exposed: true
    force: 25565
```

### Cas spécifique

Un projet composé d'un serveur web utilisant un websocket :

```yaml
service: "docker-compose"
path: "docker/docker-compose.yml"
ports:
  web:
    env_name: "WEB_PORT"
    exposed: true
    proxy: |
      location / {
        proxy_pass http://localhost:$PORT;
      }

      location /ws {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
      }
```
