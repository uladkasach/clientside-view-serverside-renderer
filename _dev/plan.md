1. <s> server_renderer is called for arbitrary URL by a proxy.  
2. <s> server_renderer takes the `url` requested by the client (through the proxy) and extracts the HTML provided by the `original_server` at that `url`  
    - var html = STRING
3. server_renderer uses JSDOM to evaluate all JS and create fully rendered DOM
    - <s> renders DOM
    - <s> renders dom from scripts
    - <s> waits for predefined async operations to complete
        - `promise_content_rendered`
    - <s> supports certain content not rendering in server_side_rendering environment
        - `window.server_side_rendering=true` in server_side_rendering environment
4. clientside-view-loader will handle rendering_location completely.
    - for clientside rendererd dom, appends the `promise_not_server_rendered` promise to view creation chain
    - for serverside rendered dom,
        1. creates a unique id for the element
            - must persist across duplicate loads
            - must be created on server then found again on client
                - can keep global variable, but how to know which dom generated it?
            - must also be creatable on client
        2. checks if element was rendered already based on the id
        3. if rendered - hydrate. if not rendered - render.
