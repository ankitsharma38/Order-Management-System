import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [recentOrders, setRecentOrders] = useState<{id: string, date: string}[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('myOrders') || '[]');
    setRecentOrders(saved);
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      navigate(`/order/${orderId.trim()}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 shadow-xl rounded-2xl border border-gray-100 text-center">
      <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h1>
      <p className="text-gray-500 mb-8">Enter your Order ID below to check its current status.</p>
      
      <form onSubmit={handleTrack} className="space-y-4">
        <input 
          type="text" 
          placeholder="Paste Order ID here" 
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none text-center font-mono"
        />
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Track Order
        </button>
      </form>

      {recentOrders.length > 0 && (
        <div className="mt-10 border-t border-gray-200 pt-6 text-left">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.map((order, i) => (
              <Link key={i} to={`/order/${order.id}`} className="block p-4 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 transition group">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="block font-mono text-sm text-gray-800 font-bold">{order.id}</span>
                    <span className="block text-xs text-gray-500 mt-1">{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                  <span className="text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform">View &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
