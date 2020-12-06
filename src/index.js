const express = require("express");
const nanoid = require("nanoid").nanoid;
const mongoose = require("mongoose");
const UrlModel = require("./urlModel.js");

const DB_URL = "mongodb://localhost:27017/db";

mongoose
  .connect(DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log('DB initial connection was succeed', res))
  .catch((err) => console.log('DB initial connection has failed', err));

  mongoose.connection.on('error', (err) => {
    console.log('DB connection error', err)
  })

const app = express();
app.use(express.raw({type: "application/json"}));
app.use(express.json({strict: false}));

const urlRoutes = express.Router();

function createShortURL(url) {
  return {
    slug: nanoid(),
    url
  }
}

urlRoutes.post('/new', async (req, res) => {
  const {url} = req.query;
  const shorterURL = new UrlModel(createShortURL(url));
  const response = await shorterURL.save();
  res.send(`http://localhost:9000/short/${response.slug}`);
});

urlRoutes.get('/:slug', async (req, res) => {
  const result = await UrlModel.findOne({
    slug: req.params.slug
  })

  if (!result) {
    res.status(404).send('URL was not found')
  }
  else {
    if (req.headers['user-agent'].search('Mozilla/') >= 0) {
      res.setHeader("Content-Type", "text/html");
      res.redirect(302, result.url);
    }
    else {
      res.send(result.url);
    }
  }
});

app.use("/short", urlRoutes);

app.listen(9000, () => {
  console.log("App listening on port 9000");
});