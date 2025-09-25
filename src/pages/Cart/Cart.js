// import Header from "../../components/Header/Header.";
// import Footer from "../../components/Footer/Footer";
import {
  cart,
  removeFromCart,
  saveToStorage,
  updateCartQuantityStraight,
} from "../../models/Cart.js";
import { getProductById } from "../../services/productService.js";
import { formatNumber, unFormatNumber } from "../../helper/formatNumber.js";
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
                class="product-main__checkbox product-main__checkbox-${skuId}"
                data-sku-id = ${skuId}
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
                <button class="dropdown-button dropdown-button__size dropdown-button__size-${skuId}"
                  data-sku-id = ${skuId}
                >
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
                <button class="dropdown-button dropdown-button__color dropdown-button__color-${skuId}"
                 data-sku-id = ${skuId} 
                >
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
              <span class="product-price__old-price">${formatNumber(
                matchingProduct.priceInfo.originalPrice
              )}</span>
              <span class="product-price__current-price product-price__current-price-${skuId}">${formatNumber(
      matchingProduct.priceInfo.currentlyPrice
    )}</span>
            </div>
            <div class="product-quantity">
              <button class="product-quantity__button product-quantity__minus"
              data-sku-id = ${skuId}>
                -
              </button>
              <input class="product-quantity__input product-quantity-input-${skuId}" 
                value="${cartItem.quantity}" min="1" />
              <button class="product-quantity__button product-quantity__plus"
              data-sku-id = ${skuId}>
                +
              </button>
            </div>
            <div class="product-total product-total-${skuId}">
            ${formatNumber(
              matchingProduct.priceInfo.currentlyPrice * cartItem.quantity
            )}
            </div>
            <div class="product-action">
              <button class="product-action__button"
                data-sku-id = ${cartItem.skuId}
              >XÓA</button>
            </div>
          </div>
    `;
  });
  // console.log(cartSummaryHTML);
  document.querySelector(".cart-item-container").innerHTML = cartSummaryHTML;
  // }

  // createPage();

  // btn XÓA remove
  document.querySelectorAll(".product-action__button").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.skuId);

      renderCartItemContainer();
    });
  });

  //tick hết nếu chọn tickAll

  // tính toàn tiền nếu chọn sản phẩm (tick check box)
  addEventListenerCheckBox();
  function addEventListenerCheckBox() {
    // Lấy tất cả checkbox
    const checkboxAll = document.querySelector(".product-main__checkbox-all");
    const checkboxes = document.querySelectorAll(".product-main__checkbox");

    checkboxes.forEach((checkbox) => {
      const skuId = checkbox.dataset.skuId;
      const item = cart.find((c) => c.skuId === skuId);
      if (checkbox.checked === false) {
        if (item.tick === true) checkbox.checked = true;
        // console.log(item);
        // console.log(item.tick);
        // console.log(item);
      }
      // if (checkboxAll.checked === true){
      //   item.tick = true;
      // }

      //change cái tất cả box
      checkboxAll.addEventListener("change", () => {
        if (checkboxAll.checked) {
          checkbox.checked = true;
          item.tick = true;
          console.log(cart);
        } else {
          checkbox.checked = false;
          item.tick = false;
          console.log(cart);
        }
        calculateTotalCheckBox();
      });
      //change từng cái riêng
      checkbox.addEventListener("change", () => {
        calculateTotalCheckBox();
        if (checkbox.checked) {
          console.log("đã tick: ", checkbox);
          item.tick = true;
          console.log(cart);
        } else {
          console.log("bỏ tick: ", checkbox);
          item.tick = false;
          console.log(cart);
        }
      });
    });
  }

  function calculateTotalCheckBox() {
    let total = 0;
    let sumTotalMoney = 0;
    let sumTotalSaveMoney = 0;

    document.querySelectorAll(".cart-item").forEach((item) => {
      const checkbox = item.querySelector(".product-main__checkbox");

      const skuId = checkbox.dataset.skuId;
      const cartItem = cart.find((c) => c.skuId === skuId);

      // if (checkbox.checked) {
      //   const price = unFormatNumber(
      //     item.querySelector(".product-total").innerText
      //   );
      //   total += price;
      // }

      if (checkbox.checked) {
        const skuId = cartItem.skuId;
        const matchingProduct = getProductById(cartItem.productId);
        sumTotalMoney +=
          matchingProduct.priceInfo.currentlyPrice * cartItem.quantity;
        sumTotalSaveMoney +=
          (matchingProduct.priceInfo.originalPrice -
            matchingProduct.priceInfo.currentlyPrice) *
          cartItem.quantity;
      }
    });
    document.querySelector(".total__bot--money-left-total-number").textContent =
      formatNumber(sumTotalMoney);
    document.querySelector(".total__bot--money-left-save-number").textContent =
      formatNumber(sumTotalSaveMoney);
  }

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

  // const inputQuantity = document.querySelector(".product-quantity__input");

  // minusButtons.addEventListener("click", () => {
  //   let value = parseInt(inputQuantity.value);
  //   if (value > 1) inputQuantity.value = value - 1;
  // });
  calculateTotalCheckBox();
  function calculateTotalMoneyFinal() {
    // "priceInfo": {
    //     "originalPrice": 250000.0,
    //     "currentlyPrice": 250000.0
    let sumTotalMoney = 0;
    let sumTotalSaveMoney = 0;
    cart.forEach((cartItem) => {
      const skuId = cartItem.skuId;
      const matchingProduct = getProductById(cartItem.productId);
      sumTotalMoney +=
        matchingProduct.priceInfo.currentlyPrice * cartItem.quantity;
      sumTotalSaveMoney +=
        (matchingProduct.priceInfo.originalPrice -
          matchingProduct.priceInfo.currentlyPrice) *
        cartItem.quantity;
    });
    sumTotalMoney;

    document.querySelector(".total__bot--money-left-total-number").textContent =
      formatNumber(sumTotalMoney);
    document.querySelector(".total__bot--money-left-save-number").textContent =
      formatNumber(sumTotalSaveMoney);
  }

  function calculateTotalMoney(skuId) {
    const price = Number(
      unFormatNumber(
        document.querySelector(`.product-price__current-price-${skuId}`)
          .textContent
      )
    );
    console.log("price" + price);
    const quantity = document.querySelector(
      `.product-quantity-input-${skuId}`
    ).value;
    console.log("quantity" + quantity);
    document.querySelector(`.product-total-${skuId}`).textContent =
      formatNumber(price * quantity);
  }

  const minusButtons = document.querySelectorAll(".product-quantity__minus");
  const plusButtons = document.querySelectorAll(".product-quantity__plus");

  minusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const skuId = button.dataset.skuId;
      const inputQuantity = document.querySelector(
        `.product-quantity-input-${skuId}`
      );
      let value = parseInt(inputQuantity.value);
      if (value > 1) inputQuantity.value = value - 1;
      const item = cart.find((c) => c.skuId === skuId);
      if (item) item.quantity = Number(inputQuantity.value);

      calculateTotalMoney(skuId);
      updateCartQuantityStraight();
      // test
      calculateTotalCheckBox();

      saveToStorage();
    });
  });

  plusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const skuId = button.dataset.skuId;
      const inputQuantity = document.querySelector(
        `.product-quantity-input-${skuId}`
      );
      let value = parseInt(inputQuantity.value);
      inputQuantity.value = value + 1;
      const item = cart.find((c) => c.skuId === skuId);
      if (item) item.quantity = Number(inputQuantity.value);
      calculateTotalMoney(skuId);
      updateCartQuantityStraight();

      // test
      calculateTotalCheckBox();

      saveToStorage();

      // console.log(cart);
      // console.log("Da save");
    });
  });

  // plusButton.addEventListener("click", () => {
  //   let value = parseInt(inputQuantity.value);
  //   inputQuantity.value = value + 1;
  // });

  const btnSize = document.querySelector(".dropdown-button__size");
  const menuSize = document.querySelector(".dropdown-menu__size");

  const btnSizes = document.querySelectorAll(".dropdown-button__size");
  const menuSizes = document.querySelectorAll(".dropdown-menu__size");

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

  const dropItemSizes = document.querySelectorAll(".dropdown-item__size");
  // click vô thì tắt
  dropItemSizes.forEach((item) => {
    item.addEventListener("click", () => {
      menuSize.classList.toggle("show");
      menuSize.classList.toggle("active");
    });
  });

  const dropItemColors = document.querySelectorAll(".dropdown-item__color");
  // click ben vô thì tắt
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
