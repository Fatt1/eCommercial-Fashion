// import Header from "../../components/Header/Header.";
// import Footer from "../../components/Footer/Footer";
import {
  cart,
  removeFromCart,
  updateCartQuantityStraight,
} from "../../models/Cart.js";
import { getProductById } from "../../services/productService.js";
// import  from "../../services/productService.js";
// function render() {
//   const root = document.getElementById("root");
//   root.innerHTML = `
//   ${Header}

//   `;
// }

// document.addEventListener("DOMContentLoaded", () => {
//   render();
// });

export function renderCartItemContainer() {
  console.log("render");
  console.log(cart);
  updateCartQuantityStraight();
  // function createPage() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const skuId = cartItem.skuId;

    // const matchingSku = getProduct(skuId);
    const matchingProduct = getProductById(cartItem.productId);

    cartSummaryHTML += `
      <div class="cart-item">
            <div class="product-main">
              <input
                type="checkbox"
                class="product-main__checkbox"
                name=""
                id=""
              />
              <img
                class="product-main__img"
                src="../assets/large-img-detail.png"
                alt=""
              />
              <span>${matchingProduct.name}</span>
            </div>
            <div class="product-size">
              <div class="dropdown">
                <button class="dropdown-button dropdown-button__size">
                  S <img src="../assets/dropdown-icon.svg" />
                </button>
                <ul class="dropdown-menu dropdown-menu__size">
                  <li class="dropdown-item dropdown-item__size">S</li>
                  <li class="dropdown-item dropdown-item__size">M</li>
                  <li class="dropdown-item dropdown-item__size">L</li>
                  <li class="dropdown-item dropdown-item__size">XL</li>
                </ul>
              </div>
            </div>
            <div class="product-color">
              <!-- <select class="product-color__select" name="" id="color">
                <option value="S">Đỏ</option>
                <option value="M">Nâu</option>
                <option value="L">Đen</option>
                <option value="XL">Hồng</option>
              </select> -->
              <div class="dropdown">
                <button class="dropdown-button dropdown-button__color">
                  Do <img src="../assets/dropdown-icon.svg" />
                </button>
                <ul class="dropdown-menu dropdown-menu__color">
                  <li class="dropdown-item dropdown-item__color">Xanh Lam</li>
                  <li class="dropdown-item dropdown-item__color">Xanh Duong</li>
                  <li class="dropdown-item dropdown-item__color">Vang</li>
                  <li class="dropdown-item dropdown-item__color">Do Nau</li>
                  <li class="dropdown-item dropdown-item__color">Xam Khoi</li>
                </ul>
              </div>
            </div>
            <div class="product-price">
              <span class="product-price__old-price">${
                matchingProduct.priceInfo.originalPrice
              }</span>
              <span class="product-price__current-price">${
                matchingProduct.priceInfo.currentlyPrice
              }</span>
            </div>
            <div class="product-quantity">
              <button class="product-quantity__button product-quantity__minus">
                -
              </button>
              <input class="product-quantity__input product-quantity-${
                matchingProduct.id
              }" 
                value="${cartItem.quantity}" min="1" />
              <button class="product-quantity__button product-quantity__plus">
                +
              </button>
            </div>
            <div class="product-total product-total-${matchingProduct.id}">
            ${matchingProduct.priceInfo.currentlyPrice * cartItem.quantity}
            </div>
            <div class="product-action">
              <button class="product-action__button"
                data-sku-id = ${cartItem.sku}
              >XÓA</button>
            </div>
          </div>
    `;
  });
  // console.log(cartSummaryHTML);
  document.querySelector(".cart-item-container").innerHTML = cartSummaryHTML;
  // }

  // createPage();
  // function calculateTotalMoney(productId,quantity,price) {
  //    const totalPrice = quantity *
  // }

  document.querySelectorAll(".product-action__button").forEach((link) => {
    link.addEventListener("click", () => {
      removeFromCart(link.dataset.skuId);

      renderCartItemContainer();
    });
  });

  // document.querySelectorAll(".js-update-link").forEach((link) => {
  //   link.addEventListener("click", () => {
  //     const skuId = link.dataset.skuId;
  //     document
  //       .querySelector(`.js-cart-item-container-${link.dataset.skuId}`)
  //       .classList.add("is-editing-quantity");
  //     // updateCartQuantity("return-to-home-link-quantity");

  //     // createPage();
  //   });
  // });

  // document.querySelectorAll(".js-save-link").forEach((link) => {
  //   link.addEventListener("click", () => {
  //     const skuId = link.dataset.skuId;
  //     document
  //       .querySelector(`.js-cart-item-container-${link.dataset.skuId}`)
  //       .classList.remove("is-editing-quantity");

  //     const valueInput = Number(
  //       document.querySelector(`.input-${skuId}`).value
  //     );
  //     if (valueInput < 0 || valueInput > 1000) {
  //       alert("Pls update quantity from 0 to 1000");
  //       return;
  //     }

  //     updateQuantity(skuId, valueInput);

  //     document.querySelector(`.js-quantity-label-${skuId}`).innerText =
  //       valueInput;
  //     // updateCartQuantity("return-to-home-link-quantity");

  //     // createPage();
  //     renderCheckoutHeader();
  //     renderCartItemContainer();
  //     renderPaymentSummary();
  //   });
  // });

  // document.querySelectorAll(".js-quantity-input").forEach((link) => {
  //   link.addEventListener("keydown", (event) => {
  //     if (event.key === "Enter") {
  //       const skuId = link.dataset.skuId;
  //       document
  //         .querySelector(`.js-cart-item-container-${link.dataset.skuId}`)
  //         .classList.remove("is-editing-quantity");

  //       const valueInput = Number(
  //         document.querySelector(`.input-${skuId}`).value
  //       );
  //       if (valueInput < 0 || valueInput > 1000) {
  //         alert("Pls update quantity from 0 to 1000");
  //         return;
  //       }

  //       updateQuantity(skuId, valueInput);

  //       document.querySelector(`.js-quantity-label-${skuId}`).innerText =
  //         valueInput;
  //       // updateCartQuantity("return-to-home-link-quantity");

  //       // createPage();
  //       renderCheckoutHeader();
  //       renderCartItemContainer();
  //       renderPaymentSummary();
  //     }
  //   });
  // });

  // function updateCartQuantityForHeader() {
  //   let cartQuantity = 0;
  //   cart.forEach((cartItem) => {
  //     cartQuantity += cartItem.quantity;
  //   });
  //   document.querySelector(".return-to-home-link-quantity").innerHTML =
  //     cartQuantity;
  // }

  // updateCartQuantity("return-to-home-link-quantity");

  // document.querySelectorAll(".js-delivery-option").forEach((element) => {
  //   element.addEventListener("click", () => {
  //     const { skuId, deliveryOptionId } = element.dataset;
  //     updateDeliveryOption(skuId, deliveryOptionId);
  //     renderCartItemContainer();
  //     renderPaymentSummary();
  //     renderCheckoutHeader();
  //   });
  // });

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

  const btnSize = document.querySelector(".dropdown-button__size");
  const menuSize = document.querySelector(".dropdown-menu__size");

  const dropItemSizes = document.querySelectorAll(".dropdown-item__size");
  const dropItemColors = document.querySelectorAll(".dropdown-item__color");

  btnSize.addEventListener("click", () => {
    if (document.querySelector(".show") !== null) {
      const activeMenus = document.querySelectorAll(".show");
      activeMenus.forEach((activeMenu) => {
        if (activeMenu !== menuSize) activeMenu.classList.remove("show");
      });
    }

    menuSize.classList.toggle("show");
    menuSize.classList.toggle("active");
  });

  dropItemSizes.forEach((item) => {
    item.addEventListener("click", () => {
      menuSize.classList.toggle("show");
      menuSize.classList.toggle("active");
    });
  });

  const btnColor = document.querySelector(".dropdown-button__color");
  const menuColor = document.querySelector(".dropdown-menu__color");
  btnColor.addEventListener("click", () => {
    if (document.querySelector(".show") !== null) {
      const activeMenus = document.querySelectorAll(".show");
      activeMenus.forEach((activeMenu) => {
        if (activeMenu !== menuColor) activeMenu.classList.remove("show");
      });
    }
    menuColor.classList.toggle("show");
    menuColor.classList.toggle("active");
  });

  dropItemColors.forEach((item) => {
    item.addEventListener("click", () => {
      menuColor.classList.toggle("show");
      menuColor.classList.toggle("active");
    });
  });

  // Click ngoài để đóng
  document.addEventListener("click", (e) => {
    // Nếu click không nằm trong menuSize và không phải button
    if (!menuSize.contains(e.target) && !btnSize.contains(e.target)) {
      menuSize.classList.remove("show", "active");
    }
    // Nếu click không nằm trong menuColor và không phải button
    if (!menuColor.contains(e.target) && !btnColor.contains(e.target)) {
      menuColor.classList.remove("show", "active");
    }
  });

  // document.addEventListener("click", () => {
  //   if (document.querySelector(".show") !== null) {
  //     const activeMenus = document.querySelectorAll(".show");
  //     activeMenus.forEach((activeMenu) => {
  //       activeMenu.classList.remove("show");
  //     });
  //   }
  // });
  // menuSize.addEventListener("transitionend", () => {
  //   if (!menuSize.classList.contains("show")) {
  //     menuSize.style.display = "none";
  //   }
  // });
}

renderCartItemContainer();
