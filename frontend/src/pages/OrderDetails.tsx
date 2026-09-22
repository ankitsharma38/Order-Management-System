import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../api';

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;
        const res = await getOrderById(id);
        setOrder(res.data);
      } catch (err: any) {
        setError('Order not found or invalid ID.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading order details...</div>;
  if (error) return <div className="text-center mt-20 text-red-600 font-bold">{error}</div>;
  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-500 font-mono mt-1">ID: {order._id}</p>
        </div>
        <div className={`px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide ${
          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {order.status}
        </div>
      </div>

      <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h2 className="text-sm font-bold text-gray-500 uppercase mb-2">Customer Info</h2>
        <p className="text-xl font-bold text-gray-900">{order.customerName}</p>
        <p className="text-sm text-gray-500 mt-1">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Purchased Items</h2>
      <div className="space-y-4 mb-8">
        {order.items.map((item: any) => (
          <div key={item._id || item.productId?._id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg shadow-sm">
            <div>
              <p className="font-bold text-gray-800">{item.productId?.name || 'Unknown Product'}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.priceAtPurchase.toLocaleString('en-IN')}</p>
            </div>
            <p className="font-extrabold text-gray-900">
              ₹{(item.quantity * item.priceAtPurchase).toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <span className="text-xl font-bold text-gray-700">Total Amount</span>
        <span className="text-4xl font-extrabold text-green-600">₹{order.totalAmount.toLocaleString('en-IN')}</span>
      </div>

      <div className="mt-10 text-center">
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-bold underline">
          &larr; Back to Products
        </Link>
      </div>
    </div>
  );
};

export default OrderDetails;
