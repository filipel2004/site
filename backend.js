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

  async function saveContactMessage(db, payload) {
    const now = window.firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      name: String(payload.name || "").trim(),
      email: String(payload.email || "").trim().toLowerCase(),
      phone: String(payload.phone || "").trim(),
      message: String(payload.message || "").trim(),
      source: "website",
      createdAt: now
    };

    const docRef = await db.collection("contactMessages").add(data);
    return docRef.id;
  }

  async function fetchContactMessages(db) {
    const snapshot = await db.collection("contactMessages").orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async function deleteContactMessage(db, id) {
    await db.collection("contactMessages").doc(id).delete();
  }

  async function sendContactEmail(payload) {
    const settings = window.FIREBASE_SETTINGS || {};
    const emailJs = settings.emailjs || {};
    const recipientEmail = String(settings.contactRecipientEmail || "").trim();

    if (!emailJs.serviceId || !emailJs.templateId || !emailJs.publicKey || !recipientEmail) {
      return { sent: false, reason: "email_not_configured" };
    }

    const response = await window.fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        service_id: emailJs.serviceId,
        template_id: emailJs.templateId,
        user_id: emailJs.publicKey,
        template_params: {
          to_email: recipientEmail,
          from_name: String(payload.name || ""),
          from_email: String(payload.email || ""),
          phone: String(payload.phone || ""),
          message: String(payload.message || "")
        }
      })
    });

    if (!response.ok) {
      throw new Error("EmailJS request failed");
    }

    return { sent: true };
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
    saveContactMessage,
    fetchContactMessages,
    deleteContactMessage,
    sendContactEmail,
    deleteProduct
  };
})(window);
