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
				<div class="material-media">
					<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.alt || product.name)}" />
				</div>
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
				<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="suggestion-image" />
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

async function loadAndRenderProducts() {
	if (!window.BackendAPI || !window.BackendAPI.hasFirebaseConfig()) {
		renderError("Catalogue indisponible : Firebase n'est pas encore configuré.");
		return;
	}

	try {
		const { db } = window.BackendAPI.initFirebase();
		allProducts = await window.BackendAPI.fetchProducts(db);
		renderProducts(allProducts);
		initializeSearch();
	} catch (error) {
		console.error(error);
		renderError("Impossible de charger le catalogue pour le moment.");
	}
}

const yearElement = document.getElementById("year");
if (yearElement) {
	yearElement.textContent = new Date().getFullYear();
}

loadAndRenderProducts();
