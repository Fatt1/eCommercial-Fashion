import { getDefaultAddress } from "../../services/userService.js";
import { renderAddressForm } from "../AddressFormPopup/AddressFormPopup.js";
export default function DeliveryAddress(selectedAddress) {
  let fullName = "";
  let phoneNumber = "";
  let address = "";
  const loggedUser = JSON.parse(localStorage.getItem("user_info"));
  if (!selectedAddress) {
    renderAddressForm();
  } else {
    fullName = loggedUser.fullName;
    phoneNumber = loggedUser.phoneNumber;
    address += `${selectedAddress.street}, ${selectedAddress.district}, ${selectedAddress.ward}, ${selectedAddress.city}`;
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
