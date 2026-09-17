const form = document.getElementById("product-form");
const tbody = document.getElementById("products-tbody");
const saveButton = document.getElementById("save-product-btn");
const cancelButton = document.getElementById("cancel-edit-btn");
const resetCatalogButton = document.getElementById("reset-catalog");
const formTitle = document.getElementById("admin-form-title");
const imagePreview = document.getElementById("admin-image-preview");
const headerActions = document.querySelector(".admin-header-actions");
const messagesTbody = document.getElementById("messages-tbody");
const exportMessagesButton = document.getElementById("export-messages-btn");

let backend = null;
let products = [];
let messages = [];
let editingId = null;

if (!window.BackendAPI || !window.BackendAPI.hasFirebaseConfig()) {
  document.body.className = "admin-page";
  document.body.innerHTML = `
    <main class="container admin-main">
      <article class="admin-card" style="max-width:760px; margin: 2rem auto;">
        <h2>Firebase non configuré</h2>
        <p class="admin-help">L'admin nécessite une configuration Firebase valide avant connexion.</p>
        <ol style="line-height:1.7; color:#334155;">
          <li>Ouvrez <strong>firebase-config.js</strong></li>
          <li>Remplacez les valeurs <strong>YOUR_...</strong> par vos vraies clés Firebase</li>
          <li>Vérifiez <strong>allowedAdminEmail</strong> = <strong>obrijanfilip2004@gmail.com</strong></li>
          <li>Rechargez la page admin</li>
        </ol>
        <a href="index.html" class="btn btn-secondary">Retour au site</a>
      </article>
    </main>
  `;
  throw new Error("Firebase non configuré");
}

backend = window.BackendAPI.initFirebase();

const allowedEmail = backend.allowedAdminEmail;
const DEFAULT_CATALOG = [
  {
    type: "Plaque",
    name: "Plaque de plâtre Knauf BA13",
    details: "Dimensions : L 1.20 m x H 3.00 m",
    price: "11,99 €",
    image: "photo/white.jpg",
    alt: "Plaque de plâtre Knauf BA13"
  },
  {
    type: "Plaque",
    name: "Plaque de plâtre hydrofuge Knauf BA13",
    details: "Dimensions : L 1.20 m x H 2.60 m",
    price: "13,99 €",
    image: "photo/green.jpg",
    alt: "Plaque de plâtre hydrofuge Knauf BA13"
  },
  {
    type: "Plaque",
    name: "Plaque de plâtre phonique Knauf BA13",
    details: "Dimensions : L 1.20 m x H 2.60 m",
    price: "14,99 €",
    image: "photo/blue.jpg",
    alt: "Plaque de plâtre phonique Knauf BA13"
  },
  {
    type: "Plaque",
    name: "Plaque de plâtre anti-feu Knauf BA13",
    details: "Dimensions : L 1.20 m x H 2.60 m",
    price: "15,99 €",
    image: "photo/roz.jpg",
    alt: "Plaque de plâtre anti-feu Knauf BA13"
  },
  {
    type: "Plaque",
    name: "Plaque de plâtre hydrofuge Knauf BA13",
    details: "Dimensions : L 1.20 m x H 3.00 m",
    price: "20,00 €",
    image: "photo/green.jpg",
    alt: "Plaque de plâtre hydrofuge Knauf BA13"
  },
  {
    type: "Plaque",
    name: "Plaque de plâtre hydrofuge Knauf BA13",
    details: "Dimensions : L 0.60 m x H 2.60 m",
    price: "8,99 €",
    image: "photo/green.jpg",
    alt: "Plaque de plâtre hydrofuge Knauf BA13"
  },
  {
    type: "Plaque",
    name: "Plaque de plâtre anti-feu Knauf BA15",
    details: "Dimensions : L 1.20 m x H 2.60 m",
    price: "25,00 €",
    image: "photo/roz.jpg",
    alt: "Plaque de plâtre anti-feu Knauf BA15"
  },
  {
    type: "Vis",
    name: "Vis 3 x 25",
    details: "Conditionnement : 1000 pièces",
    price: "9,99 €",
    image: "photo/samorez.jpg",
    alt: "Vis 3 x 25"
  },
  {
    type: "Primaire",
    name: "Ceresit primaire pénétrant sans solvant 5L",
    details: "Usage : préparation des supports",
    price: "20,00 €",
    image: "photo/ceresit1.jpg",
    alt: "Ceresit primaire pénétrant sans solvant 5L"
  },
  {
    type: "Pièce",
    name: "Cornière d’angle métallique plaque de plâtre",
    details: "Dimensions : L 3 m x l 20 mm x H 20 mm",
    price: "2,00 €",
    image: "photo/coltar.jpg",
    alt: "Cornière d’angle métallique plaque de plâtre"
  },
  {
    type: "Paquet de 10 lames",
    name: "10 lames de 18 mm",
    details: "Profil métallique pour montage",
    price: "2,00 €",
    image: "photo/lame1.jpg",
    alt: "10 lames de 18 mm"
  },
  {
    type: "Paquet de 7 lames",
    name: "7 lames de 25 mm",
    details: "Profil métallique pour montage",
    price: "4,00 €",
    image: "photo/lame3.jpg",
    alt: "7 lames de 25 mm"
  },
  {
    type: "Paquet de 100 pièces",
    name: "Lot de 100 sacs à gravats réutilisables",
    details: "Sacs robustes pour déchets chantier",
    price: "30,00 €",
    image: "photo/sac.jpg",
    alt: "Lot de 100 sacs à gravats réutilisables"
  },
  {
    type: "Rail",
    name: "Lot de 10 rails de 48 en 3 m NF, SEMIN",
    details: "Largeur : 48 mm | Longueur : 3 m | Usage : Cloison",
    price: "20,00 €",
    image: "photo/rail.jpg",
    alt: "Lot de 10 rails de 48 en 3 m NF, SEMIN"
  },
  {
    type: "Montant",
    name: "Montant de 48, L. 3 m",
    details: "Largeur : 48 mm | Longueur : 3 m | Usage : Cloison",
    price: "25,00 €",
    image: "photo/montant_m48.jpg",
    alt: "Montant de 48, L. 3 m"
  },
  {
    type: "Fourrure",
    name: "Lot de 10 fourrures de 47 en 3 m NF, SEMIN",
    details: "Largeur : 47 mm | Longueur : 3 m | Usage : Plafond et cloison",
    price: "23,00 €",
    image: "photo/lot10fourrers.jpg",
    alt: "Lot de 10 fourrures de 47 en 3 m NF, SEMIN"
  },
  {
    type: "Cornière",
    name: "Cornière acier CR2 24 x 34 mm en 3 m",
    details: "Largeur : 34 mm | Longueur : 3 m | Usage : Mise en périphérie",
    price: "25,00 €",
    image: "photo/corniere.jpg",
    alt: "Cornière acier CR2 24 x 34 mm en 3 m"
  },
  {
    type: "Isolation",
    name: "Laine de verre toutes épaisseurs",
    details: "Prix par rouleau",
    price: "35,00 €",
    image: "photo/laine.jpg",
    alt: "Laine de verre toutes épaisseurs"
  }
];

function buildProductKey(product) {
  return [product.type, product.name, product.details]
    .map((value) => String(value || "").trim().toLowerCase())
    .join("|");
}

function maskEmail(email) {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) {
    return email;
  }
  const start = localPart.substring(0, 2);
  const end = localPart.substring(localPart.length - 1);
  return `${start}***${end}@${domain}`;
}

function createLoginUi() {
  const loginBox = document.createElement("div");
  loginBox.className = "admin-card";
  loginBox.id = "admin-login-box";
  loginBox.innerHTML = `
    <h2>Connexion administrateur</h2>
    <p class="admin-help">Utilisez l'adresse autorisée : <strong>${escapeHtml(maskEmail(allowedEmail))}</strong></p>
    <form id="admin-login-form" class="admin-form">
      <label>
        Email
        <input type="email" name="email" required placeholder="email@exemple.com" />
      </label>
      <label>
        Mot de passe
        <input type="password" name="password" required minlength="6" placeholder="Votre mot de passe (6 caractères minimum)" />
      </label>
      <div class="admin-form-actions">
        <button type="submit" class="btn btn-primary">Se connecter</button>
        <button type="button" class="btn btn-secondary" id="create-account-btn">Créer le compte</button>
      </div>
    </form>
  `;

  const main = document.querySelector(".admin-main");
  main.prepend(loginBox);

  const loginForm = document.getElementById("admin-login-form");
  const createAccountButton = document.getElementById("create-account-btn");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const typedEmail = String(formData.get("email") || "").trim().toLowerCase();
    const email = typedEmail || allowedEmail;
    const password = String(formData.get("password") || "");

    if (email !== allowedEmail) {
      window.alert(`Utilisez exactement cet email autorisé : ${allowedEmail}`);
      if (loginForm.email) {
        loginForm.email.value = allowedEmail;
      }
      return;
    }

    try {
      await backend.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
      window.alert("Connexion impossible. Vérifiez email/mot de passe.");
    }
  });

  createAccountButton.addEventListener("click", async () => {
    const formData = new FormData(loginForm);
    const typedEmail = String(formData.get("email") || "").trim().toLowerCase();
    const email = typedEmail || allowedEmail;
    const password = String(formData.get("password") || "");

    if (email !== allowedEmail) {
      window.alert(`Le compte admin doit être créé avec cet email : ${allowedEmail}`);
      if (loginForm.email) {
        loginForm.email.value = allowedEmail;
      }
      return;
    }

    if (password.length < 6) {
      window.alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      await backend.auth.createUserWithEmailAndPassword(email, password);
      window.alert("Compte admin créé. Utilisez ce mot de passe pour vos prochaines connexions.");
    } catch (error) {
      console.error(error);
      window.alert("Impossible de créer le compte. Il existe déjà peut-être.");
    }
  });
}

function setAdminUiVisible(isVisible) {
  const adminGrid = document.querySelector(".admin-grid");
  adminGrid.style.display = isVisible ? "grid" : "none";
  if (headerActions) {
    headerActions.style.display = isVisible ? "flex" : "none";
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderTable() {
  if (!tbody) {
    return;
  }

  if (!products.length) {
    tbody.innerHTML = '<tr><td colspan="5">Aucun produit.</td></tr>';
    return;
  }

  tbody.innerHTML = products
    .map(
      (product) => `
      <tr>
        <td>
          <strong>${escapeHtml(product.name)}</strong>
          <p>${escapeHtml(product.details)}</p>
        </td>
        <td>${escapeHtml(product.type)}</td>
        <td>${escapeHtml(product.price)}</td>
        <td class="admin-image-cell">${product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.alt || product.name)}" class="admin-table-image" /><span>${escapeHtml(product.image)}</span>` : "Aucune image"}</td>
        <td class="admin-actions-cell">
          <button type="button" class="admin-link" data-action="edit" data-id="${escapeHtml(product.id)}">Modifier</button>
          <button type="button" class="admin-link danger" data-action="delete" data-id="${escapeHtml(product.id)}">Supprimer</button>
        </td>
      </tr>
    `
    )
    .join("");
}

function formatMessageDate(value) {
  if (!value) {
    return "-";
  }

  const dateValue = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(dateValue);
}

function getIsoDate(value) {
  if (!value) {
    return "";
  }

  const dateValue = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    return "";
  }

  return dateValue.toISOString();
}

function toCsvCell(value) {
  const safe = String(value ?? "").replace(/\r?\n|\r/g, " ").replace(/"/g, '""');
  return `"${safe}"`;
}

function exportMessagesToCsv() {
  if (!messages.length) {
    window.alert("Aucun message à exporter.");
    return;
  }

  const headers = ["date_iso", "date_locale", "nom", "email", "telephone", "message"];
  const rows = messages.map((message) => [
    getIsoDate(message.createdAt),
    formatMessageDate(message.createdAt),
    message.name || "",
    message.email || "",
    message.phone || "",
    message.message || ""
  ]);

  const csvLines = [headers, ...rows]
    .map((line) => line.map((value) => toCsvCell(value)).join(";"))
    .join("\n");

  const csvContent = `\uFEFF${csvLines}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  const datePart = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `messages-contact-${datePart}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function renderMessagesTable() {
  if (!messagesTbody) {
    return;
  }

  if (exportMessagesButton) {
    exportMessagesButton.disabled = messages.length === 0;
  }

  if (!messages.length) {
    messagesTbody.innerHTML = '<tr><td colspan="6">Aucun message.</td></tr>';
    return;
  }

  messagesTbody.innerHTML = messages
    .map(
      (message) => `
      <tr>
        <td>${escapeHtml(formatMessageDate(message.createdAt))}</td>
        <td>${escapeHtml(message.name || "-")}</td>
        <td>${escapeHtml(message.email || "-")}</td>
        <td>${escapeHtml(message.phone || "-")}</td>
        <td class="admin-message-cell">${escapeHtml(message.message || "-")}</td>
        <td class="admin-actions-cell">
          <button type="button" class="admin-link danger" data-action="delete-message" data-id="${escapeHtml(message.id)}">Supprimer</button>
        </td>
      </tr>
    `
    )
    .join("");
}

function resetForm() {
  form.reset();
  editingId = null;
  saveButton.textContent = "Ajouter";
  formTitle.textContent = "Ajouter un produit";
  updateImagePreview("");
}

function updateImagePreview(imagePath) {
  if (!imagePreview) {
    return;
  }

  imagePreview.hidden = !imagePath;
  imagePreview.src = imagePath || "";
}

function fillForm(product) {
  form.type.value = product.type;
  form.name.value = product.name;
  form.details.value = product.details;
  form.price.value = product.price;
  form.image.value = product.image && !product.image.startsWith("data:") ? product.image : "";
  form.alt.value = product.alt;
  updateImagePreview(product.image || "");
}

async function refreshProducts() {
  await syncDefaultCatalog();
  products = await window.BackendAPI.fetchProducts(backend.db);
  renderTable();
}

async function refreshMessages() {
  if (!messagesTbody || !window.BackendAPI.fetchContactMessages) {
    return;
  }

  messages = await window.BackendAPI.fetchContactMessages(backend.db);
  renderMessagesTable();
}

async function syncDefaultCatalog() {
  const currentProducts = await window.BackendAPI.fetchProducts(backend.db);
  const existingKeys = new Set(currentProducts.map((product) => buildProductKey(product)));
  let importedCount = 0;

  for (const item of DEFAULT_CATALOG) {
    const normalized = window.BackendAPI.normalizeProduct(item);
    const key = buildProductKey(normalized);

    if (existingKeys.has(key)) {
      continue;
    }

    await window.BackendAPI.saveProduct(backend.db, normalized, null);
    existingKeys.add(key);
    importedCount += 1;
  }

  return importedCount;
}

async function importDefaultCatalog() {
  if (!window.confirm("Importer le catalogue par défaut dans Firebase ? Les doublons seront ignorés.")) {
    return;
  }

  const originalLabel = resetCatalogButton.textContent;
  resetCatalogButton.disabled = true;
  resetCatalogButton.textContent = "Import en cours...";

  try {
    const importedCount = await syncDefaultCatalog();
    await refreshProducts();
    window.alert(importedCount ? `${importedCount} produit(s) importé(s) avec succès.` : "Le catalogue par défaut est déjà importé.");
  } catch (error) {
    console.error(error);
    window.alert("Impossible d'importer le catalogue par défaut.");
  } finally {
    resetCatalogButton.disabled = false;
    resetCatalogButton.textContent = originalLabel;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const input = Object.fromEntries(formData.entries());
  const selectedFile = form.imageFile && form.imageFile.files ? form.imageFile.files[0] : null;

  try {
    if (selectedFile) {
      input.image = await window.BackendAPI.uploadImage(backend.storage, selectedFile);
    }
  } catch (error) {
    window.alert("Impossible de charger l'image sélectionnée.");
    return;
  }

  if (!input.image || !input.image.trim()) {
    if (editingId) {
      const currentProduct = products.find((product) => product.id === editingId);
      input.image = currentProduct ? currentProduct.image : "";
    }
  }

  if (!input.image || !String(input.image).trim()) {
    window.alert("Ajoutez une image depuis votre ordinateur ou indiquez un chemin d'image.");
    return;
  }

  const normalized = window.BackendAPI.normalizeProduct(input);

  try {
    await window.BackendAPI.saveProduct(backend.db, normalized, editingId || null);
    await refreshProducts();
    resetForm();
  } catch (error) {
    console.error(error);
    window.alert("Enregistrement impossible.");
  }
});

cancelButton.addEventListener("click", () => {
  resetForm();
});

tbody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }

  if (action === "edit") {
    editingId = id;
    fillForm(product);
    saveButton.textContent = "Mettre à jour";
    formTitle.textContent = "Modifier le produit";
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (action === "delete") {
    const confirmed = window.confirm(`Supprimer \"${product.name}\" ?`);
    if (!confirmed) {
      return;
    }

    window.BackendAPI
      .deleteProduct(backend.db, id)
      .then(() => refreshProducts())
      .catch((error) => {
        console.error(error);
        window.alert("Suppression impossible.");
      });

    if (editingId === id) {
      resetForm();
    }
  }
});

if (messagesTbody) {
  messagesTbody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action='delete-message']");
    if (!button) {
      return;
    }

    const { id } = button.dataset;
    const message = messages.find((item) => item.id === id);
    if (!message) {
      return;
    }

    const confirmed = window.confirm(`Supprimer le message de "${message.name || "Inconnu"}" ?`);
    if (!confirmed) {
      return;
    }

    window.BackendAPI
      .deleteContactMessage(backend.db, id)
      .then(() => refreshMessages())
      .catch((error) => {
        console.error(error);
        window.alert("Suppression du message impossible.");
      });
  });
}

if (exportMessagesButton) {
  exportMessagesButton.addEventListener("click", exportMessagesToCsv);
}

if (resetCatalogButton) {
  resetCatalogButton.addEventListener("click", () => {
    importDefaultCatalog();
  });
}

setAdminUiVisible(false);
createLoginUi();

backend.auth.setPersistence(window.firebase.auth.Auth.Persistence.NONE).catch(() => {});

backend.auth.signOut().finally(() => {
  backend.auth.onAuthStateChanged(async (user) => {
    const loginBox = document.getElementById("admin-login-box");

    if (!user) {
      setAdminUiVisible(false);
      if (loginBox) {
        loginBox.style.display = "block";
      }
      return;
    }

    const email = (user.email || "").toLowerCase().trim();
    if (email !== allowedEmail) {
      window.alert("Accès refusé : email non autorisé.");
      await backend.auth.signOut();
      return;
    }

    if (loginBox) {
      loginBox.style.display = "none";
    }

    setAdminUiVisible(true);
    await refreshProducts();
    await refreshMessages();
  });
});
