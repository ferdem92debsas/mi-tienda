// ==========================================
// CARRITO DE COMPRAS
// ==========================================

// Array donde guardaremos los productos seleccionados
let carrito = [];


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const panelCarrito = document.getElementById("panel-carrito");
const itemsCarrito = document.getElementById("items-carrito");
const totalCarrito = document.getElementById("total-carrito");
const contadorCarrito = document.getElementById("contador-carrito");

const overlay = document.getElementById("overlay");
const cerrarCarrito = document.getElementById("cerrar-carrito");


// ==========================================
// AGREGAR PRODUCTO
// ==========================================

function agregarAlCarrito(idProducto) {

    // Buscamos el producto dentro del array productos
    const producto = productos.find(
        producto => producto.id === idProducto
    );

    // Si no encontramos el producto, salimos
    if (!producto) {
        console.error("Producto no encontrado:", idProducto);
        return;
    }


    // Buscamos si el producto ya está en el carrito
    const productoEnCarrito = carrito.find(
        producto => producto.id === idProducto
    );


    // Si ya existe...
    if (productoEnCarrito) {

        productoEnCarrito.cantidad++;

    } else {

        // Si no existe, lo agregamos
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            categoria: producto.categoria,
            subcategoria: producto.subcategoria,
            cantidad: 1
        });
    }


    // Actualizamos la interfaz
    actualizarCarrito();

    // Abrimos el carrito
    abrirCarrito();
}


// ==========================================
// MOSTRAR CARRITO
// ==========================================

function actualizarCarrito() {

    // Limpiamos el contenido anterior
    itemsCarrito.innerHTML = "";


    // Si el carrito está vacío
    if (carrito.length === 0) {

        itemsCarrito.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío.
            </p>
        `;

        totalCarrito.textContent = "$0";
        actualizarContador();

        return;
    }


    // Recorremos los productos del carrito
    carrito.forEach(producto => {

        const subtotal =
            producto.precio * producto.cantidad;


        const item = document.createElement("div");

        item.classList.add("carrito-item");


        item.innerHTML = `
            <div class="carrito-item-info">

                <strong>
                    ${producto.nombre}
                </strong>

                <span>
                    Cantidad: ${producto.cantidad}
                </span>

                <span>
                    ${formatearPrecioCarrito(subtotal)}
                </span>

            </div>

            <button
                class="btn-eliminar"
                data-id="${producto.id}"
                type="button"
            >
                🗑️
            </button>
        `;


        itemsCarrito.appendChild(item);
    });


    // Calculamos el total
    const total = carrito.reduce(
        (acumulador, producto) => {
            return acumulador +
                producto.precio * producto.cantidad;
        },
        0
    );


    totalCarrito.textContent =
        formatearPrecioCarrito(total);


    actualizarContador();
}


// ==========================================
// ELIMINAR PRODUCTO
// ==========================================

function eliminarDelCarrito(idProducto) {

    carrito = carrito.filter(
        producto => producto.id !== idProducto
    );

    actualizarCarrito();
}


// ==========================================
// CONTADOR DEL CARRITO
// ==========================================

function actualizarContador() {

    const cantidadTotal = carrito.reduce(
        (total, producto) => {
            return total + producto.cantidad;
        },
        0
    );


    contadorCarrito.textContent =
        cantidadTotal;
}


// ==========================================
// ABRIR CARRITO
// ==========================================

function abrirCarrito() {

    panelCarrito.classList.add("activo");
    overlay.classList.add("activo");
}


// ==========================================
// CERRAR CARRITO
// ==========================================

function cerrarPanelCarrito() {

    panelCarrito.classList.remove("activo");
    overlay.classList.remove("activo");
}


cerrarCarrito.addEventListener(
    "click",
    cerrarPanelCarrito
);


overlay.addEventListener(
    "click",
    cerrarPanelCarrito
);


// ==========================================
// BOTONES "AGREGAR AL CARRITO"
// ==========================================

document.addEventListener("click", evento => {

    const boton =
        evento.target.closest(".boton-producto");


    if (!boton) {
        return;
    }


    const idProducto =
        boton.dataset.id;


    agregarAlCarrito(idProducto);
});


// ==========================================
// BOTONES "ELIMINAR"
// ==========================================

document.addEventListener("click", evento => {

    const boton =
        evento.target.closest(".btn-eliminar");


    if (!boton) {
        return;
    }


    const idProducto =
        boton.dataset.id;


    eliminarDelCarrito(idProducto);
});


// ==========================================
// FORMATEAR PRECIOS
// ==========================================

function formatearPrecioCarrito(precio) {

    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0
    }).format(precio);
}


// ==========================================
// INICIALIZAR
// ==========================================

actualizarCarrito();

