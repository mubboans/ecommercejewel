/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "sonner";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOAD_CART"; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );

      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }

      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.productId !== action.payload
      );
      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
        .filter((item) => item.quantity > 0);

      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }

    case "CLEAR_CART":
      return {
        ...initialState,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "LOAD_CART": {
      const total = action.payload.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = action.payload.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: action.payload,
        total,
        itemCount,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (orderData: any) => Promise<string | null>;
  validateStock: () => Promise<boolean>;
  dispatch: React.Dispatch<CartAction>; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// ADD BACK THE cartHelpers EXPORT
export const cartHelpers = {
  addItem: (dispatch: React.Dispatch<CartAction>, item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  },
  removeItem: (dispatch: React.Dispatch<CartAction>, productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  },
  updateQuantity: (
    dispatch: React.Dispatch<CartAction>,
    productId: string,
    quantity: number
  ) => {
    if (quantity === 0) {
      dispatch({ type: "REMOVE_ITEM", payload: productId });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
    }
  },
  clearCart: (dispatch: React.Dispatch<CartAction>) => {
    dispatch({ type: "CLEAR_CART" });
  },
  setLoading: (dispatch: React.Dispatch<CartAction>, isLoading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: isLoading });
  },
  loadCart: (dispatch: React.Dispatch<CartAction>, items: CartItem[]) => {
    dispatch({ type: "LOAD_CART", payload: items });
  },
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          dispatch({ type: "LOAD_CART", payload: cartData });
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        // Clear corrupted cart data
        localStorage.removeItem("cart");
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.items.length > 0) {
      try {
        localStorage.setItem("cart", JSON.stringify(state.items));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    } else {
      localStorage.removeItem("cart");
    }
  }, [state.items]);

  const addItem = (item: CartItem) => {
    // Validate item before adding
    if (
      !item.productId ||
      !item.name ||
      item.price <= 0 ||
      item.quantity <= 0
    ) {
      console.error("Invalid cart item:", item);
      toast.error("Invalid product data");
      return;
    }

    // Check if quantity exceeds max stock
    if (item.quantity > item.maxStock) {
      toast.error(`Only ${item.maxStock} items available in stock`);
      return;
    }

    dispatch({ type: "ADD_ITEM", payload: item });
    toast.success(`${item.name} added to cart`);
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
    toast.success("Item removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 0) {
      console.error("Invalid quantity:", quantity);
      return;
    }

    if (quantity === 0) {
      removeItem(productId);
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.success("Cart cleared");
  };

  // Validate stock before creating order
  const validateStock = async (): Promise<boolean> => {
    if (state.items.length === 0) {
      toast.error("Cart is empty");
      return false;
    }

    try {
      const response = await fetch("/api/orders/validate-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: state.items }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Stock validation failed");
      }

      const result = await response.json();

      if (!result.valid && result.outOfStockItems) {
        result.outOfStockItems.forEach((item: any) => {
          toast.error(`${item.name} is out of stock`);
        });
        return false;
      }

      return result.valid;
    } catch (error) {
      console.error("Stock validation error:", error);
      toast.error("Failed to validate stock. Please try again.");
      return false;
    }
  };

  // Create order with pending status
  const createOrder = async (orderData: any): Promise<string | null> => {
    if (state.items.length === 0) {
      toast.error("Cart is empty");
      return null;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Validate stock first
      const isStockValid = await validateStock();
      if (!isStockValid) {
        return null;
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderData,
          items: state.items,
          subtotal: state.total,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create order");
      }

      const order = await response.json();

      // Clear cart only after successful order creation
      clearCart();

      toast.success("Order created successfully!");
      return order.orderNumber;
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create order"
      );
      return null;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    createOrder,
    validateStock,
    dispatch
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
