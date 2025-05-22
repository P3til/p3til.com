const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.get('/favicon.ico', (req, res) => {res.sendFile(path.join(__dirname, '/favicon.ico'))})

app.get(['/*p', '/'], (req, res) => {
    // $ File Work
    function $(filec, step=1) {
        if (step == 10) {return;}
        let filew = "";
        let location;
        let selected = false;
        for (let i in filec) {
            if (filec[i] == "$" && filec[i-1] != "\\") {
                location = i;
                selected = true;
            } else if (filec[i] == ";" && selected) {
                selected = false;
                filew += $(fs.readFileSync(path.join(__dirname, filec.slice(location,i).split("$")[1]), 'utf8'), step+1);
            } else if (!selected && filec[i] != "\\") {
                filew += filec[i];
            }

        }
        return filew;
    }

    // Redirect to basic page without .html in req.path
    if (req.path.endsWith('.html')) {
        return res.redirect(301, req.path.replace('.html', ''));
    }

    // If the file requested doesn't exist then.. 404!!
    if (!(fs.existsSync(path.join(__dirname, 'src', req.path)) 
        || fs.existsSync(path.join(__dirname, 'src', req.path, 'index.html')))) {
            return res.status(404).send($(fs.readFileSync(path.join(__dirname, 'error/404.html'), 'utf-8')));
        }
    
    // Determines if it is a index.html or other file
    if (req.path.split('/')[req.path.split('/').length - 1].includes('.')) {
        return res.send($(fs.readFileSync(path.join(__dirname, req.path), 'utf-8')));
    }

    if (!(req.path.split('/')[req.path.split('/').length - 1].includes('.'))) {
        return res.send($(fs.readFileSync(path.join(__dirname, 'src', req.path, 'index.html'), 'utf8')));
    }
});

app.listen(80);
