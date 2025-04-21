const express = require("express");
const router = express.Router();
const upload = require("../config/upload");
const {
  getProductpage,
  getProductId,
  PostCreaeteProduct,
  postUpdateProduct,
  postHandleDeleteProduct,
} = require("../controllers/productController");
// const db = require("../db");

// API lấy danh sách sản phẩm
router.get("/products", getProductpage);

router.get("/products/:id", getProductId);

router.post("/create-product", upload.single("image"), PostCreaeteProduct);

router.post("/update-product/:id", upload.single("image"), postUpdateProduct);

router.post("/delete-product/:id", postHandleDeleteProduct);

module.exports = router;
