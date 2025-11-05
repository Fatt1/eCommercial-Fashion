import { loadDataFromJson } from "./helper.js";
const DB_KEY = "db_context";

async function setDataFromJsonIntoDbContext() {
  const products = await loadDataFromJson("product.json", "products");
  const skus = await loadDataFromJson("sku.json", "skus");
  const categories = await loadDataFromJson("category.json", "categories");
  const colors = await loadDataFromJson("color.json", "colors");
  const sizes = await loadDataFromJson("size.json", "sizes");
  const brands = await loadDataFromJson("brand.json", "brands");
  const attributes = await loadDataFromJson("attribute.json", "attributes");
  const users = await loadDataFromJson("user.json", "users");
  const discounts = await loadDataFromJson("discount.json", "discounts");
  const orders = await loadDataFromJson("order.json", "orders");
  const importInvoices = await loadDataFromJson(
    "importInvoice.json",
    "importInvoices"
  );
  const paymentMethods = await loadDataFromJson(
    "paymentMethod.json",
    "paymentMethods"
  );
  localStorage.setItem(
    DB_KEY,
    JSON.stringify({
      products,
      skus,
      categories,
      colors,
      sizes,
      brands,
      attributes,
      users,
      discounts,
      paymentMethods,
      orders,
      importInvoices,
    })
  );
}

async function loadDataToLocalStorage() {
  if (localStorage.getItem(DB_KEY)) {
    return;
  }

  await setDataFromJsonIntoDbContext();
  // localStorage.setItem(DB_KEY, JSON.stringify(dbContext));
}

function getDbContextFromLocalStorage() {
  return JSON.parse(localStorage.getItem(DB_KEY));
}
function saveDbContextToLocalStorage(dbContext) {
  localStorage.setItem(DB_KEY, JSON.stringify(dbContext));
}
export {
  loadDataToLocalStorage,
  getDbContextFromLocalStorage,
  saveDbContextToLocalStorage,
};
