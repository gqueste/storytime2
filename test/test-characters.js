//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

let currentLength;
let insertedCharacterId;


function testGetAllCharacters(res) {
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.should.have.property('status');
    res.body.should.have.property('characters');
    res.body.characters.should.be.a('array');
}


//Our parent block
describe('Characters', () => {
    /*
     * Test the /GET route
     */
    describe('/GET characters', () => {
        it('it should GET all the characters', (done) => {
            chai.request(server)
                .get('/api/v1/characters')
                .end((err, res) => {
                    testGetAllCharacters(res);
                    currentLength = res.body.characters.length;
                    done();
                });
        });
        it('it should search on name', (done) => {
            chai.request(server)
                .get('/api/v1/characters?name=')
                .end((err, res) => {
                    testGetAllCharacters(res);
                    currentLength = res.body.characters.length;
                    done();
                });
        });
    });
    /*
     * Test the /POST route
     */
    describe('/POST characters', () => {
        it('it should POST a new character', (done) => {
            let character = {
                name: "Test Character",
                physique: "a",
                morale: "a",
                histoire: "a"
            };
            chai.request(server)
                .post('/api/v1/characters')
                .send(character)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('character');
                    res.body.character.should.be.a('object');
                    res.body.character.should.have.property('tags');
                    res.body.character.tags.should.be.a('array');
                    res.body.character.should.have.property('name');
                    res.body.character.name.should.be.eql(character.name);
                    res.body.character.should.have.property('physique');
                    res.body.character.physique.should.be.eql(character.physique);
                    res.body.character.should.have.property('morale');
                    res.body.character.morale.should.be.eql(character.morale);
                    res.body.character.should.have.property('histoire');
                    res.body.character.histoire.should.be.eql(character.histoire);
                    res.body.character.tags.length.should.be.eql(0);
                    insertedCharacterId = res.body.character['_id'];
                    done();
                });
        });
        it('it should add a character', (done) => {
            chai.request(server)
                .get('/api/v1/characters')
                .end((err, res) => {
                    testGetAllCharacters(res);
                    res.body.characters.length.should.be.eql(currentLength + 1);
                    done();
                });
        });
    });
    describe('/GET characters Search', () => {
        it('it should search on name', (done) => {
            chai.request(server)
                .get('/api/v1/characters?name=Test')
                .end((err, res) => {
                    testGetAllCharacters(res);
                    res.body.characters.length.should.be.eql(1);
                    done();
                });
        });
        it('it should send no characters if failed search', (done) => {
            chai.request(server)
                .get('/api/v1/characters?name=edeeede')
                .end((err, res) => {
                    testGetAllCharacters(res);
                    res.body.characters.length.should.be.eql(0);
                    done();
                });
        });
    });
    describe('/GET characters/:id', () => {
        it('it should GET the character', (done) => {
            chai.request(server)
                .get(`/api/v1/characters/${insertedCharacterId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('character');
                    res.body.character.should.be.a('object');
                    res.body.character.should.have.property('_id');
                    res.body.character['_id'].should.be.eql(insertedCharacterId);
                    done();
                });
        });
        it('it should return an error if there is no character', (done) => {
            chai.request(server)
                .get(`/api/v1/characters/${insertedCharacterId}12345`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
    describe('/PUT characters/:id', () => {
        it('it should change the character', (done) => {
            let query = {
                name: 'Test2',
                physique: "b",
                morale: "b",
                histoire: "b"
            };
            chai.request(server)
                .put(`/api/v1/characters/${insertedCharacterId}`)
                .send(query)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('character');
                    res.body.character.should.be.a('object');
                    res.body.character.should.have.property('_id');
                    res.body.character['_id'].should.be.eql(insertedCharacterId);
                    res.body.character.should.have.property('name');
                    res.body.character.name.should.be.eql(query.name);
                    res.body.character.should.have.property('physique');
                    res.body.character.physique.should.be.eql(query.physique);
                    res.body.character.should.have.property('morale');
                    res.body.character.morale.should.be.eql(query.morale);
                    res.body.character.should.have.property('histoire');
                    res.body.character.histoire.should.be.eql(query.histoire);
                    done();
                });
        });
        it('it should return an error if there is no character', (done) => {
            chai.request(server)
                .put(`/api/v1/characters/${insertedCharacterId}12345`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
    
    
    
    describe('/DELETE characters/:id', () => {
        it('it should throw an error for no character', (done) => {
            chai.request(server)
                .delete(`/api/v1/characters/${insertedCharacterId}1234`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('it should DELETE a character', (done) => {
           chai.request(server)
               .delete(`/api/v1/characters/${insertedCharacterId}`)
               .end((err, res) => {
                   res.should.have.status(200);
                   res.body.should.be.a('object');
                   res.body.should.have.property('status');
                   res.body.should.have.property('character');
                   res.body.character.should.be.a('object');
                   res.body.character.should.have.property('_id');
                   res.body.character['_id'].should.be.eql(insertedCharacterId);
                   done();
               });
        });
        it('it should remove a character', (done) => {
            chai.request(server)
                .get('/api/v1/characters')
                .end((err, res) => {
                    testGetAllCharacters(res);
                    res.body.characters.length.should.be.eql(currentLength);
                    done();
                });
        });
    });
});