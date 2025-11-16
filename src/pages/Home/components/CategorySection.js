import { getAllCategoriesByLevel } from "../../../services/categoryService.js";
import { loadProductPage } from "../../../pages/Product/Product.js";
export default function CategorySection() {
  const categories = getAllCategoriesByLevel(0);
  return `
     <div class="category-home">
        <div class="main-content">
          <h2 class="header-text">DANH MỤC</h2>
          <div class="category-list">
            <div class="category-list-carousel">
            ${categories
              .slice(0, 4)
              .map((cate) => {
                return `
              <div class="category-list-item">
              <img
                class="category-image"
                src="../assets/categories/${cate.image}"
                alt=""
              />
              <div class="category-list-item__overlay"></div>
              <p data-cate-id="${cate.id}" class="category-item__title">${cate.name}</p>
            </div>
              `;
              })
              .join(" ")}
            </div>
          </div>
         
        </div>
      </div>
  `;
}
export function setupCategorySection() {
  // Hover effect cho category items
  document.querySelectorAll(".category-list-item").forEach((elm) => {
    elm.addEventListener("mouseover", () => {
      const overlayElem = elm.querySelector(".category-list-item__overlay");
      overlayElem.style.opacity = 1;
      elm.querySelector(".category-image").style.transform = "scale(1.2)";
    });

    elm.addEventListener("mouseout", () => {
      elm.querySelector(".category-list-item__overlay").style.opacity = 0;
      elm.querySelector(".category-image").style.transform = "scale(1)";
    });
  });

  document.querySelectorAll(".category-item__title").forEach((titleElem) => {
    titleElem.addEventListener("click", () => {
      const categoryId = titleElem.dataset.cateId;
      loadProductPage(categoryId);
    });
  });

  // Khởi tạo trạng thái ban đầu
  updateButtons();
}
