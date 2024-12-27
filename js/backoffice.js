/**
 * Gestisce l'interfaccia di amministrazione dei prodotti
 * @example
 * // La vista viene inizializzata automaticamente al caricamento della pagina
 * document.addEventListener('DOMContentLoaded', initBackofficeView);
 */
function createBackofficeView() {
    const apiService = createApiService();
    const productForm = document.getElementById('dfProductForm');
    const productsTableBody = document.getElementById('dfProductsTableBody');
    const imageUrl = document.getElementById('imageUrl');
    const imageFile = document.getElementById('imageFile');
    const imagePreview = document.getElementById('imagePreview');

    /**
     * Gestisce l'anteprima dell'immagine
     */
    function setupImageHandlers() {
        // Anteprima per URL
        imageUrl.addEventListener('input', () => {
            const url = imageUrl.value;
            if (url) {
                let img = imagePreview.querySelector('img');
                if (!img) {
                    img = document.createElement('img');
                    img.className = 'img-fluid';
                    imagePreview.appendChild(img);
                }
                img.src = url;
            } else {
                const img = imagePreview.querySelector('img');
                if (img) {
                    img.remove();
                }
            }
        });

        // Anteprima per File
        imageFile.addEventListener('change', () => {
            const file = imageFile.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    let img = imagePreview.querySelector('img');
                    if (!img) {
                        img = document.createElement('img');
                        img.className = 'img-fluid';
                        imagePreview.appendChild(img);
                    }
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    /**
     * Carica i prodotti dal server
     */
    async function loadProducts() {
        const products = await apiService.fetchProducts();
        renderProducts(products);
    }

    /**
     * Renderizza i prodotti nella tabella
     */
    function renderProducts(products) {
        productsTableBody.innerHTML = products.map(createProductRow).join('');
        
        // Aggiungi event listeners per le azioni
        productsTableBody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => editProduct(btn.dataset.id));
        });
        
        productsTableBody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
        });
    }

    /**
     * Gestisce l'invio del form
     */
    async function handleSubmit(e) {
        e.preventDefault();
        
        // Determina la fonte dell'immagine
        let imageSource;
        if (imageFile.files.length > 0) {
            // Se c'è un file, lo convertiamo in base64
            imageSource = await convertFileToBase64(imageFile.files[0]);
        } else {
            // Altrimenti usiamo l'URL
            imageSource = imageUrl.value;
        }

        const productData = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            brand: document.getElementById('brand').value,
            imageUrl: imageSource,
            price: parseFloat(document.getElementById('price').value)
        };

        const productId = document.getElementById('productId').value;

        try {
            if (productId) {
                await apiService.updateProduct(productId, productData);
            } else {
                await apiService.createProduct(productData);
            }
            
            resetForm();
            await loadProducts();
        } catch (error) {
            console.error('Errore durante il salvataggio:', error);
            alert('Si è verificato un errore durante il salvataggio del prodotto.');
        }
    }

    /**
     * Converte un file in base64
     */
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Reset del form
     */
    function resetForm() {
        productForm.reset();
        document.getElementById('productId').value = '';
        productForm.querySelector('button[type="submit"]').textContent = 'Salva';
        const img = imagePreview.querySelector('img');
        if (img) {
            img.remove();
        }
    }

    /**
     * Crea una riga di prodotto nella tabella
     * @param {Object} product - Prodotto da visualizzare
     * @returns {string} HTML della riga di prodotto
     * @private
     */
    function createProductRow(product) {
        return `
            <tr>
                <td>
                    <div class="df-image-preview">
                        ${product.imageUrl ? 
                            `<img src="${product.imageUrl}" 
                                 class="img-fluid product-thumbnail" 
                                 alt="${product.name}"
                                 onerror="this.src='https://via.placeholder.com/50x50?text=NA'">` 
                            : ''}
                    </div>
                </td>
                <td>${product.name}</td>
                <td>${product.brand}</td>
                <td>€${product.price}</td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-action btn-edit" data-id="${product._id}">
                            ✏️
                        </button>
                        <button class="btn btn-action btn-delete" data-id="${product._id}">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    /**
     * Carica un prodotto nel form per la modifica
     * @async
     * @param {string} id - ID del prodotto da modificare
     * @private
     */
    async function editProduct(id) {
        const product = await apiService.getProduct(id);
        if (!product) return;

        document.getElementById('productId').value = product._id;
        document.getElementById('name').value = product.name;
        document.getElementById('description').value = product.description;
        document.getElementById('brand').value = product.brand;
        document.getElementById('imageUrl').value = product.imageUrl;
        document.getElementById('price').value = product.price;

        // Gestione anteprima immagine esistente
        if (product.imageUrl) {
            let img = imagePreview.querySelector('img');
            if (!img) {
                img = document.createElement('img');
                img.className = 'img-fluid';
                imagePreview.appendChild(img);
            }
            img.src = product.imageUrl;
        }

        productForm.querySelector('button[type="submit"]').textContent = 'Aggiorna';
    }

    /**
     * Elimina un prodotto
     * @async
     * @param {string} id - ID del prodotto da eliminare
     */
    async function deleteProduct(id) {
        if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return;

        try {
            await apiService.deleteProduct(id);
            await loadProducts();
        } catch (error) {
            console.error('Errore durante l\'eliminazione:', error);
            alert('Si è verificato un errore durante l\'eliminazione del prodotto.');
        }
    }

    /**
     * Inizializzazione
     */
    async function init() {
        setupImageHandlers();
        productForm.addEventListener('submit', handleSubmit);
        productForm.addEventListener('reset', resetForm);
        await loadProducts();
    }

    return { init };
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    const backofficeView = createBackofficeView();
    backofficeView.init();
});