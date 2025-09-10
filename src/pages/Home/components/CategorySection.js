export default function CategorySection() {
  return `
     <div class="category-home">
        <div class="main-content">
          <h2 class="header-text">DANH MỤC</h2>
          <div class="category-list">
            <div class="category-list-item">
              <img
                class="category-image"
                src="../assets/category-1.jpg"
                alt=""
              />
              <div class="category-list-item__overlay"></div>
              <p class="category-item__title">MEN</p>
            </div>
            <div class="category-list-item">
              <img
                class="category-image"
                src="../assets/category-1.jpg"
                alt=""
              />
              <div class="category-list-item__overlay"></div>
              <p class="category-item__title">MEN</p>
            </div>
            <div class="category-list-item">
              <img
                class="category-image"
                src="../assets/category-1.jpg"
                alt=""
              />
              <div class="category-list-item__overlay"></div>
              <p class="category-item__title">MEN</p>
            </div>
            <div class="category-list-item">
              <img
                class="category-image"
                src="../assets/category-1.jpg"
                alt=""
              />
              <div class="category-list-item__overlay"></div>
              <p class="category-item__title">MEN</p>
            </div>
          </div>
          <div class="category-home-dots">
            <button class="category-home-dots__item less-than">
              <img src="../assets/lessthan.svg" />
            </button>
            <button class="category-home-dots__item greater-than">
              <img src="../assets/lessthan.svg" />
            </button>
          </div>
        </div>
      </div>
  `;
}
export function setupCategorySection() {
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
}
