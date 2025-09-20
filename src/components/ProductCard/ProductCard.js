import { loadProductDetail } from "../../pages/Product/ProductDetails.js";
export default function ProductCard({ id, thumbnail, name, sale, priceInfo }) {
  return `
      <div class="product-card" data-product-id=${id}>
              ${
                sale
                  ? `<div class="product-card__percentage">-${sale}%</div>`
                  : ""
              }
              <a class="product-card__img">
                <img src="../assets/${thumbnail}" alt=""
              /></a>
              <div class="product-card-desc">
                <a class="product-card__name"
                  >${name}</a
                >
                <div class="product-card-price">
                  <span class="product-card-price__sale">${
                    priceInfo.currentlyPrice
                  }đ</span>
                  <span class="product-card-price__origin">${
                    priceInfo.originalPrice
                  }đ</span>
                </div>
              </div>
            </div>
  `;
}

// xử lí sự kiện cho product card
export function handleProductCardClick() {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const productId = card.dataset.productId;
      loadProductDetail(productId);
    });
  });
}
