const Order = require("../models/Order");
const Customer = require("../models/Customer");

exports.createOrder = async (req, res) => {
  try {
    const { customer_id, products, total_amount, payment_method } = req.body;

    const order = new Order({
      customer_id,
      products,
      total_amount,
      payment_method
    });

    await order.save();

    // Link to customer
    await Customer.findByIdAndUpdate(customer_id, { $push: { orders: order._id } });

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer_id", "name email")
      .populate("products.product_id", "name images price");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer_id", "name email")
      .populate("products.product_id", "name images price");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_status, payment_status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { order_status, payment_status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
