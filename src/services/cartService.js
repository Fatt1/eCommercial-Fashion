export let cart;
loadCart();
// nên đổi tên thành getCart() để có ý nghĩa có ràng hơn
export function loadCart() {
  cart = JSON.parse(localStorage.getItem("cart"));
  if (!cart) {
    cart = [];
  }
}

export function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function getTotalQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

export function addToCart(skuId, productId, quantity, tick = false) {
  // const quantity = Number(
  //   document.querySelector(`.js-quantity-selector-${skuId}`).value
  // );
  let matchingItem;
  cart.forEach((cartItem) => {
    if (cartItem.skuId === skuId) matchingItem = cartItem;
  });
  if (matchingItem) matchingItem.quantity += quantity;
  else
    cart.push({
      skuId,
      productId,
      quantity,
      tick,
    });
  saveCart();
}
export function unTickAllCartItems() {
  cart.forEach((cartItem) => {
    cartItem.tick = false;
  });
}
export function removeFromCart(skuId) {
  cart = cart.filter((item) => item.skuId !== skuId);
  saveCart();
}

export function updateCartQuantity(classIdToChange) {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  document.querySelector(`.${classIdToChange}`).innerHTML = cartQuantity;
}
export function updateCartQuantityStraight() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += 1;
  });
  document.querySelector(`.cart-quantity`).innerHTML = cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  cart.forEach((item) => {
    if (item.id === productId) {
      item.quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      return;
    }
  });
}

function getTickedProductInCart() {
  const cartItems = JSON.parse(localStorage.getItem("cart"));
  return cartItems.filter((c) => c.tick === true);
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
