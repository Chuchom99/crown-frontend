# crown-frontend

The storefront and admin dashboard for **Crown Solar**, an online shop for solar equipment: panels, inverters, batteries and accessories. Customers can browse products, size a solar system with the built-in quote calculator, and check out. Admins manage the catalogue, orders and users from a dashboard in the same app.

Built with React 18, Vite and Tailwind CSS. The app talks to a separate Node/Express REST API (crown-backend).

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## Features

**Storefront**
- Product catalogue with search, category filters and pagination
- Product detail pages with an image gallery
- Cart that persists in `localStorage`
- Checkout flow that creates orders through the API
- **Solar quote calculator** (`/quote`): enter your appliances or daily kWh usage, backup hours and system type, and get a recommended system you can add to the cart or download as a PDF
- WhatsApp contact links
- About and Contact pages

**Accounts**
- Register and log in with JWT auth (the token is attached to every request)
- Protected account page

**Admin dashboard** (`/admin`, admin role only)
- Dashboard overview
- Manage products (including image uploads), categories, orders and users

## Tech stack

| Area      | Tools                                  |
| --------- | -------------------------------------- |
| UI        | React 18, React Router 6               |
| Styling   | Tailwind CSS 3, PostCSS, Autoprefixer  |
| Build     | Vite 5                                 |
| HTTP      | Axios                                  |
| Icons     | lucide-react                           |
| PDF       | jsPDF                                  |

## Getting started

### Prerequisites

- Node.js 18 or later
- npm
- A running instance of the Crown backend API

### Installation

```bash
git clone https://github.com/Chuchom99/crown-frontend.git
cd crown-frontend
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

The app runs at <http://localhost:5173>.

### Environment variables

| Variable               | Description                                             | Example                  |
| ---------------------- | ------------------------------------------------------- | ------------------------ |
| `VITE_API_URL`         | Base URL of the backend API, with no trailing slash     | `http://localhost:3000`  |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number for contact links, in international format with no `+` | `2348000000000` |
| `VITE_STORE_NAME`      | Store name shown in the UI (optional)                   | `Crown Solar`            |

> The backend must allow the frontend's origin in its CORS config (for example `http://localhost:5173` in development).

## Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the dev server on port 5173        |
| `npm run build`   | Build for production into `dist/`        |
| `npm run preview` | Serve the production build locally       |

## Project structure

```
src/
├── api/          # Axios client with the auth interceptor
├── components/   # Navbar, Footer, ProductCard, shared UI pieces
├── context/      # AuthContext and CartContext providers
├── pages/        # Route-level pages
│   └── admin/    # Admin dashboard pages
├── utils/        # Formatting helpers
├── App.jsx       # Routes and route guards
├── main.jsx      # App entry point
└── styles.css    # Tailwind entry and global styles
```

## API endpoints used

| Method | Endpoint                          | Purpose                    |
| ------ | --------------------------------- | -------------------------- |
| GET    | `/api/products/get-product`       | List products (`search`, `categoryId`, `page`, `limit`) |
| GET    | `/api/products/get-product/:id`   | Get one product            |
| GET    | `/api/categories`                 | List categories            |
| POST   | `/api/users/register`             | Create an account          |
| POST   | `/api/users/login`                | Log in                     |
| POST   | `/api/orders/create-order`        | Place an order             |

## Deployment

Run `npm run build` and deploy the `dist/` folder to any static host (Vercel, Netlify, Render and so on). Set the environment variables in the host's dashboard. Because the app uses client-side routing, configure the host to send all routes to `index.html`.

## Author

**Chuchom99** · [GitHub](https://github.com/Chuchom99)
