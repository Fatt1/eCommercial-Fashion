import { getDefaultAddress } from "../../services/userService.js";
import { renderAddressForm } from "../AddressFormPopup/AddressFormPopup.js";
export default function DeliveryAddress() {
  let fullName = "";
  let phoneNumber = "";
  let address = "";
  const loggedUser = JSON.parse(localStorage.getItem("user_info"));
  if (loggedUser.addresses.length === 0) {
    renderAddressForm();
  } else {
    fullName = loggedUser.fullName;
    phoneNumber = loggedUser.phoneNumber;
    const fullAddress = getDefaultAddress(loggedUser.id);
    address += `${fullAddress.street}, ${fullAddress.district}, ${fullAddress.ward}, ${fullAddress.city}`;
  }
  return `  <!-- delivery -->
              <div class="delivery-address main-content">
            <div class="delivery-address-box">
              <div class="delivery-address-top">
                <span><img src="../assets/location-icon.svg" /> </span>
                <div>Địa chỉ nhận hàng</div>
              </div>
              <div class="delivery-address-bot">
                <div class="delivery-info-1">${fullName} (${phoneNumber})</div>
                <div class="delivery-info-2">
                  ${address}
                </div>
                <div class="delivery-info-3">Mặc định</div>
                <button class="blue-button">Thay đổi</button>
              </div>
            </div>
          </div>
  `;
}
