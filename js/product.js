/**
 * Gestisce la visualizzazione del dettaglio di un prodotto
 * @example
 * // La vista viene inizializzata automaticamente al caricamento della pagina
 * document.addEventListener('DOMContentLoaded', initProductDetailView);
 */
function createProductDetailView() {
    const apiService = createApiService();
    const productContainer = document.getElementById('dfProductDetail');
    const productId = new URLSearchParams(window.location.search).get('id');

    /**
     * Carica e visualizza i dettagli del prodotto
     * @async
     * @private
     * @example
     * const product = {
     *   name: "iPhone 15",
     *   brand: "Apple", 
     *   price: 999,
     *   description: "L'ultimo iPhone",
     *   imageUrl: "https://example.com/iphone.jpg"
     * };
     * renderProduct(product);
     */
    async function init() {
        if (!productId) {
            window.location.href = 'index.html';
            return;
        }
        await loadProduct();
    }

    /**
     * Carica i dettagli del prodotto dal backend
     * @async
     * @private
     * @example
     * const product = await loadProduct();
     * console.log(product); // {id: "123abc", name: "iPhone", ...}
     */
    async function loadProduct() {
        const product = await apiService.getProduct(productId);
        if (!product) {
            showError();
            return;
        }
        renderProduct(product);
        document.title = `${product.name} - Marketplace`;
    }

    /**
     * Renderizza i dettagli del prodotto nella pagina
     * @param {Object} product - Prodotto da visualizzare
     * @private
     * @example
     * const product = {
     *   name: "iPhone 15",
     *   brand: "Apple",
     *   price: 999,
     *   description: "L'ultimo iPhone",
     *   imageUrl: "https://example.com/iphone.jpg"
     * };
     * renderProduct(product);
     */
    function renderProduct(product) {
        productContainer.innerHTML = `
            <div class="product-header">
                <div class="product-image-container">
                    <img src="${product.imageUrl}" 
                         class="product-image" 
                         alt="${product.name}"
                         onerror="this.src='https://via.placeholder.com/600x400?text=Immagine+non+disponibile'">
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.brand}</div>
                    <h1 class="product-name">${product.name}</h1>
                    <div class="product-price">${product.price}</div>
                    <a href="index.html" class="btn btn-outline-primary">
                        ← Torna alla lista
                    </a>
                </div>
            </div>
            <div class="product-description">
                ${product.description}
            </div>
        `;
    }

    /**
     * Mostra un messaggio di errore se il prodotto non viene trovato
     * @private
     */
    function showError() {
        productContainer.innerHTML = `
            <div class="text-center py-5">
                <h2>Prodotto non trovato</h2>
                <p class="text-muted">Il prodotto che stai cercando non esiste o è stato rimosso.</p>
                <a href="index.html" class="btn btn-primary mt-3">
                    Torna alla homepage
                </a>
            </div>
        `;
    }

    return {
        init
    };
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    const productDetailView = createProductDetailView();
    productDetailView.init();
});