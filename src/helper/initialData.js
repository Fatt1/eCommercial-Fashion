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
  return {
    products,
    skus,
    categories,
    colors,
    sizes,
    brands,
    attributes,
    users,
  };
}

async function loadDataToLocalStorage() {
  if (localStorage.getItem(DB_KEY)) {
    return;
  }

  await setDataFromJsonIntoDbContext();
  // localStorage.setItem(DB_KEY, JSON.stringify(dbContext));
}
async function getDbContextFromLocalStorage() {
  let dbContext = JSON.parse(localStorage.getItem(DB_KEY));
  if (!dbContext) {
    dbContext = await setDataFromJsonIntoDbContext();
    localStorage.setItem(DB_KEY, JSON.stringify(dbContext));
  }

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
