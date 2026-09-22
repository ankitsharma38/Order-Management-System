import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<any>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    const orderData = {
      customerName,
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    try {
      const res = await placeOrder(orderData);
      setSuccess(res.data);
      clearCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. A product might be out of stock.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-10 text-center shadow-2xl rounded-3xl max-w-2xl mx-auto border border-gray-100 mt-10">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-8 font-medium">Thank you for your purchase, {success.customerName}.</p>
        
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 inline-block text-left w-full sm:w-auto">
          <p className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Order Reference</p>
          <p className="text-lg font-mono text-gray-900 break-all">{success._id}</p>
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-end">
             <span className="text-gray-500 font-medium">Total Paid</span>
             <span className="text-2xl font-extrabold text-green-600">₹{success.totalAmount}</span>
          </div>
        </div>
        
        <br/>
        <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty.</h2>
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-bold text-lg underline">Go back to products</Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-10 shadow-xl rounded-2xl max-w-2xl mx-auto border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      {error && (
        <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Order Summary</h2>
        <p className="text-gray-500 mb-4">{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</p>
        <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-2">
          <span className="text-lg font-medium text-gray-700">Total to Pay:</span>
          <span className="text-3xl font-extrabold text-green-600">₹{cartTotal}</span>
        </div>
      </div>

      <form onSubmit={handleCheckout} className="space-y-6">
        <div>
          <label htmlFor="customerName" className="block text-sm font-bold text-gray-700 mb-2">
            Your Full Name
          </label>
          <input 
            type="text" 
            id="customerName"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all outline-none text-lg font-medium text-gray-900 shadow-sm"
            placeholder="e.g. Rahul Sharma"
            required 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex justify-center items-center h-14"
        >
          {loading ? (
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            `Place Order (₹${cartTotal})`
          )}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
