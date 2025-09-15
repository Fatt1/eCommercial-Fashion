import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function render() {
  const root = document.getElementById("root");
  root.innerHTML = `
  ${Header}
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  render();
});

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

render();
