export default function CartSection() {
  return `
    <section class="cart">
        <div class="cart-info">
          <div class="product-main">
            <input
              type="checkbox"
              class="product-main__checkbox-all"
              name=""
              id=""
            />
            Tất Cả Sản Phẩm
          </div>
          <div class="product-size">Kích Cỡ</div>
          <div class="product-color">Màu Sắc</div>
          <div class="product-price">Đơn Giá</div>
          <div class="product-quantity">Số Lượng</div>
          <div class="product-total">Số Tiền</div>
          <div class="product-action">Thao Tác</div>
        </div>
        <div class="cart-item-container">
          <!-- cartItem -->
        </div>
      </section>
    `;
}
