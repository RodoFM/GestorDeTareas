let tareas = [];
let CLAVE_LS_TAREAS = "";

// CArgar las tareas que vienen desde datos.js
document.addEventListener("tareas-cargadas", function (e) {
    // Nos aseguramos de que cada elemento sea un objeto Tarea
    tareas = e.detail.tareas;
    CLAVE_LS_TAREAS = e.detail.clave;
    render();
});

// CNOstructor de Tareas
function Tarea(id, titulo, realizada) {
    this.id = id;
    this.titulo = titulo;
    this.realizada = realizada || false;
}

// referencas al DOM
const formulario = document.getElementById("formulario");
const tituloInput = document.getElementById("titulo");
const buscar = document.getElementById("buscar");
const estado = document.getElementById("estado");
const lista = document.getElementById("lista");
const mensaje = document.getElementById("mensaje");

// Guardar en LocalStorage
function guardar() {
    if (!CLAVE_LS_TAREAS) return; // por seguridad
    localStorage.setItem(CLAVE_LS_TAREAS, JSON.stringify(tareas));
}

// Generar ID
function AsignacionId() {
    let id = Number(localStorage.getItem("ultimoId")) || 1000;
    id++;
    localStorage.setItem("ultimoId", id);
    return id;
}

// VAriables de filtro
let busqueda = "";
let estadoDelFiltro = "todas";

function mostrarMensaje(texto) {
    mensaje.textContent = texto || "";
}

// Filtración
function filtrarTareas(filtro) {
    return filtro.filter(function (tarea) {
        const tituloMinuscula = tarea.titulo.toLowerCase();
        const coincideTexto =
            busqueda === "" ||
            tituloMinuscula.includes(busqueda);

        const coincideEstado =
            estadoDelFiltro === "todas" ||
            (estadoDelFiltro === "pendientes" && !tarea.realizada) ||
            (estadoDelFiltro === "hechas" && tarea.realizada);

        return coincideTexto && coincideEstado;
    });
}

// Renderizar lista
function render() {
    const ver = filtrarTareas(tareas);
    lista.innerHTML = "";

    ver.forEach(function (tarea) {
        const li = document.createElement("li");

        // Checkbox
        const verificador = document.createElement("input");
        verificador.type = "checkbox";
        verificador.checked = tarea.realizada;

        verificador.addEventListener("change", function () {
            const encontrada = tareas.find(t => t.id === tarea.id);
            if (encontrada) {
                encontrada.realizada = verificador.checked;
                guardar();
                render();
            }
        });

        // Texto
        const contenedorSpan = document.createElement("contenedorSpan");
        contenedorSpan.textContent = tarea.titulo;
        if (tarea.realizada) contenedorSpan.classList.add("tarea-hecha");

        // Botón eliminar
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", function () {

            Swal.fire({
                title: "¿Eliminar tarea?",
                text: `La tarea "${tarea.titulo}" será eliminada.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6"
            }).then((resultado) => {

                if (resultado.isConfirmed) {
                    // Eliminar la tarea
                    tareas = tareas.filter(t => t.id !== tarea.id);
                    guardar();
                    render();

                    Swal.fire({
                        title: "Eliminada",
                        text: "La tarea fue eliminada con éxito.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                }

            });

        });

        li.append(verificador, contenedorSpan, botonEliminar);
        lista.appendChild(li);
    });
}

// Agregar nuevas tareas
formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    const texto = tituloInput.value.trim();

    if (!texto) {
        mostrarMensaje("Escribe una tarea primero");
        return;
    }

    if (tareas.find(t => t.titulo === texto)) {
        mostrarMensaje("Ya existe esa tarea");
        return;
    }

    const nueva = new Tarea(AsignacionId(), texto, false);
    tareas.push(nueva);

    guardar();
    formulario.reset();
    mostrarMensaje("Tarea Agregada");
    render();
});

// Buscar texto
buscar.addEventListener("input", function (e) {
    busqueda = e.target.value.trim().toLowerCase();
    render();
    mostrarMensaje("");
});

// CAmbiar filtro de estado
estado.addEventListener("change", function (e) {
    estadoDelFiltro = e.target.value;
    render();
    mostrarMensaje("");
});
