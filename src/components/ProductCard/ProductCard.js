import {
  handleBuyNowBtn,
  handleClickSmallImage,
  loadProductDetail,
} from "../../pages/Product/ProductDetails.js";
import { getProductById } from "../../services/productService.js";
import { preventInputTextForNumberInput } from "../../helper/helper.js";
import { formatNumber } from "../../helper/formatNumber.js";
import {
  plusMinusBtn,
  addToCartBtn,
  handleClickSelectedVariation,
  handleClickVariation,
  updateCartQuantityStraight,
} from "../../pages/Product/ProductDetails.js";
export default function ProductCard({
  id,
  thumbnail,
  name,
  salePercentage,
  priceInfo,
}) {
  return `
      <div class="product-card" data-product-id=${id}>
              ${
                salePercentage
                  ? `<div class="product-card__percentage">-${salePercentage}%</div>`
                  : ""
              }
              <a class="product-card__img">
                <img src="../assets/products/${thumbnail}" alt=""
                />
                <div class="product-card-overlay">
                <button class="product-card-overlay__btn">Mua ngay</button>
              </div>
                </a>
              <div class="product-card-desc">
                <a class="product-card__name"
                  >${name}</a
                >
                <div class="product-card-price">
                  <span class="product-card-price__sale">${formatNumber(
                    priceInfo.currentlyPrice
                  )}đ</span>
                  ${
                    salePercentage
                      ? `<span class="product-card-price__origin">${formatNumber(
                          priceInfo.originalPrice
                        )}đ</span>`
                      : ""
                  }
                  
                </div>
              </div>
              
            </div>
  `;
}

// xử lí sự kiện cho product card
export function handleProductCardClick() {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const productId = card.dataset.productId;
      loadProductDetail(productId);
    });
  });
  document.querySelectorAll(".product-card-overlay__btn").forEach((btn) =>
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const productId = event.target.closest(".product-card").dataset.productId;
      renderProductDetailOverLay(productId);
    })
  );
}

function renderProductDetailOverLay(productId) {
  const product = getProductById(productId);
  let variationColor = undefined;
  let variationSize = undefined;
  product.variations.forEach((variation) => {
    if (variation.name === "Màu sắc") {
      variationColor = variation;
    } else variationSize = variation;
  });

  let variationColorContent = "";
  let variationSizeContent = "";
  // tạo content cho variation color
  if (variationColor) {
    let variationColorIndex = 0;
    variationColorContent += `
              <div class="color-variation variation-group">
                <p class="name-variation">
                  ${variationColor.name}
                </p>
                <div class="variation-values">
                  ${variationColor.variationOptions
                    .map(
                      (option) => `
                  <button class="variation-value color-choice"
                  data-product-id="${productId}" data-index-color-sku="${variationColorIndex++}">
                    <img
                      class="variation-value__img"
                      src="../assets/${option.image}"
                    />
                    
                    <span class="variation-value__value-name">${
                      option.name
                    }</span>
                      <div class="selection-box-stick">
                      <img src="../assets/stick.png"/>
                    </div>
                  </button>`
                    )
                    .join(" ")}

                </div>
              </div>`;
  }
  // tạo content cho variation size
  if (variationSize) {
    let variationSizeIndex = 0;
    variationSizeContent += ` <div class="size-variation variation-group">
                <p class="name-variation">
                  ${variationSize.name}
                </p>
                <div class="variation-values">
                 ${variationSize.variationOptions
                   .map(
                     (option) => ` 
                  <button class="variation-value size-choice" 
                  data-product-id="${productId}" data-index-size-sku="${variationSizeIndex++}">

                    <span class="variation-value__value-name">${
                      option.name
                    }</span>
                    <div class="selection-box-stick">
                      <img src="../assets/stick.png"/>
                    </div>
                  </button>`
                   )
                   .join(" ")}
                </div>
              </div>`;
  }
  const detailElem = document.createElement("div");
  detailElem.classList.add("overlay-content");
  const overlayContent = `
        <button class="close-detail-btn">X</button>
        <div class="content-section">
            <h3 class="detail-product-name">${product.name.toUpperCase()}</h3>
            <div class="rating">
              <img class="rating-star" src="../assets/Star.svg" />
              <img class="rating-img" src="../assets/Star.svg" />
              <img class="rating-img" src="../assets/Star.svg" />
              <img class="rating-img" src="../assets/Star.svg" />
              <img class="rating-img" src="../assets/Star.svg" />
              <span class="average-rating">5.0</span>
            </div>
            <div class="detail-product-price">
                
              <span class="detail-product-price__sale">${
                product.priceInfo.currentlyPrice
              }đ</span>
              ${
                product.salePercentage !== 0
                  ? ` <span class="detail-product-price__origin">${product.priceInfo.originalPrice}đ</span>`
                  : ""
              }
             
              ${
                product.salePercentage !== 0
                  ? ` <span class="detail-product-percentage">-${product.salePercentage}%</span>`
                  : ""
              }
             
            </div>
            <div class="product-delivery">
               <p class="delivery-name">
                 Vận chuyển
                </p>
                <div class="delivery-content">
                  <img class="shipping-icon" src="../assets/In Transit.svg">
                  <div class="delivery-content__desc">
                    <p>Nhận hàng 14 Th09 - 17 Th09 ></p>
                    <p>Phí ship 0₫ cho tất cả đơn hàng trên 120.000đ</p>
                  </div>
                </div>
            </div>
            <div class="return-policy">
               <p class="return-policy__name">
                 Đổi trả
                </p>
                <div class="return-policy__content">
                  <img class="return-package-icon" src="../assets/Return Package.svg">
                   <p class="return-policy__desc"> 30-day free returns</p>
                </div>
            </div>
            <div class="variation-product">
                ${variationColorContent}
               ${variationSizeContent}

              <div class="quantity">
                 <p class="quantity-name">
                  Số lượng
                </p>
              <div class="action-quantity">
                  <button class="decrease-quantity product-quantity__minus"><span class="line"></span></button>
                  <input value="1" class="quantity-input number-input product-quantity__input" type="text" >
                  <button class="increase-quantity product-quantity__plus">+</button>
              </div>
              <span class="available-quantity">0 sản phẩm có sẵn</span>
              </div>
              <div class="product-actions">
                <button data-product-id="${productId}" class="add-to-cart-btn"> 
                  <img class="cart-img" src="../assets/shopping-cart.png"> Thêm vào giỏ hàng
                </button>
                <button data-product-id="${productId}" class="buy-now-btn">Mua ngay</button>
              </div>



              <div class="add-to-cart-message">
                 
                 <!--  <img class="add-to-cart-tick" src="../assets/circle-check-solid-full.svg"> -->
                 Added to cart
              </div>



            </div>
            <div class="share-section">
              <p class="share-section__name">Chia sẻ</p>
              <div class="share-icons">
                <button class="share-icon share-on-facebook"><i class="fa-brands fa-facebook fa-2xl" style="color: #25467e"></i></button>
                 <button class="share-icon share-on-messenger"><i class="fa-brands fa-facebook-messenger fa-2xl" style="color: #1371b9;"></i></button>
                  <button class="share-icon share-on-x"><i class="fa-brands fa-x-twitter fa-2xl"></i></button>
                   <button class="share-icon share-on-youtube"><i class="fa-brands fa-youtube fa-2xl" style="color: #ce1c1c;"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
  `;
  detailElem.innerHTML = overlayContent;
  document.querySelector(".overlay").after(detailElem);
  handleClickVariation();
  handleClickSelectedVariation();
  plusMinusBtn();
  addToCartBtn();
  updateCartQuantityStraight();
  preventInputTextForNumberInput();
  handleClickSmallImage();
  handleBuyNowBtn();
  document.querySelector(".close-detail-btn").addEventListener("click", () => {
    document.querySelector(".overlay").classList.remove("show");
    document.querySelector(".overlay-content").remove();
  });
  document.querySelector(".overlay").classList.add("show");
}
