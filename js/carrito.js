document.addEventListener("DOMContentLoaded", () => {
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const btnVaciar = document.getElementById("vaciar-carrito");

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    function agruparProductos(carrito) {
        const agrupado = {};
        carrito.forEach(producto => {
            const key = producto.nombre;
            if (!agrupado[key]) {
                agrupado[key] = { ...producto, cantidad: 1 };
            } else {
                agrupado[key].cantidad++;
            }
        });
        return Object.values(agrupado);
    }

    function renderCarrito() {
        listaCarrito.innerHTML = "";
        const productos = agruparProductos(carrito);
        let total = 0;

        if (productos.length === 0) {
            listaCarrito.innerHTML = "<li>El carrito está vacío.</li>";
            totalCarrito.textContent = "";
            btnVaciar.style.display = "none";
            return;
        }

        productos.forEach(producto => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;

            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.alignItems = "center";
            li.style.marginBottom = "1rem";
            li.style.gap = "1rem";

            li.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 60px; border-radius: 8px;">
                <div style="flex-grow: 1;">
                    <p style="margin: 0; font-weight: bold;">
                        ${producto.nombre}
                        <span style="color: red; font-size: 0.9rem; margin-left: 0.5rem;">x${producto.cantidad}</span>
                    </p>
                    <p style="margin: 0;">Precio unitario: $${producto.precio.toFixed(2)}</p>
                    <p style="margin: 0;">Subtotal: $${subtotal.toFixed(2)}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 0.3rem;">
                    <button class="btn-disminuir" data-nombre="${producto.nombre}" style="padding: 0.3rem;">➖</button>
                    <button class="btn-aumentar" data-nombre="${producto.nombre}" style="padding: 0.3rem;">➕</button>
                </div>
            `;
            listaCarrito.appendChild(li);
        });

        totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
        btnVaciar.style.display = "inline-block";

        // Eventos dinámicos
        agregarEventosBotones();
    }

    function agregarEventosBotones() {
        // +
        document.querySelectorAll(".btn-aumentar").forEach(btn => {
            btn.addEventListener("click", e => {
                const nombre = e.target.getAttribute("data-nombre");
                const producto = carrito.find(p => p.nombre === nombre);
                carrito.push({ ...producto });
                localStorage.setItem("carrito", JSON.stringify(carrito));
                renderCarrito();
            });
        });

        // -
        document.querySelectorAll(".btn-disminuir").forEach(btn => {
            btn.addEventListener("click", e => {
                const nombre = e.target.getAttribute("data-nombre");
                const index = carrito.findIndex(p => p.nombre === nombre);
                if (index !== -1) {
                    carrito.splice(index, 1);
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    renderCarrito();
                }
            });
        });
    }

    // Vaciar carrito completo
    btnVaciar.addEventListener("click", () => {
        localStorage.removeItem("carrito");
        location.reload();
    });

    // Render inicial
    renderCarrito();
});

const btnComprar = document.getElementById("comprar-carrito");

btnComprar.addEventListener("click", () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito vacío',
            text: 'Agregá productos antes de realizar una compra.',
            confirmButtonText: 'OK'
        });
        return;
    }

    const total = carrito.reduce((sum, p) => sum + p.precio, 0);

    Swal.fire({
        icon: 'success',
        title: '¡Compra exitosa!',
        html: `<p>Tu compra fue realizada con éxito.</p><p><strong>Total: $${total.toFixed(2)}</strong></p>`,
        confirmButtonText: 'Aceptar'
    }).then(() => {
        localStorage.removeItem("carrito");
        location.reload();
    });
});