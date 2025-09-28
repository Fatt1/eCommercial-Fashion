import { cart, loadFromStorage } from "../models/Cart.js";

function getTickedProductInCart() {
  const cart = loadFromStorage();
  return cart.filter((c) => c.tick === true);
}

export function checkCart() {
  if (cart.length <= 0) return false;
  let check = false;
  cart.forEach((cartItem) => {
    console.log(cartItem.tick);
    if (cartItem.tick === true) check = true;
  });
  console.log("a");
  return check;
}

export { getTickedProductInCart };
