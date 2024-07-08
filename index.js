const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function(req, res) {
    fs.readdir('./files', function(err, files) {
        if (err) {
            console.error("Could not list the directory.", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.render("fr", { files: files }); // Sending the files data from backend to frontend
        }
    });
});

app.post('/create', function(req, res) {
    const fileName = req.body.title.split(' ').join('') + '.txt';
    const filePath = path.join(__dirname, 'files', fileName);

    fs.writeFile(filePath, req.body.content, function(err) {
        if (err) {
            console.error("Could not write the file.", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect("/");
        }
    });
});

app.get('/files/:filename', function(req, res) {
    const filePath = path.join(__dirname, 'files', req.params.filename);

    fs.readFile(filePath, 'utf-8', function(err, data) {
        if (err) {
            console.error("Could not read the file.", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.render('show', { filename: req.params.filename, content: data });
        }
    });
});

app.get('/rename/:filename', function(req, res) {
    res.render('edit', { filename: req.params.filename });
});

app.post('/rename', function(req, res) {
    const oldFilePath = path.join(__dirname, 'files', req.body.oldName);
    const newFilePath = path.join(__dirname, 'files', req.body.newName.split(' ').join('') + '.txt');

    fs.rename(oldFilePath, newFilePath, function(err) {
        if (err) {
            console.error("Could not rename the file.", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect("/");
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
