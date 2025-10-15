import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import { loadAddProduct } from "./addProduct.js";

import {
  getSkusByProductId,
  getDetailOneSku,
  getProductById,
  filterProductsForAdmin,
} from "../../../../services/productService.js";
import { formatNumber } from "../../../../helper/formatNumber.js";

function ProductManageHead() {
  return `
    <div class="product-manage__head">
      <div class="product-manage__head-left">
        <a data-tab-index="0" class="selected">Danh sách sản phẩm</a>
        <a data-tab-index="1">Đang hoạt động</a>
        <a data-tab-index="2">Đang ẩn</a>
      </div>
      <div class="product-manage__head-right">
        <button class="add-product-btn">Thêm sản phẩm</button>
      </div>
    </div>
  `;
}

function ProductSearch() {
  return `
    <div class="product-manage-main-search">
      <input type="text" size="50" placeholder="Tìm kiếm sản phẩm..." class='product-manage-main-search__text' />
      <button class="product-manage-main-search__button product-manage-main-search__button1">Áp Dụng</button>
      <button class="product-manage-main-search__button product-manage-main-search__button2">Nhập Lại</button>
    </div>
  `;
}

function ProductList() {
  return `
    <div class="cart product-result">
      <div class="cart-info product-result-info">
        <div class="product-status">Trạng thái</div>
        <div class="product-main product-result-info__main">Sản phẩm</div>
        <div class="product-price product-result-info__price">Giá</div>
        <div class="product-quantity product-result-info__stock">Kho hàng</div>
        <div class="product-action">Thao tác</div>
      </div>
      <div class="product-list-container"></div>
    </div>
  `;
}

export function renderProductAdminHtml() {
  document.getElementById("root").innerHTML = `
    <div class="admin">
      ${AdminNav()}
      <div class="admin__main">
        <div class="main-content__admin">
          <div class="product-manage">
            ${ProductManageHead()}
            <div class="product-manage-main">
              ${ProductSearch()}
              <div class="product-manage-main-result">
                <div class="product-manage-main-result__top">
                  <span class="product-manage-main-result__top--quantity">0 Sản Phẩm</span>
                </div>
                <div class="product-manage-main-result__bot">
                  ${ProductList()}
                </div>
                <div class="product-manage-main-result__end">
                  <div class="noti-message">Mỗi trang tối đa 5 sản phẩm</div>
                  <div class="pagination"></div>
                  <div class="page-index-track">Trang 0/0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  `;
}

function calculateStock(productId) {
  let stockSum = 0;
  const skus = getSkusByProductId(productId);
  skus.forEach((sku) => {
    stockSum += sku.stock;
  });
  return stockSum;
}

function renderProductList(products) {
  const resultContainer = document.querySelector(".product-list-container");
  resultContainer.innerHTML = "";

  if (!products || products.length === 0) {
    resultContainer.innerHTML = `<p style="padding: 16px;">Không tìm thấy sản phẩm nào.</p>`;
    return;
  }

  const productItemsHtml = products
    .map((p) => {
      const skus = getSkusByProductId(p.id);
      const totalSkus = skus.length;
      const statusText = p.status === "public" ? "Đang hoạt động" : "Đã ẩn";
      const statusClass =
        p.status === "public" ? "status-public" : "status-private";

      return `
        <div class="product-item-container" data-product-id="${p.id}">
          <div class="cart-item product-result-item__product">
            <div class="product-status ${statusClass}"><span>${statusText}</span></div>
            <div class="product-main">
              <img class="product-main__img" src="../assets/large-img-detail.png" alt="${
                p.name
              }" />
              <span>${p.name}</span>
            </div>
            <div class="product-price"><span class="product-price__current-price">${formatNumber(
              p.priceInfo.currentlyPrice
            )}đ</span></div>
            <div class="product-quantity"><span>${calculateStock(
              p.id
            )}</span></div>
            <div class="product-action">
            
            <a href="#!" class="update-link">Cập nhật</a>
            <br/>
            <br/>
            <a href="#!" class="delete-link">Xóa</a>
            
            </div>
          </div>
          ${
            totalSkus > 0
              ? `
            <div class="link-see-more">
              <a href="#!" class="show-sku-btn" data-product-id="${p.id}" data-sku-count="${totalSkus}">Xem Thêm ( Còn ${totalSkus} sản phẩm )</a>
            </div>`
              : ""
          }
          <div class="sku-container" id="sku-container-${p.id}"></div>
        </div>
      `;
    })
    .join("");

  resultContainer.innerHTML = productItemsHtml;
  attachSkuToggleListeners();
}

function attachSkuToggleListeners() {
  document.querySelectorAll(".show-sku-btn").forEach((btn) => {
    if (btn.dataset.listenerAttached) return;
    btn.dataset.listenerAttached = true;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = e.target.dataset.productId;
      const skuCount = e.target.dataset.skuCount;
      const container = document.getElementById(`sku-container-${productId}`);

      if (container.classList.contains("opened")) {
        container.classList.remove("opened");
        container.innerHTML = "";
        e.target.textContent = `Xem Thêm ( Còn ${skuCount} sản phẩm )`;
      } else {
        const skus = getSkusByProductId(productId);
        container.innerHTML = renderSkuList(skus);
        container.classList.add("opened");
        e.target.textContent = "Thu gọn";
      }
    });
  });
}

function renderSkuList(skus) {
  if (!skus || skus.length === 0)
    return `<div class="sku-empty">Không có SKU nào</div>`;
  return `<div class="skus product-result-item__skus">${skus
    .map((sku) => {
      const detail = getDetailOneSku(sku, sku.productId);
      const p = getProductById(sku.productId);
      if (detail) {
        return `
              <div class="sku">
                <div class="cart-item">
                  <div class="product-status"></div>
                  <div class="product-main product-main-sku">
                    <img class="product-main__img product-main__img-sku" src="../assets/large-img-detail.png" />
                    <div class="name-sku">
                      <span>${p.name}</span> 
                      <div>${detail.selectedDetails[0].name}, ${
          detail.selectedDetails[1].name
        }</div>
                    </div>
                  </div>
                  <div class="product-price"><span class="product-price__current-price">${formatNumber(
                    p.priceInfo.currentlyPrice || 0
                  )}đ</span></div>
                  <div class="product-quantity"><span>${
                    sku.stock || 0
                  }</span></div>
                  <div class="product-action"></div>
                </div>
              </div>`;
      }
      return "";
    })
    .join("")}</div>`;
}

export function setUpProductManagePlayable() {
  const searchInput = document.querySelector(
    ".product-manage-main-search__text"
  );
  const searchBtn = document.querySelector(
    ".product-manage-main-search__button1"
  );
  const clearBtn = document.querySelector(
    ".product-manage-main-search__button2"
  );

  let currentPage = 1;
  let totalPages = 1;
  let currentKeyword = "";
  let currentTab = 0;

  function renderPagination(pageNumber, totalPages) {
    const paginationContainer = document.querySelector(".pagination");
    const pageTrack = document.querySelector(".page-index-track");

    pageTrack.textContent = `Trang ${pageNumber}/${totalPages}`;

    let paginationHtml = `
          <button class="pagination-btn prev-btn" ${
            pageNumber === 1 ? "disabled" : ""
          }>
              &lt;
          </button>
          <button class="pagination-btn next-btn" ${
            pageNumber === totalPages ? "disabled" : ""
          }>
              &gt;
          </button>
        `;
    paginationContainer.innerHTML = paginationHtml;

    document.querySelector(".prev-btn").addEventListener("click", () => {
      if (currentPage > 1) {
        fetchAndRenderProducts(currentPage - 1);
      }
    });

    document.querySelector(".next-btn").addEventListener("click", () => {
      if (currentPage < totalPages) {
        fetchAndRenderProducts(currentPage + 1);
      }
    });
  }

  async function fetchAndRenderProducts(page = 1) {
    currentPage = page;

    let statusFilter = null;
    if (currentTab === 1) statusFilter = "public";
    if (currentTab === 2) statusFilter = "draft";

    const result = filterProductsForAdmin({
      searchKey: currentKeyword,
      status: statusFilter,
      pageNumber: currentPage,
      pageSize: 5,
    });

    totalPages = result.totalPages > 0 ? result.totalPages : 1;

    document.querySelector(
      ".product-manage-main-result__top--quantity"
    ).textContent = `${result.totalItems} Sản Phẩm`;

    renderProductList(result.items);
    renderPagination(currentPage, totalPages);
  }

  function handleSearch() {
    currentKeyword = searchInput.value.trim();
    fetchAndRenderProducts(1);
  }

  searchBtn.addEventListener("click", handleSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    handleSearch();
  });

  const tabLinks = document.querySelectorAll(".product-manage__head-left a");
  tabLinks.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabLinks.forEach((link) => link.classList.remove("selected"));
      tab.classList.add("selected");
      currentTab = parseInt(tab.dataset.tabIndex, 10);
      fetchAndRenderProducts(1);
    });
  });

  fetchAndRenderProducts(1);
}

function setUpProductAdmin() {
  setUpAdminNav();
  document.querySelector(".add-product-btn").addEventListener("click", () => {
    loadAddProduct();
  });
  setUpProductManagePlayable();
}

export function loadProductAdmin() {
  renderProductAdminHtml();
  setUpProductAdmin();
}
