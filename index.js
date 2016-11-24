/**
 * Created by lifayu on 16/7/8.
 */

var fs = require('fs');
var vueify = require('vueify');
var u = require('underscore');
module.exports = function (compileOptions, encoding) {

    encoding = encoding || 'utf8';
    return function (context) {
        var docRoot = context.conf.documentRoot;
        var pathname = context.request.pathname;
        var file = docRoot + pathname.replace(/\.js$/, '');
        context.stop();
        if (fs.existsSync(file)) {
            var content = fs.readFileSync(file, encoding);
            vueify.compiler.applyConfig(u.extend({
                babel: {
                    presets: ['es2015'],
                    plugins: []
                }
            }, compileOptions));
            vueify.compiler.compile(content, file, function (err, result) {
                if (!err) {
                    context.content = 'define(function(require, exports, module){\n' + result + '\n});';
                    // context.content = result;
                    context.start();
                }
                else {
                    console.log(err);
                    context.status = 500;
                    context.start();
                }
            });
        }
        else {
            context.status = 404;
            context.start();
        }
    }
};