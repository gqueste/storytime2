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
        if (parameters.tagId) {
            let tagQuery = Array.isArray(parameters.tagId)? parameters.tagId: [parameters.tagId];
            query = {
                'tags._id' : { $all: tagQuery}
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
        character.tags = [];
        return charactersCollection.insertOne(character);
    }).then(r => {
        currentDB.close();
        return Promise.resolve(r.ops[0]);
    });
}

function getCharacterById(character_id) {
    let currentDB;
    return getCharacterCollection().then(({ db, charactersCollection }) => {
        currentDB = db;
        let query = {};
        if (character_id) { //TODO Handle if undefined : throw error
            query['_id'] = new ObjectId(character_id);
        }
        return charactersCollection.find(query).next();
    }).then(character => {
        currentDB.close();
        return Promise.resolve(character);
    }).catch(() => {
        //TODO handle other errors. If bdd not accessible, it's not an id problem
        throw ({
            status: 404,
            message: 'incorrect id'
        });
    });
}

function updateCharacter(character_id, params) {
    let currentDB;
    return getCharacterCollection().then(({ db, charactersCollection }) => {
        currentDB = db;
        let query = {};
        if (character_id) { //TODO Handle if undefined : throw error
            query['_id'] = new ObjectId(character_id);
        }
        return charactersCollection.findOneAndUpdate(
            query,
            { $set: params },
            { returnOriginal: false }
        );
    }).then(updatedCharacter => {
        currentDB.close();
        return Promise.resolve(updatedCharacter.value);
    }).catch(() => {
        //TODO handle other errors. If bdd not accessible, it's not an id problem
        throw ({
            status: 404,
            message: 'incorrect id'
        });
    });
}

function deleteCharacter(character_id) {
    let currentDB;
    return getCharacterCollection().then(({ db, charactersCollection }) => {
        currentDB = db;
        let query = {};
        if (character_id) {
            query['_id'] = new ObjectId(character_id);
        }
        return charactersCollection.findOneAndDelete(query);
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

function getCharacterTags(character_id) {
    return getCharacterById(character_id).then(character => {
        return Promise.resolve(character.tags);
    });
}

function insertTagForCharacter(character_id, tag) {
    let currentDB;
    return getCharacterCollection().then(({ db, charactersCollection }) => {
        currentDB = db;
        let query = {};
        if (character_id) { //TODO Handle if undefined : throw error
            query['_id'] = new ObjectId(character_id);
        }
        return charactersCollection.findOneAndUpdate(
            query,
            { $push: { tags : tag } },
            { returnOriginal: false }
        );
    }).then(updatedCharacter => {
        currentDB.close();
        return Promise.resolve(updatedCharacter.value);
    }).catch(() => {
        //TODO handle other errors. If bdd not accessible, it's not an id problem
        throw ({
            status: 404,
            message: 'incorrect id'
        });
    });
}

function getCharacterTag(character_id, tag_id) {
    function getCorrectTag(tag) {
        return tag['_id'] === tag_id;
    }

    return getCharacterById(character_id).then(character => {
        const tagWanted = character.tags.find(getCorrectTag);
        if (tagWanted) {
            return Promise.resolve(tagWanted);
        } else {
            throw ({
                status: 404,
                message: 'incorrect tag id'
            });
        }
    });
}

function deleteTagForCharacter(character_id, tag_id) {
    let currentDB;
    return getCharacterCollection().then(({ db, charactersCollection }) => {
        currentDB = db;
        let query = {};
        if (character_id) { //TODO Handle if undefined : throw error
            query['_id'] = new ObjectId(character_id);
        }
        return charactersCollection.findOneAndUpdate(
            query,
            { $pull: { tags : { '_id': tag_id } } },
            { returnOriginal: false }
        );
    }).then(updatedCharacter => {
        currentDB.close();
        return Promise.resolve(updatedCharacter.value);
    }).catch(() => {
        //TODO handle other errors. If bdd not accessible, it's not an id problem
        throw ({
            status: 404,
            message: 'incorrect id'
        });
    });
}


module.exports = {
    getCharacters,
    insertCharacter,
    getCharacterById,
    updateCharacter,
    deleteCharacter,
    getCharacterTags,
    insertTagForCharacter,
    getCharacterTag,
    deleteTagForCharacter
};