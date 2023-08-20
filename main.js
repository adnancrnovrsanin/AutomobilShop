import './style.css'
import { baza } from './baza';

var izabranaMarka = "";
var izabranModel = "";
var izabranaBoja = "";
var cars = baza;
var opcijeMarke = [];
var opcijeModela = [];
var opcijeBoja = [];
var filters = null;

document.querySelector('#app').innerHTML = `
  <div class="filters">
        <div class="filter">
            <label for="marka">Marka: </label>
            <select name="marka" id="filter-marka">
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
            <label for="boja">Boja: </label>
            <select name="boja" id="filter-boja">
                <option>Izaberite boju</option>
            </select>
        </div>

        <button id="filter-button">Filter</button>
        <button id="reset-filters">Reset filters</button>
    </div>

    <div class="cars">

    </div>
`;

getOpcijeMarke();
printCarsHtml();

function resetFiltersButtonHandler() {
  filters = null;
  printCarsHtml();
  document.getElementById("filter-marka").value = "";
  document.getElementById("filter-model").value = "";
  document.getElementById("filter-boja").value = "";
  getOpcijeMarke();
  getOpcijeModela();
  getOpcijeBoja();
}

function selectChangeHandler(e) {
  switch (e.target.name) {
    case "marka":
      izabranaMarka = e.target.value.toLowerCase();
      filters = {
        marka: izabranaMarka,
        model: "",
        boja: ""
      }
      getOpcijeModela();
      break;
    case "model":
      izabranModel = e.target.value.toLowerCase();
      filters = {
        marka: izabranaMarka,
        model: izabranModel,
        boja: ""
      }
      getOpcijeBoja();
      break;
    case "boja":
      izabranaBoja = e.target.value.toLowerCase();
      filters = {
        marka: izabranaMarka,
        model: izabranModel,
        boja: izabranaBoja
      }
      break;
  }
}

function filterButtonHandler() {
  filters = {
    marka: izabranaMarka,
    model: izabranModel,
    boja: izabranaBoja
  };
  printCarsHtml();
}

function getCarsHtml() {
  cars = baza;
  if (filters !== null) {
    cars = baza.filter(car => {
      if (filters.marka.length > 0 && car.marka.toLowerCase() !== filters.marka)
        return false;
      if (filters.model.length > 0 && car.model.toLowerCase() !== filters.model)
        return false;
      if (filters.boja.length > 0 && car.boja.toLowerCase() !== filters.boja)
        return false;
      if (car.kolicina === 0)
        return false;
      return true;
    });
  }
  return cars.map(car => {
    const carDiv = document.createElement('div');
    carDiv.classList.add('car');

    const markaP = document.createElement('p');
    markaP.innerText = `Marka: ${car.marka}`;

    const modelP = document.createElement('p');
    modelP.innerText = `Model: ${car.model}`;

    const img = document.createElement('img');
    img.src = car.imgUrl;
    img.alt = "car photo";

    const kolicinaP = document.createElement('p');
    kolicinaP.innerText = `Kolicina: ${car.kolicina}`;

    const datumPoslednjeProdajeP = document.createElement('p');
    datumPoslednjeProdajeP.innerText = (car.datumPoslednjeProdaje) ? `Datum poslednje prodaje: ${car.datumPoslednjeProdaje.toLocaleDateString()}` : "";

    const cenaP = document.createElement('p');
    cenaP.innerText = `Cena: ${car.cena} $`;

    const bojaP = document.createElement('p');
    bojaP.innerText = `Boja: ${car.boja}`;

    const narucivanjeButton = document.createElement('button');
    narucivanjeButton.classList.add('narucivanje');
    narucivanjeButton.innerText = "Naruci";
    narucivanjeButton.addEventListener('click', () => narucivanje(car.id));

    carDiv.appendChild(markaP);
    carDiv.appendChild(modelP);
    carDiv.appendChild(img);
    carDiv.appendChild(kolicinaP);
    carDiv.appendChild(datumPoslednjeProdajeP);
    carDiv.appendChild(cenaP);
    carDiv.appendChild(bojaP);
    carDiv.appendChild(narucivanjeButton);

    return carDiv;

    // return ` <---- Ovo je bilo pre refaktorisanja
    //   <div class="car">
    //       <p>Marka: ${car.marka}</p>

    //       <p>Model: ${car.model}</p>

    //       <img src="${car.imgUrl}" alt="car photo">

    //       <p>Kolicina: ${car.kolicina}</p>

    //       ${car.datumPoslednjeProdaje !== null ? `<p>Datum poslednje prodaje: ${car.datumPoslednjeProdaje.toLocaleDateString()}</p>` : ""}

    //       <p>Cena: ${car.cena} $</p>

    //       <p>Boja: ${car.boja} </p>

    //       <button>Naruci</button>
    //   </div>
    // `;
  });
}

function narucivanje(carId) {
  alert("Uspesno ste narucili automobil");
  const car = cars.find(car => car.id === carId);
  car.kolicina--;
  car.datumPoslednjeProdaje = new Date();
  getOpcijeMarke();
  getOpcijeModela();
  getOpcijeBoja();
  printCarsHtml();
}

function printCarsHtml() {
  const carsHtml = getCarsHtml();
  const carsElement = document.querySelector('.cars');
  carsElement.innerHTML = "";
  for (let carHtml of carsHtml) {
    carsElement.appendChild(carHtml);
  }
}

function printOptionsToSelectHtml(selectElement, options) {
  selectElement.innerHTML = "";
  const nullOptionElement = document.createElement('option');
  nullOptionElement.value = "";
  nullOptionElement.innerText = "Izaberite opciju";
  selectElement.appendChild(nullOptionElement);
  for (let option of options) {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.innerText = option;
    selectElement.appendChild(optionElement);
  }
}

function getOpcijeMarke() {
  opcijeMarke = [];
  const selectElement = document.getElementById("filter-marka");
  for (let car of baza) {
    if (!opcijeMarke.includes(car.marka.toLowerCase()) && car.kolicina > 0) {
      opcijeMarke.push(car.marka.toLowerCase());
    }
  }
  printOptionsToSelectHtml(selectElement, opcijeMarke);
  getOpcijeModela();
}

function getOpcijeModela() {
  opcijeModela = [];
  const selectElement = document.getElementById("filter-model");
  for (let car of baza) {
    if (izabranaMarka.length > 0 && car.marka.toLowerCase() !== izabranaMarka)
      continue;
    if (!opcijeModela.includes(car.model.toLowerCase()) && car.kolicina > 0) {
      opcijeModela.push(car.model.toLowerCase());
    }
  }
  printOptionsToSelectHtml(selectElement, opcijeModela);
  getOpcijeBoja();
}

function getOpcijeBoja() {
  opcijeBoja = [];
  const selectElement = document.getElementById("filter-boja");
  for (let car of baza) {
    if (izabranaMarka.length > 0 && car.marka.toLowerCase() !== izabranaMarka)
      continue;
    if (izabranModel.length > 0 && car.model.toLowerCase() !== izabranModel)
      continue;
    if (!opcijeBoja.includes(car.boja.toLowerCase()) && car.kolicina > 0) {
      opcijeBoja.push(car.boja.toLowerCase());
    }
  }
  printOptionsToSelectHtml(selectElement, opcijeBoja);
}

document.getElementById("filter-marka").addEventListener('change', selectChangeHandler);
document.getElementById("filter-model").addEventListener('change', selectChangeHandler);
document.getElementById("filter-boja").addEventListener('change', selectChangeHandler);
document.getElementById("filter-button").addEventListener('click', filterButtonHandler);
document.getElementById("reset-filters").addEventListener('click', resetFiltersButtonHandler);

