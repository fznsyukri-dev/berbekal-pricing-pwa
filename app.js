// Navigasi antar menu
function navigate(page) {
  const content = document.getElementById("content");
  if (page === "inventory") {
    content.innerHTML = `
      <h2>Bahan Baku</h2>
      <input id="bahan" placeholder="Nama Bahan"><br>
      <input id="harga" type="number" placeholder="Harga per unit"><br>
      <button onclick="saveBahan()">Simpan</button>
      <div id="listBahan"></div>
    `;
    showBahan();
  }
  if (page === "recipes") {
    content.innerHTML = `
      <h2>Resep/Menu</h2>
      <input id="menu" placeholder="Nama Menu"><br>
      <input id="takaran" type="number" placeholder="Takaran bahan (unit)"><br>
      <select id="bahanSelect"></select><br>
      <button onclick="saveResep()">Simpan</button>
      <div id="listResep"></div>
    `;
    loadBahanSelect();
    showResep();
  }
  if (page === "costs") {
    content.innerHTML = `
      <h2>Biaya Operasional</h2>
      <input id="biaya" type="number" placeholder="Biaya (Rp)"><br>
      <button onclick="saveCost()">Simpan</button>
      <div id="listCost"></div>
    `;
    showCosts();
  }
  if (page === "hpp") {
    content.innerHTML = `<h2>Hitung HPP</h2><div id="hppResult"></div>`;
    hitungHPP();
  }
}

// Simpan ke localStorage
function saveBahan() {
  let bahan = document.getElementById("bahan").value;
  let harga = parseFloat(document.getElementById("harga").value);
  if (!bahan || !harga) return;
  let list = JSON.parse(localStorage.getItem("bahan") || "[]");
  list.push({ bahan, harga });
  localStorage.setItem("bahan", JSON.stringify(list));
  showBahan();
}

function showBahan() {
  let list = JSON.parse(localStorage.getItem("bahan") || "[]");
  let html = "<ul>";
  list.forEach((b, i) => {
    html += `<li>${b.bahan} - Rp${b.harga.toLocaleString()}</li>`;
  });
  html += "</ul>";
  document.getElementById("listBahan").innerHTML = html;
}

function loadBahanSelect() {
  let list = JSON.parse(localStorage.getItem("bahan") || "[]");
  let select = document.getElementById("bahanSelect");
  list.forEach(b => {
    let opt = document.createElement("option");
    opt.value = b.bahan;
    opt.textContent = b.bahan;
    select.appendChild(opt);
  });
}

function saveResep() {
  let menu = document.getElementById("menu").value;
  let takaran = parseFloat(document.getElementById("takaran").value);
  let bahan = document.getElementById("bahanSelect").value;
  if (!menu || !takaran || !bahan) return;
  let list = JSON.parse(localStorage.getItem("resep") || "[]");
  list.push({ menu, bahan, takaran });
  localStorage.setItem("resep", JSON.stringify(list));
  showResep();
}

function showResep() {
  let list = JSON.parse(localStorage.getItem("resep") || "[]");
  let html = "<ul>";
  list.forEach(r => {
    html += `<li>${r.menu} - ${r.takaran} unit ${r.bahan}</li>`;
  });
  html += "</ul>";
  document.getElementById("listResep").innerHTML = html;
}

function saveCost() {
  let biaya = parseFloat(document.getElementById("biaya").value);
  if (!biaya) return;
  let list = JSON.parse(localStorage.getItem("costs") || "[]");
  list.push(biaya);
  localStorage.setItem("costs", JSON.stringify(list));
  showCosts();
}

function showCosts() {
  let list = JSON.parse(localStorage.getItem("costs") || "[]");
  let total = list.reduce((a, b) => a + b, 0);
  let html = "<ul>";
  list.forEach((c, i) => {
    html += `<li>Rp${c.toLocaleString()}</li>`;
  });
  html += `</ul><p><b>Total: Rp${total.toLocaleString()}</b></p>`;
  document.getElementById("listCost").innerHTML = html;
}

function hitungHPP() {
  let bahan = JSON.parse(localStorage.getItem("bahan") || "[]");
  let resep = JSON.parse(localStorage.getItem("resep") || "[]");
  let costs = JSON.parse(localStorage.getItem("costs") || "[]");

  let totalCosts = costs.reduce((a, b) => a + b, 0);

  let html = "<ul>";
  resep.forEach(r => {
    let b = bahan.find(x => x.bahan === r.bahan);
    let biayaBahan = b ? b.harga * r.takaran : 0;
    let hpp = biayaBahan + (totalCosts / (resep.length || 1));
    html += `<li>${r.menu} → HPP Rp${hpp.toLocaleString()}</li>`;
  });
  html += "</ul>";
  document.getElementById("hppResult").innerHTML = html;
}
