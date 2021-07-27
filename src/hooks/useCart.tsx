import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      debugger;
      await api.get('/stock/' + productId).then(response => {
          const produtoEncontrado: Product | undefined = cart.find(produto => produto.id === productId);
          if (produtoEncontrado) {
            if (response.data.amount > produtoEncontrado.amount ) {
              produtoEncontrado.amount = produtoEncontrado.amount + 1;
              const total: number = cart.length * produtoEncontrado.price
              localStorage.setItem('@RocketShoes:cart:total', total.toString());
            } else {
              toast.error('Quantidade solicitada fora de estoque');
            }
          }else{
            api.get('/products/' + productId ).then(resultadoMaroto => {
              const produto = resultadoMaroto.data;
              localStorage.setItem('@RocketShoes:cart', JSON.stringify(produto));
            })
            
          }
      })
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
