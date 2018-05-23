// env constants
process.env.src_root = __dirname + "/../src";
process.env.config_root = __dirname + "/../config";
process.env.test_env_root = __dirname + "/_env"
var testing_port = 7777;

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
                port : testing_port,
                path : "/src/basic/just_html.html",
            }
            var body = await promise_to_get_body(options);
            var file_content = await promise_to_read_file(process.env.test_env_root + "/src/basic/just_html.html");
            assert.equal(body, file_content, "body should be equal to file content")
        })
    })
    describe('parse_html_into_dom', function(){
        require("./basic")
        require("./clientside_view_loader");
    })
})
