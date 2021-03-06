module.exports = {
  name: 'Admin',
  version: '0.0.1',
  description: 'Admin section for the site',
  middleware: [
    function(serviceLocator) {
      return function(req, res, next) {
        serviceLocator.adminAccessControl.isAllowed(req, res, 'Admin Bar', 'read', function(error, allowed) {
          if (allowed) {
            res.bodyStart = [__dirname + '/views/adminBar.jade'];
          }
          next();
        });
      };
    }
  ],
  initialize: [
    function(serviceLocator, done) {

      // Adding this bundle registers the admin acl
      serviceLocator.register('adminAccessControlList',
        require('../../lib/secure/accessControlList').createAccessControlList(serviceLocator.logger));
      done();
    },
    function(serviceLocator, done) {

      // The resource you need access of see the admin bundles
      serviceLocator.adminAccessControlList.addResource('Admin');
      serviceLocator.adminAccessControlList.addResource('Admin Bar');

      // This controls the authentication and authorisation of the admin
      serviceLocator.register('adminAccessControl',
        require('../../lib/secure/accessControl').createAccessControl(
          serviceLocator.administratorModel, serviceLocator.adminAccessControlList,
          {}, 'admin', serviceLocator.logger,
          function(req, res, resource, action, next) {
            res.redirect('/admin/login');
          }));
      done();
    },
    function(serviceLocator, done) {

      var compact = serviceLocator.compact;

      compact
        .addNamespace('admin-common')
        .addJs('/js/chosen/chosen.jquery.js')
        .addJs('/js/fancybox/jquery.fancybox.pack.js')
        .addJs('/js/admin/control.js');

      // Create controller
      require('./controller').createRoutes(serviceLocator.app, serviceLocator.properties, serviceLocator, __dirname + '/views');
      done();
    },
    function(serviceLocator, done) {
      serviceLocator.app.configure(function() {
        serviceLocator.app.dynamicHelpers({
          adminIsAllowed: function(req, res) {
            return function (resource, action) {
              return serviceLocator.adminAccessControl.isAllowed(req, res, resource, action);
            };
          }
        });
      });
      done();
    }
  ]
};