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
                title: "Tag title1"
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

    describe('/GET tags Search', () => {
        it('it should search on title', (done) => {
            chai.request(server)
                .get('/api/v1/tags?title=tle1')
                .end((err, res) => {
                    testGetAllTags(res);
                    res.body.tags.length.should.be.eql(1);
                    done();
                });
        });
        it('it should send no tags if failed search', (done) => {
            chai.request(server)
                .get('/api/v1/tags?title=edeeede')
                .end((err, res) => {
                    testGetAllTags(res);
                    res.body.tags.length.should.be.eql(0);
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
    describe('/PUT tags/:id', () => {
        it('it should change the tag', (done) => {
            let query = {
                title: 'Test2'
            };
            chai.request(server)
                .put(`/api/v1/tags/${insertedTagId}`)
                .send(query)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('tag');
                    res.body.tag.should.be.a('object');
                    res.body.tag.should.have.property('_id');
                    res.body.tag['_id'].should.be.eql(insertedTagId);
                    res.body.tag.should.have.property('title');
                    res.body.tag.title.should.be.eql(query.title);
                    done();
                });
        });
        it('it should return an error if there is no tag', (done) => {
            chai.request(server)
                .put(`/api/v1/tags/${insertedTagId}12345`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
    describe('/DELETE tags/:id', () => {
        it('it should throw an error for no tag', (done) => {
            chai.request(server)
                .delete(`/api/v1/tags/${insertedTagId}1234`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('it should DELETE a tag', (done) => {
            chai.request(server)
                .delete(`/api/v1/tags/${insertedTagId}`)
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
        it('it should remove a tag', (done) => {
            chai.request(server)
                .get('/api/v1/tags')
                .end((err, res) => {
                    testGetAllTags(res);
                    res.body.tags.length.should.be.eql(currentLength);
                    done();
                });
        });
    });
});