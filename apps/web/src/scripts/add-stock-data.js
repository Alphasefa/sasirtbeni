const fs = require("fs");

const dealersData = JSON.parse(
  fs.readFileSync("apps/web/src/shared/data/dealers.json", "utf8"),
);

const carModels = {
  audi: ["A3", "A4", "A5", "A6", "Q3", "Q5", "Q7", "Q8", "e-tron"],
  skoda: ["Octavia", "Superb", "Kodiaq", "Karoq", "Kamiq", "Scala", "Enyaq"],
  volkswagen: [
    "Polo",
    "Golf",
    "T-Roc",
    "Tiguan",
    "Passat",
    "Arteon",
    "Touareg",
    "ID.4",
  ],
  peugeot: ["208", "308", "508", "2008", "3008", "5008", "e-208"],
  citroen: ["C3", "C4", "C5", "C4 X", "Berlingo", "Spacetourer"],
  opel: ["Corsa", "Astra", "Mokka", "Grandland", "Combo", "Zafira"],
};

const getRandomStock = () => {
  return Math.floor(Math.random() * 8) + 1;
};

dealersData.dealers = dealersData.dealers.map((dealer) => {
  const brandKey = dealer.brand.toLowerCase();
  const models = carModels[brandKey] || carModels.audi;
  const selectedModels = models.slice(0, Math.floor(Math.random() * 4) + 2);

  const newCars = selectedModels.map((model) => ({
    model: `${dealer.brand.charAt(0).toUpperCase() + dealer.brand.slice(1)} ${model}`,
    versions: ["Sport", "S Line", "Premium"].slice(
      0,
      Math.floor(Math.random() * 2) + 1,
    ),
    stock: getRandomStock(),
  }));

  const usedCarsCount = Math.floor(Math.random() * 4);
  const usedCars = [];
  for (let i = 0; i < usedCarsCount; i++) {
    const model =
      selectedModels[Math.floor(Math.random() * selectedModels.length)];
    const year = 2020 + Math.floor(Math.random() * 4);
    const km = Math.floor(Math.random() * 80000) + 15000;
    const basePrice = 800000 + Math.floor(Math.random() * 1500000);
    usedCars.push({
      model: `${dealer.brand.charAt(0).toUpperCase() + dealer.brand.slice(1)} ${model}`,
      year,
      km,
      price: basePrice,
    });
  }

  return {
    ...dealer,
    newCars,
    usedCars,
  };
});

fs.writeFileSync(
  "apps/web/src/shared/data/dealers.json",
  JSON.stringify(dealersData, null, 2),
);
console.log(`Added stock data to ${dealersData.dealers.length} dealers`);
