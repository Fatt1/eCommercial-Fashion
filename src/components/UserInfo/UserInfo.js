// File: UserInfo.js

/**
 * Trả về chuỗi HTML và CSS cho modal thông tin người dùng.
 */
export function renderUserInfo() {
  return `
    <style>
      /* Các style này được gói gọn trong component
        để đảm bảo nó chỉ ảnh hưởng đến modal này.
      */
      .profile-container {
        position: relative; /* CHỈNH SỬA: Thêm để định vị nút X */
        z-index: 101;     /* CHỈNH SỬA: Đảm bảo modal nổi trên overlay */
        background-color: #ffffff;
        width: 800px; 
        padding: 30px 40px;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        margin: 0 auto; 
        color: #333;
        box-sizing: border-box;
      }
      
      /* THÊM MỚI: Style cho nút X */
      .profile-close-btn {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 3rem; /* Làm cho chữ X to, rõ */
        color: #ff0000;  /* Màu đỏ */
        cursor: pointer;
        line-height: 1;
        font-weight: 300;
        opacity: 0.8;
      }
      .profile-close-btn:hover {
        opacity: 1;
      }
      /* Kết thúc THÊM MỚI */

      .profile-header {
        margin-bottom: 20px;
      }
      .profile-header h1 {
        font-size: 24px;
        margin: 0 0 5px 0;
        font-weight: 500;
        color: #333;
      }
      .profile-header p {
        font-size: 16px;
        color: #666;
        margin: 0;
      }
      .profile-container hr {
        border: none;
        border-top: 1px solid #e0e0e0;
        margin-bottom: 30px;
      }
      .profile-body {
        padding-left: 50px;
      }
      .form-row {
        display: flex;
        align-items: center;
        margin-bottom: 25px;
      }
      .form-label {
        width: 150px;
        text-align: right;
        margin-right: 20px;
        color: #888;
        font-size: 15px;
      }
      .form-control {
        flex: 1;
        display: flex;
        align-items: center;
      }
      .form-control span {
        font-size: 16px;
        color: #333;
      }
      .form-control input[type="text"] {
        width: 70%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
        color: #333;
      }
      .form-control input[type="text"]:focus {
        outline: none;
        border-color: #ee4d2d;
      }
      .change-link {
        margin-left: 15px;
        color: #007bff;
        text-decoration: none;
        font-size: 14px;
      }
      .change-link:hover {
        text-decoration: underline;
      }
      .gender-options label {
        margin-right: 30px;
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #333;
      }
      .gender-options input[type="radio"] {
        margin-right: 8px;
        accent-color: #ee4d2d;
      }
      .dob-options select {
        padding: 8px 12px;
        margin-right: 15px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 15px;
        background-color: white;
        cursor: pointer;
        color: #333;
      }
      .dob-options select:focus {
        outline: none;
        border-color: #ee4d2d;
      }
      .save-button {
        background-color: #2dee97;
        color: white;
        border: none;
        padding: 12px 40px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      .save-button:hover {
        background-color: #16d663;
      }
    </style>

    <div class="profile-container">
      
      <button class="profile-close-btn" id="profile-close-btn">&times;</button>
      
      <div class="profile-header">
        <h1>Hồ Sơ Của Tôi</h1>
        <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>
      <hr />
      <div class="profile-body">
        <form id="profile-form">
          <div class="form-row">
            <label class="form-label" for="username">Tên đăng nhập</label>
            <div class="form-control">
              <span id="username">proundamn</span>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label" for="full-name">Tên</label>
            <div class="form-control">
              <input type="text" id="full-name" value="Danh777" />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label" for="email">Email</label>
            <div class="form-control">
              <span>Pr*******@gmail.com</span>
              <a href="#" class="change-link">Thay Đổi</a>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label" for="phone">Số điện thoại</label>
            <div class="form-control">
              <span>********04</span>
              <a href="#" class="change-link">Thay Đổi</a>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Giới tính</label>
            <div class="form-control gender-options">
              <label
                ><input type="radio" name="gender" value="male" checked />
                Nam</label
              >
              <label
                ><input type="radio" name="gender" value="female" /> Nữ</label
              >
              <label
                ><input type="radio" name="gender" value="other" /> Khác</label
              >
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Ngày sinh</label>
            <div class="form-control dob-options">
              <select id="day"></select>
              <select id="month"></select>
              <select id="year"></select>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label"></label>
            <div class="form-control">
              <button type="submit" class="save-button">Lưu</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;
}

/**
 * Gắn các trình xử lý sự kiện và logic cho form thông tin.
 * Phải được gọi SAU KHI renderUserInfo() đã được chèn vào DOM.
 */
export function setupUserInfoForm() {
  const daySelect = document.getElementById("day");
  const monthSelect = document.getElementById("month");
  const yearSelect = document.getElementById("year");
  const profileForm = document.getElementById("profile-form");

  // THÊM MỚI: Tìm nút X
  const closeButton = document.getElementById("profile-close-btn");

  // THÊM MỚI: Hàm đóng modal
  const closeModal = () => {
    const overlay = document.querySelector(".overlay");
    if (overlay) {
      overlay.classList.remove("show");
    }
    document.body.style.overflow = "auto";
    const registerLoginContainer = document.getElementById("register-login");
    if (registerLoginContainer) {
      registerLoginContainer.innerHTML = "";
    }
  };

  // THÊM MỚI: Gắn sự kiện click cho nút X
  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  // Kiểm tra nếu các phần tử không tồn tại (để phòng lỗi)
  if (!daySelect || !monthSelect || !yearSelect || !profileForm) {
    console.error("Không tìm thấy các thành phần DOM của form hồ sơ.");
    return;
  }

  // Xóa các option cũ để tránh bị lặp lại khi mở modal nhiều lần
  daySelect.innerHTML = '<option value="">Ngày</option>';
  monthSelect.innerHTML = '<option value="">Tháng</option>';
  yearSelect.innerHTML = '<option value="">Năm</option>';

  // --- Logic để tạo ngày/tháng/năm ---
  for (let i = 1; i <= 31; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    daySelect.appendChild(option);
  }

  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `Tháng ${i}`;
    monthSelect.appendChild(option);
  }

  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= 1920; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
  }
  // --- Hết logic ngày/tháng/năm ---

  // Gắn sự kiện submit cho form
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = document.getElementById("full-name").value;
    const selectedGender = document.querySelector(
      'input[name="gender"]:checked'
    ).value;
    const day = daySelect.value;
    const month = monthSelect.value;
    const year = yearSelect.value;

    const updatedProfile = {
      fullName: fullName,
      gender: selectedGender,
      dateOfBirth: {
        day: day,
        month: month,
        year: year,
      },
    };

    console.log("Thông tin đã lưu:", updatedProfile);
    alert("Đã lưu thông tin thành công!");

    // THÊM MỚI: Tự động đóng modal sau khi lưu thành công
    closeModal();
  });
}
