'use strict';

const { getCharacters } = require('../models/characters');

const apiRoot = "/api/v1/";

module.exports = function(app) {

    // todoList Routes
    app.route(`${apiRoot}characters`)
        .get((req, res) => {
            getCharacters()
                .then(characters => {
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
        });
};