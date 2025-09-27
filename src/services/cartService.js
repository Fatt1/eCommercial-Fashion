import { loadFromStorage } from "../models/Cart.js";
function getTickedProductInCart() {
  const cart = loadFromStorage();
  return cart.filter((c) => c.tick === true);
}

export { getTickedProductInCart };
