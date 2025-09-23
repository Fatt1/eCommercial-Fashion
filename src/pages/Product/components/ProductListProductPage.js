import {
  filterProducts,
  searchProducts,
} from "../../../services/productService.js";
import ProductList, {
  handClickProductList,
} from "../../../components/ProductList/ProductList.js";
import { filterParams, isSearching } from "../../Product/Product.js";
export default function ProductListProductPage({
  pageNumber,
  products,
  isPrev,
  isNext,
  totalPages,
}) {
  return `
                       ${ProductList({
                         products,
                         className: "product-list",
                       })}
                        <div class="pagination">
                            <a href="#" class="prev-btn pagination-btn ${
                              isPrev ? "" : "disable-pagination-link"
                            }" data-index='${
    pageNumber - 1
  }'><img src="../assets/prev-btn.svg"></a>
                            
                            ${generatePaginationBtnHtml(totalPages, pageNumber)}
                            <a href="#" class="pagination-btn next-btn ${
                              isNext ? "" : "disable-pagination-link"
                            }" data-index='${
    pageNumber + 1
  }'><img src="../assets/prev-btn.svg"></a>
                          </div>
  `;
}
function generatePaginationBtnHtml(totalPages, pageNumber) {
  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<a href="#" class="pagination-btn ${
      pageNumber === i ? "active" : ""
    }" data-index='${i}'>${i}</a>`;
  }
  return html;
}

export function handleClickProductListPage() {
  handClickProductList();
  document
    .querySelectorAll(".pagination .pagination-btn")
    .forEach((paginationBtn) => {
      paginationBtn.addEventListener("click", (event) => {
        console.log(filterParams);
        const pageNumber = Number(paginationBtn.dataset.index);

        let result;
        if (isSearching) {
          result = searchProducts({ ...filterParams, pageNumber });
        } else {
          result = filterProducts({ ...filterParams, pageNumber });
        }
        console.log(result);
        document.querySelector("#product-list-section").innerHTML =
          ProductListProductPage({
            pageNumber,
            products: result.items,
            ...result,
          });
        handleClickProductListPage();
      });
    });
}
