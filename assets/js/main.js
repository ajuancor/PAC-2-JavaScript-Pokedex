var ids_pokemons = [];
var id;
//var working = false;
var no_cards = false;
let data_pokemon = {};

// Controller
let controller = new AbortController();
let signal = controller.signal;

// Buscador de pokemons
var controllerTime = "";
const form_pokemon = document.querySelector('#search-pokemon');
const button_pokemon = document.querySelector('#btn-search-pokemon');

// Al escriure el nom d'un pokemon
form_pokemon.addEventListener('keyup', getTextSearcher);

// Al clicar el botó de buscar
button_pokemon.addEventListener('click', getAllPokemon);

// First crides a funcions
getAllPokemon();

// Genera número aleatori
function getRandomId(max) {
    return Math.floor(Math.random() * max);
}

// Espera una mica abans de buscar el contingut del buscador
function getTextSearcher() {
    clearTimeout(controllerTime);
    loader('flex');
    controllerTime = setTimeout(getAllPokemon, 250);
}

// Obté les dades de tots els pokemons
function getAllPokemon() {
    if ( Object.entries(data_pokemon).length !== 0 ) {
        
        if ( form_pokemon.value != '' ) {
            /* if (working) {
                controller.abort();
                working = false;
                console.log("abort");
            }*/
            clearCardsPokemon();
            
            // Buscador
            const text_search = form_pokemon.value.toLowerCase();
            let exit_search = false;
            //working = true;
            
            for( let pokemon of data_pokemon.results ) {
                
                if ( pokemon.name.indexOf(text_search) === 0 /* && working */ ) {
                    console.log(text_search);
                    getDataPokemon(pokemon.url);
                    
                    if ( !exit_search ) {
                        exit_search = true;
                    }
                }
            }

            //working = false;

            if ( !exit_search ) {
                no_cards = true;
                printCardPokemon('');
            }
            
            loader('none');
        }

        else {
            if ( ids_pokemons.length === 0 ) {
                firstCards();
            }

            else {
                backCardsPokemon();
                loader('none');
            }
        }

    }
    
    else {
        getDataAllPokemon();
    }

}

/* PART DATA-PROMISES */
const isResponseOk = async (response) => {
    if (!response.ok)
        throw new Error(response.status);
    //return response.text();
    return await response.json();
}

function getDataAllPokemon() {
    fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=905')
    .then(response => isResponseOk(response))
    .then(data => {
        //console.log(data);
        data_pokemon = data;
        getAllPokemon();
    })
    .catch(err => console.error("ERROR: ", err.message));
}

function getDataPokemon(url) {
    fetch(url, { signal: controller.signal })
    .then(response => isResponseOk(response))
    .then(data => {
        console.log(data);
        printCardPokemon(data);
    })
    .catch(err => console.error("ERROR: ", err.message));
}

// Pinta la carta del Pokémon
function printCardPokemon(pokemon) {
    if ( pokemon != '' && !no_cards ) {
        var html = '<article class="card">';
        html += '<h2 class="title text-center">'+ pokemon.name +'</h2>';
        if ( pokemon.sprites.front_default != null ) {
            html += '<div class="content-img-card"><img src="'+ pokemon.sprites.front_default +'" class="img-card-pokemon" /></div>';
        } else {
            html += '<div class="content-img-card"><img src="./assets/img/default-pokemon.png" class="img-card-pokemon" /></div>';
        }
        
        html += '<div class="content-text-card mt10">';
        html += '<ul>';
        html += '<li><span class="align-self-center">Tipus</span> <span class="content-types-pokemon">';
        if ( pokemon.types[0].type.name != null ) {
            html += selectPokemonType(pokemon.types[0].type.name);
        }
        
       if ( pokemon.types.hasOwnProperty(1) ) {
            if ( pokemon.types[1].type.name != null ) {
                html += selectPokemonType(pokemon.types[1].type.name);
            }
        }
        html += '</span></li>';
        html += '<li><span>Atac</span> <span>'+ pokemon.stats[1].base_stat +'</span></li>';
        html += '<li><span>Defensa</span> <span>'+ pokemon.stats[2].base_stat +'</span></li>';
        html += '</ul>';
        html += '</div>';
        html += '</article>';

        const list = document.querySelector("#pokemon-list .list-card-pokemon");
        list.innerHTML += html;
    }

    else {
        var html = "<h1>No s'han trobat resultats</h1>";
        
        const list = document.querySelector("#pokemon-list .list-card-pokemon");
        list.innerHTML = html;
        
        setTimeout(no_cards = false, 500);
    }

    //console.log(pokemon);
}

function selectPokemonType(type) {
    let icon = '';
    switch (type) {
        case 'normal':
        default:
            icon = '<img src="assets/img/icons/icon_normal.webp" class="img-type-pokemon" alt="Normal" title="Normal" />';
            break;
        case 'fighting':
            icon = '<img src="assets/img/icons/icon_lucha.webp" class="img-type-pokemon" alt="Lluita" title="Lluita" />';
            break;
        case 'flying':
            icon = '<img src="assets/img/icons/icon_volador.webp" class="img-type-pokemon" alt="Volador" title="Volador" />';
            break;
        case 'poison':
            icon = '<img src="assets/img/icons/icon_veneno.webp" class="img-type-pokemon" alt="Verí" title="Verí" />';
            break;
        case 'ground':
            icon = '<img src="assets/img/icons/icon_tierra.webp" class="img-type-pokemon" alt="Terra" title="Terra" />';
            break;
        case 'rock':
            icon = '<img src="assets/img/icons/icon_roca.webp" class="img-type-pokemon" alt="Roca" title="Roca" />';
            break;
        case 'bug':
            icon = '<img src="assets/img/icons/icon_bicho.webp" class="img-type-pokemon" alt="Bicho" title="Bicho" />';
            break;
        case 'ghost':
            icon = '<img src="assets/img/icons/icon_fantasma.webp" class="img-type-pokemon" alt="Fantasma" title="Fantasma" />';
            break;
        case 'steel':
            icon = '<img src="assets/img/icons/icon_acero.webp" class="img-type-pokemon" alt="Acero" title="Acero" />';
            break;
        case 'fire':
            icon = '<img src="assets/img/icons/icon_fuego.webp" class="img-type-pokemon" alt="Fuego" title="Fuego" />';
            break;
        case 'water':
            icon = '<img src="assets/img/icons/icon_agua.webp" class="img-type-pokemon" alt="Agua" title="Agua" />';
            break;
        case 'grass':
            icon = '<img src="assets/img/icons/icon_planta.webp" class="img-type-pokemon" alt="Planta" title="Planta" />';
            break;
        case 'electric':
            icon = '<img src="assets/img/icons/icon_electrico.webp" class="img-type-pokemon" alt="Electric" title="Electric" />';
            break;
        case 'psychic':
            icon = '<img src="assets/img/icons/icon_psiquico.webp" class="img-type-pokemon" alt="Psiquic" title="Psiquic" />';
            break;
        case 'ice':
            icon = '<img src="assets/img/icons/icon_hielo.webp" class="img-type-pokemon" alt="Gel" title="Gel" />';
            break;
        case 'dragon':
            icon = '<img src="assets/img/icons/icon_dragon.webp" class="img-type-pokemon" alt="Dragon" title="Dragon" />';
            break;
        case 'dark':
            icon = '<img src="assets/img/icons/icon_siniestro.webp" class="img-type-pokemon" alt="Siniestro" title="Siniestro" />';
            break;
        case 'fairy':
            icon = '<img src="assets/img/icons/icon_hada.webp" class="img-type-pokemon" alt="Fada" title="Fada" />';
            break;
    }

    return icon;
}

// Primeres cartes 
function firstCards() {
    // No para fins a tenir 10 números
    while ( ids_pokemons.length < 10 ) {
        id = getRandomId(905);
        
        let url_pokemon = 'https://pokeapi.co/api/v2/pokemon/' + id;
        //console.log(url_pokemon);
        
        // Si id no esta al array l'afegeix
        if ( !ids_pokemons.includes(url_pokemon) && id != 0 && id !== null ) {
            ids_pokemons.push(url_pokemon);
        }
    }

    for (let id_pokemon of ids_pokemons) {
        getDataPokemon(id_pokemon);
    }
}

/*
for (var i = 0; i < 9; i++) {
    fetch('https://pokeapi.co/api/v2/pokemon/'+ids_pokemons[i])
    .then(response => isResponseOk(response))
    //.then(data => console.log("Datos: ", data))
    .then(data => { 
        //data_pokemon = JSON.parse(data);
        //printCardPokemon(data_pokemon);
        printCardPokemon(data);
    })
    .catch(err => console.error("ERROR: ", err.message));
    
    //console.log(ids_pokemons);
}
*/

function loader(status) {
    const spinner = document.querySelector('.content-spinner');
    spinner.style.display = status;
}

// Neteja les cartes
function clearCardsPokemon() {
    const list = document.querySelector("#pokemon-list .list-card-pokemon");
    list.innerHTML = '';
}

// Torna a les cartes del inici
function backCardsPokemon() {
    clearCardsPokemon();

    for (let id_pokemon of ids_pokemons) {
        getDataPokemon(id_pokemon);
    }
}