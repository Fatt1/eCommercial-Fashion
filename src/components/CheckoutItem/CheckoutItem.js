import { formatNumber } from "../../helper/formatNumber.js";
import { getProductById } from "../../services/productService.js";
export default function CheckoutItem(item, quantity, rawPrice) {
  let variationSize;
  let variationColor;
  item.detailSku.selectedDetails.forEach((selected) => {
    if (selected.variation === "Kích thước") variationSize = selected;
    else variationColor = selected;
  });
  var product = getProductById(item.productId);
  return `
     <div class="checkout-item">
                <div class="product-main">
                  <img
                    class="product-main__img"
                    src="../assets/products/${product.thumbnail}"
                    alt=""
                  />
                  <span>${item.productName}</span>
                </div>
                <div class="product-size">
                  <div class="dropdown">
                    <span
                    
                      class="dropdown-button dropdown-button__size"
                    >
             
                     ${variationSize.name}
                    </span>
                  </div>
                </div>
                <div class="product-color">
                  <div class="dropdown">
                    <span
                     
                      class="dropdown-button dropdown-button__color"
                    >
                    ${variationColor.name}
                    </span>
                  </div>
                </div>
                <div class="product-price">
                  <span class="product-price__old-price">${formatNumber(
                    item.originalPrice
                  )}đ</span>
                  <span class="product-price__current-price">${formatNumber(
                    item.currentlyPrice
                  )}đ</span>
                </div>
                <div class="product-quantity">
                  <span  class="product-quantity__input">${quantity}</span>
                </div>
                <div class="product-total product-total-text">${formatNumber(
                  rawPrice
                )}đ</div>
              </div>
  `;
}
