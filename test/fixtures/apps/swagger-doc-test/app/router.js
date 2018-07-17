'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.post('/resource', controller.resource.index);
  router.post('/resource/create', controller.resource.create);
};
