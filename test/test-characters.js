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
    res.body.should.have.property('data');
    res.body.data.should.have.property('characters');
    res.body.data.characters.should.be.a('array');
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
                    currentLength = res.body.data.characters.length;
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
                name: "Test Character"
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
                    insertedCharacterId = res.body.character['_id'];
                    done();
                });
        });
        it('it should add a character', (done) => {
            chai.request(server)
                .get('/api/v1/characters')
                .end((err, res) => {
                    testGetAllCharacters(res);
                    res.body.data.characters.length.should.be.eql(currentLength + 1);
                    done();
                });
        });
    });
    describe('/DELETE characters/:id', () => {
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
                    res.body.data.characters.length.should.be.eql(currentLength);
                    done();
                });
        });
    });

});