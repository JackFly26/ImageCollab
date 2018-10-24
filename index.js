const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const fs = require('fs');
app.use(bodyparser.json({limit: '20mb', extended: true}));
app.use(require('cors')());
app.use(express.static("website"));
let imagedata = {};
app.get("/image", (req, res) => {
        res.end(imagedata[req.ip]);
})
app.post('/setimage', (req, res) => {
        if (req.body.image) imagedata[req.ip] = req.body.image;
        else {
                res.status(400).json("Please include an image.");
                res.end();
        }
        res.end()
})
app.listen(80);