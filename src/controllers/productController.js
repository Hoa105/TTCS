const { name } = require("ejs");
const connection = require("../config/database");
const cloudinary = require("../config/cloudinary");

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../services/CRUDProducts");

const getProductpage = async (req, res) => {
  try {
    const results = await getAllProducts();
    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm" });
  }
};

const getProductId = async (req, res) => {
  const productId = req.params.id;
  try {
    const results = await getProductById(productId);
    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm theo ID" });
  }
};

const PostCreaeteProduct = async (req, res) => {
  const { name, description, price, material, category } = req.body;
  const image = req.file;

  try {
    let imageUrl = "";

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image.path, {
        upload_preset: "online-shop",
      });
      imageUrl = uploadedResponse.secure_url;
    }

    await createProduct(name, description, price, material, category, imageUrl);
    res.status(200).json({ message: "Product created successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to create product", error: err.message });
  }
};
// const ABC = async (req, res) => {
//     // console.log(req.body);
//     let email = req.body.email;
//     let name = req.body.name;
//     let city = req.body.city;
//     let[results, fields] = await connection.query(
//         `INSERT INTO
//         Users (email, name, city)
//         VALUES(?, ?, ?); `,
//         [email, name, city]
//     );
//     res.send("Creart Success")
// }
// const getCreat = (req, res) => {
//     return res.render('create.ejs')
// }
// const getUpdate = async (req, res) => {
//     const userId = req.params.id;
//     let user = await getUserById(userId);
//     return res.render('edit.ejs', {userEdit: user})
// }

const postUpdateProduct = async (req, res) => {
  const { name, description, price, material, category } = req.body;
  const productId = req.params.id;
  const image = req.file;

  try {
    let imageUrl = "";

    // Nếu không có file, dùng ảnh cũ từ DB
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image.path, {
        upload_preset: "online-shop",
      });
      imageUrl = uploadedResponse.secure_url;
    } else {
      // Fetch ảnh cũ từ DB nếu không upload ảnh mới
      const [oldProduct] = await connection.query(
        "SELECT image FROM Products WHERE id = ?",
        [productId]
      );
      imageUrl = oldProduct[0]?.image || ""; // lấy lại ảnh cũ
    }

    await updateProduct(
      name,
      description,
      price,
      material,
      category,
      imageUrl,
      productId
    );
    res.status(200).json({ message: "Product created successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to create product", error: err.message });
  }
};

// const postDelete = async (req, res) => {
//     const userId = req.params.id;
//     let user = await getUserById(userId);
//     res.render('delete.ejs', {userEdit: user})
// }

const postHandleDeleteProduct = async (req, res) => {
  const productId = req.params.id;
  await deleteProduct(productId);
  res.redirect("/");
  // res.send("Delete Success")
};
//)
module.exports = {
  // getHomepage,
  // ABC,
  // getCreat,
  // getUpdate,
  // postUpdate,
  // postDelete,
  // postHandleDelete
  getProductpage,
  getProductId,
  PostCreaeteProduct,
  postUpdateProduct,
  postHandleDeleteProduct,
};
