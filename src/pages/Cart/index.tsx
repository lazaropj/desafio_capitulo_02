import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();
  

  const cartFormatted = cart.map(product => ({
    ...product,
    priceFormated: formatPrice(product.price) 
  }))
  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        return sumTotal + product.price * product.amount
      }, 0)
    )

  function handleProductIncrement(product: Product) {
    updateProductAmount({productId: product.id, amount: product.amount + 1})
  }

  function handleProductDecrement(product: Product) {
    updateProductAmount({productId: product.id, amount: product.amount - 1})
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cartFormatted.map((produtoFormatado, index) => {
            return (
              <tr data-testid="product" key={index}>
                <td>
                  <img src={produtoFormatado.image} alt={produtoFormatado.title} />
                </td>
                <td>
                  <strong>{produtoFormatado.title}</strong>
                  <span>{produtoFormatado.priceFormated}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                      disabled={produtoFormatado.amount <= 1}
                      onClick={() => handleProductDecrement(produtoFormatado)}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={produtoFormatado.amount}
                    />
                    <button
                      type="button"
                      data-testid="increment-product"
                      onClick={() => handleProductIncrement(produtoFormatado)}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{ formatPrice(produtoFormatado.price * produtoFormatado.amount)}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(produtoFormatado.id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
