import {
  filterProducts,
  getAllProducts,
} from "../../../services/productService.js";
import ProductList from "../../../components/ProductList/ProductList.js";

export default function ProductListProductPage({
  pageNumber,
  ...filterParams
}) {
  const response = filterProducts({ pageNumber, ...filterParams });

  const products = response.items;
  return `
                       ${ProductList({
                         products,
                         className: "product-list",
                       })}
                        <div class="pagination">
                            <a href="#" class="prev-btn pagination-btn ${
                              response.isPrev ? "" : "disable-pagination-link"
                            }" data-index='${
    pageNumber - 1
  }'><img src="../assets/prev-btn.svg"></a>
                            
                            ${generatePaginationBtnHtml(
                              response.totalPages,
                              response.pageNumber
                            )}
                            <a href="#" class="pagination-btn next-btn ${
                              response.isNext ? "" : "disable-pagination-link"
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
