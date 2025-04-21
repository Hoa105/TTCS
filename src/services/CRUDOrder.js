const connection = require("../config/database");

const getAllProducts = async () => {
  let [results, fields] = await connection.query("select * from Products");
  return results;
};

const getProductById = async (ProductId) => {
  const [results, fields] = await connection.query(
    "select * from Products where id = ? ",
    [ProductId]
  );

  let product = results && results.length > 0 ? results[0] : {};
  return product;
};

const createProduct = async (
  name,
  description,
  price,
  material,
  category,
  image
) => {
  const [results, fields] = await connection.query(
    ` INSERT INTO Products (name, description, price, material, category, image)
        VALUES(?, ?, ?, ?, ?, ?); `,
    [name, description, price, material, category, image]
  );
  return results;
};

const updateProduct = async (
  name,
  description,
  price,
  material,
  category,
  image,
  productId
) => {
  let [results, fields] = await connection.query(
    `
          UPDATE Products
          SET name = ?, description = ?, price = ?, material = ?, category = ?, image = ?
          where id = ? `,
    [name, description, price, material, category, image, productId]
  );
};

const deleteProduct = async (userId) => {
  let [results, fields] = await connection.query(
    `DELETE FROM Products WHERE id = ?; `,
    [userId]
  );
};
module.exports = {
  // getAllUser,
  // getUserById,
  // updateUserId,
  // deleteUserId
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
