# Solar Dealer Storefront (React + Tailwind)

A modern **white + orange** e-commerce frontend that connects to your existing Node/Express backend (the zip you shared).

## Quick start

```bash
cd solar-dealer-storefront
npm install
cp .env.example .env
npm run dev
```

Open: `http://localhost:5173`

## Configure backend URL

Edit `.env`:

```bash
VITE_API_URL=http://localhost:3000
```

> Tip: remove any trailing slash.

## Backend endpoints used

This UI calls these routes:

- Products
  - `GET /api/products/get-product` (supports `search`, `categoryId`, `page`, `limit`)
  - `GET /api/products/get-product/:id`
- Categories
  - `GET /api/categories`
- Auth
  - `POST /api/users/register`
  - `POST /api/users/login`
- Orders (Checkout)
  - `POST /api/orders/create-order`

## Important notes about the backend zip you uploaded

1) **CORS**
Your backend currently allows:
- `https://hairsbyfunky.com`
- `http://localhost:3000`

This frontend runs on `http://localhost:5173` by default.
So you must add `http://localhost:5173` to your backend `corsOptions.origin` array (or change the frontend port).

2) **Order creation controller export**
Your `src/routes/orderRoutes.js` imports `createOrder` from `../controllers/ordercontroller`,
but the `ordercontroller.js` in the zip only exports `{ notifyPaymentCompleted, confirmPayment }`.

If your production backend already has `createOrder`, you're fine.
If not, you'll need to add `createOrder` and export it for checkout to work.

3) **Product images path**
`productController` saves images to URLs like `/Uploads/<filename>` and the server serves `/Uploads` statically.
But `multer` in `routes/productroutes.js` uploads to `./routes/uploads` (different folder).
If images don’t show, align the upload destination with the static `/Uploads` folder.

## What’s included in the UI

- Modern homepage (hero + features + CTA)
- Product listing with:
  - search
  - category filter
  - pagination
- Product detail page with image gallery
- Cart (localStorage)
- Checkout form (posts order payload)
- Login / Register
- Account screen

## Next upgrades (easy)
If you want to finish in one day, these are the fastest wins:
- Add an **Admin dashboard** (create category/product, upload images)
- Add a **payment method selector** using `/api/payment-method/get-payment-method`
- Add order tracking page (if backend has a customer orders endpoint)

Tell me what your **solar product categories** are (e.g., Panels / Inverters / Batteries / Accessories),
and whether you want an admin panel on the frontend—I'll wire it up.
# crown-frontend
# crown-frontend
