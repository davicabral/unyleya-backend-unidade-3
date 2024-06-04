import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import Url from './models/Url.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
dotenv.config({ path: './config/.env' });
const app = express();

//Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Davi - URL Shortener',
    version: '1.0.0',
    description: 'Esta API faz parte da pós graduação da Unyleya'
  },
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Development server',
    }
  ]
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['app.js'],
};

const swaggerSpec = swaggerJSDoc(options);

connectDB();

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /{urlId}:
 *   get:
 *     summary: Redireciona para a URL final a partir do id da URL encurtada
 *     description: Busca no banco de dados se existe alguma URL com o id passado por parametro, case exista redireciona automaticamente.
 *     parameters:
 *       - in: path
 *         name: urlId
 *         required: true
 *         description: Short URL id.
 *         schema:
 *           type: string
*/
app.get('/:urlId', async (req, res) => {
  try {
    const persistedURL = await Url.findOne({ urlId: req.params.urlId });
    if (persistedURL) {
      return res.redirect(persistedURL.url);
    } else { 
      res.status(404).json('Not found')
  };
  } catch (err) {
    console.log(err);
    res.status(500).json('Server Error');
  }
})

/**
 * @swagger
 * /all/{date}:
 *   get:
 *     summary: Busca todas as url encurtadas naquela data
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         description: Data usada para busca (yyyy-mm-dd).
 *         schema:
 *           type: string
*/
app.get('/all/:date', async (req, res) => {
  try {
    let initialDate = new Date(req.params.date);
    initialDate.setHours(0,0,0,0);
    let finalDate = new Date(req.params.date)
    finalDate.setHours(23,59,59,0);
    console.log("Initial date " + initialDate);
    console.log("Final date " + finalDate);
    const persistedURLs = await Url.find({ date: {
      $gte: initialDate,
      $lte: finalDate,
    }
  });
    if (persistedURLs) {
      return res.json(persistedURLs);
    } else { 
      res.status(404).json('Not found')
  };
  } catch (err) {
    console.log(err);
    res.status(500).json('Server Error');
  }
})

/**
 * @swagger
 * /api/short:
 *   post:
 *     summary: Submete uma nova url para ser encurtada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: URL que será encurtada
 *                 example: https://www.google.com
*/
app.post('/api/short', async (req, res) => {
  const { url } = req.body;
  const base = process.env.BASE;

  const urlId = nanoid();
  if (url.startsWith("http")) {
    try {
      let persistedURL = await Url.findOne({ url });
      if (persistedURL) {
        res.json(persistedURL);
      } else {
        const shortUrl = `${base}/${urlId}`;

        persistedURL = new Url({
          url,
          shortUrl,
          urlId,
          date: new Date(),     
        });

        await persistedURL.save();
        res.json(persistedURL);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  } else {
    res.status(400).json('Invalid Original Url');
  }
})

// Server Setup
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});

