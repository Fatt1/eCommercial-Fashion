export default function PromotionSection() {
  return `
    <div class="promotion">
        <div class="main-content">
          <div class="promotion-list">
            <img
              class="promotion-image__large"
              src="../assets/sale.webp"
              alt=""
            />
            <div class="promotion-image__behind">
              <div class="promotion-overlay"></div>
              <img
                class="promotion-small"
                src="../assets/promo-img-1.jpeg"
                alt=""
              />
              <img
                class="promotion-small"
                src="../assets/promo-img-2.jpg"
                alt=""
              />
              <img
                class="promotion-small"
                src="../assets/promo-img-3.jpg"
                alt=""
              />
              <img
                class="promotion-small"
                src="../assets/promo-img-4.jpg"
                alt=""
              />
            </div>

            <div class="timer-promotion">
              <div class="timer">
                <span id="day" class="promotion-timer__idicator">2</span> Ngày
              </div>
              <div class="timer">
                <span id="hour" class="promotion-timer__idicator">23</span> Giờ
              </div>
              <div class="timer">
                <span id="minute" class="promotion-timer__idicator">59</span>
                Phút
              </div>
              <div class="timer">
                <span id="second" class="promotion-timer__idicator">59</span>
                Giây
              </div>
            </div>
          </div>
          <a class="btn promotion-btn"> XEM THÊM</a>
        </div>
      </div>
  `;
}

export function setupPromotion() {
  function formatTime(value) {
    return value.toString().padStart(2, "0");
  }
  function timer() {
    const now = new Date();
    const day = document.querySelector("#day");
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    document.querySelector("#hour").innerHTML = formatTime(hour);

    document.querySelector("#minute").innerHTML = formatTime(minute);

    document.querySelector("#second").innerHTML = formatTime(second);
  }
  timer();
  setInterval(timer, 1000);
}
