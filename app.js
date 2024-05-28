import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import Url from './models/Url.js';
dotenv.config({ path: './config/.env' });
const app = express();

connectDB();

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  console.log(persistedURLs);
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