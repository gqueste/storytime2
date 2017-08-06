//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

let currentLength;
//Our parent block
describe('Books', () => {
    /*
     * Test the /GET route
     */
    describe('/GET characters', () => {
        it('it should GET all the characters', (done) => {
            chai.request(server)
                .get('/api/v1/characters')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('characters');
                    res.body.data.characters.should.be.a('array');
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
                    done();
                });
        });
    });

});