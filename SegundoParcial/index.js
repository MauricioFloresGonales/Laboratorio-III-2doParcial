//--------------------------------------------------------------------CONSTATES---------------------------------------------------------------------
const columnas = [
    {"title": "ID", "name": "entidadId", "value": "id", "entidad": "Vehiculo"},
    {"title": "Modelo", "name": "entidadModelo", "value": "modelo", "entidad": "Vehiculo"},
    {"title": "AnoFab", "name": "entidadAnoFab", "value": "anoFab", "entidad": "Vehiculo"},
    {"title": "VelMax", "name": "entidadVelMax", "value": "velMax", "entidad": "Vehiculo"},
    {"title": "Cantidad Puertas", "name": "entidadCantPue", "value": "cantPue", "entidad": "aereo"},
    {"title": "Cantidad Ruedas", "name": "entidadCantRue", "value": "cantRue", "entidad": "aereo"},
    {"title": "Altura Maxima", "name": "entidadAltMax", "value": "altMax", "entidad": "terrestre"},
    {"title": "Autonomia", "name": "EntidadAutonomia", "value": "autonomia", "entidad": "terrestre"},
    {"title": "Modificar", "name": "entidadModificar", "value": "modificar", "entidad": "Vehiculo"},
    {"title": "Eliminar", "name": "entidadEliminar", "value": "eliminar", "entidad": "Vehiculo"},
];
//--------------------------------------------------------------------ENTIDADES---------------------------------------------------------------------
class Vehiculo {
    constructor(id, modelo, anoFab, velMax) {
        this.id = id != null ? id : 1;
        this.modelo = modelo != null ? modelo : "MODELO";
        this.anoFab = anoFab != null ? anoFab : "ANOFAB";
        this.velMax = velMax != null ? velMax : 1;
    }
}

class Aereo extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, cantPue, cantRue) {
        super(id, modelo, anoFab, velMax);
        this.cantPue = cantPue > 0 ? cantPue : 1;
        this.cantRue = cantRue > 0 ? cantRue : 1;
      }
}

class Terrestre extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, altMax, autonomia) {
        super(id, modelo, anoFab, velMax,);
        this.altMax = altMax > 0 ? altMax : 1;
        this.autonomia = autonomia > 0 ? autonomia : 1;
      }
}

//--------------------------------------------------------------------COMPONENTES---------------------------------------------------------------------

const boton = (abmComponent, text, funcion) => {
    let button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", funcion);
    button.style = "justify-content: center; align-items: center; height: 40px;"
    abmComponent.appendChild(button);
}

const crearTabla = (arrayDeColumnas, datos) => {
    if (arrayDeColumnas != null &&  datos != null) {
        let dynamicTable = document.getElementById('dynamicTable');
        while (dynamicTable.firstChild) {
            dynamicTable.removeChild(dynamicTable.firstChild);
        }
        
        dynamicTable.style = "width:100%";

        //<--Filas Titulos-->
        let fila = document.createElement("tr");
        arrayDeColumnas.map(dato => {
            let columna = document.createElement("th");
            let textoColumna = document.createTextNode(dato.title);
            columna.appendChild(textoColumna);
            columna.setAttribute("entidad", dato.entidad);
            columna.setAttribute("name", dato.name);
            columna.setAttribute("value", dato.value);
            columna.setAttribute("visible", true);
            fila.appendChild(columna);
            dynamicTable.appendChild(fila);
        });
        //<--Filas Entidades-->
        
        let idTarget = undefined;
        datos.map(dato => {
            let filaDato = document.createElement("tr");
            idTarget = dato.id;
            if (dato instanceof Aereo) {
                TablaCrearFila(filaDato, datos, dato, arrayDeColumnas, "aereo", idTarget);
            } else {
                TablaCrearFila(filaDato, datos, dato, arrayDeColumnas, "terrestre", idTarget);
            }
            dynamicTable.appendChild(filaDato);
        })

        //<--Boton-->
        let filaBoton = document.createElement("tr");
        boton(filaBoton, "Agregar Elemento", () => ocultarTabla(arrayDeColumnas, datos, idTarget));
        dynamicTable.appendChild(filaBoton);

    }
}

const TablaCrearFila = (componeteFila, datos, dato, columnas, identificador, idTarget) => {
    componeteFila.setAttribute("id", dato.id);
    columnas.map(columna => TablaCrearColumna(componeteFila, datos, dato, columnas, identificador, idTarget, columna));
    
    
}

const TablaCrearColumna = (componeteFila, datos, dato, columnas, identificador, idTarget, columna) => {
    let columnaDato = document.createElement("td");
    let text = "N/A";
    if (dato[columna.value]) {
        text = dato[columna.value]
    }
    if (columna.value == "modificar") {
        boton(columnaDato, columna.title, () => LlenarConDatosABM(datos, idTarget, identificador, "Modificar"));
    } else if (columna.value == "eliminar") {
        boton(columnaDato, columna.title, () => LlenarConDatosABM(datos, idTarget, identificador, "Eliminar"));
    } else {
        let textoColumna = document.createTextNode(text);
        columnaDato.appendChild(textoColumna);
        columnaDato.setAttribute("entidad", identificador);
        columnaDato.setAttribute("name", columna.name);
        columnaDato.setAttribute("visible", true);
    }
    
    componeteFila.appendChild(columnaDato);
}

const tablaABM = (arrayDeColumnas, arrayEntidades, idEntidad, entidadDefinida = null, funcionalidad="Alta") => {
    if (arrayDeColumnas != null) {
        // Tomo el componente
        let abmComponent = document.getElementById('abmComponent');

        // Lo hago visible
        abmComponent.style = "display: visible";

        // remuevo todo lo del componente creado
        while (abmComponent.firstChild) {
            abmComponent.removeChild(abmComponent.firstChild);
        }

        // Creo el titulo del componente
        let title = document.createElement('h3');
        title.innerHTML = 'Formulario ABM';
        abmComponent.appendChild(title);
        
        // Creo campos especificos de la entidad principal
        let mostrarABMPersona = [ "modelo", "anoFab", "velMax"];
        abmVehiculo(arrayDeColumnas, abmComponent, mostrarABMPersona);
        
        // Creo Select del tipo de entidad que voy a crear
        let labelSelect = document.createElement('label');
        labelSelect.for = "tipo";
        labelSelect.innerHTML = 'Tipo: ';

        let select = document.createElement('select');
        select.id = "selectAbmTipo";
        let opcionSeleccione = document.createElement('option');
        let optionTerrestre = document.createElement('option');
        let opcionAereo = document.createElement('option');
        opcionSeleccione.value = ' '
        opcionSeleccione.textContent = 'Seleccione...';
        opcionAereo.value = 'aereo'
        opcionAereo.textContent = 'Aereo';
        optionTerrestre.value = 'terrestre'
        optionTerrestre.textContent = 'Terrestre';

        select.appendChild(opcionSeleccione);
        select.appendChild(opcionAereo);
        select.appendChild(optionTerrestre);
        
        // Creo campos ESPECIALES de la entidad hija
        let saltoDeLinea = document.createElement('br');
        let divABM = document.createElement('div');
        divABM.id = "divAbmDinamico";

        // Evento para que sea dinamico

        select.onchange = () => abmDinamico(arrayDeColumnas, divAbmComponent, selectTipo);

        // se agregan al componente padre
        abmComponent.appendChild(labelSelect);
        abmComponent.appendChild(select);
        abmComponent.appendChild(saltoDeLinea);
        abmComponent.appendChild(divABM);
        
        //Set SelectTipo si se ingresó el ID
        let divAbmComponent = document.getElementById('divAbmDinamico');
        let selectTipo = document.getElementById('selectAbmTipo');
        if (entidadDefinida != null) {
            selectTipo.value = entidadDefinida;
            selectTipo.setAttribute("textContent", entidadDefinida);
            abmDinamico(arrayDeColumnas, divAbmComponent, selectTipo);

            let user = BuscarUserPorId(arrayEntidades, idEntidad);
            //SOLO VER EN PATALLA LOS DATOS

        }
        // Creo botones
        if (funcionalidad == "Alta") {
            boton(abmComponent, "Alta", () => AltaEntidad(arrayEntidades));
        }
        if (funcionalidad == "Modificar") {
            boton(abmComponent, "Modificar", () => ModificarEntidad(arrayEntidades, idEntidad, entidadDefinida, (lista) => ManejarABMComponente(lista)));
        }
        if (funcionalidad == "Eliminar") {
            boton(abmComponent, "Eliminar", () => ModificarEntidad(
                arrayEntidades, 
                idEntidad, 
                entidadDefinida, 
                DeleteEntidad(arrayEntidades, idEntidad, (lista, id) => EliminarEntidad(lista, id))));
        }
        boton(abmComponent, "Cancelar", () => Cancelar(arrayEntidades));
    }
}
const abmVehiculo = (arrayDeChecks, abmComponent, mostrarSolo) => {
    if (arrayDeChecks != null) {
        let mostrar = arrayDeChecks.filter( item => mostrarSolo.includes(item.value));
        mostrar.map(prop => {
                let label = document.createElement('label');
                label.for = prop.name;
                label.innerHTML = `${prop.title}: `;
                
                let inputText = document.createElement('input');
                inputText.setAttribute("id", prop.value);
                inputText.setAttribute("type", 'text');
                inputText.setAttribute("name", prop.name);

                let saltoDeLinea = document.createElement('br');
                abmComponent.appendChild(label);
                abmComponent.appendChild(inputText);
                abmComponent.appendChild(saltoDeLinea);
            }
        );
    }
}

const abmDinamico = (arrayDeColumnas, componenteDinamico, opcionesSelect) => {
    let mostrarABMEspeciales;

    while (componenteDinamico.firstChild) {
        componenteDinamico.removeChild(componenteDinamico.firstChild);
    }

    mostrarABMEspeciales = OpcionesEspeciales(opcionesSelect.value);

    abmPropsEspeciales(arrayDeColumnas, componenteDinamico, mostrarABMEspeciales);
};

const abmPropsEspeciales = (arrayDeChecks, abmComponent, mostrarSolo) => {
    if (arrayDeChecks != null) {
        let mostrar = arrayDeChecks.filter( item => mostrarSolo.includes(item.value));
        mostrar.map(prop => {
                let label = document.createElement('label');
                label.for = prop.name;
                label.innerHTML = `${prop.title}: *`;
                
                let inputText = document.createElement('input');
                
                inputText.setAttribute("id", prop.value);
                inputText.setAttribute("type", 'text');
                inputText.setAttribute("name", prop.name);

                let saltoDeLinea = document.createElement('br');

                abmComponent.appendChild(label);
                abmComponent.appendChild(inputText);
                abmComponent.appendChild(saltoDeLinea);
            }
        );
    }
}
const ocultarTabla = (filters, datos, idTarget) => {
    let dynamicTable = document.getElementById('dynamicTable');
    dynamicTable.style = "display: none";
    tablaABM(filters, datos, idTarget);
}
const ocultarTablaParaEditar = (filters, datos, idTarget, identificador, funcionalidad) => {
    let dynamicTable = document.getElementById('dynamicTable');
    dynamicTable.style = "display: none";
    tablaABM(filters, datos, idTarget, identificador, funcionalidad);
}
const ocultarABM = () => {
    let abmComponent = document.getElementById('abmComponent');
    abmComponent.style = "display: none";
}

const ManejarABMComponente = (datos) => {
    crearTabla(columnas, datos);
    ocultarABM()
} 
const AltaEntidad = (arrayEntidades) => {
    //let id = idDinamico(arrayEntidades);
    let modelo;
    let anoFab;
    let velMax;
    let cantPue;
    let cantRue;
    let altMax;
    let autonomia;

    let componentesImput = document.getElementsByTagName("input");
    for (let index = 0; index < componentesImput.length; index++) {
        let input = componentesImput[index];
        switch (input.getAttribute('id')) {
            case "modelo":
                modelo = input.value;
                break;
            case "anoFab":
                anoFab = input.value;
                break;
            case "velMax":
                velMax = input.value;
                break;
            case "cantPue":
                cantPue = input.value;
                break;
            case "cantRue":
                cantRue = input.value;
                break;
            case "altMax":
                altMax = input.value;
                break;
            case "autonomia":
                autonomia = input.value;
                break;
            default:
                console.log("HAY UN ERRO EN EL SWITCH = id: ", input.getAttribute('id'));
                break;
        }
    }

    let tipo = document.getElementById("selectAbmTipo");

    if (tipo.value == "aereo") {
        let entidad = {modelo, anoFab, velMax, cantPue, cantRue};
        PUTEntidad(entidad, arrayEntidades, (ingresarEn, resp) => {
            let entidadCreada = new Aereo(resp, modelo, anoFab, velMax, cantPue, cantRue);
            ingresarEn.push(entidadCreada);
        }, (lista) => ManejarABMComponente(lista));
    } else {
        let entidad = {modelo, anoFab, velMax, altMax, autonomia}
        PUTEntidad(entidad, arrayEntidades, (ingresarEn, resp) => {
            let entidadCreada = new Terrestre(resp, modelo, anoFab, velMax, altMax, autonomia)
            ingresarEn.push(entidadCreada);
        }, (lista) => ManejarABMComponente(lista));
    }
}
const encotrarIndex = (arrayEntidades, idABorrar) => {
    for (let index = 0; index < arrayEntidades.length; index++) {
        if (arrayEntidades[index].id == idABorrar) {
            return index;
        }
    }

}

const LlenarConDatosABM = (arrayEntidades, idEntidad, identificador, accion) => {
    if (idEntidad != undefined) {
        ocultarTablaParaEditar(columnas, arrayEntidades, idEntidad, identificador, accion);
        let entidad = arrayEntidades.find( dato => dato.id == idEntidad);
        let componentesImput = document.getElementsByTagName("input");
        for (let index = 0; index < componentesImput.length; index++) {
            let input = componentesImput[index];
            switch (input.getAttribute('id')) {
                case "modelo":
                    input.setAttribute("value",entidad.modelo);
                    input.setAttribute("textContent",entidad.modelo);
                    break;
                case "anoFab":
                    input.setAttribute("value",entidad.anoFab);
                    input.setAttribute("textContent",entidad.anoFab);
                    break;
                case "velMax":
                    input.setAttribute("value",entidad.velMax);
                    input.setAttribute("textContent",entidad.velMax);
                    break;
                case "cantPue":
                    input.setAttribute("value",entidad.cantPue);
                    input.setAttribute("textContent",entidad.cantPue);
                    break;
                case "cantRue":
                    input.setAttribute("value",entidad.cantRue);
                    input.setAttribute("textContent",entidad.cantRue);
                    break;
                case "altMax":
                    input.setAttribute("value",entidad.altMax);
                    input.setAttribute("textContent",entidad.altMax);
                    break;
                case "autonomia":
                    input.setAttribute("value",entidad.autonomia);
                    input.setAttribute("textContent",entidad.autonomia);
                    break;
                default:
                    console.log("HAY UN ERRO EN EL SWITCH =", input.getAttribute('id'));
                    break;
            }
        } 
        
    } else {
        console.log("no se encontró el INDEX");
    }
}

const ModificarDatosEntidad = (arrayEntidades, idABorrar, identificador) => {
    if (idABorrar != undefined) {
        let entidad = arrayEntidades.find( dato => dato.id == idABorrar);
        let componentesImput = document.getElementsByTagName("input");
        for (let index = 0; index < componentesImput.length; index++) {
            let input = componentesImput[index];
            if (input.value != "") {
                switch (input.getAttribute('id')) {
                    case "modelo":
                        entidad.modelo = input.value;
                        break;
                    case "anoFab":
                        entidad.anoFab = input.value;
                        break;
                    case "velMax":
                        entidad.velMax = input.value;
                        break;
                    case "cantPue":
                        entidad.cantPue = input.value;
                        break;
                    case "cantRue":
                        entidad.cantRue = input.value;
                        break;
                    case "altMax":
                        entidad.altMax = input.value;
                        break;
                    case "autonomia":
                        entidad.autonomia = input.value;
                        break;
                    default:
                        console.log("HAY UN ERRO EN EL SWITCH =", input.getAttribute('id'));
                        break;
                }
            }
        }
        let index = encotrarIndex(arrayEntidades, idABorrar);
        if (index != undefined) {
            arrayEntidades[index] = entidad;
            return entidad;
        } else {
            console.log("no se encontró el INDEX");
        }
    }
}

const ModificarEntidad = (datos, idABorrar, identificador, AccionConIdAlCumplir) => {
    let entidad = ModificarDatosEntidad(datos, idABorrar, identificador)
    PostEntidad(datos, entidad, AccionConIdAlCumplir);
    ManejarABMComponente(datos);
}

const EliminarEntidad = (arrayEntidades, idABorrar) => {
    let index = encotrarIndex(arrayEntidades, idABorrar);
    if (index != undefined) {
        arrayEntidades.splice(index,1);
    } else {
        console.log("no se encontró el INDEX");
    }
    ManejarABMComponente(arrayEntidades);
}
const Cancelar = (arrayEntidades) => {
    ManejarABMComponente(arrayEntidades);
}
const Cargar = () => {
    let spinnerComponent = document.getElementById('spinner');
    spinnerComponent.style = "display: visible";

    while (spinnerComponent.firstChild) {
        spinnerComponent.removeChild(spinnerComponent.firstChild);
    }

    let imgCreate = document.createElement("img");
    imgCreate.src= "./loading-buffering.gif";
    //imgCreate.src= "https://media.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif";
    spinnerComponent.appendChild(imgCreate);
    
}
const TerminoDeCargar = () => {
    let spinnerComponent = document.getElementById('spinner');
    spinnerComponent.style = "display: none";
}
//--------------------------------------------------------------------FUCIONES---------------------------------------------------------------------

const filtrarPor = (entidades, selectComponentName) => {
    let componenteSelect = document.getElementById(selectComponentName);
    let value = componenteSelect.value;
    if (value == "Todos") {
        return entidades;
    }
    if (value == "Aereo") {
        return entidades.filter(e => e instanceof Aereo);
    }
    if (value == "Terrestre") {
        return entidades.filter(e => e instanceof Terrestre);
    }
}

const crearEntidad = (entidad) => {
    const {id, modelo, anoFab, velMax} = entidad;
    if (entidad.hasOwnProperty("cantPue")) {
        return new Aereo(id,modelo, anoFab, velMax, entidad.cantPue, entidad.cantRue);
    } else {
        return new Terrestre(id,modelo, anoFab, velMax, entidad.altMax, entidad.autonomia);
    }
}

const generaArrayDeDatos = (arrayDatos) => {
    let datos = JSON.parse(arrayDatos);
    return datos.map(data =>crearEntidad(data));
};
const OpcionesEspeciales = (value) => {
    if (value == "aereo") {
        return ["cantPue", "cantRue"];
    }
    if (value == "terrestre") {
        return ["altMax", "autonomia"];
    }

    return "algo salio mal";
};

const ordenar = (entidades, propiedad) => {
    return entidades.sort((a, b) => {
        if(a[propiedad] == b[propiedad]) {
          return 0; 
        }
        if(a[propiedad] < b[propiedad]) {
          return 1;
        }
        return -1;
      });
}

const calcularPromedio = (entidades) =>  {
    if (entidades != undefined) {
        let arrayVelocidades = entidades.map(entidad => entidad.velMax);
        let acumulador = 0;
        let sumaDeEdades = arrayVelocidades.reduce(
            (valorPrevio, valorPresente) => valorPrevio + valorPresente,
            acumulador
        );
        let imputVelPromedio = document.getElementById('imputVelPromedio');

        imputVelPromedio.value = sumaDeEdades / entidades.length;
    }
}
const idDinamico = (datos) => {
    let ids = datos.map( d => d.id);
    let valorInicial = 0
    let ultimoID = ids.reduce(
        (previousID, currentID) => previousID < currentID ? currentID : previousID,
        valorInicial
      );
    return ultimoID + 1;
}

const BuscarUserPorId = (entidades, id) => {
    return entidades.find(e => e.id ==id);
} 

//--------------------------------------------------------------------PETICIONES-------------------------------------------------------------------

const GetLista = (GenerarConConsulta) => {
    let consulta = fetch('http://localhost/SegundoParcialLaboIII/Consultas.php', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    
    Cargar();

    consulta.then(respuesta =>{ 
        if (respuesta.status==400){
            throw `ERROR 400: ${respuesta.text()}`;
        }
        if (respuesta.status==200){
            return respuesta.text();
        } else {
            throw "throw ERROR";
        }
    }).then(respuesta => {
        GenerarConConsulta(respuesta);
        return TerminoDeCargar();
    }).catch(error => console.log("CATCH", error));
}

const PUTEntidad = (entidad, arrayEntidades, AccionConIdAlCumplir, TerminarProceso) => {
    let xhttp = new XMLHttpRequest();
    Cargar();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200){
                AccionConIdAlCumplir(arrayEntidades, JSON.parse(xhttp.response).id);
                TerminarProceso(arrayEntidades);
                return TerminoDeCargar();
            } else {
                TerminarProceso(arrayEntidades);
                TerminoDeCargar();
                alert(`No se puedo cargar el usuario\n${xhttp.status}: ${xhttp.response}`);
            }
        } 
    };
    xhttp.open("PUT", "http://localhost/SegundoParcialLaboIII/Consultas.php", true);
    xhttp.send(JSON.stringify(entidad));
}

const PostEntidad = async(arrayEntidades, entidad, AccionConIdAlCumplir) => {
    try {
        Cargar();
        let consulta = await fetch('http://localhost/SegundoParcialLaboIII/Consultas.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(entidad) // Tiene que coincidir con el Content-Type
        });
        if (consulta.status == 200) {
            console.log("consulta 200", consulta.statusText);
            return AccionConIdAlCumplir(arrayEntidades);
        } else {
            return alert(`No se pudo realizar la consulta\nCodigo: ${consulta.status} -> ${consulta.statusText}`);
        }
    } catch (error) {
        console.log("Error POST: ", error);
    } finally {
        TerminoDeCargar();
    }
}

const DeleteEntidad = async(datos, idABorrar, AccionConIdAlCumplir) => {
    try {
        Cargar();
        let entidad = datos.find( dato => dato.id == idABorrar);
        let consulta = await fetch('http://localhost/SegundoParcialLaboIII/Consultas.php', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(entidad) // Tiene que coincidir con el Content-Type
        });
        if (consulta.status == 200) {
            console.log("consulta 200", consulta.statusText);
            return AccionConIdAlCumplir(datos, idABorrar);
        } else {
            return alert(`No se pudo realizar la consulta\nCodigo: ${consulta.status} -> ${consulta.statusText}`);
        }
    } catch (error) {
        console.log("Error POST: ", error);
    } finally {
        TerminoDeCargar();
    }
}

//--------------------------------------------------------------------iNDEX.JS---------------------------------------------------------------------

window.addEventListener("load", () => {
    
    GetLista((consulta) => {
        let entidades = generaArrayDeDatos(consulta);
        console.log(entidades);
        document.addEventListener('DOMContentLoaded', crearTabla(columnas, entidades), false);
    });
});

