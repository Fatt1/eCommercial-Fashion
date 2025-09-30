import { preventInputTextForNumberInput } from "../../helper/helper.js";
import { renderCheckout } from "../../pages/Cart/Checkout.js";
import { FormValidator } from "../../services/formValidator.js";
import { addNewAddress } from "../../services/userService.js";
import { renderAddressList } from "../ListAddressPopup/ListAddressPopup.js";
import PickerLocation, {
  setUpPickerLocation,
  validatePickerLocation,
} from "../PickerLocation/PickerLocation.js";
import { clearErrors } from "../Login/Login.js";
export function renderAddressForm(isReturnAddressList) {
  document.getElementById("address-form-popup").style.display = "block";
  document.getElementById("address-form-popup").innerHTML = `
    <div class="address-form-popup__header">Địa chỉ mới </div>
     <div id="address-form" class="address-form-container">
        <div class="form-group"> 
         <label for="fullName">Họ và tên</label>
          <input id="fullName" name="fullName" placeholder="Họ và tên" />
           <div class="error-message error-fullName"></div>
        </div>
         <div style="margin-left: 20px" class="form-group"> 
         <label for="phoneNumber">Số điện thoại</label>
          <input class="number-input" type="text" id="phoneNumber" name="phoneNumber" placeholder="Số điện thoại" />
          <div class="error-message error-phoneNumber"></div>
     </div>
      ${PickerLocation()}
      <div class="form-group address-form"> 
         <label for="address">Đường</label>
          <input id="address" name="address" placeholder="Đường" />
           <div class="error-message error-address"></div>
        </div>
      </div>
     </div>
    
    <div class="address-form-action"> 
        <button class="return-btn">Trở lại</button>
        <button class="apply-voucher-btn agree-btn">Đồng ý</button>
      </div>
  `;

  setUpAddressForm(isReturnAddressList);
}
const config = {
  fullName: {
    isRequired: "Họ tên là bắt buộc",
  },
  phoneNumber: {
    isRequired: "Số điện thoại là bắt buộc",
  },
  address: {
    isRequired: "Địa chỉ đường là bắt buộc",
  },
};

function setUpAddressForm(isReturnAddressList) {
  preventInputTextForNumberInput();
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

  document.querySelectorAll(".form-group input").forEach((input) =>
    input.addEventListener("keydown", () => {
      if (
        !(
          input.closest(".form-group").querySelector(".error-message")
            .textContent.length === 0
        )
      )
        clearErrors(input);
    })
  );

  // Xử lí khi nhấn nút xác nhận
  document.querySelector(".agree-btn").addEventListener("click", () => {
    const addressFormValidator = new FormValidator(config, "address-form");
    const isValidForm = addressFormValidator.validate();
    const isValidPicker = validatePickerLocation();
    let hasError = false; // Biến cờ để theo dõi lỗi

    // 1. Kiểm tra và xử lý lỗi Form
    if (!isValidForm) {
      addressFormValidator.displayErrors();
      hasError = true;
    }

    // 2. Kiểm tra và xử lý lỗi Picker (độc lập với lỗi Form)
    if (!isValidPicker) {
      document.querySelector(".error-picker").innerHTML =
        "Vui lòng không để trống";
      hasError = true;
    }

    // 3. Thoát nếu có bất kỳ lỗi nào
    if (hasError) {
      return;
    }
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
