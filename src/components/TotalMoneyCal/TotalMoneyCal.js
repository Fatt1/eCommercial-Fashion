export default function TotalMoneyCal() {
  return `
    <section class="total-money-cal">
        <div class="total__top">
          <div class="total__top--voucher">
            <div class="total__top--voucher-left">
              <span><img src="../assets/Voucher.svg" alt="" /> </span>
              <span>Voucher</span>
            </div>
            <button>Chọn hoặc nhập mã</button>
          </div>
        </div>
        <div class="total__bot">
          <div class="total__bot--money">
            <div class="total__bot--money-left">
              <div class="total__bot--money-left-total">
                <span class="total__bot--money-left-total-line"
                  >Tổng cộng (0 Sản phẩm):</span
                >
                <span class="total__bot--money-left-total-number"
                  >447.000đ</span
                >
              </div>

              <div class="total__bot--money-left-save">
                <span>Tiết kiệm:</span>
                <span class="total__bot--money-left-save-number">300.000đ</span>
              </div>
            </div>
            <div class="total__bot--money-right">
              <button class="buy-now-btn">MUA NGAY</button>
            </div>
          </div>
        </div>
      </section>
    `;
}
