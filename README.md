# linkedFol.io

## Development

Make sure to install Deno: https://deno.land/manual/getting_started/installation

Then start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

## TODO

- fetch linkedin userinfo with access token to create a session with user data
  - use some unique user info as identifier
- create a middleware for protected routes that ensures a user is logged in
- set cookie to same ttl as accesstoken from linkedin

- create a route that lets a user upload its data as zip format
- unpack this data
- store raw data in kv store

- create a dynamic route that fetches user data from kv store and renders
  website

- prettify all of that!
