import { useState } from 'react';
import './App.css'
import Header from './Header';
import Products from './Products';

function App() {

  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  function increaseCartCount(productName){
    setCartCount(cartCount + 1)
    setToastMessage(`${productName} added to cart`)
    setTimeout(() => {
      setToastMessage("")
    }, 2000)
  }
  return (
    <main className="app">
      <Header cartCount = {cartCount} />
      <Products addToCart={increaseCartCount}  />

      {toastMessage !== "" && (
        <div className="toast-notification">
          <span className="material-symbols-outlined">check_circle</span>
          <p>{toastMessage}</p>
        </div>
      )}
    </main>
  )
}

export default App
