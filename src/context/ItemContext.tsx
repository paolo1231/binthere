import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../types';

type ItemState = {
    items: Item[];
    searchQuery: string;
    selectedLocation: string;
};

type ItemAction =
    | { type: 'SET_ITEMS'; payload: Item[] }
    | { type: 'ADD_ITEM'; payload: Item }
    | { type: 'UPDATE_ITEM'; payload: Item }
    | { type: 'DELETE_ITEM'; payload: string }
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'SET_SELECTED_LOCATION'; payload: string };

const initialState: ItemState = {
    items: [],
    searchQuery: '',
    selectedLocation: '',
};

const ItemContext = createContext<{
    state: ItemState;
    dispatch: React.Dispatch<ItemAction>;
    addItem: (item: Omit<Item, 'id' | 'createdAt'>) => void;
    updateItem: (item: Item) => void;
    deleteItem: (id: string) => void;
    filteredItems: Item[];
} | null>(null);

function itemReducer(state: ItemState, action: ItemAction): ItemState {
    switch (action.type) {
        case 'SET_ITEMS':
            return { ...state, items: action.payload };
        case 'ADD_ITEM':
            return { ...state, items: [...state.items, action.payload] };
        case 'UPDATE_ITEM':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id ? action.payload : item
                ),
            };
        case 'DELETE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
            };
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };
        case 'SET_SELECTED_LOCATION':
            return { ...state, selectedLocation: action.payload };
        default:
            return state;
    }
}

export const ItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(itemReducer, initialState);

    // Load items from storage on app start
    useEffect(() => {
        loadItems();
    }, []);

    // Save items whenever they change
    useEffect(() => {
        saveItems();
    }, [state.items]);

    const loadItems = async () => {
        try {
            const stored = await AsyncStorage.getItem('items');
            if (stored) {
                const items = JSON.parse(stored).map((item: any) => ({
                    ...item,
                    createdAt: new Date(item.createdAt),
                    reminder: item.reminder ? new Date(item.reminder) : undefined,
                    usageHistory: item.usageHistory?.map((date: string) => new Date(date)) || [],
                }));
                dispatch({ type: 'SET_ITEMS', payload: items });
            }
        } catch (error) {
            console.error('Failed to load items:', error);
        }
    };

    const saveItems = async () => {
        try {
            await AsyncStorage.setItem('items', JSON.stringify(state.items));
        } catch (error) {
            console.error('Failed to save items:', error);
        }
    };

    const addItem = (itemData: Omit<Item, 'id' | 'createdAt'>) => {
        const newItem: Item = {
            ...itemData,
            id: Date.now().toString(),
            createdAt: new Date(),
            usageHistory: [],
        };
        dispatch({ type: 'ADD_ITEM', payload: newItem });
    };

    const updateItem = (item: Item) => {
        dispatch({ type: 'UPDATE_ITEM', payload: item });
    };

    const deleteItem = (id: string) => {
        dispatch({ type: 'DELETE_ITEM', payload: id });
    };

    const filteredItems = state.items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchesLocation = !state.selectedLocation || item.location === state.selectedLocation;
        return matchesSearch && matchesLocation;
    });

    return (
        <ItemContext.Provider value={{
            state,
            dispatch,
            addItem,
            updateItem,
            deleteItem,
            filteredItems,
        }}>
            {children}
        </ItemContext.Provider>
    );
};

export const useItems = () => {
    const context = useContext(ItemContext);
    if (!context) {
        throw new Error('useItems must be used within an ItemProvider');
    }
    return context;
};