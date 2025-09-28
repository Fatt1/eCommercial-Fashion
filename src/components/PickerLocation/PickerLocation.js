const BASE_API_URL = "https://provinces.open-api.vn/api";
export default function PickerLocation() {
  return `<div class="picker-location">
    <select id="provinces">
      <option value="">-- Chọn tỉnh/thành phố -- </option>
    </select>
     <select id="districts">
      <option value="">-- Chọn quận/huyện -- </option>
    </select>
     <select id="wards">
      <option value="">-- Chọn phường/xã  -- </option>
    </select>
  </div>`;
}

export async function setUpPickerLocation() {
  await fetchAllProvinces();
  document.getElementById("provinces").addEventListener("change", (event) => {
    fetchDistrict(event.target.value);
  });
  document.getElementById("districts").addEventListener("change", (event) => {
    fetchWards(event.target.value);
  });
}
async function fetchAllProvinces() {
  try {
    const response = await fetch(BASE_API_URL + "/p/?depth=2");
    const data = await response.json();
    data.map(
      (value) =>
        (document.getElementById(
          "provinces"
        ).innerHTML += `<option value="${value.code}">${value.name}</option>`)
    );
  } catch (err) {
    console.log(err);
  }
}

async function fetchDistrict(codeProvince) {
  try {
    const response = await fetch(BASE_API_URL + `/p/${codeProvince}?depth=2`);

    const data = await response.json();
    document.getElementById(
      "wards"
    ).innerHTML = ` <option value="">-- Chọn phường/xã -- </option>`;
    document.getElementById(
      "districts"
    ).innerHTML = ` <option value="">-- Chọn quận/huyện -- </option>`;
    if (data.districts !== undefined)
      data.districts.map(
        (value) =>
          (document.getElementById(
            "districts"
          ).innerHTML += `<option value="${value.code}">${value.name}</option>`)
      );
  } catch (err) {
    console.log(err);
  }
}

async function fetchWards(codeDistrict) {
  try {
    const response = await fetch(BASE_API_URL + `/d/${codeDistrict}?depth=2`);

    const data = await response.json();
    document.getElementById(
      "wards"
    ).innerHTML = ` <option value="">-- Chọn phường/xã -- </option>`;
    if (data.wards !== undefined)
      data.wards.map(
        (value) =>
          (document.getElementById(
            "wards"
          ).innerHTML += `<option value="${value.code}">${value.name}</option>`)
      );
  } catch (err) {
    console.log(err);
  }
}
