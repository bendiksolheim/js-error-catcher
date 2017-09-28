# What is this?

This is an attempt to create a poor mans system for catching and understanding
javascript errors. It consists of two parts

- A browser script which registers itself on `window.onerror` and sends errors
  to a backend
- A backend which receives errors, tries to fetch the source map (very naively)
  for the file the error comes from, transform the error, and log it.

## Howto

### Backend

- `cd backend`
- `npm i`
- `npm run watch`

### Frontend

- `cd frontend`
- `npm i`
- `npm run develop`

Open `http://localhost:3001`. It will fail, sending the error to the backend.
The backend will fetch the source map naively (appending `.map` to the
javascript file), load it, transform the error the best it can, and print it.
