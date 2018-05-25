# clientside-view-serverside-renderer
This module makes it easy to setup a proxy server capable of rendering clientside content on the server side. When used in conjunction with the `clientside-view-loader`, changing client rendering to server rendering is as simple as adding the string `"server"` as a flag.

##### Proxy Setup Example

##### Usage Example
The following example demonstrates how seamlessly this module enables rendering on the server.

1. rendering on client
```js
    view_loader.load(path_to_view).build(build_options);
```

2. rendering on server
```js
    view_loader.load(path_to_view).build(build_options, "server");
```

# Overview


The `renderer_server` conducts server-side rendering on select paths before serving the content to a client.
- For paths on the `render_list`, it proxies the html from a `raw` server, renders it (waiting for certain async content), and serves it.
    - the `clientside-view-loader` can then be used to facilitate hydration of the rendered dom
- For paths not on the `render_list`, it proxies the request directly to and from the `console` without any modifications.


# Usage Overview

This section documents an overview of using the server-side rendering functionality. It particularly covers automated usage, which utilizes the `clientside-view-loader` to seamlessly integrate server-side rendering into a client-side application.

## Automated Usage
This module was built in coordination with the `clientside-view-loader` module to facilitate seemless usage of serverside rendering. The `clientside-view-loader` supports selectivly building view components on the server and on the client based on a simple flag. The difference between building on the server and building on the client is really as little as adding one `string` to the clientside-view-loader's `build()` command.


##### Example
The following example will demonstrate how seamlessly this module enables rendering on the server.

1. rendering on client
```js
    view_loader.load(path_to_view).build(build_options);
```

2. rendering on server
```js
    view_loader.load(path_to_view).build(build_options, "server");
```

## Manual Usage
This module can also be used manually. One must consider several border cases and constraints. There are several tools created by this module that facilitate overcoming these border cases.

These border cases and constraints are outlined in the following [ Client-Side Usage Considerations]() section.

# Components

## Proxy

This module provides a proxy server capable of seamlessly integrating with any existing server to render views on the server.

INSERT IMAGE DEMONSTRATING HOW SEEMLESSLY IT INTERFACES WITH EXISTING OPERATIONS


## Rendering

The proxy server retreives HTML from any server and evaluates all client-side JS on the server. The HTML resultant by any changes JS has made to the DOM is then forwarded to the client.

The rendering service utilizes JSDOM as the headless browser. Rendering waits until all promises specified to the `content_rendered_manager` are resolved to determine when asynchronous rendering has completed.

# Client-Side Usage Considerations

Client-side developers must take care in considering three aspects to ensure ideal server-side rendering of client-side code. This module supports both a manual and a seamless integration. The manual integration requires the developers to consider these three aspects on their own. The seemless integration leverages the `clientside-view-loader` view library to automatically handle these considerations for them.


### Duplicate Rendering

Special care must be considered to ensure that views that are not intended to be rendered on the server are not rendered by the server. Otherwise, certain views would be rendered on both the client and the server.

##### Seamless Integration
The `clientside-view-loader` module ensures that views intended to be rendered on the client are not rendered on the server automatically.

##### Manual Integration
For manual integrations, the rendering service provisions the JSDOM rendering environment with the global property `currently_rendering_on_server`. Client-side JS should skip rendering any views ment to be rendered on the client when they see this property set to `true`.

### Waiting for Asynchronous Rendering

As mentioned in the [rendering](#Rendering) section, the rendering service waits for a specific promise to resolve to ensure that all asynchronous code has rendered. This promise is generated through the `content_rendered_manager` object, provisioned in the rendering environment.

##### Seamless Integration

The `clientside-view-loader` module provides and has seamless support for server side rendering. By using the `clientside-view-loader`, developers do not need to consider ensuring that the rendering server waits for async rendering to complete.   All `clientside-require` `load()` requests are waited for on the server. Additionally, all `clientside-view-loader` `view()` and `build()`.


##### Manual Integration
For manual integrations, the rendering service provisions the JSDOM rendering environment with the global object `content_rendered_manager`. Client-side JS should ensure that the `content_rendered_manager` waits for any asynchronous rendering js to complete by utilizing the `wait_for()` method. Example:

```js
if(typeof window.content_rendered_manager == "object")
    window.content_rendered_manager.wait_for(a_rendering_promise);
```



### Hydration

Special care has to be taken by the client-side JS code as when the client receives the rendered DOM, any ["hydration"]() that the JS code conducts on the server will not be present on the client. Therefore, special care must be taken to hydrate any rendered DOM.

##### Seamless Integration

The `clientside-view-loader` module provides seamless support for serverside rendering. The module automatically detects whether a view needs to be rendered, hydrated, or both on run time.

By utilizing the `clientside-view-loader`, developers to not need to consider which elements to hydrate with what code - given the view is rendered on the server in the first place.
