//Order test sequence
require('./test-characters');
require('./test-tags');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

let insertedCharacterId;
let insertedTagId;
let insertedTag;

//Our parent block
describe('Character Tags', () => {

    // Insert new test data
    before(() => {
        let character = {
            name: "Character1"
        };
        chai.request(server)
            .post('/api/v1/characters')
            .send(character)
            .end((err, res) => {
                insertedCharacterId = res.body.character['_id'];
            });
        let tag = {
            title: "Tag1"
        };
        chai.request(server)
            .post('/api/v1/tags')
            .send(tag)
            .end((err, res) => {
                insertedTagId = res.body.tag['_id'];
                insertedTag = res.body.tag;
            });
    });


    // Removes test data
    after(() => {
        chai.request(server)
            .delete(`/api/v1/characters/${insertedCharacterId}`);
        chai.request(server)
            .delete(`/api/v1/tags/${insertedTagId}`);
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

    //TODO delete tag from character
    //TODO get all characters with tag title

});