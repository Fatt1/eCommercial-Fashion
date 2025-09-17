// import Header from "../../components/Header/Header.";
// import Footer from "../../components/Footer/Footer";

// function render() {
//   const root = document.getElementById("root");
//   root.innerHTML = `
//   ${Header}

//   `;
// }

// document.addEventListener("DOMContentLoaded", () => {
//   render();
// });

const minusButton = document.querySelector(".product-quantity__minus");
const plusButton = document.querySelector(".product-quantity__plus");
const inputQuantity = document.querySelector(".product-quantity__input");

minusButton.addEventListener("click", () => {
  let value = parseInt(inputQuantity.value);
  if (value > 1) inputQuantity.value = value - 1;
});
plusButton.addEventListener("click", () => {
  let value = parseInt(inputQuantity.value);
  inputQuantity.value = value + 1;
});

const btnSize = document.querySelector(".dropdown-button__size");
const menuSize = document.querySelector(".dropdown-menu__size");
btnSize.addEventListener("click", () => {
  if (document.querySelector(".show") !== null) {
    const activeMenus = document.querySelectorAll(".show");
    activeMenus.forEach((activeMenu) => {
      if (activeMenu !== menuSize) activeMenu.classList.remove("show");
    });
  }

  menuSize.classList.toggle("show");
  menuSize.classList.toggle("active");
});

const btnColor = document.querySelector(".dropdown-button__color");
const menuColor = document.querySelector(".dropdown-menu__color");
btnColor.addEventListener("click", () => {
  if (document.querySelector(".show") !== null) {
    const activeMenus = document.querySelectorAll(".show");
    activeMenus.forEach((activeMenu) => {
      if (activeMenu !== menuColor) activeMenu.classList.remove("show");
    });
  }
  menuColor.classList.toggle("show");
  menuColor.classList.toggle("active");
});

// document.addEventListener("click", () => {
//   if (document.querySelector(".show") !== null) {
//     const activeMenus = document.querySelectorAll(".show");
//     activeMenus.forEach((activeMenu) => {
//       activeMenu.classList.remove("show");
//     });
//   }
// });
// menuSize.addEventListener("transitionend", () => {
//   if (!menuSize.classList.contains("show")) {
//     menuSize.style.display = "none";
//   }
// });
