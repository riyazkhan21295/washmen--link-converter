const Sails = require('sails');
const request = require('supertest');
const { expect } = require('chai');

let app;

describe('LinkConverterController', () => {
  before((done) => {
    Sails.lift({ log: { level: 'error' } }, (err, sails) => {
      // Instantiates new sails application
      app = sails;

      done(err, sails);
    });
  });

  describe('POST /api/linkConverter/webUrlToDeeplink', () => {
    it('should return an error for an invalid web URL', (done) => {
      request(app.hooks.http.app)
          .post('/api/linkConverter/webUrlToDeeplink')
          .send({ webURL: 'invalid-url' })
          .expect(400)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            expect(res.text).to.equal('"Invalid URL"');

            done();
          });
    });

    it('Page Search: should convert a valid web URL to a deeplink', (done) => {
      request(app.hooks.http.app)
            .post('/api/linkConverter/webUrlToDeeplink')
            .send({ webURL: 'https://www.washmen.com/sr?q=price' })
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              expect(res.body).to.have.property('deeplink', 'washmen://?Page=Search&Query=price');

              done();
            });
    });

    it('Page Product: should convert a valid web URL to a deeplink', (done) => {
      request(app.hooks.http.app)
          .post('/api/linkConverter/webUrlToDeeplink')
          .send({ webURL: 'https://www.washmen.com/clean-and-press/shirts-p-1894501?cityId=994892-asda0-123-asdq' })
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            expect(res.body).to.have.property('deeplink', 'washmen://?Page=Product&ContentId=1894501&CityId=994892-asda0-123-asdq');

            done();
          });
    });

    it('Page Home: should convert a valid web URL to a deeplink', (done) => {
      request(app.hooks.http.app)
            .post('/api/linkConverter/webUrlToDeeplink')
            .send({ webURL: 'https://www.washmen.com/account/favorites' })
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              expect(res.body).to.have.property('deeplink', 'washmen://?Page=Home');

              done();
            });
    });
  });

  describe('POST /api/linkConverter/deeplinkToWebUrl', () => {
    it('should return an error for an invalid deeplink', (done) => {
      request(app.hooks.http.app)
          .post('/api/linkConverter/deeplinkToWebUrl')
          .send({ deeplink: 'invalid-deeplink' })
          .expect(400)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            expect(res.text).to.equal('"Invalid URL"');

            done();
          });
    });

    it('Page Search: should convert a valid deeplink to a web URL', (done) => {
      request(app.hooks.http.app)
            .post('/api/linkConverter/deeplinkToWebUrl')
            .send({ deeplink: 'washmen://?Page=Search&Query=price' })
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              expect(res.body).to.have.property('webURL', 'https://www.washmen.com/sr?q=price');

              done();
            });
    });

    it('Page Product: should convert a valid deeplink to a web URL', (done) => {
      request(app.hooks.http.app)
          .post('/api/linkConverter/deeplinkToWebUrl')
          .send({ deeplink: 'washmen://?Page=Product&ContentId=1894501&CityId=994892-asda0-123-asdq' })
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            expect(res.body).to.have.property('webURL', 'https://www.washmen.com/serviceName/productName-p-1894501?cityId=994892-asda0-123-asdq');

            done();
          });
    });

    it('Page Home: should convert a valid deeplink to a web URL', (done) => {
      request(app.hooks.http.app)
            .post('/api/linkConverter/deeplinkToWebUrl')
            .send({ deeplink: 'washmen://?Page=Home' })
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              expect(res.body).to.have.property('webURL', 'https://www.washmen.com');

              done();
            });
    });
  });
});
