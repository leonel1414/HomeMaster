document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("categorias-dinamicas");

    const nombresPersonalizados = {
        "electronics": "Lo mejor en tecnología",
        "jewelery": "Accesorios",
        "men's clothing": "Moda masculina",
        "women's clothing": "Moda femenina"
    };

    fetch("https://fakestoreapi.com/products/categories")
        .then(res => res.json())
        .then(categorias => {
            categorias.forEach((categoria, index) => {
                fetch(`https://fakestoreapi.com/products/category/${categoria}`)
                    .then(res => res.json())
                    .then(productos => {
                        const primerProducto = productos[0];
                        const nombre = nombresPersonalizados[categoria] || categoria;
                        const imagen = primerProducto?.image || "/img/default.jpg";

                        const div = document.createElement("div");
                        div.classList.add("grid-item");
                        div.setAttribute("data-aos", "fade-up");
                        div.setAttribute("data-aos-duration", 1000 + (index * 500));

                        div.innerHTML = `
                            <div class="categoria-card">
                                <img src="${imagen}" alt="${nombre}" style="height: 200px; object-fit: contain;">
                                <div class="c-info">
                                    <h3>${nombre}</h3>
                                </div>
                            </div>
                        `;

                        contenedor.appendChild(div);
                    })
                    .catch(err => {
                        console.error(`Error al obtener productos de ${categoria}:`, err);
                    });
            });
        })
        .catch(err => {
            console.error("Error al cargar categorías:", err);
            contenedor.innerHTML = "<p>No se pudieron cargar las categorías.</p>";
        });
});
