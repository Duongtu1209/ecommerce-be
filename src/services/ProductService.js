const Product = require("../models/ProductsModel");
const bcrypt = require("bcrypt");

const create = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { sku } = newProduct;
    try {
      const existProduct = await Product.findOne({
        sku,
      });
      if (existProduct !== null) {
        resolve({
          status: "ERR",
          message: "Product already exists",
        });
      }
      const createdProduct = await Product.create(newProduct);

      if (createdProduct) {
        resolve({
          status: "OK",
          message: "Product created successfully",
          data: createdProduct,
        });
      } else {
        resolve({
          status: "ERR",
          message: "There was an error during product creation",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

const update = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ _id: id });
      if (product === null) {
        resolve({
          status: "ERR",
          message: "The product does not exist",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "The product updated successfully",
        data: updatedProduct,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ _id: id });
      if (product === null) {
        resolve({
          status: "ERR",
          message: "The product does not exist",
        });
      }

      resolve({
        status: "OK",
        message: "successfully",
        data: product,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ _id: id });
      if (product === null) {
        resolve({
          status: "ERR",
          message: "The product does not exist",
        });
      }

      await Product.findByIdAndDelete(id, { new: true });

      resolve({
        status: "OK",
        message: "The product deleted successfully",
      });
    } catch (err) {
      reject(err);
    }
  });
};

const getAllProduct = (limit = 10, page = 0, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();
      if (filter) {
        const label = filter[0];
        const allProductFilter = await Product.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit)
          .sort({ name: "desc" });

        resolve({
          status: "OK",
          message: "successfully",
          data: allProductFilter,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPAge: Math.ceil(totalProduct / limit),
        });
      }

      if (sort) {
        const objectSort = {};
        objectSort[sort[0]] = sort[1];
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);

        resolve({
          status: "OK",
          message: "successfully",
          data: allProductSort,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPAge: Math.ceil(totalProduct / limit),
        });
      }

      const allProduct = await Product.find()
        .limit(limit)
        .skip(page * limit)
        .sort({ name: "desc" });

      resolve({
        status: "OK",
        message: "successfully",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPAge: Math.ceil(totalProduct / limit),
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  create,
  update,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
};
