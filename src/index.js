process.env.config_root = __dirname + "/../config";
const express = require('express');
const app = express();
const original_server = require(process.env.config_root + "/original_server.json");
const render_list = require(process.env.config_root + "/render_list.json");
const proxy = require('express-http-proxy');
const Renderer = require('./renderer.js');


// define renderer
const renderer = new Renderer(original_server);

/*
    if on render list, render the DOM
*/
app.get(render_list, (req, res)=>{
    console.log("rendering dom on server, url : " + req.url);
    renderer
        .promise_to_render(req.url)
        .then((serialized_render)=>{
            res.send(serialized_render);
        })
})

/*
    if not caught by the render_list, simply proxy it back
*/
app.use(proxy(original_server.protocol + "://" + original_server.host + ":" + original_server.port));

// start server
var port_number = 1112;
app.listen(port_number, () => console.log('Listening on localhost:' + port_number))
