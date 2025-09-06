const carouselItems = document.querySelectorAll(".carousel-item");
// function carousel(index) {
//   const carouselContainer = document.querySelector(".carousel-container--list");

//   carouselContainer.style.transform = `translateX(-${100 * index}%)`;
// }

let slides = Array.from(document.querySelectorAll(".carousel-item")); //lấy các item bỏ vô array
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

    slides = Array.from(document.querySelectorAll(".carousel-item")); //update lại slide

    let currentIndex = 1; // lúc này index 0 là cái last rồi
    let isAnimating = false; //tét
    const transitionTime = 1000; // ms (1s) - giữ đồng bộ với CSS

    carouselContainer.style.transition = "none";
    carouselContainer.style.transform = `translateX(-${100 * currentIndex}%)`;

    console.log(carouselContainer.offsetHeight);
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
      if (isAnimating) return; //phải chạy xong mới bấm đc
      isAnimating = true;
      carouselContainer.style.transition = `transform ${
        transitionTime / 1000
      }s ease`;
      currentIndex = idx;
      carouselContainer.style.transform = `translateX(-${100 * currentIndex}%)`;
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

        console.log(carouselContainer.offsetHeight);

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

// let currentIndex = 0;
// function moveToSlide(index) {
//   const carouselContainer = document.querySelector(".carousel-container--list");
//   carouselContainer.style.transform = `translateX(-${100 * index}%)`;
//   document.querySelectorAll(".carousel__dot").forEach((dot) => {
//     dot.classList.remove("active");
//   });
//   document.querySelectorAll(".carousel__dot")[index].classList.add("active");
// }

//   carouselWrapperButtons.forEach((btn) => {});
// });

// carouselWrapperButtons.forEach((btn) => {
//   btn.addEventListener("click", () => {
//     moveToSlide(currentIndex++);
//   });
// });

// carouselWrapperButtonsNext.addEventListener("click", () => {
//   moveToSlide(currentIndex++);
// });

// startAutoSlide();
// setInterval(() => {
//   if (currentIndex >= 3) currentIndex = 0;
//   moveToSlide(currentIndex++);
// }, 5000);

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
