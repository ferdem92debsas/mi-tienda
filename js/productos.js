/* =========================================================
   PRODUCTOS.JS
   Sistema de lectura y visualización del catálogo
   ========================================================= */


/* =========================================================
   1. VARIABLES GLOBALES
   ========================================================= */

/*
    Aquí almacenaremos todos los productos
    que vienen desde productos.csv.
*/

let productos = [];


/*
    Ruta de nuestro archivo CSV.
*/

const RUTA_CSV = "data/productos.csv";


/*
    Contenedor HTML donde aparecerán
    las tarjetas de productos.
*/

const contenedorProductos =
    document.getElementById(
        "contenedor-productos"
    );


/*
    Elemento que mostraremos cuando
    una búsqueda no encuentre resultados.
*/

const mensajeSinResultados =
    document.getElementById(
        "sin-resultados"
    );


/* =========================================================
   2. CARGAR CSV
   ========================================================= */

/*
    fetch() solicita el archivo CSV.

    Como estamos trabajando con archivos locales,
    algunos navegadores pueden bloquear fetch()
    si abrimos index.html directamente.

    Por eso más adelante vamos a utilizar
    un servidor local.
*/

async function cargarProductos() {

    try {

        const respuesta =
            await fetch(RUTA_CSV);


        /*
            Verificamos que el archivo
            haya respondido correctamente.
        */

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar productos.csv"
            );

        }


        /*
            Convertimos la respuesta
            en texto.
        */

        const textoCSV =
            await respuesta.text();


        /*
            Procesamos el CSV.
        */

        productos =
            convertirCSV(textoCSV);


        /*
            Mostramos los productos.
        */

        mostrarProductos(productos);


        console.log(
            "Productos cargados:",
            productos
        );


    } catch (error) {

        console.error(
            "Error al cargar productos:",
            error
        );

    }

}


// ==========================================
// BUSCADOR Y FILTROS
// ==========================================

// Elementos del HTML
const buscador = document.getElementById("buscador-productos");
const filtroCategoria = document.getElementById("filtro-categoria");
const botonesCategoria = document.querySelectorAll("[data-categoria]");

// ------------------------------------------
// Función principal de filtrado
// ------------------------------------------

function filtrarProductos() {

    const textoBuscado = buscador.value
        .toLowerCase()
        .trim();

    const categoriaSeleccionada = filtroCategoria.value;

    const productosFiltrados = productos.filter(producto => {

        // Buscar texto
        const coincideTexto =
            producto.nombre.toLowerCase().includes(textoBuscado) ||
            producto.descripcion.toLowerCase().includes(textoBuscado) ||
            producto.subcategoria.toLowerCase().includes(textoBuscado);

        // Filtrar categoría
        const coincideCategoria =
            categoriaSeleccionada === "todos" ||
            producto.categoria === categoriaSeleccionada;

        // El producto debe cumplir ambas condiciones
        return coincideTexto && coincideCategoria;
    });

    mostrarProductos(productosFiltrados);
}


// ------------------------------------------
// Evento del buscador
// ------------------------------------------

buscador.addEventListener("input", filtrarProductos);


// ------------------------------------------
// Evento del selector de categorías
// ------------------------------------------

filtroCategoria.addEventListener("change", filtrarProductos);


// ------------------------------------------
// Botones de las tarjetas de categorías
// ------------------------------------------

botonesCategoria.forEach(boton => {

    boton.addEventListener("click", () => {

        const categoria = boton.dataset.categoria;

        // Cambiar el selector
        filtroCategoria.value = categoria;

        // Limpiar el buscador
        buscador.value = "";

        // Aplicar filtro
        filtrarProductos();

        // Llevar al usuario al catálogo
        document
            .getElementById("catalogo")
            .scrollIntoView({
                behavior: "smooth"
            });
    });
});



/* =========================================================
   3. CONVERTIR CSV
   ========================================================= */

function convertirCSV(textoCSV) {


    /*
        Eliminamos espacios innecesarios
        al principio y al final.
    */

    const textoLimpio =
        textoCSV.trim();


    /*
        Separamos el CSV por líneas.

        Cada línea representa
        un producto.
    */

    const filas =
        textoLimpio.split("\n");


    /*
        La primera fila contiene
        los nombres de las columnas.
    */

    const encabezados =
        filas[0]
            .split(",")
            .map(
                encabezado =>
                    encabezado.trim()
            );


    /*
        Aquí guardaremos
        nuestros productos.
    */

    const resultado = [];


    /*
        Recorremos todas las filas,
        comenzando desde la segunda.

        La posición 0 es el encabezado.
    */

    for (
        let i = 1;
        i < filas.length;
        i++
    ) {


        /*
            Ignoramos líneas vacías.
        */

        if (
            filas[i].trim() === ""
        ) {

            continue;

        }


        /*
            Separamos las columnas.
        */

        const valores =
            filas[i]
                .split(",")
                .map(
                    valor =>
                        valor.trim()
                );


        /*
            Creamos un objeto producto.
        */

        const producto = {};


        /*
            Asociamos cada encabezado
            con su correspondiente valor.
        */

        encabezados.forEach(
            (encabezado, indice) => {

                producto[encabezado] =
                    valores[indice] ?? "";

            }
        );


        /*
            Convertimos precio
            de texto a número.
        */

        producto.precio =
            Number(producto.precio);


        /*
            Guardamos el producto.
        */

        resultado.push(producto);

    }


    return resultado;

}


/* =========================================================
   4. MOSTRAR PRODUCTOS
   ========================================================= */

function mostrarProductos(listaProductos) {


    /*
        Limpiamos el contenedor
        antes de volver a dibujar.
    */

    contenedorProductos.innerHTML = "";


    /*
        Si no existen productos,
        mostramos el mensaje.
    */

    if (
        listaProductos.length === 0
    ) {

        mensajeSinResultados
            .classList
            .remove("oculto");

        return;

    }


    /*
        Tenemos productos,
        por lo tanto ocultamos
        el mensaje.
    */

    mensajeSinResultados
        .classList
        .add("oculto");


    /*
        Recorremos la lista.
    */

    listaProductos.forEach(
        producto => {

            /*
                Creamos una tarjeta.
            */

            const tarjeta =
                crearTarjetaProducto(
                    producto
                );


            /*
                La agregamos
                al HTML.
            */

            contenedorProductos
                .appendChild(tarjeta);

        }
    );

}


/* =========================================================
   5. CREAR TARJETA
   ========================================================= */

function crearTarjetaProducto(
    producto
) {


    /*
        Creamos el elemento principal.
    */

    const tarjeta =
        document.createElement("article");


    tarjeta.classList.add(
        "producto-card"
    );


    /*
        Construimos la ruta
        de la imagen.

        Ejemplo:

        img/electronica/accesorios/
        mouse-inalambrico.jpg
    */

    const rutaImagen =

        `img/${producto.categoria.toLowerCase()}/` +
        `${producto.subcategoria.toLowerCase()}/` +
        `${producto.imagen}`;


    /*
        Convertimos el estado
        en un texto amigable.
    */

    const estadoTexto =
        obtenerTextoEstado(
            producto.estado
        );


    /*
        Elegimos una clase CSS
        dependiendo del estado.
    */

    const claseEstado =
        obtenerClaseEstado(
            producto.estado
        );


    /*
        Formateamos el precio.
    */

    const precioFormateado =
        formatearPrecio(
            producto.precio
        );


    /*
        Construimos el HTML.
    */

    tarjeta.innerHTML = `

        <img
            class="producto-imagen"
            src="${rutaImagen}"
            alt="${producto.nombre}"
            loading="lazy"
        >

        <div class="producto-contenido">

            <span class="producto-categoria">
                ${producto.subcategoria}
            </span>

            <h3 class="producto-nombre">
                ${producto.nombre}
            </h3>

            <p class="producto-descripcion">
                ${producto.descripcion}
            </p>

            <div class="producto-precio">
                ${precioFormateado}
            </div>

            <span
                class="producto-estado ${claseEstado}"
            >
                ${estadoTexto}
            </span>

            <button
                class="boton-producto"
                data-id="${producto.id}"
                type="button"
            >
                🛒 Agregar al carrito
            </button>

        </div>

    `;


    return tarjeta;

}


/* =========================================================
   6. TEXTO DEL ESTADO
   ========================================================= */

function obtenerTextoEstado(
    estado
) {

    switch (estado) {

        case "disponible":

            return "🟢 Disponible";


        case "por_encargo":

            return "🟡 Por encargo";


        case "agotado":

            return "🔴 Agotado";


        case "pausado":

            return "⚪ No disponible";


        default:

            return "Consultar";

    }

}


/* =========================================================
   7. CLASE CSS DEL ESTADO
   ========================================================= */

function obtenerClaseEstado(
    estado
) {

    switch (estado) {

        case "disponible":

            return "estado-disponible";


        case "por_encargo":

            return "estado-encargo";


        case "agotado":

            return "estado-agotado";


        default:

            return "";

    }

}


/* =========================================================
   8. FORMATEAR PRECIO
   ========================================================= */

function formatearPrecio(
    precio
) {

    return new Intl.NumberFormat(
        "es-AR",
        {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0
        }
    ).format(precio);

}


/* =========================================================
   9. INICIAR SISTEMA
   ========================================================= */

cargarProductos();


/* =========================================================
   FIN DEL ARCHIVO
   ========================================================= */

