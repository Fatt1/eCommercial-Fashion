import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb.js";
import ProductList from "../../../components/ProductList/ProductList.js";
import Filter from "./Filter.js";
import { getAllProducts } from "../../../services/productService.js";
const products = getAllProducts();

export default function ProductSection() {
  return `
    <div class="product-section">
        <div class="main-content">
          ${BreadCrumb()}
          <div class="product-section-main-content">
            ${Filter()}
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
                          <li class="dropdown-item">Giá: Thấp đến cao</li>
                          <li class="dropdown-item">Giá: Cao đến thấp</li>
                        </ul>
                    </div>
                    </div>
                </div>
                ${ProductList({
                  products,
                  className: "product-list",
                })}
                <div class="pagination">
                    <a href="#" class="prev-btn pagination-btn"><img src="../assets/prev-btn.svg"></a>
                    <a href="#" class="pagination-btn active">1</a>
                    <a href="#" class="pagination-btn">2</a>
                    <a href="#" class="pagination-btn">3</a>
                    <a href="#" class="pagination-btn next-btn"><img src="../assets/prev-btn.svg"></a>
                  </div>
            </div>
          </div>
        </div>
      </div>
  `;
}
