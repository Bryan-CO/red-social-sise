import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Social Network Echoes API',
        description: "API endpoints for a mini blog services documented on swagger",
        version: '1.1.0',
      },
      servers: [
        {
          url: "http://localhost:1234/",
          description: "Local server"
        }
      ]
    },
    basePath: "/",
    // looks for configuration in specified directories
    apis: ['./src/routes/*.js'],
  }

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    })
};

export default swaggerDocs;