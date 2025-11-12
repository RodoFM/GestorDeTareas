document.addEventListener("DOMContentLoaded", function () {
    function Tarea(id, titulo, realizada) {
        this.id = id
        this.titulo = titulo
        this.realizada = realizada || false;
    }


      //vinculacion con DOM
    const formulario = document.getElementById("formulario");
    const tituloInput = document.getElementById("titulo");
    const buscar = document.getElementById("buscar");
    const estado = document.getElementById("estado");
    const lista = document.getElementById("lista");
    const mensaje = document.getElementById("mensaje");


    const Tareas_Guardadas = "TareasGuardadas"

    let tareas = JSON.parse(localStorage.getItem(Tareas_Guardadas))
    if (!tareas) tareas = [];



    //Generar ID
    function AsignacionId() {
        let id = Number(localStorage.getItem("ultimoId")) || 0;
        id++;
        localStorage.setItem("ultimoId", id);
        return id;
    }


    //GuArdado en LocalStorage
    function guardar() {
        localStorage.setItem(Tareas_Guardadas, JSON.stringify(tareas));
    }


    let busqueda = "";
    let estadoDelFiltro = "todas";


    function mostrarMensaje(texto) {
        mensaje.textContent = texto || "";
    }



 //filtracion
    function filtrarTareas(filtro) {
        return filtro.filter(function (tarea) {
            const coincideTexto = busqueda === "" || tarea.titulo.toLowerCase().includes(busqueda);
            const coincideEstado = estadoDelFiltro === "todas" || (estadoDelFiltro === "pendientes" && !tarea.realizada) || (estadoDelFiltro === "hechas" && tarea.realizada);

            return coincideTexto && coincideEstado;
        });
    }


    //Visualizacion de tareas
    function render() {
        const ver = filtrarTareas(tareas);
        lista.innerHTML = "";

        ver.forEach(function (tarea) {
            const li = document.createElement("li");

            //Marcar si tarea esta realizada o pendiente

            const verificador = document.createElement("input");
            verificador.type = "checkbox";
            verificador.checked = tarea.realizada;
            verificador.addEventListener("change", function () {
                const encontrada = tareas.find(function (t) {
                    return t.id === tarea.id;
                });
                if (encontrada) {
                    encontrada.realizada = verificador.checked;
                    guardar();
                    render();
                }

            });


            const span = document.createElement("span");
            span.textContent = tarea.titulo;
            if (tarea.realizada) {
                span.classList.add("tarea-hecha");
            }

            //creacion de boton para eliminar una tarea
            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.addEventListener("click", function () {
                tareas = tareas.filter(function (t) {
                    return t.id !== tarea.id;
                });
                guardar();
                mostrarMensaje("Tarea Eliminada")
                render();
            });


            //Ver si ya hay una tarea realizada
            li.append(verificador, span, botonEliminar);
            lista.appendChild(li);
        });



        const yaHecha = tareas.some(function (t) {
            return t.realizada;
        });
    }


   


      //Agregaar nuevas tareas
    formulario.addEventListener("submit", function (agregar) {
        agregar.preventDefault();
        const textoTitulo = tituloInput.value.trim();
        if (!textoTitulo) {
            mostrarMensaje("Escribe una tarea primero")
            return;
        }

        const existe = tareas.find(function (t) {
            return t.titulo === textoTitulo;
        });
        if (existe) {
            mostrarMensaje("Ya existe esa tarea");
            return;
        }

        //crear y giarda nueva tarea
        const nueva = new Tarea(AsignacionId(), textoTitulo, false);
        tareas.push(nueva);
        guardar();
        formulario.reset();
        mostrarMensaje("Tarea Agregada")
        render();

    });

    //buscar por texto
    buscar.addEventListener("input", function (b) {
        busqueda = b.target.value.trim().toLowerCase();
        render();
        mostrarMensaje("");
    });

    estado.addEventListener("change", function (e) {
        estadoDelFiltro = e.target.value;
        render();
        mostrarMensaje("");
    })

    render();


})










