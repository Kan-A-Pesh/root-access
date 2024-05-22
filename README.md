# Dashboard ROOT//ACCESS

> 🗒️ *Note:* ROOT//ACCESS uses the UNIX user system, so it only works on UNIX systems (Linux, macOS, etc.).

The ROOT//ACCESS Dashboard is a web app for managing members, projects. \
It allows you to easily add, delete, and update member information, as well as create, delete, and modify project details. \
The dashboard also enables you to link GitHub repositories for continuous integration and deployment (CI/CD) processes, while providing FTP, SFTP, and SSH access for efficient collaboration and deployment.

## 📦 Features

- A dashboard for managing members and projects
- Integration with GitHub for CI/CD workflows
- Access controls with FTP, SFTP, and SSH for collaborative development and deployment on a per-project basis

## 🚀 Installation

### Prerequisites

The project requires Node.js, npm, and MongoDB to function.

```bash
# Install Node.js and npm
sudo apt install nodejs npm

# Install MongoDB
sudo apt install mongodb
```

MongoDB can also be installed with Docker.

```bash
# Start a MongoDB container
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root --name root-mongodb mongo

# Web UI (optional)
npm install -g mongoku
mongoku start
```

The project uses NGINX for reverse proxy, so it needs to be installed.

```bash
# Install NGINX
sudo apt install nginx

# Start NGINX
sudo systemctl start nginx # or `sudo service nginx start`
```

### Creating an Admin Account

Creating an admin account is necessary to access the dashboard. \
It must be done manually with the following HTTP request:

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

Here is the corresponding cURL command:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"rootkey":"{{ROOT_KEY}}","realname":"Full Name","email":"{{EMAIL}}"}' {{BASE_URL}}/api/auth/register/admin
```

The `rootkey` parameter is a secret key used to create an admin account. \
It is defined in the `.env` file at the root of the project.

The `realname` and `email` parameters are the admin account information. \
After the request is made, a confirmation email is sent to the specified email address. \
It contains a link to finalize the account creation, which is valid for 24 hours.

## 📄 License

This project is licensed under the GNU General Public License v3.0.\
See the [LICENSE](./LICENSE) file for details.
