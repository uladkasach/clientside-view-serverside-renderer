const express = require('express');
const proxy = require('express-http-proxy');
const Renderer = require('./renderer.js');


var Render_Server = function(render_list, original_server){
    // define renderer
    this.renderer = new Renderer(original_server);

    // define app
    this.app = express();
    this.initialize_express_app(this.app, render_list, original_server);
}
Render_Server.prototype = {
    initialize_express_app : function(app, render_list, original_server){
        /*
            log when request is received
        */
        app.use((req, res, next)=>{
            // console.log("retreived request :" + req.url);
            next();
        })

        /*
            if on render list, render the DOM
        */
        /*
            // TODO: USE PROXY TO FORWARD HEADERS BACK AND FORTH - USE userResDecorator TO MODIFY (render) THE RESULT BEFORE RESPONDING TO USER

            app.use('/proxy', proxy('www.google.com', {
                userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
                    data = JSON.parse(proxyResData.toString('utf8'));
                    data.newProperty = 'exciting data';
                    return JSON.stringify(data);
                }
            }));
        */
        app.get(render_list, (req, res)=>{
            console.log(" `-> rendering dom on server");
            this.renderer
                .promise_serialized_render(req.url)
                .then((serialized_render)=>{
                    res.send(serialized_render);
                })
        })

        /*
            if not caught by the render_list, simply proxy it back
        */
        app.use(proxy(original_server.protocol + "://" + original_server.host + ":" + original_server.port));
    },
    start : function(port_number){
        if(typeof port_number == "undefined") port_number = 3000;
        this.app.listen(port_number, () => console.log('render server listening on localhost:' + port_number))
    }
}
module.exports = Render_Server;
