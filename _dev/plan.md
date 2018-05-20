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
4. server and client rendering work together to mark which content is rendered (and only needs hydrating)
    - server side loaded dom is marked
    - server side loaded content is not re-rendered
    - server side is only hydrated
