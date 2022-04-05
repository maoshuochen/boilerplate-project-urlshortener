require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const app = express();
let urls = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

//phrase post body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/api/shorturl", function (req, res) {
    let oringinalUrl = req.body.url;
    let shortUrl = Math.floor(Math.random() * 10000);
    if (
        oringinalUrl.split("//")[0] === "https:" ||
        oringinalUrl.split("//")[0] === "http:"
    ) {
        urls.push({ oringinalUrl, shortUrl });
    } else {
        res.json({ error: "invalid url" });
    }
    res.json({ original_url: oringinalUrl, short_url: shortUrl });
});

app.get("/api/shorturl/:shortUrl", function (req, res) {
    let shortUrl = Number(req.params.shortUrl);
    let url = urls.find((url) => url.shortUrl === shortUrl);
    if (url) {
        res.redirect(url.oringinalUrl);
        console.log({ shortUrl, url });
    } else {
        res.json({ error: "not in list" });
    }
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
