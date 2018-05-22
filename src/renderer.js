const http = require('http');
const jsdom = require("jsdom");

var Renderer = function(original_server){
    this.original_server = original_server; // define original server
}
Renderer.prototype = {
    /*
        generate a promise which retreives the body of a url and renders the DOM of the body
    */
    promise_to_render : async function(path){
        // retreive body
        var options = {
            host : this.original_server.host,
            port : this.original_server.port,
            path : path,
        };
        var body = await this.promise_to_get_body(options);

        // convert body into dom
        var dom = this.parse_html_into_dom(body, this.original_server);

        // wait untill window is loaded
        await dom.window.promise_loaded;

        // wait untill a specifically named promise resolves
        await dom.window.promise_content_rendered;

        // serialize the dom at this point
        var serialization = dom.serialize();

        // return the serialized rendered dom
        return serialization;
    },

    /*
        generate a promise which resolves when the body is received from an HTTP GET request and resolves with the body

            var options = {
                host : original_server.host,
                port : original_server.port,
                path : req.url
            };
    */
    promise_to_get_body : function(options){
        return new Promise((resolve, reject)=>{
            http.get(options, function(res) {
                var body = '';
                res.on('data', function(chunk) {
                    body += chunk;
                });
                res.on('end', function() {
                    resolve(body);
                });
            }).on('error', function(error) {
                reject(error)
            });
        })
    },

    /*
        parse html into dom list and return the dom.
    */
    parse_html_into_dom : function(html, original_server){
        // normalize original server
        if(typeof original_server.protocol == "undefined") original_server.protocol = "http"; // default to http if not defined

        // define optiosn for jsdom
        var dom_options = {
            url: original_server.protocol + "://" + original_server.host + ":" + original_server.port + "/",
            resources: "usable", // load external resources
            runScripts : "dangerously", // enable loading of scripts - dangerously is fine since we are running code we wrote.
            includeNodeLocations: true, // make script tag console.error reporting positions accurate
            beforeParse : function(window) { // set a global variable to mark that the environment is a server_side_rendering environment
                window.currently_rendering_on_server = true;
                window.promise_loaded = new Promise((resolve, reject)=>{ // add a global promise that resolves when window is loaded
                    window.addEventListener('load', resolve);
                })
            },
        };

        // generate dom
        var dom = new jsdom.JSDOM(html, dom_options);

        // return dom
        return dom;
    },

}
module.exports = Renderer;
