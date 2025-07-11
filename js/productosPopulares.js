document.addEventListener("DOMContentLoaded", () => {
    const tabLinks = document.querySelectorAll(".hm-tab-link");
    const tabContainers = {
        moda_hombre: document.getElementById("tab-moda-hombre"),
        moda_mujer: document.getElementById("tab-moda-mujer"),
        tecnologia: document.getElementById("tab-tecnologia"),
        oferta: document.getElementById("tab-oferta")
    };

    // Función para crear la card HTML de cada producto
    function crearCardProducto(producto) {
        return `
        <div class="product-item">
            <div class="p-portada">
            <img src="${producto.image}" alt="${producto.title}">
            ${producto.price < 50 ? '<span class="stin stin-new">Nuevo</span>' : ''}
            </div>
            <div class="p-info">
            <h3>${producto.title.length > 40 ? producto.title.slice(0,40) + "..." : producto.title}</h3>
            <div class="precio">
                <span>$ ${producto.price.toFixed(2)}</span>
            </div>
            <a href="#" class="hm-btn btn-primary uppercase" onclick='guardarProducto(${JSON.stringify({
                nombre: producto.title,
                precio: producto.price,
                imagen: producto.image
            }).replace(/"/g, "&quot;")})'>AGREGAR AL CARRITO</a>
            </div>
        </div>
        `;
    }

    // Cargar productos desde la API
    fetch("https://fakestoreapi.com/products")
        .then(res => res.json())
        .then(data => {
        // Filtrar y limitar productos para cada categoría
        const moda_hombre = data.filter(p => p.category === "men's clothing").slice(0,4);
        const moda_mujer = data.filter(p => p.category === "women's clothing").slice(0,4);
        const tecnologia = data.filter(p => p.category === "electronics").slice(0,4);
        const oferta = data.filter(p => p.price < 50).slice(0,4);

        // Insertar productos en el DOM en los contenedores correspondientes
        tabContainers.moda_hombre.innerHTML = moda_hombre.map(crearCardProducto).join("");
        tabContainers.moda_mujer.innerHTML = moda_mujer.map(crearCardProducto).join("");
        tabContainers.tecnologia.innerHTML = tecnologia.map(crearCardProducto).join("");
        tabContainers.oferta.innerHTML = oferta.map(crearCardProducto).join("");
        
        // Después de cargar, agregar funcionalidad a los tabs
        tabLinks.forEach(tab => {
            tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            // Quitar active de todos y poner active al clickeado
            tabLinks.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Ocultar todos los contenedores y mostrar el seleccionado
            Object.values(tabContainers).forEach(c => c.style.display = 'none');
            if (tabContainers[target]) tabContainers[target].style.display = 'grid';
            });
        });

        // Mostrar tab por defecto
        if (tabLinks.length > 0) {
            tabLinks[0].click();
        }
        })
        .catch(err => {
        console.error("Error cargando productos:", err);
        });
});
