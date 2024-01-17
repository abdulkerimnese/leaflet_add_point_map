let map;
let markers = [];

let coordinates = document.getElementById('coordinates')

map = L.map("map").setView([39.9334, 32.8597], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  let map_prop = document.getElementById('map-prop')
  let right_side = document.getElementById('right-side')
  let buttons_container = document.getElementById('button-properties')
  document.getElementById("add-location-btn").addEventListener("click", function () {
    if (markers.length === 0) {
      map.on("click", function (e) {
        map_prop.style.width = '80vw'
        right_side.style.width = '20vw'
        buttons_container.style.width = '18vw'
        let lat = e.latlng.lat.toFixed(4);
        let lng = e.latlng.lng.toFixed(4);
        showInfoForm(e.latlng);
        map.off("click");
        coordinates.value = `Enlem: ${lat}, Boylam: ${lng}`
      });
    }
  });

// document.addEventListener("DOMContentLoaded", function () {
//   map = L.map("map").setView([39.9334, 32.8597], 6);

//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: '© OpenStreetMap contributors'
//   }).addTo(map);

//   let map_prop = document.getElementById('map-prop')
//   let right_side = document.getElementById('right-side')
//   let buttons_container = document.getElementById('button-properties')
//   document.getElementById("add-location-btn").addEventListener("click", function () {
//     if (markers.length === 0) {
//       map.on("click", function (e) {
//         map_prop.style.width = '80vw'
//         right_side.style.width = '20vw'
//         buttons_container.style.width = '18vw'
//         showInfoForm(e.latlng);
//         map.off("click");
//       });
//     }
//   });
// });



function showInfoForm(latlng) {
  document.getElementById("info-form").classList.remove("hidden");
  document.getElementById("location-form").reset();
  markers.push(L.marker(latlng).addTo(map));
}

function saveLocation() {
  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const company = document.getElementById("company").value;
  const docType = document.getElementById("document-type").value;
  const stock = document.getElementById("stock").value;
  const exit = document.getElementById("exit").value;
  const unit = document.getElementById("unit").value;
  const date = document.getElementById("date").value;

  const marker = markers.pop();
  marker.bindPopup(
    `<b>Ad:</b> ${name} ${surname}<br>` +
    `<b>Firma:</b> ${company}<br>` +
    `<b>Evrak Tipi:</b> ${docType}<br>` +
    `<b>Stok:</b> ${stock}<br>` +
    `<b>Çıkış:</b> ${exit}<br>` +
    `<b>Birim:</b> ${unit}<br>` +
    `<b>Tarih:</b> ${date}`
  ).openPopup();

  document.getElementById("info-form").classList.add("hidden");
}



document.getElementById("save-btn").addEventListener("click", saveLocation);
document.getElementById("export-btn").addEventListener("click", exportToExcel);

function exportToExcel() {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  const ws_data = [['Ad', 'Firma', 'Evrak Tipi', 'Stok', 'Çıkış', 'Birim', 'Tarih']];

  // Iterate through markers and add data to worksheet
  markers.forEach((marker) => {
    const popupContent = marker.getPopup().getContent();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(popupContent, 'text/html');

    const name = htmlDoc.querySelector('b:contains("Ad")').nextSibling.nodeValue.trim();
    const company = htmlDoc.querySelector('b:contains("Firma")').nextSibling.nodeValue.trim();
    const docType = htmlDoc.querySelector('b:contains("Evrak Tipi")').nextSibling.nodeValue.trim();
    const stock = htmlDoc.querySelector('b:contains("Stok")').nextSibling.nodeValue.trim();
    const exit = htmlDoc.querySelector('b:contains("Çıkış")').nextSibling.nodeValue.trim();
    const unit = htmlDoc.querySelector('b:contains("Birim")').nextSibling.nodeValue.trim();
    const date = htmlDoc.querySelector('b:contains("Tarih")').nextSibling.nodeValue.trim();

    const data = [name, company, docType, stock, exit, unit, date];
    ws_data.push(data);
  });

  // Add the worksheet to the workbook
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, 'Marker Data');

  // Save the workbook as an Excel file
  XLSX.writeFile(wb, 'marker_data.xlsx');
}

