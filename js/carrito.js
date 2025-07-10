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
                    <p style="margin: 0; font-weight: bold;">${producto.nombre} - x${producto.cantidad}</p>
                    <p style="margin: 0;">Subtotal: $${subtotal.toFixed(2)}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 0.3rem;">
                    <button class="btn-disminuir" data-nombre="${producto.nombre}" style="padding: 0.3rem;">➖</button>
                    <button class="btn-aumentar" data-nombre="${producto.nombre}" style="padding: 0.3rem;">➕</button>
                    <button class="eliminar-producto hm-btn btn-danger" data-nombre="${producto.nombre}">Eliminar</button>
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
        // ➕
        document.querySelectorAll(".btn-aumentar").forEach(btn => {
            btn.addEventListener("click", e => {
                const nombre = e.target.getAttribute("data-nombre");
                const producto = carrito.find(p => p.nombre === nombre);
                carrito.push({ ...producto });
                localStorage.setItem("carrito", JSON.stringify(carrito));
                renderCarrito();
            });
        });

        // ➖
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

        // Eliminar todos de ese tipo
        document.querySelectorAll(".eliminar-producto").forEach(btn => {
            btn.addEventListener("click", e => {
                const nombre = e.target.getAttribute("data-nombre");
                carrito = carrito.filter(p => p.nombre !== nombre);
                localStorage.setItem("carrito", JSON.stringify(carrito));
                renderCarrito();
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
