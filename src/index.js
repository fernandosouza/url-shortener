const express = require("express");
const nanoid = require("nanoid").nanoid;
const mongoose = require("mongoose");

const DB_URL = "mongodb://localhost:27017/db";

mongoose
  .connect(DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => res)
  .catch((err) => console.log(err));


const URLSchema = new mongoose.Schema({
  slug: {
    type: String
  },
  url: {
    type: String
  }
})
const UrlModel = mongoose.model('URL', URLSchema);

const app = express();
app.use(express.raw({type: "application/json"}));
app.use(express.json({strict: false}));

const urlRoutes = express.Router();

urlRoutes.post('/new', async (req, res) => {
  const {url} = req.query;
  const id = nanoid();
  const shorterURL = new UrlModel({
    slug: id,
    url
  });
  const response = await shorterURL.save();
  res.send(`http://localhost:9000/${response.slug}`);
});

urlRoutes.get('/:slug', async (req, res) => {
  const result = await UrlModel.findOne({
    slug: req.params.slug
  })

  if (!result) {
    res.status(404).send('URL was not found')
  }
  else {
    res.send(result.url)
  }
});

app.use("/short", urlRoutes);

app.listen(9000, () => {
  console.log("App listening on port 9000");
});