//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Tags', () => {
    /*
     * Test the /GET route
     */
    describe('/GET tags', () => {
        it('it should GET all the tags', (done) => {
            chai.request(server)
                .get('/api/v1/tags')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('tags');
                    res.body.tags.should.be.a('array');
                    done();
                });
        });
    });
});