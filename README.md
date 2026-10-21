**English** | [Русский](/README.ru.md)

# Stellar Burgers — a Space Burger Joint

Stellar Burgers is a SPA built with React + TypeScript where users can assemble their own burger, place an order, browse the order feed and their order history, and manage their profile.

## 💻[Demo](https://yaylnt.github.io/stellar-burgers/)

Order feed and burger constructor

https://github.com/user-attachments/assets/5fc587e9-9da9-4485-89ad-072cb6bfbe16

Registration

https://github.com/user-attachments/assets/b3e99581-e528-47fc-b26b-7036ee5f01c0

Order process

https://github.com/user-attachments/assets/a66bbf8c-dee1-4989-9157-03c6fbb364fa

## Features

- burger constructor with adding, removing and reordering ingredients;
- order placement for authenticated users;
- registration, login and password recovery;
- protected routes and a personal account area;
- order feed and the user's order history;
- viewing ingredients and orders in modal windows;
- editing profile data;
- handling loading and error states when working with the API.

## Tech Stack

| React<br>TypeScript<br>Redux Toolkit<br>React Router<br>Jest<br>Playwright<br>Webpack<br>GitHub Actions | [![Technology stack](https://skillicons.dev/icons?i=ts,react,redux,webpack,jest)](https://skillicons.dev/icons?i=ts,react,redux,webpack,jest) |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |

## My Contribution

- Implemented routing with React Router, including dynamic and protected routes, a 404 page and modal routing.
- Implemented authentication and protection of private routes using access/refresh tokens.
- Built the global application state with Redux Toolkit: slices, selectors and asynchronous `createAsyncThunk` actions.
- Implemented the logic of the burger constructor, order placement, the order feed and order history.
- Implemented user profile handling: loading, editing and saving data.
- Wrote unit tests with Jest and integration tests with Playwright; for the e2e tests I used HAR-based API mocks and test authentication.
- Set up CI/CD with GitHub Actions: lint, TypeScript type-check, tests, production build and automatic deployment to GitHub Pages.

## Testing

### Jest

Redux reducers and their states are tested for both synchronous and asynchronous actions.

```
npm test
```

To view coverage:

```
npm run test:coverage
```

### Playwright

Integration tests cover the main user scenarios of the constructor and order placement.

```
npm run pl
```

## Installation and Running

Clone the repository and install dependencies:

```
npm install
```

Create a `.env` file based on `.env.example` and set the API URL:

```
BURGER_API_URL=...
```

Start the project in development mode:

```
npm run start
```

The app will be available locally at `http://localhost:4000`.

## Production Build

```
npm run build
```