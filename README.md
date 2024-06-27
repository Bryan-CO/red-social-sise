# PROYECTO API REST - RED SOCIAL DE INTERESES COMUNES "ECHOES"
Este proyecto es una plantilla básica para una aplicación Node.js utilizando Express. Implementa autenticación basada en JWT, validación de esquemas, encriptación de contraseñas y manejo de cookies.

## Requisitos

- Node.js v20 o superior
- MySQL

## Base de Datos
Este proyecto utiliza MySQL como base de datos. Asegúrate de tener una instancia de MySQL corriendo y configura tus credenciales en el archivo `.env`.

## Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/Bryan-CO/red-social-sise.git
```

2. Instala las dependencias

```bash
npm install
```

3. Configura las variables de entorno en un archivo `.env` en la raíz del proyecto. Plantilla disponible en [.env.example](./docs/enviroments/.env.example). 

4. Iniciar el servidor

```bash
npm start
```

## Estructura de carpetas

```bash
├── src
│   ├── controllers
│   │   ├── authentication.js  # Controlador de autenticación
│   │   └── user.js            # Controlador de usuario
│   ├── middlewares
│   │   ├── cors.js            # Middleware para habilitar CORS
│   │   ├── validatePerms.js   # Middleware para validar permisos
│   │   └── validateToken.js   # Middleware para validar token JWT
│   ├── models
│   │   └── mysql
│   │       └── user.js        # Consultas de usuario
│   ├── routes
│   │   ├── authentication.js  # Rutas de autenticación
│   │   └── user.js            # Rutas de usuario
│   ├── schemas
│   │   └── user.js            # Esquema de validación de usuario
│   ├── utils
│   │   ├── AuthUtil.js        # Utilidades de autenticación
│   │   └── Response.js        # Utilidad para generar respuestas
│   └── app.js                 # Archivo principal de la aplicación
├── test
│   └── api.http               # Archivo para pruebas con Rest Client
├── .env                       # Archivo con variables de entorno
├── .gitignore
├── package.json
└── README.md

```

## Lista de dependencias 

- [express](https://www.npmjs.com/package/express) - Framework para NodeJS
- [cors](https://www.npmjs.com/package/cors) - Middleware para habilitar CORS
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Encriptador de contraseñas
- [zod](https://www.npmjs.com/package/zod) - Validador de esquemas
- [cookie-parser](https://www.npmjs.com/package/cookie-parser) - Parseador de cookies
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Generador de tokens
- [mysql2](https://www.npmjs.com/package/mysql2) - Conector para MySQL

## Pruebas con Rest Client
Para realizar pruebas de las rutas de la API, puedes utilizar los archivos en la carpeta `/test` incluido en el proyecto. Esta carpeta contiene ejemplos de solicitudes HTTP que puedes ejecutar con la extensión [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) de Visual Studio Code.