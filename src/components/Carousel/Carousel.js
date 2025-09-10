export default function Carousel() {
  return `
  <div class="carousel">
        <div class="main-content">
          <div class="carousel-wrapper">
            <button class="carousel--btn__prev">
              <img src="../assets/Expo.png" />
            </button>
            <div class="carousel-container--list">
              <div dataset-index="0" class="carousel-item">
                <img src="../assets/carousel-3.jpg" />
              </div>
              <div dataset-index="1" class="carousel-item">
                <img src="../assets/carousel-2.jpg" />
              </div>
              <div dataset-index="2" class="carousel-item">
                <img src="../assets/carousel-1.jpg" />
              </div>
            </div>
            <button class="carousel--btn__next">
              <img src="../assets/Expo.png" alt="" />
            </button>
          </div>
        </div>
        <div class="carousel-dots-container">
          <span class="carousel__dot active"></span>
          <span class="carousel__dot"></span>
          <span class="carousel__dot"></span>
        </div>
      </div>
  `;
}

export function setupCarousel() {
  let slides = document.querySelectorAll(".carousel-item"); //lấy các item bỏ vô array
  const carouselContainer = document.querySelector(".carousel-container--list");
  const dots = Array.from(document.querySelectorAll(".carousel__dot"));
  if (slides.length > 0) {
    if (slides.length > 0) {
      const firstClone = slides[0].cloneNode(true);
      const lastClone = slides[slides.length - 1].cloneNode(true); //clone đầu cuối
      firstClone.classList.add("clone");
      lastClone.classList.add("clone"); //thêm class để phân beiejt lúc sau

      carouselContainer.appendChild(firstClone);
      carouselContainer.insertBefore(lastClone, slides[0]);

      slides = document.querySelectorAll(".carousel-item"); //update lại slide

      let currentIndex = 1; // lúc này index 0 là cái last rồi
      let isAnimating = false; //tét
      const transitionTime = 1000; // ms (1s) - giữ đồng bộ với CSS

      carouselContainer.style.transition = "none";
      carouselContainer.style.transform = `translateX(-${100 * currentIndex}%)`;

      carouselContainer.offsetHeight;
      carouselContainer.style.transition = `transform ${
        transitionTime / 1000
      }s ease`;

      // dot đầu đừng bị lỗi
      updateDotsFromIndex(currentIndex);

      function updateDotsFromIndex(idx) {
        const realTotal = dots.length; //vì length của dot nhỏ hơn 2 cái
        const dotIndex = (idx - 1 + realTotal) % realTotal;
        dots.forEach((d) => d.classList.remove("active"));
        if (dots[dotIndex]) dots[dotIndex].classList.add("active");
      }

      function moveToIndex(idx) {
        if (idx < 0 || idx > slides.length - 1) idx = 0; //chặn out of range

        if (isAnimating) return; //phải chạy xong mới bấm đc
        isAnimating = true;
        carouselContainer.style.transition = `transform ${
          transitionTime / 1000
        }s ease`;
        currentIndex = idx;
        carouselContainer.style.transform = `translateX(-${
          100 * currentIndex
        }%)`;
        updateDotsFromIndex(currentIndex);

        //phải đợi xong mới chạy dc nên set time cho nó lâu thêm 1 tí
        setTimeout(() => {
          isAnimating = false;
        }, transitionTime + 50);
      }

      const btnPrev = document.querySelector(".carousel--btn__prev");
      const btnNext = document.querySelector(".carousel--btn__next");

      btnNext.addEventListener("click", () => {
        moveToIndex(currentIndex + 1);
        restartAutoSlide();
      });

      btnPrev.addEventListener("click", () => {
        moveToIndex(currentIndex - 1);
        restartAutoSlide();
      });

      //thêm cái nhỏ nếu click dot thì tới đó lun
      dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
          moveToIndex(i + 1);
          restartAutoSlide();
        });
      });

      carouselContainer.addEventListener("transitionend", () => {
        //
        console.log(currentIndex);
        if (slides[currentIndex].classList.contains("clone")) {
          // nếu đang ở clone thì tắt tran để tele về cái hình thật liền luôn nên k phân biệt dc
          carouselContainer.style.transition = "none";

          if (currentIndex === slides.length - 1) {
            currentIndex = 1;
          } else if (currentIndex === 0) {
            currentIndex = slides.length - 2;
          }

          carouselContainer.style.transform = `translateX(-${
            100 * currentIndex
          }%)`;

          carouselContainer.offsetHeight;

          // bật lại trans
          carouselContainer.style.transition = `transform ${
            transitionTime / 1000
          }s ease`;
        }
        // chuyển xong mới thao tác dc
        isAnimating = false;
        updateDotsFromIndex(currentIndex);
      });

      const carouselWrapper = document.querySelector(".carousel-wrapper");
      const carouselWrapperButtons = carouselWrapper.querySelectorAll("button");

      carouselWrapper.addEventListener("mouseover", () => {
        carouselWrapperButtons.forEach((btn) => {
          btn.style.opacity = 1;
        });
        stopAutoSlide(); // dừng auto khi hover
      });

      carouselWrapper.addEventListener("mouseout", () => {
        carouselWrapperButtons.forEach((btn) => {
          btn.style.opacity = 0;
        });
        restartAutoSlide(); // resume khi out
      });

      let autoSlideId = null;
      function startAutoSlide() {
        stopAutoSlide();
        autoSlideId = setInterval(() => {
          moveToIndex(currentIndex + 1);
        }, 5000);
      }
      function stopAutoSlide() {
        if (autoSlideId) {
          clearInterval(autoSlideId);
          autoSlideId = null;
        }
      }
      function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
      }

      startAutoSlide();
    }
  }
}
