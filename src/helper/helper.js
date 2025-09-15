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
