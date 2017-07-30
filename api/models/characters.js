'use strict';

const MongoClient = require('mongodb').MongoClient;

const mongoURL = "mongodb://localhost:27017/storytime";

const connect = () => {
    return MongoClient.connect(mongoURL);
};

function getCharacters() {
    let currentDB;
    return connect().then((db) => {
        currentDB = db;
        const charactersCollection = currentDB.collection("characters");
        return charactersCollection.find({}).toArray();
    }).then(characters => {
        currentDB.close();
        return Promise.resolve(characters);
    });
}   


module.exports = {
    getCharacters
};