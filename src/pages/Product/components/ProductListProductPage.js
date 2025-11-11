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

  // Nếu tổng số trang <= 5, hiển thị tất cả
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      html += `<a href="#" class="pagination-btn ${
        pageNumber === i ? "active" : ""
      }" data-index='${i}'>${i}</a>`;
    }
    return html;
  }

  // Logic cho nhiều hơn 5 trang:
  // Luôn hiển thị trang 1
  html += `<a href="#" class="pagination-btn ${
    pageNumber === 1 ? "active" : ""
  }" data-index='1'>1</a>`;

  // Nếu pageNumber > 3, thêm dấu "..."
  if (pageNumber > 3) {
    html += `<span class="pagination-ellipsis">...</span>`;
  }

  // Hiển thị tối đa 2 trang trước và 2 trang sau trang hiện tại (không tính trang 1 và trang cuối)
  let startPage = Math.max(2, pageNumber - 2);
  let endPage = Math.min(totalPages - 1, pageNumber + 2);

  // Điều chỉnh để luôn hiển thị đủ trang
  // Nếu đang ở đầu (trang 1, 2, 3), hiển thị 2, 3, 4
  if (pageNumber <= 3) {
    startPage = 2;
    endPage = Math.min(4, totalPages - 1);
  }

  // Nếu đang ở cuối (trang n-2, n-1, n), hiển thị n-3, n-2, n-1
  if (pageNumber >= totalPages - 2) {
    startPage = Math.max(2, totalPages - 3);
    endPage = totalPages - 1;
  }

  // Render các trang ở giữa
  for (let i = startPage; i <= endPage; i++) {
    html += `<a href="#" class="pagination-btn ${
      pageNumber === i ? "active" : ""
    }" data-index='${i}'>${i}</a>`;
  }

  // Nếu pageNumber < totalPages - 2, thêm dấu "..."
  if (pageNumber < totalPages - 2) {
    html += `<span class="pagination-ellipsis">...</span>`;
  }

  // Luôn hiển thị trang cuối (nếu totalPages > 1)
  if (totalPages > 1) {
    html += `<a href="#" class="pagination-btn ${
      pageNumber === totalPages ? "active" : ""
    }" data-index='${totalPages}'>${totalPages}</a>`;
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
