The `console_render_proxy` conducts server side rendering on select paths before serving the clientside.
- For paths on the `render_list`, it requests the html from the `console` server, renders it (waiting for certain async content), and serves it with hydration.
- For paths not on the `render_list`, it forwards the request directly to the `console`.
- In all cases, it acts like a proxy.
