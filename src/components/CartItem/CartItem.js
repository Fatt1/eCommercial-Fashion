import {
  cart,
  removeFromCart,
  saveCart,
  updateCartQuantityStraight,
} from "../../services/cartService.js";
import { getProductById } from "../../services/productService.js";
import { formatNumber, unFormatNumber } from "../../helper/formatNumber.js";
import { getSkuByProductId, getSkuBySkuId } from "../../models/Sku.js";
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
              <div class="dropdown dropdown-cart">
                
                ${renderSizeButton(matchingProduct, skuId)} 
                
                ${renderDropDownMenuSize(matchingProduct, skuId)}
              </div>
            </div>
            <div class="product-color">
              
              <div class="dropdown dropdown-cart">
                
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
    let variationColor = product.variations.find((v) => v.name === "Màu sắc");
    if (!variationColor) return "";

    let html = `<ul class="dropdown-menu dropdown-menu-cart dropdown-menu__color dropdown-menu__color-${skuId}">`;
    variationColor.variationOptions.forEach((option, idx) => {
      const isActive = idx === sku.tierIndexes[0];
      html += `
      <li 
        class="dropdown-item dropdown-item-cart dropdown-item__color ${
          isActive ? "disabled" : ""
        }" 
        data-index-color-sku="${idx}"
        data-sku-id="${skuId}"
        data-variation-id="${option.id}"
        data-type="color"
      >
        ${option.name}
      </li>`;
    });
    html += "</ul>";
    return html;
  }

  function renderDropDownMenuSize(product, skuId) {
    const sku = getSkuBySkuId(skuId, product.id);
    let variationSize = product.variations.find((v) => v.name !== "Màu sắc");
    if (!variationSize) return "";

    let html = `<ul class="dropdown-menu dropdown-menu-cart dropdown-menu__size dropdown-menu__size-${skuId}">`;
    variationSize.variationOptions.forEach((option, idx) => {
      const isActive = idx === sku.tierIndexes[1];
      html += `
      <li 
        class="dropdown-item dropdown-item-cart dropdown-item__size ${
          isActive ? "disabled" : ""
        }" 
        data-index-size-sku="${idx}"
        data-sku-id="${skuId}"
        data-variation-id="${option.id}"
        data-type="size"
      >
        ${option.id}
      </li>`;
    });
    html += "</ul>";
    return html;
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
          saveCart();
          console.log(cart);
        } else {
          checkbox.checked = false;
          item.tick = false;
          saveCart();
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
          saveCart();
        } else {
          console.log("bỏ tick: ", checkbox);
          item.tick = false;
          console.log(cart);
          checkboxAll.checked = false;
          saveCart();
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

  calculateTotalCheckBox();
  function calculateTotalMoneyFinal() {
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

        calculateTotalCheckBox();

        saveCart();
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

        saveCart();

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

    const dropItemColors = document.querySelectorAll(".dropdown-item__color");
    dropItemColors.forEach((item) => {
      if (item.classList.contains("disabled")) return; // chặn click
      item.addEventListener("click", () => {
        const skuId = item.dataset.skuId;
        const menuColor = document.querySelector(
          `.dropdown-menu__color-${skuId}`
        );
        changeSkuClickDropItemColor2(skuId, item.dataset.indexColorSku);
        menuColor.classList.remove("show", "active");
      });
    });

    const dropItemSizes = document.querySelectorAll(".dropdown-item__size");
    dropItemSizes.forEach((item) => {
      if (item.classList.contains("disabled")) return; // chặn click
      item.addEventListener("click", () => {
        const skuId = item.dataset.skuId;
        const menuSize = document.querySelector(
          `.dropdown-menu__size-${skuId}`
        );
        changeSkuClickDropItemSize2(skuId, item.dataset.indexSizeSku);
        menuSize.classList.remove("show", "active");
      });
    });

    function changeSkuClickDropItemColor2(skuId, colorIndex) {
      const cartItem = cart.find((c) => c.skuId === skuId);
      if (!cartItem) return;

      const productId = cartItem.productId;
      const currentSku = getSkuBySkuId(skuId, productId);
      if (!currentSku) return;

      let tierIndexes = [...currentSku.tierIndexes];
      tierIndexes[0] = Number(colorIndex);

      const newSku = getSkuByProductId(productId, tierIndexes);
      if (!newSku) return;

      const existingItem = cart.find((c) => c.skuId === newSku.id);
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;

        const index = cart.findIndex((c) => c.skuId === skuId);
        if (index !== -1) cart.splice(index, 1);
      } else {
        cartItem.skuId = newSku.id;
      }

      saveCart();
      renderCartItemContainer();
    }

    function changeSkuClickDropItemSize2(skuId, sizeIndex) {
      const cartItem = cart.find((c) => c.skuId === skuId);
      if (!cartItem) return;

      const productId = cartItem.productId;
      const currentSku = getSkuBySkuId(skuId, productId);
      if (!currentSku) return;

      let tierIndexes = [...currentSku.tierIndexes];
      tierIndexes[1] = Number(sizeIndex);

      const newSku = getSkuByProductId(productId, tierIndexes);
      if (!newSku) return;

      const existingItem = cart.find((c) => c.skuId === newSku.id);
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
        const index = cart.findIndex((c) => c.skuId === skuId);
        if (index !== -1) cart.splice(index, 1);
      } else {
        cartItem.skuId = newSku.id;
      }

      saveCart();
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
    //     saveCart();
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
