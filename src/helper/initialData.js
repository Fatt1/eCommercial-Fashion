import { loadDataFromJson } from "./helper.js";
const DB_KEY = "db_context";
let dbContext = null;
async function setDataFromJsonIntoDbContext() {
  if (!dbContext) {
    const products = await loadDataFromJson("product.json", "products");
    const skus = await loadDataFromJson("sku.json", "skus");
    const categories = await loadDataFromJson("category.json", "categories");
    const colors = await loadDataFromJson("color.json", "colors");
    const sizes = await loadDataFromJson("size.json", "sizes");
    const brands = await loadDataFromJson("brand.json", "brands");
    const attributes = await loadDataFromJson("attribute.json", "attributes");
    dbContext = {
      products,
      skus,
      categories,
      colors,
      sizes,
      brands,
      attributes,
      saveChanges: saveDbContextToLocalStorage,
    };
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
export { loadDataToLocalStorage, getDbContextFromLocalStorage };
