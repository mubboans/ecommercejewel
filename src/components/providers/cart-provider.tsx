'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartState, CartAction, ICartItem } from '@/types';

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const item = action.payload as ICartItem;
      const existingItem = state.items.find(i => i.productId === item.productId);
      
      let items: ICartItem[];
      if (existingItem) {
        items = state.items.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        items = [...state.items, item];
      }
      
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items, total, itemCount };
    }
    
    case 'REMOVE_ITEM': {
      const productId = action.payload as string;
      const items = state.items.filter(item => item.productId !== productId);
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items, total, itemCount };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity === 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: productId });
      }
      
      const items = state.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items, total, itemCount };
    }
    
    case 'CLEAR_CART': {
      return initialState;
    }
    
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ecommerce-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        if (cartData.items && Array.isArray(cartData.items)) {
          cartData.items.forEach((item: ICartItem) => {
            dispatch({ type: 'ADD_ITEM', payload: item });
          });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('ecommerce-cart', JSON.stringify(state));
  }, [state]);
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Cart helper functions
export const cartHelpers = {
  addItem: (dispatch: React.Dispatch<CartAction>, item: ICartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  },
  
  removeItem: (dispatch: React.Dispatch<CartAction>, productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  },
  
  updateQuantity: (dispatch: React.Dispatch<CartAction>, productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  },
  
  clearCart: (dispatch: React.Dispatch<CartAction>) => {
    dispatch({ type: 'CLEAR_CART' });
  },
};