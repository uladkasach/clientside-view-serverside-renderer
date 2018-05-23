var assert = require("assert");
var testing_port = 7777;

describe('basic', function(){
    it('should be able to parse basic html', async function(){
        var Renderer = require(process.env.src_root + "/renderer.js");
        var promise_to_get_body = Renderer.prototype.promise_to_get_body;
        var parse_html_into_dom = Renderer.prototype.parse_html_into_dom;
        var options = {
            host : "localhost",
            port : testing_port,
            path : "/src/basic/just_html.html",
        }
        var html = await promise_to_get_body(options);
        var dom = parse_html_into_dom(options.path, html, options);
        var child_length = dom.window.document.body.children.length;
        assert.equal(child_length, 2, "assert two children exist. should be two <p/> tags")
    })
    it('should be able to parse html with sync script', async function(){
        var Renderer = require(process.env.src_root + "/renderer.js");
        var promise_to_get_body = Renderer.prototype.promise_to_get_body;
        var parse_html_into_dom = Renderer.prototype.parse_html_into_dom;
        var options = {
            host : "localhost",
            port : testing_port,
            path : "/src/basic/html_with_sync.html",
        }
        var html = await promise_to_get_body(options);
        var dom = parse_html_into_dom(options.path, html, options);
        var child_length = dom.window.document.body.children.length;
        assert.equal(child_length, 3, "assert two children exist. should be 3 <p/> tags")
    })
    it('should be able to parse html with async script - before promise resolves', async function(){
        var Renderer = require(process.env.src_root + "/renderer.js");
        var promise_to_get_body = Renderer.prototype.promise_to_get_body;
        var parse_html_into_dom = Renderer.prototype.parse_html_into_dom;
        var options = {
            host : "localhost",
            port : testing_port,
            path : "/src/basic/html_with_async.html",
        }
        var html = await promise_to_get_body(options);
        var dom = parse_html_into_dom(options.path, html, options);
        var child_length = dom.window.document.body.children.length;
        assert.equal(child_length, 2, "assert two children exist. should be two <p/> tags")
    })
    it('should be able to parse html with async script - after promise resolves', async function(){
        var Renderer = require(process.env.src_root + "/renderer.js");
        var promise_to_get_body = Renderer.prototype.promise_to_get_body;
        var parse_html_into_dom = Renderer.prototype.parse_html_into_dom;
        var options = {
            host : "localhost",
            port : testing_port,
            path : "/src/basic/html_with_async.html",
        }
        var html = await promise_to_get_body(options);
        var dom = parse_html_into_dom(options.path, html, options);
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
            port : testing_port,
            path : "/src/basic/html_with_async.html",
        }
        var html = await promise_to_get_body(options);
        var dom = parse_html_into_dom(options.path, html, options);
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
            port : testing_port,
            path : "/src/basic/html_with_async_not_waited.html",
        }
        var html = await promise_to_get_body(options);
        var dom = parse_html_into_dom(options.path, html, options);
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
            port : testing_port,
            path : "/src/basic/html_with_async_with_exclusion.html",
        }
        var html = await promise_to_get_body(options);
        var dom = parse_html_into_dom(options.path, html, options);
        var child_length = dom.window.document.body.children.length;
        assert.equal(child_length, 2, "assert two children exist. should be two <p/> tags");
        await dom.window.promise_content_rendered;
        var child_length = dom.window.document.body.children.length;
        assert.equal(child_length, 3, "assert 3 children exist. should be 3 <p/> tags");
        var excluded_part_was_rendered = (dom.window.document.querySelectorAll("img").length > 0); // excluded part generates the img tag
        assert.equal(excluded_part_was_rendered, false, "excluded part should not have been waited")
    })
    it('should wait until window is loaded to wait for the promise_content_rendered parameter') // relevant since dom returns before all script tags are evaluated
    it('should be able to render dom in one command', async function(){
        var Renderer = require(process.env.src_root + "/renderer.js");
        var original_server = {
            protocol : "http",
            host : "localhost",
            port : testing_port,
        }
        var renderer = new Renderer(original_server);
        var dom = await renderer.promise_to_render("/src/basic/just_html.html");
        var child_length = dom.window.document.body.children.length;
        assert.equal(child_length, 2, "assert two children exist. should be two <p/> tags")
    })
})
