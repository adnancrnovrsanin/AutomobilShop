export class Automobil {
    constructor(imgUrl, marka, model, kolicina, cena, boja) {
        this.id = Math.random();
        this.imgUrl = imgUrl;
        this.marka = marka;
        this.model = model;
        this.kolicina = kolicina;
        this.cena = cena;
        this.boja = boja;
        this.datumPoslednjeProdaje = null;
    }
}