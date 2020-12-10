"use strict";
let express = require("express");
let router = express.Router();
let Court = require("../models/Court.js");

//Create a new court : POST /api/courts/
router.post("/" , function(req, res){
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