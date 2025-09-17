import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb.js";
import { ORDER_BY } from "../../../constant/Constant.js";
import Filter from "./Filter.js";

import ProductListProductPage from "./ProductListProductPage.js";

export default function ProductSection(categoryId) {
  return `
    <div class="product-section">
        <div class="main-content">
          ${BreadCrumb()}
          <div class="product-section-main-content">
            ${Filter({ categoryId })}
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
                   ${ProductListProductPage({ pageNumber: 1, categoryId })}
                </div>
             
            </div>
          </div>
        </div>
      </div>
  `;
}
