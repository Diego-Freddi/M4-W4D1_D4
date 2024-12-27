const API_URL = 'https://striveschool-api.herokuapp.com/api/product';

/**
 * Servizio per gestire le chiamate API al backend del marketplace.
 * Fornisce metodi per interagire con l'API dei prodotti, incluse operazioni CRUD.
 * 
 * @example
 * // Crea un'istanza del servizio
 * const api = createApiService();
 * 
 * // Recupera tutti i prodotti
 * const products = await api.fetchProducts();
 * 
 * // Recupera un singolo prodotto
 * const product = await api.getProduct('123');
 * 
 * // Crea un nuovo prodotto
 * const newProduct = {
 *   name: "iPhone 15 Pro",
 *   description: "L'ultimo modello di iPhone", 
 *   brand: "Apple",
 *   imageUrl: "https://example.com/iphone.jpg",
 *   price: 1299
 * };
 * const created = await api.createProduct(newProduct);
 * 
 * // Aggiorna un prodotto esistente
 * const updated = await api.updateProduct('123', { price: 1199 });
 * 
 * // Elimina un prodotto
 * await api.deleteProduct('123');
 */
/**
 * Crea un'istanza del servizio API
 * @returns {Object} Oggetto con i metodi per interagire con l'API
 */
const createApiService = () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYxYjhlNTUzMDRhNzAwMTUxNDhiMmEiLCJpYXQiOjE3MzQ0NjQ0NzcsImV4cCI6MTczNTY3NDA3N30.0f9iHSOe-pusM6x6s9HbtFpICRF4nsGl5dzicFu_PgU';
    localStorage.setItem('token', token);

    /**
     * Recupera tutti i prodotti dal backend
     * @async
     * @returns {Promise<Array>} Array di prodotti
     */
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return await response.json();

        } catch (error) {
            console.error('Errore nel recupero dei prodotti:', error);
            return [];
        }
    };

    /**
     * Recupera un singolo prodotto dal backend
     * @async
     * @param {string} id - ID del prodotto da recuperare
     * @returns {Promise<Object>} Prodotto recuperato
     */
    const getProduct = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Errore nel recupero del prodotto:', error);
            return null;
        }
    };

    /**
     * Crea un nuovo prodotto
     * @async
     * @param {Object} product - Dati del prodotto da creare
     * @returns {Promise<Object>} Prodotto creato
     */
    const createProduct = async (product) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(product)
            });
            return await response.json();
        } catch (error) {
            console.error('Errore nella creazione del prodotto:', error);
            return null;
        }
    };

    /**
     * Aggiorna un prodotto esistente
     * @async
     * @param {string} id - ID del prodotto da aggiornare
     * @param {Object} product - Nuovi dati del prodotto
     * @returns {Promise<Object>} Prodotto aggiornato
     */
    const updateProduct = async (id, product) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(product)
            });
            return await response.json();
        } catch (error) {
            console.error('Errore nell\'aggiornamento del prodotto:', error);
            return null;
        }
    };

    /**
     * Elimina un prodotto
     * @async
     * @param {string} id - ID del prodotto da eliminare
     * @returns {Promise<Object>} Risultato dell'eliminazione
     */
    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Errore nell\'eliminazione del prodotto:', error);
            return null;
        }
    };

    return {
        fetchProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct
    };
};