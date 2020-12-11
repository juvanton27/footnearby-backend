"use strict";
let express = require("express");
let router = express.Router();
let Court = require("../models/Court.js");

//Create a new court : POST /api/courts/
router.post("/" , function(req, res){
    var formidable = require('formidable');
    var fs = require('fs');
    if(req.params.image!==null){
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, req) {
            var oldpath = files.filetoupload.path;
            console.log(oldpath);
            var newpath = '../../src/images/'+Court.nextCourtId()+'-image.jpg';
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
              });
        });
        req.body.image = '../images/'+Court.nextCourtId()+'-image.jpg';
    }
    let newCourt= new Court(req.body);
    newCourt.save();
    return res.json(newCourt);   
});

//Read all the existing courts: GET /api/courts/
router.get("/", function(req, res) {
    return res.json(Court.list);
});


//Search a court: GET /api/courts/:search
router.get("/:search", function(req, res){
    return res.json(Court.search(req.params.search));
});

//Read an identified court: GET /api/courts/:id
router.get("/:id",function(req, res){
    const courtFound = Court.get(req.params.id);
    if(!courtFound) return res.status(404).end();

    return res.json(courtFound);
});

module.exports = router;