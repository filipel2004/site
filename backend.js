(function (window) {
  const FIREBASE_SETTINGS = window.FIREBASE_SETTINGS;

  function hasFirebaseConfig() {
    if (!FIREBASE_SETTINGS || !FIREBASE_SETTINGS.config) {
      return false;
    }

    const { apiKey, authDomain, projectId, appId } = FIREBASE_SETTINGS.config;
    return Boolean(apiKey && authDomain && projectId && appId && apiKey !== "YOUR_FIREBASE_API_KEY");
  }

  function initFirebase() {
    if (!hasFirebaseConfig()) {
      throw new Error("Firebase non configuré. Mettez à jour firebase-config.js");
    }

    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(FIREBASE_SETTINGS.config);
    }

    const app = window.firebase.app();
    const auth = typeof window.firebase.auth === "function" ? window.firebase.auth(app) : null;
    const db = window.firebase.firestore(app);
    const storage = typeof window.firebase.storage === "function" ? window.firebase.storage(app) : null;

    return {
      app,
      auth,
      db,
      storage,
      allowedAdminEmail: (FIREBASE_SETTINGS.allowedAdminEmail || "").toLowerCase().trim()
    };
  }

  async function fetchProducts(db) {
    const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
      return `${amount.toFixed(2).replace(".", ",")} €`;
    }

    return cleaned.endsWith("€") ? cleaned : `${cleaned} €`;
  }

  function normalizeProduct(input) {
    return {
      type: (input.type || "Produit").trim(),
      name: (input.name || "Nouveau produit").trim(),
      details: (input.details || "").trim(),
      price: formatPrice(input.price),
      image: (input.image || "").trim(),
      alt: (input.alt || input.name || "Produit").trim()
    };
  }

  async function uploadImage(storage, file) {
    if (!storage) {
      throw new Error("Firebase Storage n'est pas disponible.");
    }

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const ref = storage.ref().child(`products/${safeName}`);
    await ref.put(file);
    return ref.getDownloadURL();
  }

  async function saveProduct(db, payload, id) {
    const now = window.firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      ...payload,
      updatedAt: now
    };

    if (id) {
      await db.collection("products").doc(id).update(data);
      return id;
    }

    data.createdAt = now;
    const docRef = await db.collection("products").add(data);
    return docRef.id;
  }

  async function deleteProduct(db, id) {
    await db.collection("products").doc(id).delete();
  }

  window.BackendAPI = {
    hasFirebaseConfig,
    initFirebase,
    fetchProducts,
    normalizeProduct,
    uploadImage,
    saveProduct,
    deleteProduct
  };
})(window);
