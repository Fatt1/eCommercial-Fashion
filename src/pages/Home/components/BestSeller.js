import ProductList from "../../../components/ProductList/ProductList.js";
import { loadProductPage } from "../../Product/Product.js";

export default function BestSeller({ result }) {
  let defaultTab = true;
  return `<div class="best-seller">
    <div class="main-content">
      <h2 class="header-text">BÁN CHẠY NHẤT</h2>
      <ul class="category-best-seller">
        <li data-target="cate-001" class="category-best-seller-item active">
          <a>MEN</a>
        </li>
          <li data-target="cate-002" class="category-best-seller-item">
          <a>WOMEN</a>
        </li>
        <li data-target="cate-003" class="category-best-seller-item">
          <a>ACCESSORIES</a>
        </li>
      
      </ul>
     <div style="display: flex;">
        <a
        class="more-link"
          style="
                margin-left: auto;
                display: block;
                font-family: 'Roboto', sans-serif;
                font-size: 2.2rem;
                font-weight: bold;
              "
        >
          XEM THÊM &gt&gt
     </div>
      </a>
      ${result
        .map((cate) => {
          let content = `<div id="${cate.categoryId}" ${
            !defaultTab ? "hidden" : ""
          }>
         ${ProductList({
           products: cate.products,
           className: "product-list-best-seller",
         })}
        </div>`;
          defaultTab = false;
          return content;
        })
        .join(" ")}
      

    </div>
  </div>`;
}
export function setUpBestSeller() {
  document.querySelectorAll(".category-best-seller-item").forEach((item) =>
    item.addEventListener("click", () => {
      const cateId = item.dataset.target;

      const selectedTab = document.querySelector(
        ".category-best-seller-item.active"
      );
      selectedTab.classList.remove("active");
      document.getElementById(`${selectedTab.dataset.target}`).hidden = true;
      document.getElementById(cateId).hidden = false;
      item.classList.add("active");
    })
  );

  // Khi nhấn vào nút xem thêm
  document.querySelector(".more-link").addEventListener("click", () => {
    const selectedTab = document.querySelector(
      ".category-best-seller-item.active"
    );
    const cateId = selectedTab.dataset.target;
    loadProductPage(cateId);
  });
}
