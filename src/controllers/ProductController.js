const ProductService = require("../services/ProductService");

const create = async (req, res) => {
  try {
    const { name, type, price, quantity, sku } = req.body;
    if (!name || !type || !price || !quantity || !sku) {
      return res.status(500).json({
        status: "ERR",
        message: "This field is a required field",
      });
    }
    const response = await ProductService.create(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, type, price, quantity, sku } = req.body;
    if (!name || !type || !price || !quantity || !sku) {
      return res.status(500).json({
        status: "ERR",
        message: "This field is a required field",
      });
    }

    const response = await ProductService.update(id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getDetailsProduct = async () => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(500).json({
        status: "ERR",
        message: "The product does not exist",
      });
    }
    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(500).json({
        status: "ERR",
        message: "The product does not exist",
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAllProduct(
      Number(limit) || 10,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error });
  }
};

module.exports = {
  create,
  update,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
};
