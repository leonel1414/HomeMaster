const apiContainer = document.getElementById("api-productos");
const guardadosContainer = document.getElementById("productos-guardados");
const contador = document.getElementById("contador-guardados");
const borrarTodosBtn = document.getElementById("borrar-todos");

// Obtener productos de FakeStore y renderizar
fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(productos => {
        productos.forEach(producto => {
            const card = crearProductoCard(producto, true);
            apiContainer.appendChild(card);
        });
        actualizarContadorCarrito();
    });

// Crear una tarjeta de producto
function crearProductoCard(producto, conBotonAgregar = false) {
    const div = document.createElement("div");
    div.classList.add("producto-card");
    div.innerHTML = `
    <img src="${producto.image}" alt="${producto.title}">
    <h2>${producto.title}</h2>
    <p>${producto.description.slice(0, 80)}...</p>
    <span class="precio">$${producto.price}</span>
    ${conBotonAgregar ? '<button class="hm-btn btn-primary">Agregar al carrito</button>' : ""}
    `;

    if (conBotonAgregar) {
        const btn = div.querySelector("button");
        btn.addEventListener("click", () => guardarProducto(producto));
    }

    return div;
}

function guardarProducto(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const index = carrito.findIndex(p => p.nombre === producto.title);
    if (index >= 0) {
        carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
    } else {
        carrito.push({
            nombre: producto.title,
            precio: producto.price,
            imagen: producto.image,
            cantidad: 1
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);
    const contadorSpan = document.querySelector(".hm-icon-cart span");
    if (contadorSpan) {
        contadorSpan.textContent = total;
    }
}
