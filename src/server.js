require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const configviewEngine = require("./config/viewEngine");
const webRoute = require("./routes/web");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const port = process.env.PORT;
const hostname = process.env.HOST_NAME;
const jwt = process.env.JWT_SECRET;

//condig req.body
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies\\
app.use(cors());
app.options("*", cors());

configviewEngine(app);
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});
app.use("/uploads", express.static("uploads"));
app.use("/", webRoute);

app.use("/", productRoutes);

app.use("/", orderRoutes);

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
