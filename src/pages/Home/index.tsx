import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    const novaSoma = {...sumAmount}
    novaSoma[product.id] = product.amount
    return novaSoma
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get<Product[]>('/products');

      const produtosJaFormatados = response.data.map(produto => ({
        ...produto,
        priceFormatted: formatPrice(produto.price)
      }))
      
        setProducts(produtosJaFormatados);
      
    }
    loadProducts();
  }, []);

  function handleAddProduct(productId: number) {
    addProduct(productId);
    
  }

  return (
    <ProductList>
      {products.map(produto => {
        return (
          <li key={produto.id.toString()}>
            <img src={produto.image} alt="Tênis de Caminhada Leve Confortável" />
            <strong>{produto.title}</strong>
            <span>{produto.priceFormatted}</span>
            <button
              type="button"
              data-testid="add-product-button"
              onClick={() => handleAddProduct(produto.id)}
            >
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {cartItemsAmount[produto.id] || 0}
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>

        )
      })}
      
    </ProductList>
  );
};

export default Home;
