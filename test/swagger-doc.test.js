'use strict';

const mock = require('egg-mock');

describe('test/swagger-doc.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/swagger-doc-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/swagger-ui.html')
      .expect(200);
  });
});
