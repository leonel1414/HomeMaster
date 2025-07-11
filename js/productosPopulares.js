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
        const div = document.createElement("div");
        div.classList.add("product-item");
        div.innerHTML = `
            <div class="p-portada">
                <img src="${producto.image}" alt="${producto.title}">
                ${producto.price < 50 ? '<span class="stin stin-new">Nuevo</span>' : ''}
            </div>
            <div class="p-info">
                <h3>${producto.title.length > 40 ? producto.title.slice(0, 40) + "..." : producto.title}</h3>
                <div class="precio">
                    <span>$ ${producto.price.toFixed(2)}</span>
                </div>
                <a href="#" class="hm-btn btn-primary uppercase btn-agregar">AGREGAR AL CARRITO</a>
            </div>
        `;

        // Evento para botón agregar
        div.querySelector(".btn-agregar").addEventListener("click", (e) => {
            e.preventDefault();
            guardarProducto({
                nombre: producto.title,
                precio: producto.price,
                imagen: producto.image
            });
        });

        return div;
    }

    // Guardar producto en localStorage
    window.guardarProducto = function(producto) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        const index = carrito.findIndex(p => p.nombre === producto.nombre);
        if (index >= 0) {
            carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
        } else {
            producto.cantidad = 1;
            carrito.push(producto);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContadorCarrito();
    };

    // Actualizar número en ícono del carrito
    function actualizarContadorCarrito() {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const total = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);
        const span = document.querySelector(".hm-cart span");
        if (span) span.textContent = total;
    }

    // Cargar productos desde la API
    fetch("https://fakestoreapi.com/products")
        .then(res => res.json())
        .then(data => {
            const zapatillas = data.filter(p => p.category === "men's clothing").slice(0, 4);
            const moda = data.filter(p => p.category === "women's clothing").slice(0, 4);
            const tecnologia = data.filter(p => p.category === "electronics").slice(0, 4);
            const oferta = data.filter(p => p.price < 50).slice(0, 4);

            tabContainers.zapatillas.innerHTML = '<div class="grid-product"></div>';
            zapatillas.forEach(p => tabContainers.zapatillas.querySelector('.grid-product').appendChild(crearCardProducto(p)));

            tabContainers.moda.innerHTML = '<div class="grid-product"></div>';
            moda.forEach(p => tabContainers.moda.querySelector('.grid-product').appendChild(crearCardProducto(p)));

            tabContainers.tecnologia.innerHTML = '<div class="grid-product"></div>';
            tecnologia.forEach(p => tabContainers.tecnologia.querySelector('.grid-product').appendChild(crearCardProducto(p)));

            tabContainers.oferta.innerHTML = '<div class="grid-product"></div>';
            oferta.forEach(p => tabContainers.oferta.querySelector('.grid-product').appendChild(crearCardProducto(p)));

            // Mostrar por defecto el primer tab
            if (tabLinks.length > 0) tabLinks[0].click();

            // Contador inicial
            actualizarContadorCarrito();
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

    // Actualizar contador en caso de que el header ya esté cargado
    actualizarContadorCarrito();
});
