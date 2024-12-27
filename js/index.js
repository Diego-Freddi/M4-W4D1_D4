/**
 * Gestisce la visualizzazione dei prodotti nella homepage
 * @example
 * // La vista viene inizializzata automaticamente al caricamento della pagina
 * document.addEventListener('DOMContentLoaded', initProductsView);
 */
function createProductsView() {
    const apiService = createApiService();
    const productsContainer = document.getElementById('dfProductsContainer');

    /**
     * Inizializza la vista caricando i prodotti
     * @async
     * @private
     */
    async function init() {
        await loadProducts();
    }

    /**
     * Carica i prodotti dal backend
     * @async
     * @private
     */
    async function loadProducts() {
        const products = await apiService.fetchProducts();
        renderProducts(products);
    }

    /**
     * Renderizza i prodotti nella pagina
     * @param {Array} products - Array di prodotti da visualizzare
     * @private
     * @example
     * const products = [
     *   {
     *     _id: "123",
     *     name: "iPhone",
     *     brand: "Apple", 
     *     price: 999,
     *     imageUrl: "https://example.com/iphone.jpg"
     *   }
     * ];
     * renderProducts(products);
     */
    function renderProducts(products) {
        productsContainer.innerHTML = products.map(createProductCard).join('');
    }

    function createProductCard(product) {
        return `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="df-product-card card h-100">
                    <img src="${product.imageUrl}" 
                         class="card-img-top" 
                         alt="${product.name}"
                         onerror="this.src='https://via.placeholder.com/300x200?text=Immagine+non+disponibile'">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <div class="card-brand">${product.brand}</div>
                        <p class="card-text text-muted">${product.description}</p>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <div class="card-price">${product.price}</div>
                            <a href="product.html?id=${product._id}" 
                               class="btn btn-details">
                               Dettagli
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    init();
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', createProductsView);