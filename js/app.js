//Cotizador Constructor
function Seguro (marca, anio, tipo) {
    this.marca = marca;
    this.anio = anio;
    this.tipo = tipo;
}

Seguro.prototype.cotizarSeguro = function () {
    /*
        1 = Americano: 1.15
        2 = Asiático: 1.05
        3 = Europeo: 1.35
    */

    let cantidad;
    const base = 2000;

    switch(this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
    }

    const diferencia = new Date().getFullYear() - this.anio;

    //Cada año de diferencia hay que reducir 3% el valor del seguro
    cantidad -= ((diferencia * 3) * cantidad) / 100;
    
    /* TIPOS DE SEGURO:
    Basico: se multiplica por 30% mas
    Completo: se multiplica por 50% mas
    */

    if (this.tipo === 'basico') {
        cantidad *= 1.3;
    } else {
        cantidad *= 1.5;
    }
    return cantidad;
}

//Constructor Interfaz (Todo lo que se muestra)
function Interfaz () {}

//Mensaje que se imprime en el HTML
Interfaz.prototype.mostrarMensaje = function(mensaje, tipo) {
    const div = document.createElement('div');
    if (tipo === 'error') {
        div.classList.add('mensaje', 'error');
    } else {
        div.classList.add('mensaje', 'correcto');
    }
    div.innerHTML = `${mensaje}`;
    formulario.insertBefore(div, document.querySelector('.form-group'));

    setTimeout(function() {
        document.querySelector('.mensaje').remove();
    }, 1500)
}

//Imprime el resultado de la cotizacion
Interfaz.prototype.mostrarResultado = function(seguro, total) {
    const resultado = document.getElementById('resultado');
    let marca;
    switch (seguro.marca) {
        case '1':
            marca = 'Americano';
            break;
        case '2':
            marca = 'Asiatico';
            break;
        case '3':
            marca = 'Europeo';
            break;
    }
    const div = document.createElement('div');
    //Insertar informacion
    div.innerHTML = `
        <p class='header'>TU RESUMEN</p>
        <p>Marca: ${marca}</p>
        <p>Año: ${seguro.anio}</p>
        <p>Tipo: ${seguro.tipo}</p>
        <p>Total: $ ${total}</p>
    `;
    const spinner = document.querySelector('#cargando img');
    spinner.style.display = 'block';
    setTimeout(() => {
        spinner.style.display = 'none';
        resultado.appendChild(div);
    }, 1500);
    
}

//Event Listeners
const formulario = document.getElementById('cotizar-seguro');
formulario.addEventListener('submit', function(e) {
    e.preventDefault();
    //Leer el Index de la marca seleccionada
    const marca = document.getElementById('marca');
    const marcaSeleccionada = marca.options[marca.selectedIndex].value;
    //Leer el anio seleccionado
    const anio = document.getElementById('anio');
    const anioSeleccionado = anio.options[anio.selectedIndex].value;
    //Lee el valor del radio button
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    //Crear instancia de Interfaz
    const interfaz = new Interfaz();

    //Revisamos que los campos no esten vacíos
    if (marcaSeleccionada === '' || anioSeleccionado === '' || tipo === '') {
        interfaz.mostrarMensaje('Faltan datos, revisa el formulario y prueba de nuevo', 'error');
    } else {
        //Limpiar resultados anteriores
        const resultados = document.querySelector('#resultado div');
        if (resultados != null) {
            resultados.remove();
        }
        const seguro = new Seguro(marcaSeleccionada, anioSeleccionado, tipo);
        //Cotizar seguro
        const cantidad = seguro.cotizarSeguro();
        //Mostrar el resultado
        interfaz.mostrarResultado(seguro, cantidad);
        interfaz.mostrarMensaje('Cotizando...', 'exito');
    }
});

//Fecha máxima y mínima
const max = new Date().getFullYear();
const min = max - 20;

//Bucle para agregar años a las opciones
const selectAnios = document.getElementById('anio');
for (let i = max; i > min; i--) {
    let option = document.createElement('option');
    option.value = i;
    option.innerHTML = i;
    selectAnios.appendChild(option);
}