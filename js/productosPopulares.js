document.addEventListener("DOMContentLoaded", () => {
    const tabLinks = document.querySelectorAll(".hm-tab-link");
    const tabContainers = {
        zapatillas: document.getElementById("zapatillas"),
        moda: document.getElementById("moda"),
        tecnologia: document.getElementById("tecnologia"),
        oferta: document.getElementById("oferta")
    };
    // Función para crear una tarjeta de producto
    function crearCardProducto(producto) {
        return `
        <div class="product-item">
            <div class="p-portada">
            <img src="${producto.image}" alt="${producto.title}">
            ${producto.price < 50 ? '<span class="stin stin-new">Nuevo</span>' : ''}
            </div>
            <div class="p-info">
            <h3>${producto.title.length > 40 ? producto.title.slice(0, 40) + "..." : producto.title}</h3>
            <div class="precio">
                <span>$ ${producto.price.toFixed(2)}</span>
            </div>
            <a href="#" class="hm-btn btn-primary uppercase" onclick='guardarProducto(${JSON.stringify({
                nombre: producto.title,
                precio: producto.price,
                imagen: producto.image
                }).replace(/"/g, "&quot;")})'>AGREGAR AL CARRITO</a>
            </div>
        </div>`;
    }

    // Cargar productos desde la API
    fetch("https://fakestoreapi.com/products")
        .then(res => res.json())
        .then(data => {
        const zapatillas = data.filter(p => p.category === "men's clothing").slice(0, 4);
        const moda = data.filter(p => p.category === "women's clothing").slice(0, 4);
        const tecnologia = data.filter(p => p.category === "electronics").slice(0, 4);
        const oferta = data.filter(p => p.price < 50).slice(0, 4);

        tabContainers.zapatillas.innerHTML = `<div class="grid-product">${zapatillas.map(crearCardProducto).join("")}</div>`;
        tabContainers.moda.innerHTML = `<div class="grid-product">${moda.map(crearCardProducto).join("")}</div>`;
        tabContainers.tecnologia.innerHTML = `<div class="grid-product">${tecnologia.map(crearCardProducto).join("")}</div>`;
        tabContainers.oferta.innerHTML = `<div class="grid-product">${oferta.map(crearCardProducto).join("")}</div>`;
        })
        .catch(err => {
        console.error("Error cargando productos:", err);
        });

    // Tabs funcionales
    tabLinks.forEach(tab => {
        tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabLinks.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        Object.values(tabContainers).forEach(c => {
            c.style.display = 'none';
            c.classList.remove('tab-active');
        });

        const selected = tabContainers[target];
        if (selected) {
            selected.style.display = 'block';
            selected.classList.add('tab-active');
        }
        });
    });
});
