'use strict';

const MongoClient = require('mongodb').MongoClient;

const mongoURL = "mongodb://localhost:27017/storytime";

function connect() {
    return MongoClient.connect(mongoURL);
}

function getCharacterCollection() {
    return connect().then((db) => {
        const charactersCollection = db.collection("characters");
        return Promise.resolve({ db, charactersCollection });
    })
}

function getCharacters(parameters) {
    let currentDB;
    return getCharacterCollection().then(({ db, charactersCollection }) => {
        currentDB = db;
        let query = {};
        if (parameters.name) {
            query.name = {
                $regex: parameters.name
            };
        }
        return charactersCollection.find(query).toArray();
    }).then(characters => {
        currentDB.close();
        return Promise.resolve(characters);
    });
}

function insertCharacter(character) {
    let currentDB;
    return getCharacterCollection().then(({db, charactersCollection}) => {
        currentDB = db;
        return charactersCollection.insertOne(character);
    }).then(r => {
        currentDB.close();
        return Promise.resolve(r.ops[0]);
    });
}


module.exports = {
    getCharacters,
    insertCharacter
};