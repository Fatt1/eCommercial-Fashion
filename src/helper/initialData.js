import { loadDataFromJson } from "./helper.js";
const DB_KEY = "db_context";
let dbContext = null;
async function setDataFromJsonIntoDbContext() {
  if (!dbContext) {
    const products = await loadDataFromJson("product.json", "products");
    const skus = await loadDataFromJson("sku.json", "skus");
    dbContext = { products, skus };
  }
}
async function loadDataToLocalStorage() {
  if (localStorage.getItem(DB_KEY)) {
    return;
  }

  await setDataFromJsonIntoDbContext();
  localStorage.setItem(DB_KEY, JSON.stringify(dbContext));
}
function getDbContextFromLocalStorage() {
  const dbContext = JSON.parse(localStorage.getItem(DB_KEY)) || {};

  return dbContext;
}
function saveDbContextToLocalStorage(dbContext) {
  localStorage.setItem(DB_KEY, JSON.stringify(dbContext));
}
export {
  loadDataToLocalStorage,
  getDbContextFromLocalStorage,
  saveDbContextToLocalStorage,
};
