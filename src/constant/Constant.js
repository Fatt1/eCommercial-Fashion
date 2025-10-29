export const ORDER_BY = { ascending: "asc", descending: "desc" };
export const DB_CONTEXT_KEY = "db_context";
export const FEE_SHIPPING = 30000;
export const DISCOUNT_TYPE = {
  FIXED_AMOUNT: "FIXED_AMOUNT",
  PERCENTAGE: "PERCENTAGE",
};
export const ORDER_STATUS = {
  PENDING: "PENDING", // Chờ xác nhận
  SHIPPING: "SHIPPING", // Đang vận chuyển
  DELIVERED: "DELIVERED", // Chờ giao hàng
  COMPLETED: "COMPLETED", // Hoàn thành
  CANCELED: "CANCELED", // Đã hủy
};
export const INPUT_TYPE = {
  // Loại 1: Chỉ chọn một giá trị từ danh sách (Không cho phép nhập mới)
  SINGLE_DROP_DOWN: 1,

  // Loại 3: Trường nhập văn bản tự do (Không có danh sách gợi ý)
  FREE_TEXT_FIELD: 2,

  // Loại 4: Cho phép chọn nhiều giá trị từ danh sách (Không cho phép nhập mới)
  MULTI_DROP_DOWN: 3,
};

export const USER_STATUS = {
  ACTIVE: "active",
  BLOCKED: "blocked",
};
export const PAY_CLIENT_ID =
  "AWX03Hr4m9SF6hKtpRlcfF2oG1l_CFxXYqhvYHyanxTDVAce9znVExv43NY_hxShcUGJftk2hAyrbA33";
export const PAY_SECRET =
  "EB6dKWMDcZ5ehLZbv0AYr5irBWErA8CEL7aOOutUQjxnfFvi027G7-ZyXJAF5qkT-eSe3iXyzwdg8geJ";
export const PAY_BASE_URL = "https://api-m.sandbox.paypal.com";
