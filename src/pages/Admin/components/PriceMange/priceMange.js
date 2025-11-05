import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import {
  getAllProductForAdmin,
  updatePriceProductById,
} from "../../../../services/productService.js";
import {
  formatNumber,
  unFormatNumber,
} from "../../../../helper/formatNumber.js";
import { preventInputTextForNumberInput } from "../../../../helper/helper.js";
import { getAllCategoriesByLevel } from "../../../../services/categoryService.js";
import { filterProductsForPriceManage } from "../../../../services/priceService.js";
const PAGE_SIZE = 6;
let productList = [];
let filter = {
  categoryId: null,
  priceType: "gia-ban",
  priceValue: 0,
};
function renderPriceManageHtml() {
  const pageResult = filterProductsForPriceManage({
    ...filter,
    pageSize: PAGE_SIZE,
    pageNumber: 1,
  });
  console.log(pageResult);
  productList = pageResult.items;
  const categoriesLevel = getAllCategoriesByLevel();

  document.getElementById("root").innerHTML = `<div class="admin">
        ${AdminNav()}
<div class="admin__main">
  <div class="main-content __admin">
    <div class="priceManage_container">
      <div class="priceManage_header">
        <a>Quản lý giá bán</a>
        <button class="add_product_btn">Nhập sản phẩm</button>
      </div>
      <div class="priceMange_main_container">
        <div class="priceMange_main_content_header">
          <select class="price-filter">
            <option value="gia-ban">Giá bán</option>
            <option value="gia-von">Giá vốn</option>
            <option value="loi-nhuan">% Lợi nhuận</option>
          </select>
          <select class="catergory-filter">
            <option selected value="all">--Chọn danh mục--</option>
          ${categoriesLevel.map((cate) => {
            return `<option value="${cate.id}">${cate.name}</option>`;
          })}
          </select>
          <div class="right_object">
            <button class="apply-filter-btn">Áp dụng</button>
            <button class="reset-price-filter-btn">Nhập lại</button>
          </div>
        </div>
        <div class="price-find-container"><input class="price-find-input number-input" type="text" placeholder="Nhập giá để tìm kiếm..." /></div>
        <div class="main_content_header">
          <table>
            <thead class = "table_header">
              <tr>
                <th>Sản phẩm</th>
                <th>Giá Vốn</th>
                <th>% lợi nhuận</th>
                <th>Giá Bán</th>
                <th>% giảm giá</th>
                <th>Giá giảm</th>
                <th>Thao tác</th>
                </tr>
            </thead>
            ${TableBody(productList)}
          </table>
          <div class="pagination">
           
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

  renderPagination(pageResult.totalPages, 1, PAGE_SIZE);
}

function renderPagination(totalPages, currentPage, pageSize) {
  const paginationContainerDiv = document.createElement("div");
  paginationContainerDiv.classList.add("pagination");
  for (let i = 1; i <= totalPages; i++) {
    const pageItemDiv = document.createElement("div");
    pageItemDiv.classList.add("page-item");
    pageItemDiv.innerText = i;
    if (i === currentPage) {
      pageItemDiv.classList.add("active");
    }
    pageItemDiv.addEventListener("click", () => {
      const pageResult = filterProductsForPriceManage({
        ...filter,
        pageSize: pageSize,
        pageNumber: i,
      });

      productList = pageResult.items;
      document.querySelector("table").lastElementChild.remove();
      document.querySelector("table").innerHTML += TableBody(productList);
      renderPagination(pageResult.totalPages, i, pageSize);
      setUpHandleClickTableRow();
    });
    paginationContainerDiv.appendChild(pageItemDiv);
  }
  const existingPagination = document.querySelector(".pagination");
  if (existingPagination) {
    existingPagination.replaceWith(paginationContainerDiv);
  }
}

function TableBody(productList) {
  return `
  <tbody class = "table_body">
            ${productList.map((product) => TableRow(product)).join("")}
              </tbody>
  `;
}
function TableRow(product) {
  return `
    <tr data-product-id="${product.id}">
      <td>${product.name}</td> 
      <td><span class="import-price">${formatNumber(
        product.priceInfo.importPrice
      )}</span>đ</td> 
      <td><input class="number-input percentage-profit-input" type="text" value="${calculateProfitPercentage(
        product.priceInfo.importPrice,
        product.priceInfo.originalPrice
      )}" /></td> 
      <td><span class="original-price">${
        product.priceInfo.originalPrice === 0
          ? formatNumber(product.priceInfo.importPrice)
          : formatNumber(product.priceInfo.originalPrice)
      }</span>đ</td> 
      <td><input class="number-input percentage-sale-input" type="text" value="${calculateSalePercentage(
        product.priceInfo.originalPrice,
        product.priceInfo.currentlyPrice
      )}" /></td> 
      <td><span class="currently-price">${
        product.priceInfo.currentlyPrice == 0
          ? formatNumber(product.priceInfo.importPrice)
          : formatNumber(product.priceInfo.currentlyPrice)
      }</span>đ</td> 
      <td class="update-price-btn">Cập nhật</td> 
    </tr>
  `;
}
function calculateSalePercentage(originalPrice, currentlyPrice) {
  if (originalPrice === 0) return 0;
  return Math.floor(((originalPrice - currentlyPrice) / originalPrice) * 100);
}
function calculateProfitPercentage(importPrice, originalPrice) {
  if (importPrice === 0) return 0;
  if (originalPrice === 0) return 0;
  return Math.floor(((originalPrice - importPrice) / importPrice) * 100);
}
function setUpRenderPriceManage() {
  setUpAdminNav();
  setUpHandleClickTableRow();
  handleClickFilterApplyButton();
}
function setUpHandleClickTableRow() {
  preventInputTextForNumberInput();
  handleOnKeyPressPercentageInput();
  handleOnKeySaleInput();
  handleClickUpdatePriceButton();
}
export function loadPriceManagePage() {
  renderPriceManageHtml();
  setUpRenderPriceManage();
}

function handleClickFilterApplyButton() {
  document.querySelector(".apply-filter-btn").addEventListener("click", () => {
    const categorySelect = document.querySelector(".catergory-filter");
    const priceTypeSelect = document.querySelector(".price-filter");
    const categoryId =
      categorySelect.value === "all" ? null : categorySelect.value;
    const priceType = priceTypeSelect.value;
    const priceValueInput = document.querySelector(".price-find-input");
    const priceValue = Number(priceValueInput.value) || 0;
    filter.categoryId = categoryId;
    filter.priceType = priceType;
    filter.priceValue = priceValue;
    const pageResult = filterProductsForPriceManage({
      ...filter,
      pageSize: PAGE_SIZE,
      pageNumber: 1,
    });
    document.querySelector("table").lastElementChild.remove();
    document.querySelector("table").innerHTML += TableBody(pageResult.items);
    renderPagination(pageResult.totalPages, 1, PAGE_SIZE);
    setUpHandleClickTableRow();
  });
}

function handleClickUpdatePriceButton() {
  document.querySelectorAll(".update-price-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const tr = button.parentElement;
      const productId = tr.dataset.productId;
      const importPriceSpan = tr.querySelector(".import-price");

      const originalPriceSpan = tr.querySelector(".original-price");
      const currentlyPriceSpan = tr.querySelector(".currently-price");

      const importPrice = unFormatNumber(importPriceSpan.innerText);
      const originalPrice = unFormatNumber(originalPriceSpan.innerText);
      const currentlyPrice = unFormatNumber(currentlyPriceSpan.innerText);

      if (importPrice === 0) {
        alert("Giá vốn không thể bằng 0!");
        return;
      }

      const priceInfo = {
        currentlyPrice: currentlyPrice,
        importPrice: importPrice,
        originalPrice: originalPrice,
      };
      updatePriceProductById(productId, priceInfo);
      alert("Cập nhật giá thành công!");
    });
  });
}

function handleOnKeyPressPercentageInput() {
  document.querySelectorAll(".percentage-profit-input").forEach((input) => {
    input.addEventListener("keyup", () => {
      const tr = input.parentElement.parentElement;
      const importPriceSpan = tr.querySelector(".import-price");
      const importPriceValue = unFormatNumber(importPriceSpan.innerText);
      if (importPriceValue === 0) {
        return;
      }

      const spanOriginalPrice = tr.querySelector(".original-price");
      const valueInput = Number(input.value);
      const price = calculateOriginalPriceFromProfitPercentage(
        importPriceValue,
        valueInput
      );
      spanOriginalPrice.innerText = formatNumber(price);

      // Nếu có phần trăm giảm giá thì ta cũng cần cập nhật lại giá hiện tại
      const saleInput = tr.querySelector(".percentage-sale-input");
      var saleValue = Number(saleInput.value);
      if (saleValue > 0) {
        const spanCurrentlyPrice = tr.querySelector(".currently-price");
        const currentlyPrice = calculateCurrentlyPriceFromSalePercentage(
          price,
          saleValue
        );
        spanCurrentlyPrice.innerText = formatNumber(currentlyPrice);
      }
    });
  });
}

function handleOnKeySaleInput() {
  document.querySelectorAll(".percentage-sale-input").forEach((input) => {
    input.addEventListener("keyup", (e) => {
      const tr = input.parentElement.parentElement;
      const spanOriginalPrice = tr.querySelector(".original-price");
      const originalPriceValue = unFormatNumber(spanOriginalPrice.innerText);
      if (originalPriceValue === 0) {
        return;
      }
      const spanCurrentlyPrice = tr.querySelector(".currently-price");
      const valueInput = Number(input.value);
      const price = calculateCurrentlyPriceFromSalePercentage(
        originalPriceValue,
        valueInput
      );
      spanCurrentlyPrice.innerText = formatNumber(price);
    });
  });
}

function calculateOriginalPriceFromProfitPercentage(
  importPrice,
  profitPercentage
) {
  return importPrice + (profitPercentage / 100) * importPrice;
}
function calculateCurrentlyPriceFromSalePercentage(
  originalPrice,
  salePercentage
) {
  return originalPrice - (salePercentage / 100) * originalPrice;
}
