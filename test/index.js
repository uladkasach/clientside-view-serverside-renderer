// env constants
process.env.src_root = __dirname + "/../src";
process.env.config_root = __dirname + "/../config";
process.env.test_env_root = __dirname + "/_env"

// testing dependencies
var assert = require("assert");
var fs = require('fs');
var promise_to_read_file = async function(file) {
    return new Promise((resolve, reject)=>{
        fs.readFile(file, 'utf8', function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
}

// unhandled promisses add details:
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise. reason:', reason);
  // application specific logging, throwing an error, or other logic here
});


/*
    test
*/
describe('utils', function(){
    describe('syntax', function(){
        it('should be able to load Renderer', function(){
            // retreive renderer
            var Renderer = require(process.env.src_root + "/renderer.js");
        })
    })
    describe('get_body', function(){
        it('http response body should be equal to file content', async function(){
            var Renderer = require(process.env.src_root + "/renderer.js");
            var promise_to_get_body = Renderer.prototype.promise_to_get_body;
            var options = {
                host : "localhost",
                port : 8181,
                path : "/just_html.html",
            }
            var body = await promise_to_get_body(options);
            var file_content = await promise_to_read_file(process.env.test_env_root + "/just_html.html");
            assert.equal(body, file_content, "body should be equal to file content")
        })
    })
    describe('parse_html_into_dom', function(){
        it('should be able to parse basic html', async function(){
            var Renderer = require(process.env.src_root + "/renderer.js");
            var promise_to_get_body = Renderer.prototype.promise_to_get_body;
            var parse_html_into_dom = Renderer.prototype.parse_html_into_dom;
            var options = {
                host : "localhost",
                port : 8181,
                path : "/just_html.html",
            }
            var html = await promise_to_get_body(options);
            var dom = parse_html_into_dom(html, options);
            var child_length = dom.window.document.body.children.length;
            assert.equal(child_length, 2, "assert two children exist. should be two <p/> tags")
        })
        it('should be able to parse html with sync script', async function(){
            var Renderer = require(process.env.src_root + "/renderer.js");
            var promise_to_get_body = Renderer.prototype.promise_to_get_body;
            var parse_html_into_dom = Renderer.prototype.parse_html_into_dom;
            var options = {
                host : "localhost",
                port : 8181,
                path : "/html_with_sync.html",
            }
            var html = await promise_to_get_body(options);
            var dom = parse_html_into_dom(html, options);
            var child_length = dom.window.document.body.children.length;
            assert.equal(child_length, 3, "assert two children exist. should be 3 <p/> tags")
        })
        it('should be able to parse html with async script - before promise resolves', async function(){
            var Renderer = require(process.env.src_root + "/renderer.js");
            var promise_to_get_body = Renderer.prototype.promise_to_get_body;
            var parse_html_into_dom = Renderer.prototype.parse_html_into_dom;
            var options = {
                host : "localhost",
                port : 8181,
                path : "/html_with_async.html",
            }
            var html = await promise_to_get_body(options);
            var dom = parse_html_into_dom(html, options);
            var child_length = dom.window.document.body.children.length;
            assert.equal(child_length, 2, "assert two children exist. should be two <p/> tags")
        })
        it('should be able to parse html with async script - after promise resolves', async function(){
            var Renderer = require(process.env.src_root + "/renderer.js");
            var promise_to_get_body = Renderer.prototype.promise_to_get_body;
            var parse_html_into_dom = Renderer.prototype.parse_html_into_dom;
            var options = {
                host : "localhost",
                port : 8181,
                path : "/html_with_async.html",
            }
            var html = await promise_to_get_body(options);
            var dom = parse_html_into_dom(html, options);
            var child_length = dom.window.document.body.children.length;
            assert.equal(child_length, 2, "assert two children exist. should be two <p/> tags")
            await dom.window.promise_content_rendered;
            var child_length = dom.window.document.body.children.length;
            assert.equal(child_length, 5, "assert two children exist. should be 5 <p/> tags")
        })
        it('should be able to parse html - async, after promise resolves', async function(){
            var Renderer = require(process.env.src_root + "/renderer.js");
            var promise_to_get_body = Renderer.prototype.promise_to_get_body;
            var parse_html_into_dom = Renderer.prototype.parse_html_into_dom;
            var options = {
                host : "localhost",
                port : 8181,
                path : "/html_with_async.html",
            }
            var html = await promise_to_get_body(options);
            var dom = parse_html_into_dom(html, options);
            var child_length = dom.window.document.body.children.length;
            assert.equal(child_length, 2, "assert two children exist. should be two <p/> tags")
            await dom.window.promise_content_rendered;
            var child_length = dom.window.document.body.children.length;
            assert.equal(child_length, 5, "assert 5 children exist. should be 5 <p/> tags")
        })
        it('should be able to parse html - async, not waited for part', async function(){
            var Renderer = require(process.env.src_root + "/renderer.js");
            var promise_to_get_body = Renderer.prototype.promise_to_get_body;
            var parse_html_into_dom = Renderer.prototype.parse_html_into_dom;
            var options = {
                host : "localhost",
                port : 8181,
                path : "/html_with_async_not_waited.html",
            }
            var html = await promise_to_get_body(options);
            var dom = parse_html_into_dom(html, options);
            var child_length = dom.window.document.body.children.length;
            assert.equal(child_length, 2, "assert two children exist. should be two <p/> tags")
            assert(typeof dom.window.promise_content_rendered != "undefined", "the promise_content_rendered variable should be defined")
            await dom.window.promise_content_rendered;
            var child_length = dom.window.document.body.children.length;
            assert.equal(child_length, 4, "assert 4 children exist.")
            var not_waited_for_was_rendered = (dom.window.document.querySelectorAll("img").length > 0); // not waited for part generates the img tag
            /*
                NOTE: this test demonstrates that even if content is not waited for it will still be rendered.
            */
        })
        it('should be able to parse html - async, excluded render part', async function(){
            var Renderer = require(process.env.src_root + "/renderer.js");
            var promise_to_get_body = Renderer.prototype.promise_to_get_body;
            var parse_html_into_dom = Renderer.prototype.parse_html_into_dom;
            var options = {
                host : "localhost",
                port : 8181,
                path : "/html_with_async_with_exclusion.html",
            }
            var html = await promise_to_get_body(options);
            var dom = parse_html_into_dom(html, options);
            var child_length = dom.window.document.body.children.length;
            assert.equal(child_length, 2, "assert two children exist. should be two <p/> tags");
            await dom.window.promise_content_rendered;
            var child_length = dom.window.document.body.children.length;
            assert.equal(child_length, 3, "assert 3 children exist. should be 3 <p/> tags");
            var excluded_part_was_rendered = (dom.window.document.querySelectorAll("img").length > 0); // excluded part generates the img tag
            assert.equal(excluded_part_was_rendered, false, "excluded part should not have been waited")
        })
        it('should wait untill window is loaded to wait for the promise_content_rendered parameter') // relevant since dom returns before all script tags are evaluated
    })
})
