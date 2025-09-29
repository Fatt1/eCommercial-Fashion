import { renderAddressForm } from "../AddressFormPopup/AddressFormPopup.js";
import { selectedAddressObject } from "../../pages/Cart/Checkout.js";
import DeliveryAddress, {
  setUpDeliveryAddress,
} from "../DeliveryAddress/DeliveryAddress.js";
export function renderAddressList() {
  const loggedUser = JSON.parse(localStorage.getItem("user_info"));
  document.getElementById("address-form-popup").style.display = "block";
  document.getElementById("address-form-popup").innerHTML = `
  <div id="addresses-list">
     <div class="addresses-list__header ">
        Địa Chỉ Của Tôi
      </div>
      <div class="address-list-items">
        ${loggedUser.addresses
          .map((address) => {
            return Address(address);
          })
          .join(" ")}
      </div>
  
    <button class="add-new-address-btn">
        <img src="../assets/plus-icon.svg" alt="dấu cộng"/>
        Thêm Địa Chỉ Mới
      </button>
     <div class="address-form-action addresses-list-action">
        <button class="return-btn">Hủy</button>
        <button class="apply-voucher-btn agree-update-address-btn">Xác nhận</button>
      </div>
  </div>
   
  `;
  setUpAddressList(loggedUser);
}

function setUpAddressList(loggedUser) {
  let tempAddress;
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
  });
  // Handle for nút thêm địa chỉ mới
  document
    .querySelector(".add-new-address-btn")
    .addEventListener("click", () => {
      renderAddressForm(true);
    });
  // handle for ratio
  document.querySelectorAll(".address-list-item__ratio").forEach((ratio) => {
    ratio.addEventListener("click", () => {
      document
        .querySelectorAll(".address-list-item__ratio")
        .forEach((r) => r.classList.remove("active"));

      const addressId = ratio.dataset.id;
      tempAddress = loggedUser.addresses.find((ad) => ad.id === addressId);

      ratio.classList.add("active");
    });
  });
  document
    .querySelector(".agree-update-address-btn")
    .addEventListener("click", () => {
      document.querySelector(".overlay").classList.remove("show");
      document.getElementById("address-form-popup").innerHTML = "";
      document.getElementById("address-form-popup").style.display = "none";
      selectedAddressObject.selectedAddress = tempAddress;
      document.getElementById("delivery-address").innerHTML = DeliveryAddress(
        selectedAddressObject.selectedAddress
      );
      setUpDeliveryAddress();
    });
}

function Address(address) {
  const { selectedAddress } = selectedAddressObject;
  return `
    <div class="address-list-item" >
       <div data-id="${address.id}" class="address-list-item__ratio ${
    address.street === selectedAddress.street &&
    address.district === selectedAddress.district &&
    address.ward === selectedAddress.ward
      ? "active"
      : ""
  }"></div>
       <div class="address-item__info">
        <p class="address-item__full-name">${
          address.fullName
        } | <span class="address-item__phone-number">${
    address.phoneNumber
  }</span></p>
        <p class="address-item__street">${address.street}</p>
        <p class="address-item__district-ward">${address.district}, ${
    address.ward
  }, ${address.city}</p>
        ${
          address.isDefault
            ? `<div class="address-item__default">Mặc định</div>`
            : ""
        }
       </div> 
       <span class="update-address-link">Cập nhật</span>
      </div>
  
  `;
}
