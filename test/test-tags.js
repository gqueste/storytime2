//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

let currentLength;
let insertedTagId;

function testGetAllTags(res) {
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.should.have.property('status');
    res.body.should.have.property('tags');
    res.body.tags.should.be.a('array');
}

describe('Tags', () => {
    /*
     * Test the /GET route
     */
    describe('/GET tags', () => {
        it('it should GET all the tags', (done) => {
            chai.request(server)
                .get('/api/v1/tags')
                .end((err, res) => {
                    testGetAllTags(res);
                    currentLength = res.body.tags.length;
                    done();
                });
        });
    });

    describe('/POST tags', () => {
        it('it should POST a new tag', (done) => {
            let tag = {
                title: "Tag title"
            };
            chai.request(server)
                .post('/api/v1/tags')
                .send(tag)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('tag');
                    res.body.tag.should.be.a('object');
                    insertedTagId = res.body.tag['_id'];
                    done();
                });
        });
        it('it should add a character', (done) => {
            chai.request(server)
                .get('/api/v1/tags')
                .end((err, res) => {
                    testGetAllTags(res);
                    res.body.tags.length.should.be.eql(currentLength + 1);
                    done();
                });
        });
    });

    describe('/GET tags/:id', () => {
        it('it should GET the tag', (done) => {
            chai.request(server)
                .get(`/api/v1/tags/${insertedTagId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('tag');
                    res.body.tag.should.be.a('object');
                    res.body.tag.should.have.property('_id');
                    res.body.tag['_id'].should.be.eql(insertedTagId);
                    done();
                });
        });
        it('it should return an error if there is no tag', (done) => {
            chai.request(server)
                .get(`/api/v1/tags/${insertedTagId}12345`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});