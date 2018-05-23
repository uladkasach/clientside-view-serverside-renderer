var assert = require("assert");
var testing_port = 7777;
var original_server = {
    protocol : "http",
    host : "localhost",
    port : testing_port,
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

describe('clientside_view_loader', function(){
    // it('should wait on the clientside_require.asynchronous_require("clientside-view-loader") promise, if exists')
    it('should not render a view if requested to be rendered on client', async function(){
        var Renderer = require(process.env.src_root + "/renderer.js");
        var renderer = new Renderer(original_server);
        var dom = await renderer.promise_to_render("/src/clientside_view_loader/client_only.html");
        var client_only_node = dom.window.document.querySelector(".basic_client_render");
        assert.equal(client_only_node, null);
    })
    it('should render a view if requested to be rendered on server', async function(){
        var Renderer = require(process.env.src_root + "/renderer.js");
        var renderer = new Renderer(original_server);
        var dom = await renderer.promise_to_render("/src/clientside_view_loader/server_only.html");
        var server_render_node = dom.window.document.querySelector(".basic_server_render");
        assert.equal(server_render_node.innerHTML, "hello!");
    })
    it('should render the `server` views but not `client` views', async function(){
        var Renderer = require(process.env.src_root + "/renderer.js");
        var renderer = new Renderer(original_server);
        var dom = await renderer.promise_to_render("/src/clientside_view_loader/server_and_client.html");

        // check client was not rendered
        var client_only_node = dom.window.document.querySelector(".basic_client_render");
        assert.equal(client_only_node, null);

        // check server was rendered
        var server_render_node = dom.window.document.querySelector(".basic_server_render");
        assert.equal(server_render_node.innerHTML, "hello!");
    })
})
