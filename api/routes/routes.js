'use strict';

const { 
    getCharacters,
    insertCharacter,
    getCharacterById,
    updateCharacter,
    deleteCharacter,
    getCharacterTags,
    insertTagForCharacter
} = require('../models/characters');

const {
    getTags,
    insertTag,
    getTagById,
    updateTag,
    deleteTag
} = require('../models/tags');

const apiRoot = "/api/v1/";

module.exports = function(app) {

    /**
     * CHARACTERS
     */
    app.route(`${apiRoot}characters`)
        .get((req, res) => {
            let parameters = {};
            parameters.name = req.query ? req.query.name : undefined;
            getCharacters(parameters).then(characters => {
                res.status(200).json({
                    status: 'success',
                    characters
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

    app.route(`${apiRoot}characters/:character_id`)
        .get((req, res) => {
            const characterId = req.params.character_id;
            getCharacterById(characterId).then(character => {
                res.status(200).json({
                    status: 'success',
                    character
                });  
            })
            .catch(error => {
                if (error.status) {
                    res.status(error.status).json({
                        status: 'failure',
                        message: error.message
                    });
                } else {
                    //TODO must serve for other errors than 404
                    res.status(500).json({
                        message: error
                    });
                }
            });
        })
        .put((req, res) => {
            const characterId = req.params.character_id;
            const params = {};
            if (req.body.name) params.name = req.body.name;
            updateCharacter(characterId, params).then(character => {
                res.status(200).json({
                    status: 'success',
                    character
                });
            }).catch(error => {
                if (error.status) {
                    res.status(error.status).json({
                        status: 'failure',
                        message: error.message
                    });
                } else {
                    //TODO must serve for other errors than 404
                    res.status(500).json({
                        message: error
                    });
                }
            })
        })
        .delete((req, res) => {
            const characterId = req.params.character_id;
            deleteCharacter(characterId).then(character => {
                res.status(200).json({
                    status: 'success',
                    character
                });
            }).catch(error => {
                if (error.status) {
                    res.status(error.status).json({
                        status: 'failure',
                        message: error.message
                    });
                } else {
                    //TODO must serve for other errors than 404
                    res.status(500).json({
                        message: error
                    });
                }
            })
        });


    /**
     * TAGS
     */
    app.route(`${apiRoot}tags`)
        .get((req, res) => {
            let parameters = {};
            parameters.title = req.query ? req.query.title : undefined;
            getTags(parameters).then(tags => {
                res.status(200).json({
                    status: 'success',
                    tags
                });
            }).catch(error => res.status(500).json({
                message: error
            }));
        })
        .post((req, res) => {
            const newTag = {
                title: req.body.title
            };
            insertTag(newTag).then(tag => {
                res.status(200).json({
                    status: 'success',
                    tag
                });
            }).catch(error => res.status(500).json({
                message: error
            }));
        });

    app.route(`${apiRoot}tags/:tag_id`)
        .get((req, res) => {
            const tagId = req.params.tag_id;
            getTagById(tagId).then(tag => {
                res.status(200).json({
                    status: 'success',
                    tag
                });
            }).catch(error => {
                if (error.status) {
                    res.status(error.status).json({
                        status: 'failure',
                        message: error.message
                    });
                } else {
                    //TODO must serve for other errors than 404
                    res.status(500).json({
                        message: error
                    });
                }
            });
        })
        .put((req, res) => {
            const tagId = req.params.tag_id;
            const params = {};
            if (req.body.title) params.title = req.body.title;
            updateTag(tagId, params).then(tag => {
                res.status(200).json({
                    status: 'success',
                    tag
                });
            }).catch(error => {
                if (error.status) {
                    res.status(error.status).json({
                        status: 'failure',
                        message: error.message
                    });
                } else {
                    //TODO must serve for other errors than 404
                    res.status(500).json({
                        message: error
                    });
                }
            })
        })
        .delete((req, res) => {
            const tagId = req.params.tag_id;
            deleteTag(tagId).then(tag => {
                res.status(200).json({
                    status: 'success',
                    tag
                });
            }).catch(error => {
                if (error.status) {
                    res.status(error.status).json({
                        status: 'failure',
                        message: error.message
                    });
                } else {
                    //TODO must serve for other errors than 404
                    res.status(500).json({
                        message: error
                    });
                }
            })
        });


    /**
     * CHARACTER_TAGS
     */
    app.route(`${apiRoot}characters/:character_id/tags`)
        .get((req, res) => {
            const characterId = req.params.character_id;
            getCharacterTags(characterId).then(tags => {
                res.status(200).json({
                    status: 'success',
                    tags
                });
            }).catch(error => {
                if (error.status) {
                    res.status(error.status).json({
                        status: 'failure',
                        message: error.message
                    });
                } else {
                    //TODO must serve for other errors than 404
                    res.status(500).json({
                        message: error
                    });
                }
            });
        })
        .post((req, res) => {
            const characterId = req.params.character_id;
            const tag = req.body.tag;
            insertTagForCharacter(characterId, tag).then(character => {
                res.status(200).json({
                    status: 'success',
                    character
                });
            }).catch(error => {
                if (error.status) {
                    res.status(error.status).json({
                        status: 'failure',
                        message: error.message
                    });
                } else {
                    //TODO must serve for other errors than 404
                    res.status(500).json({
                        message: error
                    });
                }
            });
        });
};