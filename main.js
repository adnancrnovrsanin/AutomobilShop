import './style.css'
import { carDatabase } from './carDatabase';

let selectedBrand = "";
let selectedModel = "";
let selectedColor = "";
let cars = carDatabase;
let brandOptions = [];
let modelOptions = [];
let colorOptions = [];
let appliedFilters = null;

// Postavljanje HTML sadržaja u #app element
document.querySelector('#app').innerHTML = `
  <div class="filters">
    <div class="filter">
      <label for="brand">Marka: </label>
      <select name="brand" id="filter-brand">
        <option>Izaberite marku</option>
      </select>
    </div>

    <div class="filter">
      <label for="model">Model: </label>
      <select name="model" id="filter-model">
        <option>Izaberite model</option>
      </select>
    </div>

    <div class="filter">
      <label for="color">Boja: </label>
      <select name="color" id="filter-color">
        <option>Izaberite boju</option>
      </select>
    </div>

    <button id="filter-button">Filtriraj</button>
    <button id="reset-filters">Resetuj filtere</button>
  </div>

  <div class="cars"></div>
`;

initializeBrandOptions();
renderCarsHtml();

function resetFiltersButtonHandler() {
  appliedFilters = null;
  renderCarsHtml();
  document.getElementById("filter-brand").value = "";
  document.getElementById("filter-model").value = "";
  document.getElementById("filter-color").value = "";
  initializeBrandOptions();
  initializeModelOptions();
  initializeColorOptions();
}

function selectChangeHandler(e) {
  switch (e.target.name) {
    case "brand":
      selectedBrand = e.target.value.toLowerCase();
      appliedFilters = {
        brand: selectedBrand,
        model: "",
        color: ""
      };
      initializeModelOptions();
      break;
    case "model":
      selectedModel = e.target.value.toLowerCase();
      appliedFilters = {
        brand: selectedBrand,
        model: selectedModel,
        color: ""
      };
      initializeColorOptions();
      break;
    case "color":
      selectedColor = e.target.value.toLowerCase();
      appliedFilters = {
        brand: selectedBrand,
        model: selectedModel,
        color: selectedColor
      };
      break;
  }
}

function filterButtonHandler() {
  appliedFilters = {
    brand: selectedBrand,
    model: selectedModel,
    color: selectedColor
  };
  renderCarsHtml();
}

function getCarsHtml() {
  cars = carDatabase;
  if (appliedFilters !== null) {
    cars = carDatabase.filter(car => {
      if (appliedFilters.brand.length > 0 && car.brand.toLowerCase() !== appliedFilters.brand)
        return false;
      if (appliedFilters.model.length > 0 && car.model.toLowerCase() !== appliedFilters.model)
        return false;
      if (appliedFilters.color.length > 0 && car.color.toLowerCase() !== appliedFilters.color)
        return false;
      if (car.quantity === 0)
        return false;
      return true;
    });
  }
  return cars.map(car => {
    const carDiv = createCarHtml(car);
    return carDiv;
  });
}

function orderCar(carId) {
  alert("Uspesno ste narucili automobil");
  const car = cars.find(car => car.id === carId);
  car.quantity--;
  car.lastPurchaseDate = new Date();
  initializeBrandOptions();
  initializeModelOptions();
  initializeColorOptions();
  renderCarsHtml();
}

function renderCarsHtml() {
  const carsHtml = getCarsHtml();
  const carsElement = document.querySelector('.cars');
  carsElement.innerHTML = "";
  carsHtml.forEach(carHtml => {
    carsElement.appendChild(carHtml);
  });
}

function initializeOptionsForSelect(selectElement, options) {
  selectElement.innerHTML = "";
  const nullOptionElement = document.createElement('option');
  nullOptionElement.value = "";
  nullOptionElement.innerText = "Izaberite opciju";
  selectElement.appendChild(nullOptionElement);
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.innerText = option;
    selectElement.appendChild(optionElement);
  });
}

function initializeBrandOptions() {
  brandOptions = [];
  const selectElement = document.getElementById("filter-brand");
  for (const car of carDatabase) {
    if (!brandOptions.includes(car.brand.toLowerCase()) && car.quantity > 0) {
      brandOptions.push(car.brand.toLowerCase());
    }
  }
  initializeOptionsForSelect(selectElement, brandOptions);
  initializeModelOptions();
}

function initializeModelOptions() {
  modelOptions = [];
  const selectElement = document.getElementById("filter-model");
  for (const car of carDatabase) {
    if (selectedBrand.length > 0 && car.brand.toLowerCase() !== selectedBrand)
      continue;
    if (!modelOptions.includes(car.model.toLowerCase()) && car.quantity > 0) {
      modelOptions.push(car.model.toLowerCase());
    }
  }
  initializeOptionsForSelect(selectElement, modelOptions);
  initializeColorOptions();
}

function initializeColorOptions() {
  colorOptions = [];
  const selectElement = document.getElementById("filter-color");
  for (const car of carDatabase) {
    if (selectedBrand.length > 0 && car.brand.toLowerCase() !== selectedBrand)
      continue;
    if (selectedModel.length > 0 && car.model.toLowerCase() !== selectedModel)
      continue;
    if (!colorOptions.includes(car.color.toLowerCase()) && car.quantity > 0) {
      colorOptions.push(car.color.toLowerCase());
    }
  }
  initializeOptionsForSelect(selectElement, colorOptions);
}

// Event listeneri za promjene
document.getElementById("filter-brand").addEventListener('change', selectChangeHandler);
document.getElementById("filter-model").addEventListener('change', selectChangeHandler);
document.getElementById("filter-color").addEventListener('change', selectChangeHandler);
document.getElementById("filter-button").addEventListener('click', filterButtonHandler);
document.getElementById("reset-filters").addEventListener('click', resetFiltersButtonHandler);

// Pomoćna funkcija za kreiranje HTML-a za prikaz automobila
function createCarHtml(car) {
  const carDiv = document.createElement('div');
  carDiv.classList.add('car');

  const brandP = createParagraph(`Marka: ${car.brand}`);
  const modelP = createParagraph(`Model: ${car.model}`);
  const img = createImage(car.imgUrl, "car photo");
  const quantityP = createParagraph(`Kolicina: ${car.quantity}`);
  const lastPurchaseDateP = createParagraph(car.lastPurchaseDate ? `Datum poslednje prodaje: ${car.lastPurchaseDate.toLocaleDateString()}` : "");
  const priceP = createParagraph(`Cena: ${car.price} $`);
  const colorP = createParagraph(`Boja: ${car.color}`);

  const orderButton = createButton("Naruci");
  orderButton.addEventListener('click', () => orderCar(car.id));

  appendElements(carDiv, [brandP, modelP, img, quantityP, lastPurchaseDateP, priceP, colorP, orderButton]);

  return carDiv;
}

// Pomoćne funkcije za kreiranje elemenata
function createParagraph(text) {
  const p = document.createElement('p');
  p.innerText = text;
  return p;
}

function createImage(src, alt) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  return img;
}

function createButton(text) {
  const button = document.createElement('button');
  button.classList.add('narucivanje');
  button.innerText = text;
  return button;
}

function appendElements(parent, elements) {
  elements.forEach(element => {
    parent.appendChild(element);
  });
}
