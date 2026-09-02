import { useEffect } from "react";
import { createContext, useContext, useReducer, useRef } from "react";
import { useAuth } from './AuthContext';

const CartContext = createContext();

const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';

// cart state = array of { productId, title, price, quantity }

function cartReducer(state, action) {
    switch (action.type) {
        case ADD_ITEM: {
            const existing = state.find(
                (item) => item.productId === action.payload.productId
            );
            if (existing) {
                return state.map((item) =>
                    item.productId === action.payload.productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...state, { ...action.payload, quantity: 1 }];
        }

        case REMOVE_ITEM:
            return state.filter((item) => item.productId !== action.payload.productId);

        case UPDATE_QUANTITY: {
            if (action.payload.quantity <= 0) {
                return state.filter((item) => item.productId !== action.payload.productId);
            }
            return state.map((item) =>
                item.productId === action.payload.productId
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
        }

        case CLEAR_CART:
            return [];

        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const [items, dispatch] = useReducer(cartReducer, []);
    const { token } = useAuth();
    const prevToken = useRef(token);

    useEffect(() => {
        if (prevToken.current && !token) {
            dispatch({ type: CLEAR_CART });
        }
        prevToken.current = token;
    }, [token]);

    function addItem(product) {
        dispatch({ type: ADD_ITEM, payload: product });
    }

    function removeItem(productId) {
        dispatch({ type: REMOVE_ITEM, payload: { productId } });
    }

    function updateQuantity(productId, quantity) {
        dispatch({ type: UPDATE_QUANTITY, payload: { productId, quantity } });
    }

    function clearCart() {
        dispatch({ type: CLEAR_CART });
    }

    const value = { items, addItem, removeItem, updateQuantity, clearCart };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}