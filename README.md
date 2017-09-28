# Howto

## Backend

- `cd backend`
- `npm i`
- `npm run watch`

## Frontend

- `cd frontend`
- `npm i`
- `npm run develop`

Open `http://localhost:3001`. It will fail, sending the error to the backend.
The backend will fetch the source map naively (appending `.map` to the
javascript file), load it, transform the error the best it can, and print it.
