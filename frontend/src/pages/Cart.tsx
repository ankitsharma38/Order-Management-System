import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center mt-32 bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto">
        <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-10 shadow-xl rounded-2xl max-w-4xl mx-auto border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.productId} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors">
            <div className="flex-1 w-full sm:w-auto text-center sm:text-left mb-4 sm:mb-0">
              <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm font-medium text-gray-500 mt-1">₹{item.price.toLocaleString('en-IN')} each</p>
            </div>
            
            <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8">
              <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                <button 
                  className="px-3 py-1 bg-gray-50 hover:bg-gray-200 text-gray-600 font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 font-bold text-gray-800 border-x-2 border-gray-200 min-w-[2.5rem] text-center">
                  {item.quantity}
                </span>
                <button 
                  className="px-3 py-1 bg-gray-50 hover:bg-gray-200 text-gray-600 font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  +
                </button>
              </div>
              
              <div className="w-24 text-right">
                <span className="text-lg font-extrabold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
              
              <button 
                onClick={() => removeFromCart(item.productId)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                title="Remove item"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-8 border-gray-200" />
      
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div className="mb-4 sm:mb-0 text-center sm:text-left">
          <p className="text-gray-500 font-medium">Subtotal</p>
          <p className="text-3xl font-extrabold text-gray-900">₹{cartTotal.toLocaleString('en-IN')}</p>
        </div>
        <Link 
          to="/checkout" 
          className="w-full sm:w-auto text-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;
