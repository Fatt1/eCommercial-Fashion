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
