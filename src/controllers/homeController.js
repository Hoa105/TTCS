const { name } = require("ejs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const connection = require("../config/database");
const {
  getAllUser,
  getUserById,
  updateUserId,
  deleteUserId,
  getUserByEmail,
  createUser,
  updatePass,
} = require("../services/CRUDService");
// const { get } = require('../routes/web');

const getHomepage = async (req, res) => {
  try {
    const users = await getAllUser();
    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng" });
  }
};

const ABC = async (req, res) => {
  // console.log(req.body);
  let email = req.body.email;
  let name = req.body.name;
  let city = req.body.city;
  let [results, fields] = await connection.query(
    `INSERT INTO 
        Users (email, name, city)
        VALUES(?, ?, ?); `,
    [email, name, city]
  );
  res.send("Creart Success");
};
const getCreat = (req, res) => {
  return res.render("create.ejs");
};
const getUpdate = async (req, res) => {
  const userId = req.params.id;
  let user = await getUserById(userId);
  return res.render("edit.ejs", { userEdit: user });
};

const postUpdate = async (req, res) => {
  let email = req.body.email;
  let name = req.body.name;
  let username = req.body.username;
  let phone = req.body.phone;
  let address = req.body.address;
  let userId = req.params.id;

  await updateUserId(name, username, phone, email, address, userId);

  const [rows] = await connection.query("SELECT * FROM Users WHERE id = ?", [
    userId,
  ]);

  // Trả lại dữ liệu user mới cho frontend
  return res.status(200).json(rows[0]);
};

const postChangePass = async (req, res) => {
  let password = req.body.password;
  let userId = req.params.id;
  await updatePass(password, userId);
  res.redirect("/");
};

const postDelete = async (req, res) => {
  const userId = req.params.id;
  let user = await getUserById(userId);
  res.render("delete.ejs", { userEdit: user });
};

const postHandleDelete = async (req, res) => {
  const userId = req.body.userId;
  await deleteUserId(userId);
  res.redirect("/");
};

// // Đăng ký tài khoản
const postRegister = async (req, res) => {
  try {
    let users = {
      email: req.body.email,
      name: req.body.name,
      username: req.body.username,
      phone: req.body.phone,
      password: req.body.password,
      address: req.body.address,
    };
    const hashedPassword = await bcrypt.hash(users.password, 10);

    // Kiểm tra email đã tồn tại chưa
    const userResult = await getUserByEmail(users.email);

    if (userResult && userResult.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    await createUser(
      users.name,
      users.username,
      users.phone,
      users.email,
      hashedPassword,
      users.address
    );

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

const postLogin = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    console.log("Email nhận được:", email);

    // Lấy user từ database dựa trên email
    const userResult = await getUserByEmail(email);
    console.log("User tìm thấy:", userResult);

    // Kiểm tra nếu không tìm thấy user
    if (!userResult || userResult.length === 0) {
      return res.status(401).json({ message: "Tài khoản không tồn tại!" });
    }

    const user = userResult[0]; // User tìm thấy

    // So sánh mật khẩu người dùng nhập vào với mật khẩu trong database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai mật khẩu!" });
    }

    // Sau khi đăng nhập thành công, tạo token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// // Xác thực OTP (sẽ cập nhật sau)
// exports.verifyOtp = async (req, res) => {
//     res.json({ message: "Chức năng xác thực OTP chưa triển khai!" });
// };

// // Quên mật khẩu (sẽ cập nhật sau)
// exports.forgotPassword = async (req, res) => {
//     res.json({ message: "Chức năng quên mật khẩu chưa triển khai!" });
// };

// // Refresh Token (sẽ cập nhật sau)
// exports.refreshToken = async (req, res) => {
//     res.json({ message: "Chức năng refresh token chưa triển khai!" });
// };

module.exports = {
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
};
