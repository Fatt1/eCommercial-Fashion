export default function ProductCard({
  img,
  name,
  sale,
  salePrice,
  originalPrice,
}) {
  return `
      <div class="product-card">
              ${
                sale
                  ? `<div class="product-card__percentage">-${sale}%</div>`
                  : ""
              }
              <a class="product-card__img">
                <img src="${img}" alt=""
              /></a>
              <div class="product-card-desc">
                <a href="#" class="product-card__name"
                  >${name}</a
                >
                <div class="product-card-price">
                  <span class="product-card-price__sale">${salePrice}đ</span>
                  <span class="product-card-price__origin">${originalPrice}đ</span>
                </div>
              </div>
            </div>
  `;
}
