# ShopEasy: E-commerce Demo Store

A front-end e-commerce demo built with plain HTML, CSS and JavaScript. No build step and no dependencies.

## Features

- Product grid with search, category filter and sorting
- Shopping cart drawer with quantity controls and live total
- Cart saved in `localStorage` (survives page refresh)
- Responsive layout
- Demo checkout (no real payments)

## Project structure

```
ecommerce/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run locally

Open `index.html` in any browser.

## Customize

Edit the `PRODUCTS` array at the top of `script.js` to add your own products (`id`, `name`, `category`, `price`, `emoji`).

## Deploy on GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Branch**, choose `main` and `/ (root)`, then **Save**.
4. Your site will be live at `https://<username>.github.io/<repo>/`.

## Note

This is a front-end demo only. A real store needs a backend, a database and a payment gateway (for example Razorpay or Stripe).

## License

MIT
