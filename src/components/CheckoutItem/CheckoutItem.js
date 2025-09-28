import {
  cart,
  removeFromCart,
  saveToStorage,
  updateCartQuantityStraight,
} from "../../models/Cart.js";
import { getProductById } from "../../services/productService.js";
import { formatNumber, unFormatNumber } from "../../helper/formatNumber.js";
import { getSkuByProductId, getSkuBySkuId } from "../../models/Sku.js";

export default function CheckoutItem() {
  let checkoutHtml = "";
  cart.forEach((cartItem) => {
    const skuId = cartItem.skuId;

    // const matchingSku = getProduct(skuId);
    const matchingProduct = getProductById(cartItem.productId);

    checkoutHtml += `
         <div class="checkout-item">
                <div class="product-main">
                  <img
                    class="product-main__img"
                    src="../assets/large-img-detail.png"
                    alt=""
                  />
                  <span>${matchingProduct.name}</span>
                </div>
                <div class="product-size">
                  <div class="dropdown">
                   ${renderSizeSpan(matchingProduct, skuId)}
                  </div>
                </div>
                <div class="product-color">
                  <div class="dropdown">
                    ${renderColorSpan(matchingProduct, skuId)}
                  </div>
                </div>
                <div class="product-price">
                  <span class="product-price__old-price">${formatNumber(
                    matchingProduct.priceInfo.originalPrice
                  )}</span>
                  <span class="product-price__current-price">${formatNumber(
                    matchingProduct.priceInfo.currentlyPrice
                  )}</span>
                </div>
                <div class="product-quantity">
                  <span disabled class="product-quantity__input">${
                    cartItem.quantity
                  }</span>
                </div>
                <div class="product-total product-total-text">${formatNumber(
                  matchingProduct.priceInfo.currentlyPrice * cartItem.quantity
                )}</div>
              </div>
    `;
  });
  return checkoutHtml;
}

function renderColorSpan(product, skuId) {
  const sku = getSkuBySkuId(skuId, product.id);
  let variationColor = undefined;
  product.variations.forEach((variation) => {
    if (variation.name === "Màu sắc") {
      variationColor = variation;
    }
  });
  let variationColorContent = "";
  let colorName;
  // let variationSizeContent = "";
  // tạo content cho variation color
  if (variationColor) {
    let variationColorIndex = 0;
    variationColor.variationOptions.map((option) => {
      if (variationColorIndex++ === sku.tierIndexes[0]) {
        // console.log(
        //   `${option.name} <img src="../assets/dropdown-icon.svg" />`
        // );
        colorName = `
                    <span
                      disabled
                      class="dropdown-button dropdown-button__color"
                    >
                      ${option.name}
                    </span>
        `;
      }
    });
  }
  return colorName;
}
function renderSizeSpan(product, skuId) {
  const sku = getSkuBySkuId(skuId, product.id);
  let variationSize = undefined;
  product.variations.forEach((variation) => {
    if (variation.name !== "Màu sắc") {
      variationSize = variation;
    }
  });
  let variationSizeContent = "";
  let sizeName;
  // let variationSizeContent = "";
  // tạo content cho variation color
  if (variationSize) {
    let variationSizeIndex = 0;
    variationSize.variationOptions.map((option) => {
      if (variationSizeIndex++ === sku.tierIndexes[1]) {
        // console.log(
        //   `${option.name} <img src="../assets/dropdown-icon.svg" />`
        // );
        sizeName = `<span
                      disabled
                      class="dropdown-button dropdown-button__size"
                    >
                      ${option.id}
                    </span>`;
      }
    });
  }
  return sizeName;
}
