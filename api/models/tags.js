'use strict';

//TODO : error handling -> must close DB connection and throw the error

const {
    MongoClient,
    ObjectId
} = require('mongodb');

const mongoURL = "mongodb://localhost:27017/storytime";

function connect() {
    return MongoClient.connect(mongoURL);
}

function getTagCollection() {
    return connect().then((db) => {
        const tagsCollection = db.collection("tags");
        return Promise.resolve({ db, tagsCollection });
    })
}

function getTags() {
    let currentDB;
    return getTagCollection().then(({ db, tagsCollection }) => {
        currentDB = db;
        return tagsCollection.find().toArray();
    }).then(characters => {
        currentDB.close();
        return Promise.resolve(characters);
    });
}

module.exports = {
    getTags
};