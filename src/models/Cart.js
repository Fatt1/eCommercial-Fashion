export let cart;
loadFromStorage();
// nên đổi tên thành getCart() để có ý nghĩa có ràng hơn
export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart"));
  if (!cart) {
    cart = [
      {
        skuId: "sku-001",
        productId: "prod-001",
        quantity: 1,
        tick: false,
      },
    ];
  }
}

export function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function getTotalQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

export function addToCart(skuId, productId) {
  let quantity = 1;
  if (document.querySelector(`.product-quantity__input`) !== null) {
    quantity = Number(document.querySelector(`.product-quantity__input`).value);
  }
  const tick = false;
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
  saveToStorage();
}

export function removeFromCart(id) {
  cart = cart.filter((item) => item.skuId !== id);
  saveToStorage();
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
    cartQuantity += cartItem.quantity;
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
