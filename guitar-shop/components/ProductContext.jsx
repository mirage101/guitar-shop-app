import {createContext, useContext, useState} from "react";


const ProductContext = createContext();

export const ProductProvider = ({children}) => {
  const [cartItems, setCartItems] = useState([]);

  const addProductToCart = (newProduct) => {
    setCartItems((prevProducts) => [...prevProducts, newProduct]);
  }

  const removeProductFromCart = (productId) => {
    setCartItems((prevProducts) => prevProducts.filter((product) => product.id !== productId));
  }
  const increaseQuantity = () =>{
    setCartItems((prevProducts) => 
    prevProducts.map((product) =>
            product.id === product?.id ? {...product, quantity: product.quantity + 1} : product
    ))
  }
  const decreaseQuantity = () =>{
    setCartItems((prevProducts) => 
    prevProducts.map((product) =>
            product.id === product?.id ? {...product, quantity: product.quantity - 1} : product
    ))
  }

  const totalAmount = cartItems.reduce((total, item) => {
    return total+item.quantity * item.sellPrice
  }, 0)
  return (
    <ProductContext.Provider value={{
        cartItems, addProductToCart, removeProductFromCart, setCartItems, increaseQuantity, decreaseQuantity, totalAmount
    }}>
      {children}
    </ProductContext.Provider>
  );
};
export const useProductContext = () => {
  return useContext(ProductContext);
};