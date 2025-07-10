require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const UrlShortenerService = require("./url-shortener-service");
const urlShortenerService = new UrlShortenerService();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;
  const dns = require("dns");
  const urlParser = require("url");
  const original_url = url;

  if (!urlParser.parse(url).hostname) {
    return res.json({ error: "invalid url" });
  }

  if (
    dns.lookup(urlParser.parse(url).hostname, (err, address) => {
      if (err) {
        return res.json({ error: "invalid url" });
      }
    })
  );

  const shortUrl = urlShortenerService.shortenUrl(url);
  res.json({ original_url, short_url: shortUrl });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const shortUrl = req.params.short_url;
  const originalUrl = urlShortenerService.getOriginalUrl(shortUrl);
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: "invalid url" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
