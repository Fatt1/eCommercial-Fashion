import { renderCheckout } from "../../pages/Cart/Checkout.js";
import { addNewAddress } from "../../services/userService.js";
import { renderAddressList } from "../ListAddressPopup/ListAddressPopup.js";
import PickerLocation, {
  setUpPickerLocation,
} from "../PickerLocation/PickerLocation.js";

export function renderAddressForm(isReturnAddressList) {
  document.getElementById("address-form-popup").style.display = "block";
  document.getElementById("address-form-popup").innerHTML = `
    <div class="address-form-popup__header">Địa chỉ mới </div>
     <div class="address-form-container">
        <div class="form-group"> 
         <label for="fullName">Họ và tên</label>
          <input id="fullName" name="fullName" placeholder="Họ và tên" />
        </div>
         <div style="margin-left: 20px" class="form-group"> 
         <label for="phoneNumber">Số điện thoại</label>
          <input id="phoneNumber" name="phoneNumber" placeholder="Số điện thoại" />
     </div>
     </div>
     ${PickerLocation()}
      <div class="form-group address-form"> 
         <label for="address">Đường</label>
          <input id="address" name="address" placeholder="Đường" />
        </div>
      </div>
    <div class="address-form-action">
        <button class="return-btn">Trở lại</button>
        <button class="apply-voucher-btn agree-btn">Đồng ý</button>
      </div>
  `;

  setUpAddressForm(isReturnAddressList);
}

function setUpAddressForm(isReturnAddressList) {
  const loggedUser = JSON.parse(localStorage.getItem("user_info"));
  setUpPickerLocation();
  document.querySelector(".overlay").classList.add("show");
  document.getElementById("address-form-popup").style.left =
    Math.round(
      document.body.clientWidth / 2 -
        document.getElementById("address-form-popup").clientWidth / 2
    ) + "px";
  document.querySelector(".return-btn").addEventListener("click", () => {
    document.querySelector(".overlay").classList.remove("show");
    document.getElementById("address-form-popup").innerHTML = "";
    document.getElementById("address-form-popup").style.display = "none";

    if (loggedUser.addresses.length === 0) {
      window.location.href = "./cart.html";
    }
  });

  document.querySelector(".agree-btn").addEventListener("click", () => {
    const fullName = document.getElementById("fullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const city =
      document.querySelector("#provinces").options[
        document.querySelector("#provinces").selectedIndex
      ].text;
    const district =
      document.querySelector("#districts").options[
        document.querySelector("#districts").selectedIndex
      ].text;
    const ward =
      document.querySelector("#wards").options[
        document.querySelector("#wards").selectedIndex
      ].text;
    const street = document.querySelector("#address").value;
    addNewAddress({
      userId: loggedUser.id,
      street,
      fullName,
      district,
      city,
      phoneNumber,
      ward,
    });
    document.querySelector(".overlay").classList.remove("show");
    document.getElementById("address-form-popup").innerHTML = "";
    document.getElementById("address-form-popup").style.display = "none";
    if (isReturnAddressList) {
      renderAddressList();
    } else renderCheckout();
  });
}
