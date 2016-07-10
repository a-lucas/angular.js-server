/**
 * Created by antoine on 08/07/16.
 */
/**
 * Created by antoine on 07/07/16.
 */

var express = require('express');
var path = require('path');
var favicon = require('express-favicon');

var swig = require('swig');
swig.setDefaults({ varControls: ['{[', ']}'] });
swig.setDefaults({ cache: false });
swig.setDefaults({ autoescape: false });

var angularDomServer = require('./../../../server/lib/AngularServerRenderer');
var config = require('./../../../server/config');

var appServer = express();
appServer.use(favicon(__dirname + '/favicon.ico'));

var angularServer = new angularDomServer(config);

//view renderer
appServer.engine('html', swig.renderFile);
appServer.set('view engine', 'html');

//template views base folder
appServer.set('views', __dirname + '/views');

//static definition
appServer.use(express.static( path.resolve(__dirname + '/../../../')));
appServer.use('/views', express.static( path.resolve(__dirname + '/../../../src/views')));
appServer.use('/dist', express.static( path.resolve(__dirname + '/../../../dist/client')));

//all urls
appServer.get('/*', function(req, res, next) {


    var swigAngularHtml = swig.renderFile( './views/angular.html' , {} );

    var html = angularServer.render(swigAngularHtml, req.url);

    var tpl = swig.compileFile('./views/index-pre-render.html', {
        cache: false,
        varControls: ['{[', ']}'] //Avoid angularJS moustache conflict
    });

    html.then(function(result) {

        console.log(result);
        res.send(tpl({ angularServerHtml: result }));

    }).fail(function(err) {
        res.send(tpl({ angularServerHtml: err }));
    });

});

module.exports = appServer;