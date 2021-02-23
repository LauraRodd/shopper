const express = require("express"),
  bodyParser = require("body-parser"),
  cookieSession = require("cookie-session");

// Routers
const authRouter = require("./routes/admin/auth"),
  adminProductsRouter = require("./routes/admin/products"),
  productsRouter = require("./routes/products"),
  cartsRouter = require("./routes/carts");

const app = express();

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["sdfsdfsdf"],
  })
);
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

app.listen(3000, () => {
  console.log("Listening");
});
