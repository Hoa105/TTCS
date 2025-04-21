const express = require("express");
const {
  getHomepage,
  ABC,
  getCreat,
  getUpdate,
  postUpdate,
  postDelete,
  postHandleDelete,
  postLogin,
  postRegister,
  postChangePass,
} = require("../controllers/homeController");
const router = express.Router();

router.get("/", getHomepage);
router.get("/api/users", async (req, res) => {
  try {
    const users = await getAllUser();
    res.status(200).json({ users }); // trả về JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng" });
  }
});

router.get("/creat", getCreat);

// router.get("/update/:id", getUpdate);

router.post("/creat-user", ABC);

router.post("/update-user/:id", postUpdate);

router.post("/change-password/:id", postChangePass);

router.post("/delete-user/:id", postDelete);

router.post("/delete-user", postHandleDelete);

// const router = express.Router();

router.post("/register", postRegister);
router.post("/login", postLogin);
// router.post('/verify-otp', authController.verifyOtp);
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/refresh-token', authController.refreshToken);

// module.exports = router;

module.exports = router;
