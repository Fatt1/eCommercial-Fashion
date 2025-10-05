import {
  filterProductByName,
  getAllProducts,
  getSkusByProductId,
} from "../services/productService.js";
import { createPagination } from "../helper/helper.js";

let currentPage = 1;
const pageSize = 5;

function handleSearch() {
  const keyword = document.querySelector(".product-search-input").value.trim();
  const { items, totalPages } = filterProductByName(
    keyword,
    currentPage,
    pageSize
  );
  renderProductList(items);
  //   renderPagination(totalPages, currentPage);
}

function renderProductList(products) {
  const container = document.querySelector(".product-result-item");
  container.innerHTML = products
    .map(
      (p) => `
    <div class="product-item">
      <div>${p.name}</div>
      <button onclick="renderSkuList('${p.id}')">Xem thêm</button>
    </div>
  `
    )
    .join("");
}

function renderSkuList(productId) {
  const skus = getSkusByProductId(productId);
  const listHtml = skus
    .slice(0, 3)
    .map(
      (s) => `
    <div class="sku">
      <span>${s.skuId}</span>
      <span>${s.stock}</span>
    </div>
  `
    )
    .join("");
  document.querySelector(`#sku-container-${productId}`).innerHTML = listHtml;
}
