//Order test sequence
require('./test-characters');
require('./test-tags');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

let insertedCharacters = [];
let insertedTags = [];
let insertedCharacterId;
let insertedTagId;
let insertedTag;

//Our parent block
describe('Character Tags', () => {

    // Insert new test data
    before((done) => {
        const promises = [];

        // insert characters
        for (let i = 1; i <= 3; i++) {
            let character = {
                name: `Character${i}`
            };
            promises.push(chai.request(server).post('/api/v1/characters').send(character).then((res) => {
                insertedCharacters.push(res.body.character);
                return Promise.resolve();
            }));
        }

        // insert tags
        for (let i = 1; i <= 2; i++) {
            let tag = {
                title: `Tag${i}`
            };
            promises.push(chai.request(server).post('/api/v1/tags').send(tag).then((res) => {
                insertedTags.push(res.body.tag);
                return Promise.resolve();
            }));
        }


        Promise.all(promises).then(() => {
            insertedCharacterId = (insertedCharacters[0])['_id'];
            insertedTag = (insertedTags[0]);
            insertedTagId = insertedTag['_id'];
            done();
        });
    });


    // Removes test data
    after((done) => {
        const promises = [];
        insertedCharacters.forEach(character => {
            promises.push(chai.request(server).delete(`/api/v1/characters/${character['_id']}`));
        });
        insertedTags.forEach(tag => {
            promises.push(chai.request(server).delete(`/api/v1/tags/${tag['_id']}`));
        });
        Promise.all(promises).then(() => {
            done();
        });
    });



    describe('/GET characters/:id/tags', () => {
        it('it should throw an error for no character', (done) => {
            chai.request(server)
                .get(`/api/v1/characters/${insertedCharacterId}1234/tags`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('it should return all the tags from this character', (done) => {
            chai.request(server)
                .get(`/api/v1/characters/${insertedCharacterId}/tags`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('tags');
                    res.body.tags.should.be.a('array');
                    res.body.tags.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST characters/:id/tags', () => {
        it('it should throw an error for no character', (done) => {
            chai.request(server)
                .post(`/api/v1/characters/${insertedCharacterId}1234/tags`)
                .send(insertedTag)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('it should insert the tag for this character', (done) => {
            chai.request(server)
                .post(`/api/v1/characters/${insertedCharacterId}/tags`)
                .send({ tag: insertedTag })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('character');
                    res.body.character.should.be.a('object');
                    res.body.character.should.have.property('tags');
                    res.body.character.tags.should.be.a('array');
                    res.body.character.tags.length.should.be.eql(1);
                    const lastTag = res.body.character.tags[0];
                    lastTag['_id'].should.be.eql(insertedTag['_id']);
                    done();
                });
        });
    });

    describe('/GET characters/:character_id/tags/:tag_id', () => {
        it('it should throw an error for no character', (done) => {
            chai.request(server)
                .get(`/api/v1/characters/${insertedCharacterId}1234/tags/${insertedTagId}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('it should throw an error for no tag', (done) => {
            chai.request(server)
                .get(`/api/v1/characters/${insertedCharacterId}/tags/${insertedTagId}1234`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('it should retrieve the tag', (done) => {
            chai.request(server)
                .get(`/api/v1/characters/${insertedCharacterId}/tags/${insertedTagId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('tag');
                    res.body.tag.should.be.a('object');
                    res.body.tag.should.have.property('_id');
                    res.body.tag['_id'].should.be.eql(insertedTag['_id']);
                    done();
                });
        });
    });

    describe('/DELETE characters/:character_id/tags/:tag_id', () => {
        it('it should throw an error for no character', (done) => {
            chai.request(server)
                .delete(`/api/v1/characters/${insertedCharacterId}1234/tags/${insertedTagId}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        //TODO problem with character but no existing tag. Maybe 2 queries necessary
        it('it should delete the tag', (done) => {
            chai.request(server)
                .delete(`/api/v1/characters/${insertedCharacterId}/tags/${insertedTagId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('character');
                    res.body.character.should.be.a('object');
                    res.body.character.should.have.property('_id');
                    res.body.character['_id'].should.be.eql(insertedCharacterId);
                    res.body.character.should.have.property('tags');
                    res.body.character.tags.should.be.a('array');
                    res.body.character.tags.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/GET characters?tagId=:tagId', () => {

        before((done) => {
            // Put tags in characters

            const promises = [];

            const firstCharacter = insertedCharacters[0];
            promises.push(chai.request(server).post(`/api/v1/characters/${firstCharacter['_id']}/tags`).send({ tag: insertedTags[0]}));
            const secondCharacter = insertedCharacters[1];
            promises.push(chai.request(server).post(`/api/v1/characters/${secondCharacter['_id']}/tags`).send({ tag: insertedTags[0]}));
            promises.push(chai.request(server).post(`/api/v1/characters/${secondCharacter['_id']}/tags`).send({ tag: insertedTags[1]}));
            Promise.all(promises).then(() => {
                done();
            });
        });
        
        it('it should return all the characters with a certain tag Id', (done) => {
            const tagToSearch = insertedTags[0];
            chai.request(server)
                .get(`/api/v1/characters?tagId=${tagToSearch['_id']}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('characters');
                    res.body.characters.should.be.a('array');
                    res.body.characters.length.should.be.eql(2);
                    done();
                });
        });

        it('it should return no characters with a non present tag Id', (done) => {
            const tagToSearch = insertedTags[0];
            chai.request(server)
                .get(`/api/v1/characters?tagId=${tagToSearch['_id']}1`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('characters');
                    res.body.characters.should.be.a('array');
                    res.body.characters.length.should.be.eql(0);
                    done();
                });
        });

        it('it should return all the characters with multiple tags Id', (done) => {
            const tagToSearch1 = insertedTags[0];
            const tagToSearch2 = insertedTags[1];
            chai.request(server)
                .get(`/api/v1/characters?tagId=${tagToSearch1['_id']}&tagId=${tagToSearch2['_id']}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('characters');
                    res.body.characters.should.be.a('array');
                    res.body.characters.length.should.be.eql(1);
                    done();
                });
        });
        
        //TODO 1 seul résultat
        //TODO pas de résultats
        //TODO multiple tags Id
    });

});