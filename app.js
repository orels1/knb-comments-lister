/**
 * Created by antonorlov on 17/02/2017.
 */

require('babel-polyfill');
require('babel-register');

// paths
require('app-module-path').addPath(__dirname + '/');

var path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    express = require('express'),
    cors = require('cors');

var app = express();

// Sentry
var Raven = require('raven');
if (process.env.NODE_ENV === 'production') {
    Raven.config(process.env.DSN).install();
}

/*
 * App Middleware
 * */
app.set('port', process.env.PORT || 3000);
app.set('trust proxy', process.env.NODE_ENV === 'production' || false);
app.use(Raven.requestHandler());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': false }));
app.use(express.static(path.join(__dirname, 'public')));

/*
 * DB
 * */
var mongoose = require('mongoose');
// Set promise library
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.mlabUrl || 'localhost/comments');

mongoose.connection.on('error', function() {
    console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

app.listen(app.get('port'));
console.log('Server is listening at port ' + app.get('port'));

/*
 * Modules
 * */
// var twitchapi = require('./backend/twitchapi');

/*
 * API handlers
 * */

// Main
var comments = require('./backend/api/v1/comments');

// Tasks
var tasks = require('./backend/api/v1/tasks');

/*
 * API (v1)
 * */

// Main
app.use('/api/v1/comments', cors(), comments.router);

/*
 * Frontend
 * */
var pug  = require('pug'),
    React = require('react'),
    ReactDOM = require('react-dom/server'),
    Router = require('react-router'),
    routes = require('frontend/app/routes');

app.set('view engine', 'pug');

/*
 * Busting
 * */
var busters = require('./busters.json');
function asset(path) {
    return path.substr(7) + (busters[path] ? '?' + busters[path] : '');
}

/*
 * React Middleware
 * */
app.use(function(req, res) {
    Router.match({ 'routes': routes.default, 'location': req.url }, function(err, redirectLocation, renderProps) {
        if (err) {
            res.status(500).send(err.message);
        } else if (redirectLocation) {
            res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            var html = ReactDOM.renderToString(React.createElement(Router.RouterContext, renderProps));
            res.status(200).render('../frontend/views/index', {
                'html': html,
                'styles': '/' + asset('public/css/main.css'),
                'vendor_bundle': '/' + asset('public/js/vendor.bundle.js'),
                'bundle': '/' + asset('public/js/bundle.js'),
            });
        } else {
            res.status(404).send('Page Not Found');
        }
    });
});

// Error handler
if (process.env.NODE_ENV === 'production') {
    app.use(Raven.errorHandler());
}

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.

    if (process.env.NODE_ENV === 'dev') {
        console.log(err);
    }
    res.status(500).send({
        'error': 'DBError',
        'error_details': 'Could not get data from db, contact support and provide the error_id',
        'error_id': res.sentry,
        'results': {},
    });
});

// export server for the modules which needs it
module.exports = app;
