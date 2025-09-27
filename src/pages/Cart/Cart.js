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
import { getSkuByProductId, getSkuBySkuId } from "../../models/Sku.js";
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
                
                ${renderSizeButton(matchingProduct, skuId)} 
                
                ${renderDropDownMenuSize(matchingProduct, skuId)}
              </div>
            </div>
            <div class="product-color">
              
              <div class="dropdown">
                
                  ${renderColorButton(matchingProduct, skuId)} 
                ${renderDropDownMenuColor(matchingProduct, skuId)}
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

  function renderDropDownMenuColor(product, skuId) {
    const sku = getSkuBySkuId(skuId, product.id);
    let variationColor = undefined;
    product.variations.forEach((variation) => {
      if (variation.name === "Màu sắc") {
        variationColor = variation;
      }
    });
    let variationColorContent = "";
    // let variationSizeContent = "";
    // tạo content cho variation color
    if (variationColor) {
      let variationColorIndex = 0;
      variationColorContent += `
    <ul class="dropdown-menu dropdown-menu__color dropdown-menu__color-${skuId}">
      ${variationColor.variationOptions
        .map((option) => {
          if (variationColorIndex === sku.tierIndexes[0]) {
            // console.log(
            //   document.querySelector(`.dropdown-button__color-${skuId}`)
            // );
          }
          return `
                        <li class="dropdown-item dropdown-item__color" 
                          data-index-color-sku="${variationColorIndex++}"
                          data-sku-id="${skuId}"
                          data-variation-id = "${option.id}"
                          data-type ="color">
                            ${option.name}
                        </li>
                      `;
        })
        .join(" ")}
    </ul>`;
      return variationColorContent;
    }
  }
  function renderDropDownMenuSize(product, skuId) {
    let variationSize = undefined;
    product.variations.forEach((variation) => {
      if (variation.name !== "Màu sắc") {
        variationSize = variation;
      }
    });
    let variationSizeContent = "";
    // let variationSizeContent = "";
    // tạo content cho variation color
    if (variationSize) {
      let variationSizeIndex = 0;
      variationSizeContent += `
    <ul class="dropdown-menu dropdown-menu__size dropdown-menu__size-${skuId}">
      ${variationSize.variationOptions
        .map(
          (option) => `
                        <li class="dropdown-item dropdown-item__size" 
                          data-index-size-sku="${variationSizeIndex++}"
                          data-sku-id="${skuId}"
                          data-variation-id = "${option.id}"
                          data-type ="size">
                            ${option.id}
                        </li>
                      `
        )
        .join(" ")}
    </ul>`;
      return variationSizeContent;
    }
  }
  function renderColorButton(product, skuId) {
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
          colorName = `<button class="dropdown-button dropdown-button__color dropdown-button__color-${skuId}"
                  data-sku-id = ${skuId} 
                  data-index-color = ${variationColorIndex - 1}
                  data-product-id = ${product.id}
                >
                  ${option.name}
                   <img src="../assets/dropdown-icon.svg" />
                </button>`;
        }
      });
    }
    return colorName;
  }
  function renderSizeButton(product, skuId) {
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
          sizeName = `<button class="dropdown-button dropdown-button__size dropdown-button__size-${skuId}"
                  data-sku-id = ${skuId} 
                  data-index-size = ${variationSizeIndex - 1}
                  data-product-id = ${product.id}
                >
                  ${option.id}
                   <img src="../assets/dropdown-icon.svg" />
                </button>`;
        }
      });
    }
    return sizeName;
  }

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
    console.log("hello" + checkBoxCheckAll());
    if (checkBoxCheckAll2() === true) {
      checkboxAll.checked = true;
    }
    // if (checkBoxCheckAll() === true) {
    //   checkboxAll.checked = true;
    //   console.log("checkAll" + checkBoxCheckAll());
    // }
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
          saveToStorage();
          console.log(cart);
        } else {
          checkbox.checked = false;
          item.tick = false;
          saveToStorage();
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
          if (checkBoxCheckAll() === true) {
            checkboxAll.checked = true;
            console.log("checkAll" + checkBoxCheckAll());
          }
          saveToStorage();
        } else {
          console.log("bỏ tick: ", checkbox);
          item.tick = false;
          console.log(cart);
          checkboxAll.checked = false;
          saveToStorage();
        }
      });
    });
  }

  //check xem tất cả check box đã bật lên chưa
  function checkBoxCheckAll() {
    let isAll = true;
    const checkboxes = document.querySelectorAll(".product-main__checkbox");
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked === false) {
        isAll = false;
        console.log("co false");
      }
    });
    return isAll;
  }
  function checkBoxCheckAll2() {
    let isAll = true;

    const checkboxes = document.querySelectorAll(".product-main__checkbox");
    checkboxes.forEach((checkbox) => {
      const skuId = checkbox.dataset.skuId;
      const item = cart.find((c) => c.skuId === skuId);
      if (item.tick === false) {
        isAll = false;
      }
    });
    return isAll;
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

  handleClickQuantityButton();
  function handleClickQuantityButton() {
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
  }
  // plusButton.addEventListener("click", () => {
  //   let value = parseInt(inputQuantity.value);
  //   inputQuantity.value = value + 1;
  // });

  handleClickMenuSizeColor();
  function handleClickMenuSizeColor() {
    //add toggle on/off menu khi click vào btn size&color
    const btnSizes = document.querySelectorAll(".dropdown-button__size");

    btnSizes.forEach((btnSize) => {
      btnSize.addEventListener("click", () => {
        const skuId = btnSize.dataset.skuId;
        const menuSize = document.querySelector(
          `.dropdown-menu__size-${skuId}`
        );
        if (document.querySelector(".show") !== null) {
          const activeMenus = document.querySelectorAll(".show");
          activeMenus.forEach((activeMenu) => {
            if (activeMenu !== menuSize) activeMenu.classList.remove("show");
          });
        }

        menuSize.classList.toggle("show");
        menuSize.classList.toggle("active");
      });
    });

    //add toggle on/off menu khi click vào btn size&color
    const btnColors = document.querySelectorAll(".dropdown-button__color");

    btnColors.forEach((btnColor) => {
      btnColor.addEventListener("click", () => {
        const skuId = btnColor.dataset.skuId;
        const menuColor = document.querySelector(
          `.dropdown-menu__color-${skuId}`
        );
        if (document.querySelector(".show") !== null) {
          const activeMenus = document.querySelectorAll(".show");
          activeMenus.forEach((activeMenu) => {
            if (activeMenu !== menuColor) activeMenu.classList.remove("show");
          });
        }
        menuColor.classList.toggle("show");
        menuColor.classList.toggle("active");
      });
    });

    const dropItemSizes = document.querySelectorAll(".dropdown-item__size");
    // click vo tat + handle change sku
    dropItemSizes.forEach((item) => {
      const skuId = item.dataset.skuId;
      item.addEventListener("click", () => {
        const menuSize = document.querySelector(
          `.dropdown-menu__size-${skuId}`
        );
        // if (item.dataset.type == "color") {
        //   changeSkuClickDropItemColor(skuId, item.dataset.indexColorSku);
        //   console.log("color");
        // } else if (item.dataset.type == "size") {
        //   changeSkuClickDropItemSize(skuId, item.dataset.indexSizeSku);
        //   console.log();
        // }
        if (item.dataset.type == "size") {
          changeSkuClickDropItemSize(skuId, item.dataset.indexSizeSku);
          console.log("size");
        }
        menuSize.classList.toggle("show");
        menuSize.classList.toggle("active");
      });
    });

    function changeSkuClickDropItemSize(skuId, sizeIndex) {
      let tierIndexes = [0, 0];

      // Lấy lại color hiện tại đang được chọn từ button màu
      const item = document.querySelector(`.dropdown-button__color-${skuId}`);
      tierIndexes[0] = Number(item.dataset.indexColor); // giữ color cũ
      tierIndexes[1] = Number(sizeIndex); // gán size mới

      console.log("tierIndexes size", tierIndexes);

      const newSku = getSkuByProductId(item.dataset.productId, tierIndexes);
      console.log(item.dataset.productId, tierIndexes, newSku);

      // Cập nhật lại sku trong giỏ
      const cartItem = cart.find((c) => c.skuId === skuId);
      if (cartItem && newSku) {
        cartItem.skuId = newSku.id;
        saveToStorage();
        renderCartItemContainer();
      }
    }

    const dropItemColors = document.querySelectorAll(".dropdown-item__color");
    // click ben vô thì tắt
    dropItemColors.forEach((item) => {
      const skuId = item.dataset.skuId;
      item.addEventListener("click", () => {
        const menuColor = document.querySelector(
          `.dropdown-menu__color-${skuId}`
        );
        if (item.dataset.type == "color") {
          changeSkuClickDropItemColor(skuId, item.dataset.indexColorSku);
          console.log("color");
        }
        menuColor.classList.toggle("show");
        menuColor.classList.toggle("active");
      });
    });

    function changeSkuClickDropItemColor(skuId, colorIndex) {
      let tierIndexes = [0, 0];
      // console.log(typeof tierIndexes);
      tierIndexes[0] = Number(colorIndex);
      const item = document.querySelector(`.dropdown-button__size-${skuId}`);
      tierIndexes[1] = Number(item.dataset.indexSize);
      console.log(tierIndexes);
      const newSku = getSkuByProductId(item.dataset.productId, tierIndexes);
      console.log(item.dataset.productId + " " + tierIndexes);
      console.log(newSku);
      // console.log(typeof item.dataset.productId + " " + typeof tierIndexes);
      const cartItem = cart.find((c) => c.skuId === skuId);
      console.log(cartItem);
      cartItem.skuId = newSku.id;
      saveToStorage();
      console.log(cart);
      renderCartItemContainer();
    }

    // function changeSkuClickDropItemColor2(skuId, colorIndex) {
    //   const cartItem = cart.find((c) => c.skuId === skuId);
    //   const productId = cartItem.productId;

    //   // Lấy SKU hiện tại trong cart để giữ nguyên sizeIndex
    //   const currentSku = getSkuBySkuId(skuId, productId);
    //   const sizeIndex = currentSku.tierIndexes[1]; // giữ size cũ

    //   const newTierIndexes = [Number(colorIndex), sizeIndex];
    //   const newSku = getSkuByProductId(productId, newTierIndexes);

    //   if (newSku) {
    //     cartItem.skuId = newSku.id;
    //     saveToStorage();
    //     renderCartItemContainer();
    //   } else {
    //     console.warn("Không tìm thấy SKU với tierIndexes:", newTierIndexes);
    //   }
    // }

    //chưa chỉnh lại cái này nó vẫn chưa active khi chuyển thành nhiều item
    // Click ngoài để đóng
    // document.addEventListener("click", (e) => {
    //   // Nếu click không nằm trong menuSize và không phải button
    //   if (!menuSize.contains(e.target) && !btnSize.contains(e.target)) {
    //     menuSize.classList.remove("show", "active");
    //   }
    //   // Nếu click không nằm trong menuColor và không phải button
    //   if (!menuColor.contains(e.target) && !btnColor.contains(e.target)) {
    //     menuColor.classList.remove("show", "active");
    //   }
    // });

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
}

function handleClickDropDownItem(skuId) {}

renderCartItemContainer();
