import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb.js";
import { ORDER_BY } from "../../../constant/Constant.js";
import {
  filterProducts,
  searchProducts,
} from "../../../services/productService.js";
import Filter, { handleFilterClick } from "./Filter.js";
import { filterParams, isSearching } from "../../Product/Product.js";
import ProductListProductPage, {
  handleClickProductListPage,
} from "./ProductListProductPage.js";

export default function ProductSection(categoryId) {
  let result;
  if (!isSearching) {
    filterParams.categoryId = categoryId;
    result = filterProducts({ categoryId, ...filterParams }, true);
  } else {
    const searchInput = document.querySelector(".search");
    const searchKey = searchInput.value;
    filterParams.searchKey = searchKey;

    result = searchProducts({ ...filterParams }, true);
  }

  return `
    <div class="product-section">
        <div class="main-content">
          ${BreadCrumb()}
          <div class="product-section-main-content">
          <div class="filter">
            ${Filter({
              categoryId,
              colorGroupFilter: result.colorGroupFilter,
              sizeGroupFilter: result.sizeGroupFilter,
              brandGroupFilter: result.brandGroupFilter,
              categoryGroupFilter: result.categoryGroupFilter,
            })}
          </div>
          
            <div class="right-product-section">
              <div class="sort-bar">
                <div class="left-sort-bar">
                  <button class="sort-bar-btn active">Mới nhất</button>
                   <button class="sort-bar-btn ">Bán chạy</button>
                    <button class="sort-bar-btn ">Đang khuyến mãi</button>
                  </div>
                  <div class="right-sort-bar">
                  <div class="dropdown">
                      <button class="price-btn">Giá <img src="../assets/dropdown-icon.svg"></button>
                      <ul class="dropdown-menu">
                          <li data-order='${
                            ORDER_BY.ascending
                          }' data-sort-by='price' class="dropdown-item sort-by-price">Giá: Thấp đến cao</li>
                          <li data-order='${
                            ORDER_BY.descending
                          }'  data-sort-by='price' class="dropdown-item sort-by-price"">Giá: Cao đến thấp</li>
                        </ul>
                    </div>
                    </div>
                </div>
                <div id="product-list-section">
                   ${ProductListProductPage({
                     pageNumber: 1,
                     products: result.items,
                     ...result,
                   })}
                </div>
             
            </div>
          </div>
        </div>
      </div>
  `;
}

export function handleClickProductSection() {
  handleClickProductListPage();
  handleFilterClick();
  handleSortByPrice();
}

function handleSortByPrice() {
  document.querySelectorAll(".sort-by-price").forEach((elem) =>
    elem.addEventListener("click", (event) => {
      const li = event.target;
      document.querySelector(".price-btn").textContent = li.textContent;
      li.classList.add("active");
      const order = li.dataset.order;
      const sortBy = li.dataset.sortBy;
      filterParams.order = order;
      filterParams.sortBy = sortBy;
      const result = filterProducts({
        categoryId: filterParams.categoryId,
        ...filterParams,
      });
      document.querySelector("#product-list-section").innerHTML =
        ProductListProductPage({ products: result.items, ...result });
      handleClickProductListPage();
    })
  );
}
