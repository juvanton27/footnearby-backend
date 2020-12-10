"use strict";
var escape = require("escape-html");

const FILE_PATH = __dirname + "/../data/courts.json";

class Court {
    constructor(data){
        this.id = Court.nextCourtId();
        //escape the title & link in order to protect agains XSS attacks
        this.title = escape(data.title);
        this.adress = escape(data.adress);
        this.city = escape(data.city);
        this.surface = escape(data.surface);
        this.light = escape(data.light);
        this.cover = escape(data.cover);
    } 

    static nextCourtId() {
        let courtList = getCourtsListFromFile(FILE_PATH);
        if(courtList.length === 0) return 1;
        return courtList[courtList.length-1].id + 1;
    }

    save() {
        let courtList = getCourtsListFromFile(FILE_PATH);
        courtList.push(this);
        saveCourtsListToFile(FILE_PATH, courtList);
    }

    static get(id) {
        let courtsList = getCourtsListFromFile(FILE_PATH);
        return courtsList.find((court) => court.id == id);
    }
    static search(search) {
        let courtsList =getCourtsListFromFile(FILE_PATH);
        return courtsList.find((court) => court.title.localeCompare(search) ||
                                          court.adress.localeCompare(search) ||
                                          court.city.localeCompare(search));
    }

    static delete(id){
        let courtsList = getCourtsListFromFile(FILE_PATH);
        const index = courtList.findIndex((court) => court.id == id);
        if(index<0) return;
        const itemRemoved = {...courtsList[index]};

        courtsList.splice(index,1);
        saveCourtsListToFile(FILE_PATH,courtsList);
        return itemRemoved;
    }
}



function getCourtsListFromFile(filePath){
    const fs = require("fs");
    if(!fs.existsSync(filePath)) return [];
    let courtListRawData = fs.readFileSync(filePath);
    let courtList;
    if(courtListRawData) courtList = JSON.parse(courtListRawData);
    else courtList = [];
    return courtList;

}

function saveCourtsListToFile(filePath,courtList){
    const fs = require("fs");
    let data = JSON.stringify(courtList);
    fs.writeFileSync(filePath,data);
}

module.exports = Court;