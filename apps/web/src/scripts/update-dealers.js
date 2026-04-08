const fs = require("fs");

const dealersData = JSON.parse(
  fs.readFileSync("apps/web/src/shared/data/dealers.json", "utf8"),
);

const brandInfo = {
  audi: {
    services: [
      "Yeni Araç Satış",
      "2.El Araç",
      "Servis",
      "Yedek Parça",
      "Finansman",
    ],
    showroomBase: 2000,
  },
  skoda: {
    services: [
      "Yeni Araç Satış",
      "2.El Araç",
      "Servis",
      "Yedek Parça",
      "Finansman",
    ],
    showroomBase: 1500,
  },
  volkswagen: {
    services: [
      "Yeni Araç Satış",
      "2.El Araç",
      "Servis",
      "Yedek Parça",
      "Finansman",
    ],
    showroomBase: 1800,
  },
  peugeot: {
    services: [
      "Yeni Araç Satış",
      "2.El Araç",
      "Servis",
      "Yedek Parça",
      "Finansman",
    ],
    showroomBase: 1500,
  },
  citroen: {
    services: [
      "Yeni Araç Satış",
      "2.El Araç",
      "Servis",
      "Yedek Parça",
      "Finansman",
    ],
    showroomBase: 1400,
  },
  opel: {
    services: [
      "Yeni Araç Satış",
      "2.El Araç",
      "Servis",
      "Yedek Parça",
      "Finansman",
    ],
    showroomBase: 1400,
  },
};

const cities = {
  İstanbul: 2003,
  Ankara: 2000,
  İzmir: 2001,
  Bursa: 2002,
  Antalya: 2004,
  Adana: 2005,
  Kayseri: 2006,
  Gaziantep: 2005,
  Konya: 2007,
  Mersin: 2006,
  Trabzon: 2008,
  Eskişehir: 2009,
  Sakarya: 2010,
  Denizli: 2008,
  Malatya: 2011,
  Diyarbakır: 2012,
  Erzurum: 2013,
  Konya: 2007,
};

const aboutTemplates = [
  "Müşteri memnuniyetini ön planda tutan anlayışımızla, {brand} deneyimini {city} sakinlerine yaşatıyoruz. Modern showroom ve uzman kadromuzla hizmetinizdeyiz.",
  "{city}'nin en büyük {brand} yetkili satıcısı olarak yıllardır güvenilir hizmet sunuyoruz. Sektördeki deneyimimiz ve müşteri odaklı yaklaşımımızla fark yaratıyoruz.",
  "{brand}'ın premium dünyasını {city}'ye getiriyoruz. Profesyonel ekibimiz ve geniş araç yelpazemizle en iyi deneyimi sunmayı hedefliyoruz.",
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

dealersData.dealers = dealersData.dealers.map((dealer) => {
  const brandKey = dealer.brand.toLowerCase();
  const info = brandInfo[brandKey] || brandInfo.audi;
  const year = cities[dealer.city] || 2005;
  const staffCount = Math.floor(Math.random() * 30) + 20;
  const showroomSize = info.showroomBase + Math.floor(Math.random() * 500);

  return {
    ...dealer,
    about: getRandomElement(aboutTemplates)
      .replace(
        "{brand}",
        dealer.brand.charAt(0).toUpperCase() + dealer.brand.slice(1),
      )
      .replace("{city}", dealer.city),
    established: year + Math.floor(Math.random() * 5),
    certifications: [
      `${dealer.brand.charAt(0).toUpperCase() + dealer.brand.slice(1)} Yetkili Satıcı`,
      `${dealer.brand.charAt(0).toUpperCase() + dealer.brand.slice(1)} Servis`,
    ],
    staff: staffCount,
    showroomSize: `${showroomSize} m²`,
    services: info.services,
    newCars: [],
    usedCars: [],
    images: [],
  };
});

fs.writeFileSync(
  "apps/web/src/shared/data/dealers.json",
  JSON.stringify(dealersData, null, 2),
);
console.log(
  `Updated ${dealersData.dealers.length} dealers with new data structure`,
);
