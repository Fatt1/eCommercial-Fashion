import { loadDataToLocalStorage } from "./helper/initialData.js";
import { DB_CONTEXT_KEY } from "./constant/Constant.js";

window.addEventListener("scroll", (event) => {
  const pageY = 100;

  const scrollToTop = document.querySelector(".scroll-to-top-container");
  if (pageYOffset < pageY) {
    scrollToTop.style.visibility = "hidden";
    scrollToTop.style.opacity = 0;
  } else {
    scrollToTop.style.visibility = "visible";
    scrollToTop.style.opacity = 1;
  }
});

document
  .querySelector(".scroll-to-top-container")
  .addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
