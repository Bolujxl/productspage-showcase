# 🛒 Cart State Management — Code Audit & Refactor Guide

> **Status:** Documentation only. No source files have been modified.  
> **Goal:** Upgrade from Prop Drilling → Context API + `useReducer` (industry standard).  
> **Project:** `product showcase react`

---

## 📋 Table of Contents

1. [Current Architecture Audit](#1-current-architecture-audit)
2. [The Problem — Prop Drilling Diagram](#2-the-problem--prop-drilling-diagram)
3. [Industry Standard — What Real E-Commerce Apps Use](#3-industry-standard--what-real-e-commerce-apps-use)
4. [The Solution — Context API + useReducer](#4-the-solution--context-api--usereducer)
5. [New File To Create: CartContext.jsx](#5-new-file-to-create-cartcontextjsx)
6. [Files To Modify — Before & After](#6-files-to-modify--before--after)
7. [Final Architecture Diagram](#7-final-architecture-diagram)
8. [What You Gain](#8-what-you-gain)

---

## 1. Current Architecture Audit

### Files Reviewed

| File | Role | Cart Involvement |
|---|---|---|
| `App.jsx` | Root component | ✅ Owns `cartCount` state and `increaseCartCount` |
| `Header.jsx` | Top navigation | ✅ Receives `cartCount` via prop to display |
| `Products.jsx` | Product grid | ⚠️ Receives `addToCart` only to pass it down — middleman |
| `ProductCard.jsx` | Single product card | ✅ Receives `addToCart` via prop to attach to Button |
| `Button.jsx` | Reusable button | ✅ Receives `onClick` to trigger the cart action |

### ⚠️ Issues Found

1. **Prop Drilling** — `addToCart` is passed `App` → `Products` → `ProductCard` → `Button`. `Products.jsx` is a **middleman** that doesn't use it, only passes it along.
2. **Tight Coupling** — Adding a new component anywhere deep (e.g., a `CartDrawer` or `CartSummary` in the footer) would require threading new props through every parent layer.
3. **Scalability Risk** — Cart logic (add, remove, update quantity, clear cart) would grow into multiple scattered `useState` calls and functions.
4. **No Item Tracking** — Currently only a number counter exists. A real cart needs to store *which* products were added, their quantities, and prices.

---

## 2. The Problem — Prop Drilling Diagram

```
App.jsx
│  owns: cartCount (state)
│  owns: increaseCartCount (function)
│
├─── Header.jsx        ← receives cartCount ✅ (actually needs it)
│
└─── Products.jsx      ← receives addToCart ⚠️ (does NOT need it — just passes it)
         │
         └─── ProductCard.jsx  ← receives addToCart ⚠️ (does NOT need it — just passes it)
                   │
                   └─── Button.jsx  ← receives onClick ✅ (finally uses it here)
```

> The function traveled through **2 unnecessary components** just to reach the Button.  
> This is the core definition of prop drilling.

---

## 3. Industry Standard — What Real E-Commerce Apps Use

| Scale | Solution | Examples |
|---|---|---|
| Small / Learning | `useState` + prop drilling | Side projects, tutorials |
| **Medium — recommended next step** | **Context API + `useReducer`** | **Shopify Hydrogen, boutique storefronts** |
| Large / Enterprise | Context + Zustand or Redux Toolkit | Amazon, large SaaS platforms |

**For a standard e-commerce product showcase, Context API + `useReducer` is the professional standard.**

It handles:
- Multiple cart actions without getting messy (add, remove, clear, update quantity)
- Global cart access from any component without prop drilling
- Clean, predictable state changes all in one place

---

## 4. The Solution — Context API + `useReducer`

### Concept Overview

```
CartContext.jsx  ← "The Broadcast Tower" 📡
│  Holds: cart.items (array of products)
│  Holds: cart.count (total item count)
│  Holds: addToCart, removeFromCart, clearCart functions
│
CartProvider wraps the entire app
│
├─── Header.jsx        → useCart() → reads cart.count → shows "3"
├─── ProductCard.jsx   → useCart() → calls addToCart(product)
└─── (any future component) → useCart() anywhere, instantly
```

### The `useReducer` Idea

Instead of multiple `useState` functions that grow over time:

```js
// ❌ Gets messy as features grow:
const [cartCount, setCartCount] = useState(0);
function add()    { setCartCount(c => c + 1) }
function remove() { setCartCount(c => c - 1) }
function clear()  { setCartCount(0) }
```

You write **ONE reducer function** that manages all actions cleanly:

```js
// ✅ Scalable, clean, and all in one place:
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':    return { ...state, count: state.count + 1, ... };
    case 'REMOVE_ITEM': return { ...state, count: state.count - 1, ... };
    case 'CLEAR_CART':  return { items: [], count: 0 };
    default:            return state;
  }
}
```

Think of `dispatch` like a **TV remote** 🎮. You press a button (dispatch an action), and the reducer decides what changes.

---

## 5. New File To Create: `CartContext.jsx`

> **Location:** `src/CartContext.jsx`  
> **Action:** Create this new file. No existing files are changed.

```jsx
// src/CartContext.jsx

import { createContext, useReducer, useContext } from 'react';

// ─────────────────────────────────────────────
// 1. THE REDUCER — all cart logic lives here
// ─────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD_ITEM': {
      // Check if this product is already in the cart
      const existing = state.items.find(item => item.id === action.payload.id);

      if (existing) {
        // Already in cart — just increase its quantity
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          count: state.count + 1,
        };
      }

      // Not in cart yet — add it as a new entry
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        count: state.count + 1,
      };
    }

    case 'REMOVE_ITEM': {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (!existing) return state;

      if (existing.quantity === 1) {
        // Last one — remove it entirely
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
          count: state.count - 1,
        };
      }

      // More than one — just decrease quantity
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
        count: state.count - 1,
      };
    }

    case 'CLEAR_CART':
      return { items: [], count: 0 };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────
// 2. THE CONTEXT — the broadcast signal
// ─────────────────────────────────────────────
const CartContext = createContext(null);

// ─────────────────────────────────────────────
// 3. THE PROVIDER — wraps the app, holds state
// ─────────────────────────────────────────────
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], count: 0 });

  // Convenience functions — components call these instead of dispatch directly
  function addToCart(product) {
    dispatch({ type: 'ADD_ITEM', payload: product });
  }

  function removeFromCart(product) {
    dispatch({ type: 'REMOVE_ITEM', payload: product });
  }

  function clearCart() {
    dispatch({ type: 'CLEAR_CART' });
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// ─────────────────────────────────────────────
// 4. THE HOOK — how any component tunes in
// ─────────────────────────────────────────────
export function useCart() {
  return useContext(CartContext);
}
```

---

## 6. Files To Modify — Before & After

### `App.jsx`

**Before (current):**
```jsx
import { useState } from 'react';
import './App.css'
import Header from './Header';
import Products from './Products';

function App() {
  const [cartCount, setCartCount] = useState(0);
  function increaseCartCount(){
    setCartCount(cartCount + 1)
  }
  return (
    <main className="app">
      <Header cartCount={cartCount} />
      <Products addToCart={increaseCartCount} />
    </main>
  )
}

export default App
```

**After (refactored):**
```jsx
import './App.css'
import { CartProvider } from './CartContext';
import Header from './Header';
import Products from './Products';

function App() {
  return (
    <CartProvider>
      <main className="app">
        <Header />
        <Products />
      </main>
    </CartProvider>
  )
}

export default App
```

> ✅ No more `useState`. No more prop passing. App.jsx just wraps things in the Provider.

---

### `Header.jsx`

**Before (current):**
```jsx
import './App.css'

function Header(props) {
    const cartCount = props.cartCount;

    return(
        <header>
            {/* ... nav ... */}
            <span className='cartCounted'>{cartCount}</span>
        </header>
    )
}

export default Header;
```

**After (refactored):**
```jsx
import './App.css'
import { useCart } from './CartContext';

function Header() {
    const { cart } = useCart();

    return(
        <header>
            {/* ... nav ... */}
            <span className='cartCounted'>{cart.count}</span>
        </header>
    )
}

export default Header;
```

> ✅ Header reaches into context directly. No props received from App at all.

---

### `Products.jsx`

**Before (current):**
```jsx
function Products(props){
    const addToCart = props.addToCart; // only here to pass it down

    return(
        <section className="products-section">
            {/* ... */}
            <ProductCard ... addToCart={addToCart} />
        </section>
    )
}
```

**After (refactored):**
```jsx
function Products(){
    return(
        <section className="products-section">
            {/* ... */}
            <ProductCard ... />  {/* no addToCart prop at all */}
        </section>
    )
}
```

> ✅ Products.jsx is no longer a middleman. It knows nothing about the cart.

---

### `ProductCard.jsx`

**Before (current):**
```jsx
import Button from "./Button";

function ProductCard(props){
    const { productName, productPrice, productImg, category, rating, originalPrice, addToCart } = props;

    return(
        <div className="product-card">
            {/* ... */}
            <Button buttonText="Add to Cart" iconName="shopping_cart" onClick={addToCart} />
        </div>
    )
}
```

**After (refactored):**
```jsx
import Button from "./Button";
import { useCart } from './CartContext';

function ProductCard({ id, productName, productPrice, productImg, category, rating, originalPrice }){
    const { addToCart } = useCart();

    function handleAddToCart() {
        addToCart({ id, name: productName, price: productPrice });
    }

    return(
        <div className="product-card">
            {/* ... */}
            <Button buttonText="Add to Cart" iconName="shopping_cart" onClick={handleAddToCart} />
        </div>
    )
}
```

> ✅ No `addToCart` prop needed. ProductCard tunes in directly.  
> ✅ Now passes real product data (id, name, price) into the cart — not just a click.

---

## 7. Final Architecture Diagram

```
CartContext.jsx  📡
│  state: { items: [...], count: 3 }
│  actions: addToCart, removeFromCart, clearCart
│
CartProvider wraps entire app (in App.jsx)
│
├─── Header.jsx
│        useCart() → reads cart.count → displays badge
│
└─── Products.jsx  (knows NOTHING about cart ✅)
         │
         └─── ProductCard.jsx
                   useCart() → calls addToCart({ id, name, price })
                   │
                   └─── Button.jsx (onClick fires the function)
```

---

## 8. What You Gain

| Feature | Before — Prop Drilling | After — Context + Reducer |
|---|---|---|
| Cart counter in header | ✅ Works | ✅ Works |
| Remove item from cart | ❌ Not possible cleanly | ✅ `removeFromCart(product)` |
| Clear entire cart | ❌ Not possible cleanly | ✅ `clearCart()` |
| Cart drawer / sidebar | ❌ Would need major rewiring | ✅ Just `useCart()` in new component |
| Persist cart to localStorage | ❌ Complex | ✅ One `useEffect` in CartProvider |
| Per-item quantity tracking | ❌ Not supported | ✅ Built into reducer already |
| Prop clutter in `Products.jsx` | ⚠️ Middleman | ✅ Gone completely |
| New component needing cart access | ❌ Thread props up and down | ✅ `useCart()` anywhere, instantly |

---

> 📝 **This is a documentation file only.**  
> Your actual source files (`App.jsx`, `Header.jsx`, `Products.jsx`, `ProductCard.jsx`) have **NOT** been changed.  
> Use this as a step-by-step reference when you are ready to perform the refactor.
