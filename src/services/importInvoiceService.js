import { IMPORT_INVOICE_STATUS } from "../constant/Constant.js";
import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
  saveDbContextToLocalStorage,
} from "../helper/initialData.js";
import {
  getProductById,
  updateProductImportPrice,
  updateSkuStock,
} from "./productService.js";

await loadDataToLocalStorage();

/**
 * Lấy tất cả phiếu nhập
 */
function getAllImportInvoices() {
  const dbContext = getDbContextFromLocalStorage();
  return dbContext.importInvoices || [];
}

/**
 * Lấy phiếu nhập theo ID
 */
function getImportInvoiceById(id) {
  const dbContext = getDbContextFromLocalStorage();
  return dbContext.importInvoices.find((invoice) => invoice.id === id);
}

/**
 * Lọc phiếu nhập theo trạng thái
 */
function filterImportInvoicesByStatus(status) {
  const dbContext = getDbContextFromLocalStorage();
  if (!status) return dbContext.importInvoices;
  return dbContext.importInvoices.filter(
    (invoice) => invoice.status === status
  );
}

/**
 * Tạo phiếu nhập mới
 * @param {Object} invoiceData - Dữ liệu phiếu nhập
 * @param {Array} invoiceData.items - Danh sách sản phẩm nhập
 * @returns {Object} - Kết quả tạo phiếu nhập
 */
function createImportInvoice(invoiceData) {
  const dbContext = getDbContextFromLocalStorage();

  // Tạo ID mới cho phiếu nhập
  const newId = generateImportInvoiceId();

  // Tính tổng số lượng và tổng giá trị
  let totalQuantity = 0;
  let totalPrice = 0;

  invoiceData.items.forEach((item) => {
    totalQuantity += item.quantity;
    totalPrice += item.importPrice * item.quantity;
  });

  // Tạo phiếu nhập mới
  const newInvoice = {
    id: newId,
    importDate: new Date().toISOString(),
    totalPrice: totalPrice,
    quantity: totalQuantity,
    items: invoiceData.items,
    status: IMPORT_INVOICE_STATUS?.PENDING || "PENDING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Thêm vào database
  dbContext.importInvoices.push(newInvoice);
  saveDbContextToLocalStorage(dbContext);

  return {
    successful: true,
    message: "Tạo phiếu nhập thành công",
    data: newInvoice,
  };
}

function confirmImportInvoice(invoiceId) {
  const dbContext = getDbContextFromLocalStorage();
  const invoice = dbContext.importInvoices.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    return {
      successful: false,
      message: "Không tìm thấy phiếu nhập",
    };
  }

  if (invoice.status === "COMPLETED") {
    return {
      successful: false,
      message: "Phiếu nhập đã được xác nhận trước đó",
    };
  }

  // Kiểm tra và cập nhật giá nhập cho từng sản phẩm
  const priceChanges = [];
  const stockUpdates = [];

  invoice.items.forEach((item) => {
    // Cập nhật giá nhập
    const productIndex = dbContext.products.findIndex(
      (p) => p.id === item.productId
    );

    if (productIndex !== -1) {
      const product = dbContext.products[productIndex];
      const currentImportPrice = product.priceInfo?.importPrice;
      const newImportPrice = item.importPrice;

      // Nếu giá nhập thay đổi, cập nhật vào sản phẩm
      if (currentImportPrice !== newImportPrice) {
        dbContext.products[productIndex].priceInfo.importPrice = newImportPrice;
        dbContext.products[productIndex].updatedAt = new Date().toISOString();

        priceChanges.push({
          productId: item.productId,
          productName: item.productName,
          oldPrice: currentImportPrice,
          newPrice: newImportPrice,
        });
      }
    }

    // Cập nhật stock cho SKU
    if (item.skuId) {
      const skuIndex = dbContext.skus.findIndex((s) => s.id === item.skuId);

      if (skuIndex !== -1) {
        const currentStock = dbContext.skus[skuIndex].stock || 0;
        const newStock = currentStock + item.quantity;

        dbContext.skus[skuIndex].stock = newStock;
        dbContext.skus[skuIndex].updatedAt = new Date().toISOString();

        stockUpdates.push({
          skuId: item.skuId,
          productName: item.productName,
          skuName: item.skuName,
          quantityAdded: item.quantity,
          newStock: newStock,
        });
      }
    }
  });

  // Cập nhật trạng thái phiếu nhập
  invoice.status = "COMPLETED";
  invoice.updatedAt = new Date().toISOString();

  // LƯU TẤT CẢ THAY ĐỔI MỘT LẦN DUY NHẤT
  saveDbContextToLocalStorage(dbContext);

  return {
    successful: true,
    message: "Xác nhận phiếu nhập thành công",
    priceChanges: priceChanges,
    stockUpdates: stockUpdates,
  };
}

/**
 * Hủy phiếu nhập
 */
function cancelImportInvoice(invoiceId) {
  const dbContext = getDbContextFromLocalStorage();
  const invoice = dbContext.importInvoices.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    return {
      successful: false,
      message: "Không tìm thấy phiếu nhập",
    };
  }

  if (invoice.status === "COMPLETED") {
    return {
      successful: false,
      message: "Không thể hủy phiếu nhập đã hoàn thành",
    };
  }

  invoice.status = "CANCELED";
  invoice.updatedAt = new Date().toISOString();

  saveDbContextToLocalStorage(dbContext);

  return {
    successful: true,
    message: "Hủy phiếu nhập thành công",
  };
}

/**
 * Cập nhật phiếu nhập
 */
function updateImportInvoice(invoiceId, updatedData) {
  const dbContext = getDbContextFromLocalStorage();
  const invoiceIndex = dbContext.importInvoices.findIndex(
    (inv) => inv.id === invoiceId
  );

  if (invoiceIndex === -1) {
    return {
      successful: false,
      message: "Không tìm thấy phiếu nhập",
    };
  }

  const invoice = dbContext.importInvoices[invoiceIndex];

  if (invoice.status === "COMPLETED") {
    return {
      successful: false,
      message: "Không thể cập nhật phiếu nhập đã hoàn thành",
    };
  }

  // Tính lại tổng số lượng và tổng giá trị nếu có thay đổi items
  if (updatedData.items) {
    let totalQuantity = 0;
    let totalPrice = 0;

    updatedData.items.forEach((item) => {
      totalQuantity += item.quantity;
      totalPrice += item.importPrice * item.quantity;
    });

    updatedData.quantity = totalQuantity;
    updatedData.totalPrice = totalPrice;
  }

  // Cập nhật phiếu nhập
  dbContext.importInvoices[invoiceIndex] = {
    ...invoice,
    ...updatedData,
    updatedAt: new Date().toISOString(),
  };

  saveDbContextToLocalStorage(dbContext);

  return {
    successful: true,
    message: "Cập nhật phiếu nhập thành công",
    data: dbContext.importInvoices[invoiceIndex],
  };
}

/**
 * Xóa phiếu nhập (chỉ xóa phiếu chưa hoàn thành)
 */
function deleteImportInvoice(invoiceId) {
  const dbContext = getDbContextFromLocalStorage();
  const invoiceIndex = dbContext.importInvoices.findIndex(
    (inv) => inv.id === invoiceId
  );

  if (invoiceIndex === -1) {
    return {
      successful: false,
      message: "Không tìm thấy phiếu nhập",
    };
  }

  const invoice = dbContext.importInvoices[invoiceIndex];

  if (invoice.status === "COMPLETED") {
    return {
      successful: false,
      message: "Không thể xóa phiếu nhập đã hoàn thành",
    };
  }

  dbContext.importInvoices.splice(invoiceIndex, 1);
  saveDbContextToLocalStorage(dbContext);

  return {
    successful: true,
    message: "Xóa phiếu nhập thành công",
  };
}

/**
 * Tạo ID mới cho phiếu nhập
 */
function generateImportInvoiceId() {
  const dbContext = getDbContextFromLocalStorage();
  const invoices = dbContext.importInvoices || [];

  if (invoices.length === 0) {
    return "PN001";
  }

  // Lấy số cuối cùng và tăng lên
  const lastId = invoices[invoices.length - 1].id;
  const num = parseInt(lastId.replace("PN", "")) + 1;
  return `PN${num.toString().padStart(3, "0")}`;
}

/**
 * Kiểm tra giá nhập của sản phẩm có thay đổi so với phiếu nhập
 */
function checkImportPriceChanges(productId, newImportPrice) {
  const product = getProductById(productId);

  if (!product) {
    return {
      hasChange: false,
      message: "Không tìm thấy sản phẩm",
    };
  }

  const currentImportPrice = product.priceInfo.importPrice;

  if (currentImportPrice !== newImportPrice) {
    return {
      hasChange: true,
      currentPrice: currentImportPrice,
      newPrice: newImportPrice,
      difference: newImportPrice - currentImportPrice,
      message: "Giá nhập có thay đổi",
    };
  }

  return {
    hasChange: false,
    message: "Giá nhập không thay đổi",
  };
}

export {
  getAllImportInvoices,
  getImportInvoiceById,
  filterImportInvoicesByStatus,
  createImportInvoice,
  confirmImportInvoice,
  cancelImportInvoice,
  updateImportInvoice,
  deleteImportInvoice,
  checkImportPriceChanges,
};
