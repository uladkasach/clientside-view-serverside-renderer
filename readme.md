# clientside-view-serverside-renderer
This module makes it easy to setup a proxy server capable of rendering clientside content on the server side.

The module defines the functionality capable of extracting the body from any url, parsing the html into dom, evaluating javascript, waiting for all clientside rendering to complete, serializing the resultant dom, and forwarding the results to a client.

INSERT IMAGE DEMONSTRATING HOW SEEMLESSLY IT INTERFACES WITH EXISTING OPERATIONS

### General Overview
The `renderer_server` conducts serverside rendering on select paths before serving the content to a client.
- For paths on the `render_list`, it proxies the html from a `raw` server, renders it (waiting for certain async content), and serves it.
    - the `clientside-view-loader` can then be used to facilitate hydration of the rendered dom
- For paths not on the `render_list`, it proxies the request directly to and from the `console` without any modifications.

### Automated Usage
This module was built in coordination with the `clientside-view-loader` module to facilitate seemless usage of serverside rendering. The `clientside-view-loader` supports selectivly building view components on the server and on the client based on a simple flag. The difference between building on the server and building on the client is really as little as adding one `string` to the clientside-view-loader's `build()` command.

INSERT EXAMPLES

### Manual Usage
This module can also be used manually. One must consider several border cases and constraints. There are several tools created by this module that facilitate overcomming these border cases.

INSERT DESCRIPTION OF BORDER CASES AND CONSTRAINGS
