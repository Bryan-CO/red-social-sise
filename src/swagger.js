import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const STORAGE_TOKEN = process.env.NAME_STORAGE_TOKEN_JWT || 'xyz-jwt-access';

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Echoes - API para Red Social de Intereses Comunes',
        description: "API endpoints para una red social de intereses comunes documentado en swagger",
        version: '1.1.0',
      },
      servers: [
        {
          url: "http://localhost:1234/",
          description: "Local server"
        }
      ],
      components: {
        securitySchemes: {
          AuthJWT: {
            type: 'apiKey',
            in: 'cookie',
            name: STORAGE_TOKEN,
          },
        },
      },
      security: [
        {
          AuthJWT: [],
        },
      ],
      tags: [
        {
          name: "Auth",
          description: "Everything about Authentication.",
        },
        {
          name: "Users",
          description: "Everything about users.",
        },
        {
          name: "Posts",
          description: "Everything about posts.",
        },
        {
          name: "Messages",
          description: "Everything about messages.",
        },
        {
          name: "Reactions",
          description: "Everything about reactions by post.",
        },
        {
          name: "Chats",
          description: "Everything about chats.",
        },
        {
          name: "Members",
          description: "Everything about members by chat.",
        },
        {
          name: "Comments",
          description: "Everything about comments.",
        }
      ]
    },
    basePath: "/",
    apis: ['./src/routes/*.yaml', './src/schemas/*.yaml'],
  }

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
};

export default swaggerDocs;