import BreadCrumb from "../../components/BreadCrumb/BreadCrumb.js";
import Footer from "../../components/Footer/Footer.js";
import Header, {
  handleClickHeader,
  renderOverlay,
} from "../../components/Header/Header.js";
import ProductList, {
  handClickProductList,
} from "../../components/ProductList/ProductList.js";
import {
  addToCart,
  updateCartQuantity,
  updateCartQuantityStraight,
} from "../../models/Cart.js";
import { getSkuByProductId } from "../../models/Sku.js";
import {
  getAllProducts,
  getProductById,
} from "../../services/productService.js";
import { cart } from "../../models/Cart.js";
import { preventInputTextForNumberInput } from "../../helper/helper.js";
import { isLogin } from "../../services/authenticateService.js";
import { Login, setUpLoginForm } from "../../components/Login/Login.js";
//mai mốt sẽ viết thêm hàm lấy các sản phẩm liên quan
const relatedProducts = getAllProducts({}).items;
function renderProductDetailHtml(productId) {
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
  return `
  ${Header("san-pham")}
   <div class="product-page">
      <div class="main-content">
          ${BreadCrumb()}
        <div class="detail-product">
          <div class="image-section">
          
            <img
              class="image-section__large-img"
              src="../assets/${product.thumbnail}"
            />
            <div class="small-images-section">
              ${product.images
                .map(
                  (img) => `<img
                class="small-images-section__small"
                src="../assets/${img}"
              />`
                )
                .join(" ")}
            </div>
          </div>

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
              <span class="available-quantity">499 sản phẩm có sẵn</span>
              </div>
              <div class="product-actions">
                <button data-product-id="${productId}" class="add-to-cart-btn"> 
                  <img class="cart-img" src="../assets/shopping-cart.png"> Thêm vào giỏ hàng
                </button>
                <button class="buy-now-btn">Mua ngay</button>
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
            <div class="bottom-section">
                  <ul class="extra-information__tabs">
                      <li class="extra-information__tab active" data-target="desc-content">
                        Mô tả
                      </li>
                      <li class="extra-information__tab" data-target="details-content">
                        Thông tin chi tiết
                      </li>
                      <li class="extra-information__tab" data-target="review-content">
                       Đánh giá
                      </li>
                    </ul>
                  <p id="desc-content" class="extra-information__desc" >
                        ${product.desc}
                  </p>
                  <div id="details-content" class="extra-information__detail-content " hidden>
                      ${generateAttributeContent(product)}
                  </div>

                  <div id="review-content" hidden></div>
            </div>
          <div class="related-products">
            
            <h2 class="related-products__header">Các sản phẩm liên quan</h2>
            ${ProductList({
              products: relatedProducts,
              className: "related-products-list",
            })};
          </div>  
      </div>
    </div>
    ${Footer()}
  `;
}
export function loadProductDetail(productId) {
  document.getElementById("root").innerHTML =
    renderProductDetailHtml(productId);
  console.log("chay");
  window.scrollTo(0, 0);
  handleClickHeader();
  handClickProductList();

  // addedMessageAfterClickButton();

  handleClickVariation();
  plusMinusBtn();
  addToCartBtn();
  updateCartQuantityStraight();
  preventInputTextForNumberInput();
}
function generateAttributeContent(product) {
  let content = "";
  product.attributes.forEach((att) => {
    content += `<div class="extra-information-attribute-container">
                      <h3 class="extra-information-attribute-container__attribute-name">${
                        att.name
                      }</h3>
                      <div class="extra-information-attribute-container__attribute-value">${att.attributeValues.join(
                        ", "
                      )}</div>
                   </div>`;
  });
  return content;
}

function addMessage() {
  const msg = document.querySelector(".add-to-cart-message");
  msg.classList.add("add-to-cart-message-on");
  setTimeout(() => {
    msg.classList.remove("add-to-cart-message-on");
  }, 1000);
}

// function addedMessageAfterClickButton() {
//   document.querySelector(".add-to-cart-btn").addEventListener("click", () => {
//     console.log("clicked");
//     addMessage();
//   });
// }

let tierIndexes = [];

function checkTierIndexes() {
  if (tierIndexes[0] != undefined && tierIndexes[1] != undefined) return true;
  return false;
}

function handleClickVariationColor() {
  document.querySelectorAll(".color-choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("selected")) {
        tierIndexes[0] = undefined;
      } else {
        tierIndexes[0] = Number(btn.dataset.indexColorSku);
      }
      const addToCartBtn = document.querySelector(".add-to-cart-btn");
      if (checkTierIndexes()) {
        addToCartBtn.classList.add("enabled");
      } else {
        addToCartBtn.classList.remove("enabled");
      }
      console.log(tierIndexes);

      console.log(getSkuByProductId(btn.dataset.productId, tierIndexes));

      document.querySelector(".available-quantity").innerHTML = `${
        getSkuByProductId(btn.dataset.productId, tierIndexes).stock
      } sản phẩm có sẵn`;

      checkEnableAddToCart();
    });
  });
}

function handleClickVariationSize() {
  document.querySelectorAll(".size-choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("selected")) {
        tierIndexes[1] = undefined;
      } else {
        tierIndexes[1] = Number(btn.dataset.indexSizeSku);
      }
      const addToCartBtn = document.querySelector(".add-to-cart-btn");
      if (checkTierIndexes()) {
        addToCartBtn.classList.add("enabled");
      } else {
        addToCartBtn.classList.remove("enabled");
      }
      // tierIndexes[1] = Number(btn.dataset.indexSizeSku);
      console.log(tierIndexes);
      console.log(getSkuByProductId(btn.dataset.productId, tierIndexes));

      document.querySelector(".available-quantity").innerHTML = `${
        getSkuByProductId(btn.dataset.productId, tierIndexes).stock
      } sản phẩm có sẵn`;

      checkEnableAddToCart();
    });
  });
}

function checkEnableAddToCart() {
  const colorSelected = document.querySelector(".color-choice.selected");
  const sizeSelected = document.querySelector(".size-choice.selected");
  const addToCartBtn = document.querySelector(".add-to-cart-btn");

  // if (colorSelected && sizeSelected) {
  //   addToCartBtn.classList.add("enabled");
  // } else {
  //   addToCartBtn.classList.remove("enabled");
  //   addToCartBtn.classList;
  // }
}

function handleClickVariation() {
  handleClickVariationColor();
  handleClickVariationSize();
}

function addToCartBtn() {
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      if (checkTierIndexes()) {
        if (!isLogin()) {
          document.getElementById("register-login").innerHTML = Login();
          setUpLoginForm();
          renderOverlay();
          return;
        }
        const productId = button.dataset.productId;
        const sku = getSkuByProductId(productId, tierIndexes);

        addToCart(sku.id, productId);
        updateCartQuantity("cart-quantity");
        console.log(cart);

        addMessage();
      }
    });
  });
}

function plusMinusBtn() {
  const minusButtons = document.querySelector(".product-quantity__minus");
  const plusButton = document.querySelector(".product-quantity__plus");
  const inputQuantity = document.querySelector(".product-quantity__input");

  minusButtons.addEventListener("click", () => {
    let value = parseInt(inputQuantity.value);
    if (value > 1) inputQuantity.value = value - 1;
  });

  plusButton.addEventListener("click", () => {
    let value = parseInt(inputQuantity.value);
    inputQuantity.value = value + 1;
  });
}

// document.querySelector(".add-to-cart-btn").addEventListener("click", () => {
//   const productId =
//     document.querySelector(".add-to-cart-btn").dataset.productId;
//   console.log(productId);
// });
