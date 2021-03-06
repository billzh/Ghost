var frontend    = require('../controllers/frontend'),
    config      = require('../config'),
    express     = require('express'),
    utils       = require('../utils'),

    frontendRoutes;

frontendRoutes = function () {
    var router = express.Router(),
        subdir = config.paths.subdir;

    // ### Admin routes
    router.get(/^\/(logout|signout)\/$/, function redirect(req, res) {
        /*jslint unparam:true*/
        res.set({'Cache-Control': 'public, max-age=' + utils.ONE_YEAR_S});
        res.redirect(301, subdir + '/ghost/signout/');
    });
    router.get(/^\/signup\/$/, function redirect(req, res) {
        /*jslint unparam:true*/
        res.set({'Cache-Control': 'public, max-age=' + utils.ONE_YEAR_S});
        res.redirect(301, subdir + '/ghost/signup/');
    });

    // redirect to /ghost and let that do the authentication to prevent redirects to /ghost//admin etc.
    router.get(/^\/((ghost-admin|admin|wp-admin|dashboard|signin|login)\/?)$/, function (req, res) {
        /*jslint unparam:true*/
        res.redirect(subdir + '/ghost/');
    });

    // ### Frontend routes
    router.get('/rss/', frontend.rss);
    router.get('/rss/:page/', frontend.rss);
    router.get('/feed/', function redirect(req, res) {
        /*jshint unused:true*/
        res.set({'Cache-Control': 'public, max-age=' + utils.ONE_YEAR_S});
        res.redirect(301, subdir + '/rss/');
    });

    // Tags
    router.get('/' + config.routeKeywords.tag + '/:slug/rss/', frontend.rss);
    router.get('/' + config.routeKeywords.tag + '/:slug/rss/:page/', frontend.rss);
    router.get('/' + config.routeKeywords.tag + '/:slug/' + config.routeKeywords.page + '/:page/', frontend.tag);
    router.get('/' + config.routeKeywords.tag + '/:slug/', frontend.tag);

    // Authors
    router.get('/' + config.routeKeywords.author + '/:slug/rss/', frontend.rss);
    router.get('/' + config.routeKeywords.author + '/:slug/rss/:page/', frontend.rss);
    router.get('/' + config.routeKeywords.author + '/:slug/' + config.routeKeywords.page + '/:page/', frontend.author);
    router.get('/' + config.routeKeywords.author + '/:slug/', frontend.author);

    // Default
    router.get('/' + config.routeKeywords.page + '/:page/', frontend.homepage);
    router.get('/', frontend.homepage);
    router.get('*', frontend.single);

    return router;
};

module.exports = frontendRoutes;
