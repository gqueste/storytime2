'use strict';

const { getCharacters, insertCharacter } = require('../models/characters');

const apiRoot = "/api/v1/";

module.exports = function(app) {

    // todoList Routes
    app.route(`${apiRoot}characters`)
        .get((req, res) => {
            let parameters = {};
            parameters.name = req.query ? req.query.name : undefined;
            getCharacters(parameters).then(characters => {
                res.status(200).json({
                    status: 'success',
                    data: {
                        characters
                    }
                });
            })
            .catch(error => res.status(500).json({
                message: error
            }));
        })
        .post((req, res) => {
            const newCharacter = {
                name: req.body.name
            };
            insertCharacter(newCharacter).then(character => {
                res.status(200).json({
                    status: 'success',
                    character
                });
            }).catch(error => res.status(500).json({
                message: error
            }));
        });
};