// JS/datos.js

const RUTA_JSON = "./data/tareas.json";
const CLAVE_LS = "TareasGuardadas";

async function cargarTareasIniciales() {
    // Intentar leer tareas guardadas en LocalStorage
    let guardadas = JSON.parse(localStorage.getItem(CLAVE_LS));

    // Si ya había tareas guardadas, usamos esas
    if (Array.isArray(guardadas) && guardadas.length > 0) {
        document.dispatchEvent(new CustomEvent("tareas-cargadas", {
            detail: { tareas: guardadas, clave: CLAVE_LS }
        }));
        return;
    }

    // Si no hay en LocalStorage, cargamos desde el JSON
    try {
        const respuesta = await fetch(RUTA_JSON);

        if (!respuesta.ok) {
            throw new Error("Error HTTP: " + respuesta.status);
        }

        const tareasJson = await respuesta.json();

        // Guardar en LocalStorage para futuras visitas
        localStorage.setItem(CLAVE_LS, JSON.stringify(tareasJson));

        // Enviar las tareas al main.js
        document.dispatchEvent(new CustomEvent("tareas-cargadas", {
            detail: { tareas: tareasJson, clave: CLAVE_LS }
        }));

    } catch (error) {
        console.error("Error cargando JSON:", error);

        // En caso de error, avisamos igual al main, pero con lista vacía
        document.dispatchEvent(new CustomEvent("tareas-cargadas", {
            detail: { tareas: [], clave: CLAVE_LS }
        }));
    }
}

cargarTareasIniciales();
