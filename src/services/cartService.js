import { cart, loadFromStorage } from "../models/Cart.js";

function getTickedProductInCart() {
  const cart = loadFromStorage();
  return cart.filter((c) => c.tick === true);
}

export function checkCart() {
  return cart.length > 0;
}

export { getTickedProductInCart };
