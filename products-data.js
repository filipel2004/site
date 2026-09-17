(function (window) {
  const STORAGE_KEY = "sitegicu_products";

  const DEFAULT_PRODUCTS = [
    {
      id: "p1",
      type: "Plaque",
      name: "Plaque de plâtre Knauf BA13",
      details: "Dimensions : L 1.20 m x H 3.00 m",
      price: "11,99 €",
      image: "photo/white.jpg",
      alt: "Plaque de plâtre Knauf BA13"
    },
    {
      id: "p2",
      type: "Plaque",
      name: "Plaque de plâtre hydrofuge Knauf BA13",
      details: "Dimensions : L 1.20 m x H 2.60 m",
      price: "13,99 €",
      image: "photo/green.jpg",
      alt: "Plaque de plâtre hydrofuge Knauf BA13"
    },
    {
      id: "p3",
      type: "Plaque",
      name: "Plaque de plâtre phonique Knauf BA13",
      details: "Dimensions : L 1.20 m x H 2.60 m",
      price: "14,99 €",
      image: "photo/blue.jpg",
      alt: "Plaque de plâtre phonique Knauf BA13"
    },
    {
      id: "p4",
      type: "Plaque",
      name: "Plaque de plâtre anti-feu Knauf BA13",
      details: "Dimensions : L 1.20 m x H 2.60 m",
      price: "15,99 €",
      image: "photo/roz.jpg",
      alt: "Plaque de plâtre anti-feu Knauf BA13"
    },
    {
      id: "p5",
      type: "Plaque",
      name: "Plaque de plâtre hydrofuge Knauf BA13",
      details: "Dimensions : L 1.20 m x H 3.00 m",
      price: "20,00 €",
      image: "photo/green.jpg",
      alt: "Plaque de plâtre hydrofuge Knauf BA13"
    },
    {
      id: "p6",
      type: "Plaque",
      name: "Plaque de plâtre hydrofuge Knauf BA13",
      details: "Dimensions : L 0.60 m x H 2.60 m",
      price: "8,99 €",
      image: "photo/green.jpg",
      alt: "Plaque de plâtre hydrofuge Knauf BA13"
    },
    {
      id: "p7",
      type: "Plaque",
      name: "Plaque de plâtre anti-feu Knauf BA15",
      details: "Dimensions : L 1.20 m x H 2.60 m",
      price: "25,00 €",
      image: "photo/roz.jpg",
      alt: "Plaque de plâtre anti-feu Knauf BA15"
    },
    {
      id: "p8",
      type: "Vis",
      name: "Vis 3 x 25",
      details: "Conditionnement : 1000 pièces",
      price: "9,99 €",
      image: "photo/samorez.jpg",
      alt: "Vis 3 x 25"
    },
    {
      id: "p9",
      type: "Primaire",
      name: "Ceresit primaire pénétrant sans solvant 5L",
      details: "Usage : préparation des supports",
      price: "20,00 €",
      image: "photo/ceresit1.jpg",
      alt: "Ceresit primaire pénétrant sans solvant 5L"
    },
    {
      id: "p10",
      type: "Pièce",
      name: "Cornière d’angle métallique plaque de plâtre",
      details: "Dimensions : L 3 m x l 20 mm x H 20 mm",
      price: "2,00 €",
      image: "photo/coltar.jpg",
      alt: "Cornière d’angle métallique plaque de plâtre"
    },
    {
      id: "p11",
      type: "Paquet de 10 lames",
      name: "10 lames de 18 mm",
      details: "Profil métallique pour montage",
      price: "2,00 €",
      image: "photo/lame1.jpg",
      alt: "10 lames de 18 mm"
    },
    {
      id: "p12",
      type: "Paquet de 7 lames",
      name: "7 lames de 25 mm",
      details: "Profil métallique pour montage",
      price: "4,00 €",
      image: "photo/lame3.jpg",
      alt: "7 lames de 25 mm"
    },
    {
      id: "p13",
      type: "Paquet de 100 pièces",
      name: "Lot de 100 sacs à gravats réutilisables",
      details: "Sacs robustes pour déchets chantier",
      price: "30,00 €",
      image: "photo/sac.jpg",
      alt: "Lot de 100 sacs à gravats réutilisables"
    },
    {
      id: "p14",
      type: "Rail",
      name: "Lot de 10 rails de 48 en 3 m NF, SEMIN",
      details: "Largeur : 48 mm | Longueur : 3 m | Usage : Cloison",
      price: "20,00 €",
        image: "photo/rail.jpg",
      alt: "Lot de 10 rails de 48 en 3 m NF, SEMIN"
    },
    {
      id: "p15",
      type: "Montant",
      name: "Montant de 48, L. 3 m",
      details: "Largeur : 48 mm | Longueur : 3 m | Usage : Cloison",
      price: "25,00 €",
        image: "photo/montant_m48.jpg",
      alt: "Montant de 48, L. 3 m"
    },
    {
      id: "p16",
      type: "Fourrure",
      name: "Lot de 10 fourrures de 47 en 3 m NF, SEMIN",
      details: "Largeur : 47 mm | Longueur : 3 m | Usage : Plafond et cloison",
      price: "23,00 €",
        image: "photo/lot10fourrers.jpg",
      alt: "Lot de 10 fourrures de 47 en 3 m NF, SEMIN"
    },
    {
      id: "p17",
      type: "Cornière",
      name: "Cornière acier CR2 24 x 34 mm en 3 m",
      details: "Largeur : 34 mm | Longueur : 3 m | Usage : Mise en périphérie",
      price: "25,00 €",
        image: "photo/corniere.jpg",
      alt: "Cornière acier CR2 24 x 34 mm en 3 m"
    },
    {
      id: "p18",
      type: "Isolation",
      name: "Laine de verre toutes épaisseurs",
      details: "Prix par rouleau",
      price: "35,00 €",
      image: "",
      alt: "Laine de verre toutes épaisseurs"
    }
  ];

  function cloneProducts(products) {
    return products.map((product) => ({ ...product }));
  }

  function createId() {
    return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function formatPrice(value) {
    const raw = String(value || "").trim();
    if (!raw) {
      return "";
    }

    const cleaned = raw.replace(/€/g, "").trim();
    const normalized = cleaned.replace(/,/g, ".");
    const amount = Number(normalized);

    if (!Number.isNaN(amount)) {
      const frenchPrice = amount.toFixed(2).replace(".", ",");
      return `${frenchPrice} €`;
    }

    if (cleaned.endsWith("€")) {
      return cleaned;
    }

    return `${cleaned} €`;
  }

  function normalizeProduct(input, existingId) {
    return {
      id: existingId || createId(),
      type: (input.type || "Produit").trim(),
      name: (input.name || "Nouveau produit").trim(),
      details: (input.details || "").trim(),
      price: formatPrice(input.price),
      image: (input.image || "photo/placeholder.jpg").trim(),
      alt: (input.alt || input.name || "Produit").trim()
    };
  }

  function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }

  function loadProducts() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaults = cloneProducts(DEFAULT_PRODUCTS);
      saveProducts(defaults);
      return defaults;
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (error) {
      console.error("Erreur de lecture des produits :", error);
    }

    const defaults = cloneProducts(DEFAULT_PRODUCTS);
    saveProducts(defaults);
    return defaults;
  }

  function resetProducts() {
    const defaults = cloneProducts(DEFAULT_PRODUCTS);
    saveProducts(defaults);
    return defaults;
  }

  window.ProductStore = {
    STORAGE_KEY,
    loadProducts,
    saveProducts,
    resetProducts,
    normalizeProduct,
    getDefaultProducts: () => cloneProducts(DEFAULT_PRODUCTS)
  };
})(window);
