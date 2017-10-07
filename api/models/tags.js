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

function getTags(parameters) {
    let currentDB;
    return getTagCollection().then(({ db, tagsCollection }) => {
        currentDB = db;
        let query = {};
        if (parameters.title) {
            query.title = {
                $regex: parameters.title,
                $options : "-i"
            };
        }
        return tagsCollection.find(query).toArray();
    }).then(characters => {
        currentDB.close();
        return Promise.resolve(characters);
    });
}

function insertTag(tag) {
    let currentDB;
    return getTagCollection().then(({db, tagsCollection}) => {
        currentDB = db;
        return tagsCollection.insertOne(tag);
    }).then(r => {
        currentDB.close();
        return Promise.resolve(r.ops[0]);
    });
}

function getTagById(tag_id) {
    let currentDB;
    return getTagCollection().then(({ db, tagsCollection }) => {
        currentDB = db;
        let query = {};
        if (tag_id) { //TODO Handle if undefined : throw error
            query['_id'] = new ObjectId(tag_id);
        }
        return tagsCollection.find(query).next();
    }).then(tag => {
        currentDB.close();
        return Promise.resolve(tag);
    }).catch(() => {
        //TODO handle other errors. If bdd not accessible, it's not an id problem
        throw ({
            status: 404,
            message: 'incorrect id'
        });
    });
}

function updateTag(tag_id, params) {
    //TODO should also update in all characters
    let currentDB;
    return getTagCollection().then(({ db, tagsCollection }) => {
        currentDB = db;
        let query = {};
        if (tag_id) { //TODO Handle if undefined : throw error
            query['_id'] = new ObjectId(tag_id);
        }
        return tagsCollection.findOneAndUpdate(
            query,
            { $set: params },
            { returnOriginal: false }
        );
    }).then(updatedTag => {
        currentDB.close();
        return Promise.resolve(updatedTag.value);
    }).catch(() => {
        //TODO handle other errors. If bdd not accessible, it's not an id problem
        throw ({
            status: 404,
            message: 'incorrect id'
        });
    });
}

function deleteTag(tag_id) {
    //TODO should also remove from all characters
    let currentDB;
    return getTagCollection().then(({ db, tagsCollection }) => {
        currentDB = db;
        let query = {};
        if (tag_id) {
            query['_id'] = new ObjectId(tag_id);
        }
        return tagsCollection.findOneAndDelete(query);
    }).then(result => {
        currentDB.close();
        return Promise.resolve(result.value);
    }).catch(() => {
        //TODO handle other errors. If bdd not accessible, it's not an id problem
        throw ({
            status: 404,
            message: 'incorrect id'
        });
    })
}

module.exports = {
    getTags,
    insertTag,
    getTagById,
    updateTag,
    deleteTag
};