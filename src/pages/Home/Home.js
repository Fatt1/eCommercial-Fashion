const carouselItems = document.querySelectorAll(".carousel-item");
function carousel(index) {
  const carouselContainer = document.querySelector(".carousel-container--list");

  carouselContainer.style.transform = `translateX(-${100 * index}%)`;
}
let currentIndex = 0;
function moveToSlide(index) {
  const carouselContainer = document.querySelector(".carousel-container--list");
  carouselContainer.style.transform = `translateX(-${100 * index}%)`;
  document.querySelectorAll(".carousel__dot").forEach((dot) => {
    dot.classList.remove("active");
  });
  document.querySelectorAll(".carousel__dot")[index].classList.add("active");
}

const carouselWrapper = document.querySelector(".carousel-wrapper");
const carouselWrapperButtons = carouselWrapper.querySelectorAll("button");

carouselWrapper.addEventListener("mouseover", () => {
  document;
  carouselWrapperButtons.forEach((btn) => {
    btn.style.opacity = 1;
  });
});

carouselWrapper.addEventListener("mouseout", () => {
  document;
  carouselWrapperButtons.forEach((btn) => {
    btn.style.opacity = 0;
  });
});

const carouselWrapperButtonsPrev = carouselWrapper.querySelector(
  ".carousel--btn__prev"
);
const carouselWrapperButtonsNext = carouselWrapper.querySelector(
  ".carousel--btn__next"
);

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

carouselWrapperButtonsNext.addEventListener("click", () => {
  // tránh vô index 3
  currentIndex = (currentIndex + 1) % carouselItems.length;
  moveToSlide(currentIndex);
  startAutoSlide(); //bắt đầu chạy lại cái bộ đếm 5s sau khi bấm nút
});

carouselWrapperButtonsPrev.addEventListener("click", () => {
  // hoặc sài if cũng dc :v
  currentIndex =
    (currentIndex - 1 + carouselItems.length) % carouselItems.length;
  moveToSlide(currentIndex);
  startAutoSlide();
});

let autoSlide;

function startAutoSlide() {
  clearInterval(autoSlide); // xóa interval cũ để cờ lear reset lại cái bộ đếm 5s
  autoSlide = setInterval(() => {
    currentIndex = (currentIndex + 1) % carouselItems.length;
    moveToSlide(currentIndex);
  }, 5000);
}

startAutoSlide();
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
