import express from 'express';
import { getOrders, getOrderById, createOrder, updateOrderStatus } from '../controllers/orderController';

const router = express.Router();

router.route('/').get(getOrders).post(createOrder);
router.route('/:id').get(getOrderById);
router.route('/:id/status').patch(updateOrderStatus);

export default router;
