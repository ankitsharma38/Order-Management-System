import React, { useEffect, useState } from 'react';
import { getProducts } from '../api';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, cart } = useCart();

  useEffect(() => {
    getProducts()
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const cartItem = cart.find(item => item.productId === product._id);
          const quantityInCart = cartItem ? cartItem.quantity : 0;
          const isOutOfStock = product.stock === 0 || quantityInCart >= product.stock;

          return (
            <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
              <div className="p-6 flex-grow">
                <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-blue-600">₹{product.price.toLocaleString('en-IN')}</span>
                  <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                    product.stock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2">
                <button 
                  onClick={() => addToCart(product)}
                  disabled={isOutOfStock}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors duration-200 ${
                    isOutOfStock 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isOutOfStock ? 'No more stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
