function escapeHtml(value) {
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

let allProducts = [];

function findFirstMatchingProduct(query) {
	const searchTerm = (query || "").toLowerCase().trim();
	if (!searchTerm) {
		return null;
	}

	return allProducts.find((product) => {
		const name = (product.name || "").toLowerCase();
		const type = (product.type || "").toLowerCase();
		const details = (product.details || "").toLowerCase();
		return name.includes(searchTerm) || type.includes(searchTerm) || details.includes(searchTerm);
	}) || null;
}

function goToProduct(productName) {
	const cards = document.querySelectorAll(".material-card");
	for (let card of cards) {
		if ((card.dataset.productName || "").toLowerCase() === String(productName).toLowerCase() && card.offsetParent !== null) {
			card.scrollIntoView({ behavior: "smooth", block: "center" });
			highlightProductCard(card);
			return;
		}
	}
}

function goToFirstMatchingCard(query) {
	const searchTerm = (query || "").toLowerCase().trim();
	if (!searchTerm) {
		return false;
	}

	const cards = document.querySelectorAll(".material-card");
	for (let card of cards) {
		const name = (card.dataset.productName || "").toLowerCase();
		const type = (card.dataset.productType || "").toLowerCase();
		const details = (card.dataset.productDetails || "").toLowerCase();

		if ((name.includes(searchTerm) || type.includes(searchTerm) || details.includes(searchTerm)) && card.offsetParent !== null) {
			card.scrollIntoView({ behavior: "smooth", block: "center" });
			highlightProductCard(card);
			return true;
		}
	}

	return false;
}

function triggerSearchAction(query) {
	const matchedProduct = findFirstMatchingProduct(query);
	const suggestionsList = document.getElementById("search-suggestions");
	if (suggestionsList) {
		suggestionsList.classList.remove("active");
		suggestionsList.innerHTML = "";
	}

	const catalogueSection = document.getElementById("materiaux");
	if (catalogueSection) {
		catalogueSection.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	if (!matchedProduct) {
		return;
	}

	setTimeout(() => {
		goToFirstMatchingCard(query) || goToProduct(matchedProduct.name);
	}, 60);
}

function highlightProductCard(card) {
	if (!card) {
		return;
	}

	card.classList.remove("search-target-highlight");
	void card.offsetWidth;
	card.classList.add("search-target-highlight");

	setTimeout(() => {
		card.classList.remove("search-target-highlight");
	}, 1100);
}

function renderProducts(products) {
	const grid = document.getElementById("materials-grid");
	if (!grid) {
		return;
	}

	if (products.length === 0) {
		grid.innerHTML = '<p style="color:#334155; font-weight:600; text-align:center; padding:2rem 0;">Aucun produit trouvé correspondant à votre recherche.</p>';
		return;
	}

	grid.innerHTML = products
		.map(
			(product) => `
			<article class="material-card" data-product-name="${escapeHtml(product.name)}" data-product-type="${escapeHtml(product.type)}" data-product-details="${escapeHtml(product.details)}">
				<div class="material-media">${product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.alt || product.name)}" loading="lazy" decoding="async" />` : ""}</div>
				<div class="material-content">
					<p class="type">${escapeHtml(product.type)}</p>
					<h3>${escapeHtml(product.name)}</h3>
					<p class="details">${escapeHtml(product.details)}</p>
					<p class="price">${escapeHtml(product.price)}</p>
				</div>
			</article>
		`
		)
		.join("");
}

function filterProducts(query) {
	const searchTerm = query.toLowerCase().trim();
	
	if (!searchTerm) {
		renderProducts(allProducts);
		return;
	}

	const filtered = allProducts.filter((product) => {
		const name = (product.name || "").toLowerCase();
		const type = (product.type || "").toLowerCase();
		const details = (product.details || "").toLowerCase();
		
		return name.includes(searchTerm) || type.includes(searchTerm) || details.includes(searchTerm);
	});

	renderProducts(filtered);
}

function renderSuggestions(query) {
	const suggestionsList = document.getElementById("search-suggestions");
	if (!suggestionsList) return;

	const searchTerm = query.toLowerCase().trim();

	let filtered = [];
	
	if (!searchTerm) {
		// Show all products when search is empty (for initial focus)
		filtered = allProducts.slice(0, 8);
	} else {
		filtered = allProducts.filter((product) => {
			const name = (product.name || "").toLowerCase();
			const type = (product.type || "").toLowerCase();
			const details = (product.details || "").toLowerCase();
			
			return name.includes(searchTerm) || type.includes(searchTerm) || details.includes(searchTerm);
		});
	}

	if (filtered.length === 0) {
		suggestionsList.innerHTML = '<li class="search-no-results">Aucun élément trouvé.</li>';
		suggestionsList.classList.add("active");
		return;
	}

	const topSuggestions = filtered.slice(0, 8);
	suggestionsList.innerHTML = topSuggestions
		.map(
			(product) => `
			<li class="suggestion-item" data-product-name="${escapeHtml(product.name)}" tabindex="0">
				<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="suggestion-image" loading="lazy" decoding="async" />
				<div class="suggestion-info">
					<strong>${escapeHtml(product.name)}</strong>
					<small>${escapeHtml(product.type)}</small>
				</div>
			</li>
		`
		)
		.join("");

	suggestionsList.classList.add("active");

	// Add click handlers to suggestions
	const suggestionItems = suggestionsList.querySelectorAll(".suggestion-item");
	suggestionItems.forEach((item) => {
		item.addEventListener("click", () => {
			const productName = item.dataset.productName;
			const searchInput = document.getElementById("product-search");
			if (searchInput) {
				searchInput.value = "";
				suggestionsList.classList.remove("active");
				suggestionsList.innerHTML = "";
				setTimeout(() => {
					goToProduct(productName);
				}, 60);
			}
		});

		// Keyboard navigation
		item.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				item.click();
			}
		});
	});
}

function initializeSearch() {
	const searchInput = document.getElementById("product-search");
	const searchTrigger = document.getElementById("search-trigger");
	if (searchInput) {
		// Show suggestions on focus (click in search box)
		searchInput.addEventListener("focus", (event) => {
			renderSuggestions(event.target.value);
		});

		// Update suggestions on input
		searchInput.addEventListener("input", (event) => {
			const query = event.target.value;
			renderSuggestions(query);
		});

		searchInput.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				const query = searchInput.value;
				triggerSearchAction(query);
				searchInput.value = "";
				return;
			}

			if (event.key === "Escape") {
				searchInput.value = "";
				const suggestionsList = document.getElementById("search-suggestions");
				if (suggestionsList) {
					suggestionsList.classList.remove("active");
					suggestionsList.innerHTML = "";
				}
			}
		});

		if (searchTrigger) {
			searchTrigger.addEventListener("click", () => {
				const query = searchInput.value;
				triggerSearchAction(query);
				searchInput.value = "";
			});
		}

		// Hide suggestions when clicking outside
		document.addEventListener("click", (event) => {
			const suggestionsList = document.getElementById("search-suggestions");
			const searchWrapper = document.querySelector(".search-wrapper");
			if (suggestionsList && !searchWrapper.contains(event.target)) {
				suggestionsList.classList.remove("active");
			}
		});
	}
}

function renderError(message) {
	const grid = document.getElementById("materials-grid");
	if (!grid) {
		return;
	}

	grid.innerHTML = `<p style="color:#334155; font-weight:600;">${escapeHtml(message)}</p>`;
}

function scrollToHashTarget() {
	const hash = window.location.hash;
	if (!hash) {
		return;
	}

	const target = document.querySelector(hash);
	if (!target) {
		return;
	}

	target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initializePublicContactInfo() {
	const settings = window.FIREBASE_SETTINGS || {};
	const contact = settings.publicContact || {};

	const companyName = String(contact.companyName || "Matériaux Pro Bâtiment");
	const phoneDisplay = String(contact.phoneDisplay || "+33 0 00 00 00 00");
	const phoneLink = String(contact.phoneLink || "+33000000000").replace(/\s+/g, "");
	const email = String(contact.email || "contact@materiauxprobatiment.fr");
	const address = String(contact.address || "Adresse à compléter");
	const hours = String(contact.hours || "Lun - Ven : 08:00 - 18:00");

	const phoneLinkElement = document.getElementById("contact-phone-link");
	if (phoneLinkElement) {
		phoneLinkElement.textContent = phoneDisplay;
		phoneLinkElement.setAttribute("href", `tel:${phoneLink}`);
		phoneLinkElement.setAttribute("aria-label", `Appeler ${companyName}`);
	}

	const secondPhoneDisplay = String(contact.phoneSecondDisplay || "");
	const secondPhoneLink = String(contact.phoneSecondLink || "").replace(/\s+/g, "");
	const secondPhoneLinkElement = document.getElementById("contact-phone-second-link");
	if (secondPhoneLinkElement && secondPhoneDisplay && secondPhoneLink) {
		secondPhoneLinkElement.textContent = secondPhoneDisplay;
		secondPhoneLinkElement.setAttribute("href", `tel:${secondPhoneLink}`);
		secondPhoneLinkElement.setAttribute("aria-label", `Appeler ${companyName}`);
	}

	const emailLinkElement = document.getElementById("contact-email-link");
	if (emailLinkElement) {
		emailLinkElement.textContent = email;
		emailLinkElement.setAttribute("href", `mailto:${email}`);
		emailLinkElement.setAttribute("aria-label", `Envoyer un email à ${companyName}`);
	}

	const addressElement = document.getElementById("contact-address");
	if (addressElement) {
		addressElement.textContent = address;
	}

	const hoursElement = document.getElementById("contact-hours");
	if (hoursElement) {
		hoursElement.textContent = hours;
	}

	const floatingPhoneElement = document.getElementById("floating-phone");
	if (floatingPhoneElement) {
		floatingPhoneElement.setAttribute("href", `tel:${phoneLink}`);
		floatingPhoneElement.setAttribute("aria-label", `Appeler ${companyName}`);
	}
}

function initializeContactForm() {
	const form = document.getElementById("contact-form");
	if (!form) {
		return;
	}

	const statusElement = document.getElementById("contact-form-status");
	const submitButton = document.getElementById("contact-submit-btn");

	const setStatus = (message, type) => {
		if (!statusElement) {
			return;
		}
		statusElement.textContent = message;
		statusElement.classList.remove("is-success", "is-error");
		if (type) {
			statusElement.classList.add(type);
		}
	};

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const formData = new FormData(form);
		const honeypot = String(formData.get("company") || "").trim();
		if (honeypot) {
			setStatus("Envoi impossible. Veuillez réessayer.", "is-error");
			return;
		}

		const payload = {
			name: String(formData.get("name") || "").trim(),
			email: String(formData.get("email") || "").trim(),
			phone: String(formData.get("phone") || "").trim(),
			message: String(formData.get("message") || "").trim()
		};

		if (!payload.name || !payload.email || !payload.message) {
			setStatus("Merci de remplir les champs obligatoires.", "is-error");
			return;
		}

		if (submitButton) {
			submitButton.disabled = true;
			submitButton.textContent = "Envoi...";
		}

		setStatus("", "");

		try {
			if (!window.BackendAPI || !window.BackendAPI.hasFirebaseConfig()) {
				throw new Error("firebase_not_configured");
			}

			const { db } = window.BackendAPI.initFirebase();
			await window.BackendAPI.saveContactMessage(db, payload);

			try {
				await window.BackendAPI.sendContactEmail(payload);
			} catch (emailError) {
				console.warn("Email notification not sent:", emailError);
			}

			form.reset();
			setStatus("Merci ! Votre demande a bien été envoyée.", "is-success");
		} catch (error) {
			console.error(error);
			setStatus("Impossible d'envoyer votre demande pour le moment. Réessayez plus tard.", "is-error");
		} finally {
			if (submitButton) {
				submitButton.disabled = false;
				submitButton.textContent = "Envoyer la demande";
			}
		}
	});
}

async function loadAndRenderProducts() {
	if (!window.BackendAPI || !window.BackendAPI.hasFirebaseConfig()) {
		renderError("Catalogue indisponible : Firebase n'est pas encore configuré.");
		setTimeout(scrollToHashTarget, 60);
		return;
	}

	try {
		const { db } = window.BackendAPI.initFirebase();
		allProducts = await window.BackendAPI.fetchProducts(db);
		const defaultProducts = window.ProductStore ? window.ProductStore.getDefaultProducts() : [];
		const existingProductKeys = new Set(allProducts.map((product) => `${product.name}|${product.details}`));
		const localSupplements = defaultProducts.filter((product) => product.id.startsWith("p1") && !existingProductKeys.has(`${product.name}|${product.details}`));
		allProducts = allProducts.concat(localSupplements);
		renderProducts(allProducts);
		initializeSearch();
		setTimeout(scrollToHashTarget, 60);
	} catch (error) {
		console.error(error);
		renderError("Impossible de charger le catalogue pour le moment.");
		setTimeout(scrollToHashTarget, 60);
	}
}

const yearElement = document.getElementById("year");
if (yearElement) {
	yearElement.textContent = new Date().getFullYear();
}

loadAndRenderProducts();
initializeContactForm();
initializePublicContactInfo();
// Cookie Consent Management
function initializeCookieConsent() {
	const cookieBanner = document.getElementById("cookie-banner");
	const acceptBtn = document.getElementById("cookie-accept");
	const declineBtn = document.getElementById("cookie-decline");
	const COOKIE_CONSENT_KEY = "materiaux_pro_cookie_consent";

	if (!cookieBanner || !acceptBtn || !declineBtn) {
		return;
	}

	// Check if user has already made a choice
	const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
	
	// Show banner only if no preference is stored
	if (!storedConsent) {
		cookieBanner.classList.add("show");
	} else if (storedConsent === "accepted") {
		loadAnalytics();
	}

	// Handle Accept button
	acceptBtn.addEventListener("click", () => {
		localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
		cookieBanner.classList.remove("show");
		loadAnalytics();
	});

	// Handle Decline button
	declineBtn.addEventListener("click", () => {
		localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
		cookieBanner.classList.remove("show");
	});
}

// Load Google Analytics only if consent is given
function loadAnalytics() {
	const settings = window.FIREBASE_SETTINGS || {};
	const measurementId = String(settings.analyticsMeasurementId || "").trim();

	if (!measurementId || window.__gaLoaded) {
		return;
	}

	window.__gaLoaded = true;
	window.dataLayer = window.dataLayer || [];
	window.gtag = function gtag() {
		window.dataLayer.push(arguments);
	};

	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
	document.head.appendChild(script);

	window.gtag("js", new Date());
	window.gtag("config", measurementId);
}

// Initialize cookie consent when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeCookieConsent);
} else {
	initializeCookieConsent();
}

window.addEventListener("hashchange", scrollToHashTarget);