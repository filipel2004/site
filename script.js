function escapeHtml(value) {
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function renderProducts(products) {
	const grid = document.getElementById("materials-grid");
	if (!grid) {
		return;
	}

	grid.innerHTML = products
		.map(
			(product) => `
			<article class="material-card">
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
		const products = await window.BackendAPI.fetchProducts(db);
		renderProducts(products);
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
