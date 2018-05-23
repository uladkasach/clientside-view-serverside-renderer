process.env.config_root = __dirname + "/../config";
var Render_Server = require("clientside-view-serverside-renderer");
var render_list = require(process.env.config_root + "/render_list.json");
var original_server = require(process.env.config_root + "/original_server.json");
var render_server = new Render_Server(render_list, original_server)
render_server.start(8181);
