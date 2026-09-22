import React, { useState, useEffect } from 'react';
import { getOrders, createProduct, updateOrderStatus } from '../api';

const Admin = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Product Form State
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productMsg, setProductMsg] = useState({ text: '', isError: false });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      // Sort to show newest first if we had dates, but we'll just reverse for now
      setOrders(res.data.reverse());
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct({
        name: productName,
        price: Number(productPrice),
        stock: Number(productStock)
      });
      setProductMsg({ text: 'Product added successfully!', isError: false });
      setProductName('');
      setProductPrice('');
      setProductStock('');
    } catch (err: any) {
      setProductMsg({ text: err.response?.data?.message || 'Failed to add product', isError: true });
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Refresh orders after update
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column: Add Product */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 shadow-xl rounded-2xl border border-gray-100 sticky top-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>
          
          {productMsg.text && (
            <div className={`mb-4 p-3 rounded-md text-sm font-bold ${productMsg.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {productMsg.text}
            </div>
          )}

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
              <input 
                type="text" 
                required 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
              <input 
                type="number" 
                required 
                min="0"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Stock Quantity</label>
              <input 
                type="number" 
                required 
                min="0"
                value={productStock}
                onChange={(e) => setProductStock(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
              Add Product
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Orders */}
      <div className="md:col-span-2">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Orders</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 shadow-md rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{order.customerName}</h3>
                    <span className="text-xl font-extrabold text-green-600">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mb-4">ID: {order._id}</p>
                  
                  <div className="space-y-2 mb-4">
                    {order.items.map((item: any) => (
                      <div key={item.productId?._id || item._id} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.quantity}x {item.productId?.name || 'Unknown Item'}</span>
                        <span className="text-gray-500">@ ₹{item.priceAtPurchase.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 min-w-[200px] flex flex-col justify-center">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Order Status</label>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={order.status === 'delivered' || order.status === 'cancelled'}
                    className={`w-full px-3 py-2 rounded-lg font-bold border-2 outline-none ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                      'bg-white text-blue-700 border-blue-200 focus:border-blue-500'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {(order.status === 'delivered' || order.status === 'cancelled') && (
                    <p className="text-xs text-gray-400 mt-2 text-center">Final State</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
