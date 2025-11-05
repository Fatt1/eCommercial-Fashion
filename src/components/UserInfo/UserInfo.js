import { getLoggedUser } from "../../services/userService.js";

export function renderUserInfo() {
  // Lấy thông tin user hiện tại
  const user = getLoggedUser();
  
  if (!user) {
    return `<div>Vui lòng đăng nhập để xem thông tin</div>`;
  }

  // Ẩn một phần email
  const maskEmail = (email) => {
    const [localPart, domain] = email.split('@');
    const visibleChars = 2;
    const masked = localPart.slice(0, visibleChars) + '*'.repeat(localPart.length - visibleChars);
    return `${masked}@${domain}`;
  };

  // Ẩn một phần số điện thoại
  const maskPhone = (phone) => {
    if (!phone || phone.length < 4) return '****';
    return '*'.repeat(phone.length - 4) + phone.slice(-4);
  };

  const maskedEmail = maskEmail(user.email);
  const displayPhone = user.phoneNumber ? maskPhone(user.phoneNumber) : 'Chưa cập nhật';
  const displayFullName = user.fullName || '';
  
  return `
    <style>
      .profile-container {
        position: relative;
        z-index: 101;
        background-color: #ffffff;
        width: 800px; 
        padding: 30px 40px;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        margin: 0 auto; 
        color: #333;
        box-sizing: border-box;
      }
      
      .profile-close-btn {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 3rem;
        color: #ff0000;
        cursor: pointer;
        line-height: 1;
        font-weight: 300;
        opacity: 0.8;
      }
      .profile-close-btn:hover {
        opacity: 1;
      }

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
        cursor: not-allowed;
        opacity: 0.6;
      }
      .gender-options {
        display: flex;
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
      .save-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
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
            <label class="form-label" for="username">Email đăng nhập</label>
            <div class="form-control">
              <span id="username">${user.email}</span>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label" for="full-name">Họ và tên</label>
            <div class="form-control">
              <input type="text" id="full-name" value="${displayFullName}" placeholder="Nhập họ và tên của bạn" />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label" for="phone">Số điện thoại</label>
            <div class="form-control">
              <input type="text" id="phone" value="${user.phoneNumber || ''}" placeholder="Nhập số điện thoại" />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Giới tính</label>
            <div class="form-control gender-options">
              <label>
                <input type="radio" name="gender" value="male" ${user.gender === 'male' ? 'checked' : ''} />
                Nam
              </label>
              <label>
                <input type="radio" name="gender" value="female" ${user.gender === 'female' ? 'checked' : ''} />
                Nữ
              </label>
              <label>
                <input type="radio" name="gender" value="other" ${user.gender === 'other' || !user.gender ? 'checked' : ''} />
                Khác
              </label>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Ngày sinh</label>
            <div class="form-control dob-options">
              <select id="profile-day"></select>
              <select id="profile-month"></select>
              <select id="profile-year"></select>
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

export function setupUserInfoForm() {
  const daySelect = document.getElementById("profile-day");
  const monthSelect = document.getElementById("profile-month");
  const yearSelect = document.getElementById("profile-year");
  const profileForm = document.getElementById("profile-form");
  const closeButton = document.getElementById("profile-close-btn");
  const registerLoginContainer = document.getElementById("register-login");

  if (registerLoginContainer) {
    registerLoginContainer.style.zIndex = "1001";
  }

  const closeModal = () => {
    const overlay = document.querySelector(".overlay");
    if (overlay) {
      overlay.classList.remove("show");
    }
    document.body.style.overflow = "auto";
    if (registerLoginContainer) {
      registerLoginContainer.innerHTML = "";
      registerLoginContainer.style.zIndex = "auto";
    }
  };

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  if (!daySelect || !monthSelect || !yearSelect || !profileForm) {
    console.error("Không tìm thấy các thành phần DOM của form hồ sơ.");
    return;
  }

  // Lấy thông tin user hiện tại
  const user = getLoggedUser();

  // Populate day select
  daySelect.innerHTML = '<option value="">Ngày</option>';
  for (let i = 1; i <= 31; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    daySelect.appendChild(option);
  }

  // Populate month select
  monthSelect.innerHTML = '<option value="">Tháng</option>';
  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `Tháng ${i}`;
    monthSelect.appendChild(option);
  }

  // Populate year select
  yearSelect.innerHTML = '<option value="">Năm</option>';
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= 1920; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
  }

  // Set giá trị ngày sinh nếu có
  if (user.dateOfBirth) {
    if (user.dateOfBirth.day) daySelect.value = user.dateOfBirth.day;
    if (user.dateOfBirth.month) monthSelect.value = user.dateOfBirth.month;
    if (user.dateOfBirth.year) yearSelect.value = user.dateOfBirth.year;
  }

  // Xử lý submit form
  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = document.getElementById("full-name").value.trim();
    const phoneNumber = document.getElementById("phone").value.trim();
    const selectedGender = document.querySelector('input[name="gender"]:checked').value;
    const day = daySelect.value;
    const month = monthSelect.value;
    const year = yearSelect.value;

    // Validation
    if (!fullName) {
      alert("Vui lòng nhập họ và tên!");
      return;
    }

    if (phoneNumber && !/^[0-9]{10,11}$/.test(phoneNumber)) {
      alert("Số điện thoại không hợp lệ! Vui lòng nhập 10-11 chữ số.");
      return;
    }

    // Chuẩn bị dữ liệu cập nhật
    const updatedData = {
      fullName: fullName,
      phoneNumber: phoneNumber,
      gender: selectedGender,
      dateOfBirth: null,
    };

    // Chỉ lưu ngày sinh nếu đã chọn đầy đủ
    if (day && month && year) {
      updatedData.dateOfBirth = {
        day: parseInt(day),
        month: parseInt(month),
        year: parseInt(year),
      };
    }

    // Import service để cập nhật
    const { updateUserInfo } = await import("../../services/userService.js");
    const result = updateUserInfo(user.id, updatedData);

    if (result.successful) {
      alert("✅ " + result.message);
      
      // Cập nhật lại header nếu cần
      const { setupDropdownAfterLogin } = await import("../Header/Header.js");
      setupDropdownAfterLogin(result.data.email, result.data.id);
      
      closeModal();
    } else {
      alert("❌ " + result.message);
    }
  });
}
