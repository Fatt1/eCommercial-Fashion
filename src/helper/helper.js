export function generateUniqueId(randomLength = 6) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const timestamp = Date.now().toString(36); // Chuyển đổi sang hệ cơ số 36 để rút ngắn chuỗi
  console.log(timestamp);
  let randomString = "";
  for (let i = 0; i < randomLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  return `${timestamp}-${randomString}`;
}

export async function loadDataFromJson(fileName, object) {
  try {
    const response = await fetch(`../data/${fileName}`);
    const data = await response.json();
    return data[object];
  } catch (err) {
    console.log(err);
    return null;
  }
}
export function createPagination(data, pageSize, pageNumber) {
  const count = data.length;
  const totalPages = Math.ceil(count / pageSize);
  const startIndex = (pageNumber - 1) * pageSize;
  const items = data.slice(startIndex, startIndex + pageSize);

  const isPrev = pageNumber > 1;
  const isNext = pageNumber < totalPages;
  return {
    totalPages,
    items,
    isNext,
    isPrev,
    pageNumber,
    totalItems: count,
  };
}
export function convertStringToKebabCase(value) {
  const result = value.replaceAll(" ", "-");
  return result;
}

/**
 * Hàm kiểm tra màu sáng/tối và trả về màu chữ phù hợp.
 * @param {string} hexColor - Mã màu Hex (ví dụ: "#FF5733" hoặc "FF5733").
 * @returns {string} "black" hoặc "white".
 */
export function getContrastTextColor(hexColor) {
  // Loại bỏ ký tự # nếu có
  const hex = hexColor.startsWith("#") ? hexColor.slice(1) : hexColor;

  // Chuyển mã Hex sang RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Tính toán độ sáng (Luminance) theo công thức W3C
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // Nếu độ sáng lớn hơn 0.5 (ngưỡng 128/255), màu là sáng -> dùng chữ đen
  // Nếu không, màu là tối -> dùng chữ trắng
  return luminance > 0.5 ? "black" : "white";
}
export function preventInputTextForNumberInput() {
  const numberInputs = document.querySelectorAll(".number-input");
  numberInputs.forEach((input) => {
    input.addEventListener("keydown", (event) => {
      const keyCode = event.keyCode || event.which;

      // Kiểm tra xem phím đó có phải là số (0-9) hay không
      // Các mã phím đặc biệt như Backspace, Tab, Enter, Delete, mũi tên... vẫn được cho phép
      if (
        (keyCode >= 48 && keyCode <= 57) || // Số từ bàn phím chính (0-9)
        (keyCode >= 96 && keyCode <= 105) || // Số từ bàn phím số (numpad 0-9)
        keyCode === 8 || // Backspace
        keyCode === 9 || // Tab
        keyCode === 13 || // Enter
        keyCode === 46 || // Delete
        (keyCode >= 37 && keyCode <= 40) // Các phím mũi tên
      ) {
        // Nếu là số hoặc phím đặc biệt, cho phép gõ tiếp
        return true;
      } else {
        // Nếu không phải, ngăn chặn hành động gõ phím
        event.preventDefault();
        return false;
      }
    });
  });
}
export function generateOrderId() {
  const now = new Date();

  // 1. Tạo phần Ngày/Giờ (YYYYMMDD-HHmmss)
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const datePart = `${year}${month}${day}`;
  const timePart = `${hours}${minutes}${seconds}`;

  // 2. Tạo phần ngẫu nhiên (4 chữ số)
  // Đảm bảo số ngẫu nhiên là 4 chữ số, giúp phân biệt các đơn hàng trong cùng một giây.
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  // 3. Kết hợp lại
  return `${datePart}-${timePart}-${randomPart}`;
}
export function convertVndToUsd(value) {
  // Tỷ giá hối đoái giả định (ví dụ: 1 USD = 25,000 VND)
  const EXCHANGE_RATE = 26403;

  if (typeof value !== "number" || value < 0) {
    console.error("Lỗi: Giá trị phải là một số không âm.");
    return 0; // Trả về 0 hoặc ném lỗi
  }

  // Tính toán: USD = VND / Tỷ giá
  const usdValue = value / EXCHANGE_RATE;

  // Làm tròn đến 2 chữ số thập phân (chuẩn cho tiền tệ)
  return parseFloat(usdValue.toFixed(2));
}
export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
