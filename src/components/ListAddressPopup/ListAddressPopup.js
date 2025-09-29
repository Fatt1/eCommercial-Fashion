export function renderAddressList(addresses) {
  document.getElementById("address-form-popup").style.display = "block";
  document.getElementById("address-form-popup").innerHTML = `
  <div id="addresses-list">
     <div class="addresses-list__header ">
        Địa Chỉ Của Tôi
      </div>
      <div class="address-list-items">
        ${addresses.map((address) => Address(true, address)).join(" ")}
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
  setUpAddressList();
}

function setUpAddressList() {
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
}

function Address(isDefault, address) {
  return `
    <div class="address-list-item">
       <div class="address-list-item__ratio active"></div>
       <div class="address-item__info">
        <p class="address-item__full-name">Hà Tấn Phát | <span class="address-item__phone-number">0338957688</span></p>
        <p class="address-item__street">39/2 Hoàng Bật Đạt</p>
        <p class="address-item__district-ward">Phường 15, Quận Tân Bình, TP. Hồ Chí Minh</p>
        ${isDefault ? `<div class="address-item__default">Mặc định</div>` : ""}
       </div> 
       <span class="update-address-link">Cập nhật</span>
      </div>
  
  `;
}
