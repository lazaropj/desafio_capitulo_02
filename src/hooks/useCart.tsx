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
      const carrinhoAtualizado = [...cart]
      const produtoEncontrado = carrinhoAtualizado.find(produto => produto.id === productId);
      const estoque = await api.get(`/stock/${productId}`);
          
      if (produtoEncontrado) {
        if (estoque.data.amount > produtoEncontrado.amount ) {
          produtoEncontrado.amount = produtoEncontrado.amount + 1;
        } else {
          toast.error('Quantidade solicitada fora de estoque');
          return
        }
      }else{
        const produtoSelecionado = await api.get(`/products/${productId}`);
          const novoProduto = {
            ...produtoSelecionado.data,
            amount: 1
          }
          carrinhoAtualizado.push(novoProduto);
        
      }
      setCart(carrinhoAtualizado)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(carrinhoAtualizado));
      
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const carrinhoAtualizado = [...cart]
      const removeIndex = carrinhoAtualizado.findIndex( produto => produto.id === productId );
      if (removeIndex >= 0) {
        carrinhoAtualizado.splice( removeIndex, 1 );
        setCart(carrinhoAtualizado)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(carrinhoAtualizado));
      }else{
        throw Error();
      }
      
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({productId,amount,}: UpdateProductAmount) => {
    try {

      if (amount <= 0 ){
        return;
      }

      const carrinhoAtualizado = [...cart]
      const produtoEncontrado = carrinhoAtualizado.find(produto => produto.id === productId);
      const estoque = await api.get(`/stock/${productId}`);

      
      if (amount >= estoque.data.amount ) {
        
        toast.error('Quantidade solicitada fora de estoque');
        return
      }
      if (produtoEncontrado) {
        produtoEncontrado.amount = amount;
        setCart(carrinhoAtualizado);
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(carrinhoAtualizado));
      } else {
        throw Error();
      }

    } catch {
      toast.error('Erro na alteração de quantidade do produto');
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
