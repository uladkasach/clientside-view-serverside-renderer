1. server_renderer is called for arbitrary URL by a proxy.  
2. server_renderer takes the `url` requested by the client (through the proxy) and extracts the HTML provided by the `original_server` at that `url`  
    - var html = STRING
3. server_renderer uses JSDOM to evaluate all JS and create the fully rendered DOM.
    - (p) possible to only render on server elements which are 'hydratable' ?
    - (p) how to evaluate whether to expect to hydrate an element or not ?
4. server_renderer `serializes` the html JSDOM has rendered, and sends it to the client
    - DOM to hydrate is clearly marked
        - a JSON object is appended to end, `hydration_list`
            - hydrationlist defines each element to hydrate by unique `hydration-id`
            - each `hydration-id` is associated with a `hydrator`
                - hydrator takes a DOM element and `hydrates` it
                - hydrators ***should*** be used to hydrate the raw DOM that is rendered on clientside to maintain continuity
    - scripts that would have rendered the DOM know not to render it anymore
        - rendering scripts are removed from final rendered HTML served to client
5. client uses `hydration_list` to hydrate all required DOM.
    - (p) hydration dependencies - wait conditions
        - may need the `hydration_list` to define dependencies and build a promise chain for each hydration_chain which waits to begin hydration of the element until all of its dependencies are hydrated
    - bundling and serving:
        - hydration_manager is automatically injected into the client
        - all JS is bundled linked into client with one <script> tag
        - all CSS is bundled linked into client with one <style> tag
        - (note) we bundle and link rather than bundle and inject to support parallel resource downloads + clientside-caching

----------

p. how to render some content and not others?
    - e.g., on client, make a parameter that only resolves in browser and not in JSDOM environment
        - e.g., before loading content provision JSDOM environment for "prerendering" / "server-side-rendering"
        - some renderings resolve when they see that environment has it, some do not and keep waiting / fail
