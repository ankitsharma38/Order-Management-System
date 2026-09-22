import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Product from '../models/Product';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).populate('items.productId', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId', 'name');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customerName, items } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ message: 'Customer name and items are required' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      // Calculate total with the current price
      totalAmount += product.price * item.quantity;
      
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save({ session });
    }

    const order = new Order({
      customerName,
      items: orderItems,
      totalAmount,
      status: 'pending'
    });

    const createdOrder = await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(createdOrder);
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Basic state transition validation rules
    if (order.status === 'delivered' && status !== 'delivered') {
      return res.status(400).json({ message: 'Cannot change status of a delivered order' });
    }
    if (order.status === 'cancelled' && status !== 'cancelled') {
      return res.status(400).json({ message: 'Cannot change status of a cancelled order' });
    }
    
    // Additional rules (can't skip states backwards unless cancelled)
    const currentStateIndex = validStatuses.indexOf(order.status);
    const newStateIndex = validStatuses.indexOf(status);

    if (newStateIndex < currentStateIndex && status !== 'cancelled') {
       return res.status(400).json({ message: 'Cannot move order status backwards' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
