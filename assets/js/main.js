import getDataAllPokemon from '../services/getPokemons.js';
import getDataPokemon from '../services/getPokemons.js';

var ids_pokemons = [];
var id;
var no_cards = false;
let data_pokemon = {};

// Variable dedicada a un pokemon individual
var pokemon_id = false;

function checkPokeParams() {
    if ( pokeParam != null && pokeParam != '' ) {
        pokemon_id = true;

        // Buscador ocult
        const content_searcher = document.querySelector('.content-searcher');
        content_searcher.style.display = 'none';

        // Botó tornar al inici
        const list_original = document.querySelector('.list-original');
        list_original.style.display = 'block';

        // Al clicar el botó torna a llistar els primers pokemons
        const button_back = document.querySelector('#btn-back-original-list');
        button_back.addEventListener('click', backToOriginalList);
    }

}

// Controller
let controller = new AbortController();
let signal = controller.signal;
var controllerTime = "";

// Buscador de pokemons
const form_pokemon = document.querySelector('#search-pokemon');
const button_pokemon = document.querySelector('#btn-search-pokemon');


/* LISTENERS */
// Al escriure el nom d'un pokemon
form_pokemon.addEventListener('keyup', getTextSearcher);

// Al clicar el botó de buscar
button_pokemon.addEventListener('click', getAllPokemon);

checkPokeParams();

/*
if ( pokemon_id ) {
    const button_back = document.querySelector('#btn-back-original-list');
    button_back.addEventListener('click', backToOriginalList);
}
*/

// First crides a funcions
if ( pokemon_id ) {
    getDetailPokemon();
} else {
    getAllPokemon();
}

// Genera número aleatori
function getRandomId(max) {
    return Math.floor(Math.random() * max);
}

// Espera una mica abans de buscar el contingut del buscador
function getTextSearcher() {
    loader('flex');
    clearTimeout(controllerTime);
    controllerTime = setTimeout(getAllPokemon, 250);
}

// Obté les dades de tots els pokemons
function getAllPokemon() {
    if ( Object.entries(data_pokemon).length !== 0 ) {
        
        if ( form_pokemon.value != '' ) {
           
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
                clearCardsPokemon();
                buildCardPokemon('');
            }
            
            loader('none');
        }

        else {
            if ( ids_pokemons.length === 0 ) {
                firstCards();
            }

            else {
                // Cartes Originals
                backCardsPokemon();
                loader('none');
            }
        }

    }
    
    else {
        data_pokemon = await getDataAllPokemon();
        console.log(data_pokemon);
    }

}

/* PART DATA-PROMISES */
/*
const isResponseOk = async (response) => {
    if (!response.ok)
        throw new Error(response.status);
        
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
        buildCardPokemon(data);
    })
    .catch(err => {
        if ( pokemon_id ) {
            buildCardPokemon('');
        }  
        console.error("ERROR: ", err.message);
    });
}
*/

// Fa una crida individual
function getDetailPokemon() {
    let url_pokemon = 'https://pokeapi.co/api/v2/pokemon/' + pokeParam;
    try {
        getDataPokemon(url_pokemon);
    } catch (error) {
        printCardPokemon('');
    }
}

// Pinta la carta del Pokémon
function buildCardPokemon(pokemon) {
    //https://github.com/LuichidevUOC/search-gifs/blob/main/js/main.js

    // Carta individual
    if ( pokemon != '' && pokemon_id ) {

        const template = document.querySelector('#template-card-pkm-solo').content;
	    const fragment = document.createDocumentFragment();

        // ID
        const pokeid = template.querySelector('.card');
        pokeid.dataset.pokeid = pokemon.id;

        // TITLE
        template.querySelector('.card-title').innerHTML = pokemon.name;

        // IMAGES
        // Default form
        // Front
        if ( pokemon.sprites.front_default != null ) {
            template.querySelector('.default-pokemon .front .img-card-pokemon').setAttribute('src', pokemon.sprites.front_default);
        } else {
            template.querySelector('.default-pokemon .front .img-card-pokemon').setAttribute('src', './assets/img/default-pokemon.png');
        }
        template.querySelector('.default-pokemon .front .img-card-pokemon').setAttribute('alt', pokemon.name);

        // Back
        if ( pokemon.sprites.back_default != null ) {
            template.querySelector('.default-pokemon .back .img-card-pokemon').setAttribute('src', pokemon.sprites.back_default);
        } else {
            template.querySelector('.default-pokemon .back .img-card-pokemon').setAttribute('src', './assets/img/default-pokemon.png');
        }
        template.querySelector('.default-pokemon .back .img-card-pokemon').setAttribute('alt', pokemon.name);

        // Shiny form
        // Front
        if ( pokemon.sprites.front_shiny != null ) {
            template.querySelector('.shiny-pokemon .front .img-card-pokemon').setAttribute('src', pokemon.sprites.front_shiny);
        } else {
            template.querySelector('.shiny-pokemon .front .img-card-pokemon').setAttribute('src', './assets/img/default-pokemon.png');
        }
        template.querySelector('.shiny-pokemon .front .img-card-pokemon').setAttribute('alt', pokemon.name);

        // Back
        if ( pokemon.sprites.back_shiny != null ) {
            template.querySelector('.shiny-pokemon .back .img-card-pokemon').setAttribute('src', pokemon.sprites.back_shiny);
        } else {
            template.querySelector('.shiny-pokemon .back .img-card-pokemon').setAttribute('src', './assets/img/default-pokemon.png');
        }
        template.querySelector('.shiny-pokemon .back .img-card-pokemon').setAttribute('alt', pokemon.name);


        // STATS
        // Types
        if ( pokemon.types[0].type.name != null ) {
            html += selectPokemonType(pokemon.types[0].type.name);
            template.querySelector('.content-types-pokemon').innerHTML = selectPokemonType(pokemon.types[0].type.name);
        }
        
       if ( pokemon.types.hasOwnProperty(1) ) {
            if ( pokemon.types[1].type.name != null ) {
                html += selectPokemonType(pokemon.types[1].type.name);
                template.querySelector('.content-types-pokemon').innerHTML += selectPokemonType(pokemon.types[1].type.name);
            }
        }

        // Attack & Defense        
        template.querySelector('.stat-attack').innerHTML = pokemon.stats[1].base_stat;
        template.querySelector('.stat-defense').innerHTML = pokemon.stats[2].base_stat;

        const clone = template.cloneNode(true);
		fragment.appendChild(clone);


        printCardPokemon(fragment,'detail-card-pokemon');
    }

    else if ( pokemon != '' && !no_cards ) {

        const template = document.querySelector('#template-card-pkm').content;
	    const fragment = document.createDocumentFragment();

        // ID
        const pokeid = template.querySelector('.card');
        pokeid.dataset.pokeid = pokemon.id;

        // TITLE
        template.querySelector('.card-title').innerHTML = pokemon.name;

        // IMAGES
        // Front
        if ( pokemon.sprites.front_default != null ) {
            template.querySelector('.front .img-card-pokemon').setAttribute('src', pokemon.sprites.front_default);
        } else {
            template.querySelector('.front .img-card-pokemon').setAttribute('src', './assets/img/default-pokemon.png');
        }
        template.querySelector('.front .img-card-pokemon').setAttribute('alt', pokemon.name);

        // Back
        if ( pokemon.sprites.back_default != null ) {
            template.querySelector('.back .img-card-pokemon').setAttribute('src', pokemon.sprites.back_default);
        } else {
            template.querySelector('.back .img-card-pokemon').setAttribute('src', './assets/img/default-pokemon.png');
        }
        template.querySelector('.back .img-card-pokemon').setAttribute('alt', pokemon.name);

		//template.querySelector('.card-image').setAttribute('src', gif.url);
		//template.querySelector('.card-image').setAttribute('alt', gif.title);
		
        // STATS
        // Types
        if ( pokemon.types[0].type.name != null ) {
            html += selectPokemonType(pokemon.types[0].type.name);
            template.querySelector('.content-types-pokemon').innerHTML = selectPokemonType(pokemon.types[0].type.name);
        }
        
       if ( pokemon.types.hasOwnProperty(1) ) {
            if ( pokemon.types[1].type.name != null ) {
                html += selectPokemonType(pokemon.types[1].type.name);
                template.querySelector('.content-types-pokemon').innerHTML += selectPokemonType(pokemon.types[1].type.name);
            }
        }

        // Attack & Defense        
        template.querySelector('.stat-attack').innerHTML = pokemon.stats[1].base_stat;
        template.querySelector('.stat-defense').innerHTML = pokemon.stats[2].base_stat;

        // MORE INFO
        template.querySelector('.btn-more-info').setAttribute('onclick', 'changeURL('+pokemon.id+')');

        const clone = template.cloneNode(true);
		fragment.appendChild(clone);

        printCardPokemon(fragment);
    }

    else {
        var msg = "No s'han trobat resultats";
        var html = document.createElement('div');
        html.innerHTML = msg;
        
        console.log(html);
        printCardPokemon(html);

        setTimeout(no_cards = false, 500);
    }

    //console.log(pokemon);
}

/*
function clearParamsURL() {
    location.href = location.href.replace(location.search,'');
}
*/

function changeURL(id) {
    //location.search = '?pokeID=' + id;
    history.pushState("", document.title, '?pokeID=' + id);
    
    // Comprova els parametres de la URL
    checkURLParams();

    checkPokeParams();

    clearCardsPokemon();
    getDetailPokemon();
    
    console.log(pokeParam);
}

function backToOriginalList() {
    pokemon_id = false;

    history.pushState("", document.title, window.location.pathname);

    // Neteja la card individual
    // Pinta les primeres cartes
    backCardsPokemon('detail-card-pokemon');
}


// Canvia la imatge del pokemon
function changeCardImg(card) {
    if ( card.classList.contains('front') ) {
        card.style.display = 'none';
        card.nextElementSibling.style.display = 'block';
   } else {
        card.style.display = 'none';
        card.previousElementSibling.style.display = 'block';
    }
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

// Mostrar spinner
function loader(status) {
    const spinner = document.querySelector('.content-spinner');
    spinner.style.display = status;
}

// Pinta les cartes
function printCardPokemon(html, name_class = "list-card-pokemon") {
    const list = document.querySelector("#pokemon-list ."+name_class);
    //list.innerHTML += html;
    list.append(html);
}

// Neteja les cartes
function clearCardsPokemon(name_class = "list-card-pokemon") {
    const list = document.querySelector("#pokemon-list ."+name_class);
    list.innerHTML = '';
}

// Torna a les cartes del inici
function backCardsPokemon(name_class = "list-card-pokemon") {
    clearCardsPokemon(name_class);

    // Buscador visible
    const content_searcher = document.querySelector('.content-searcher');
    content_searcher.style.display = 'flex';

    // Botó tornar al inici ocult
    const list_original = document.querySelector('.list-original');
    list_original.style.display = 'none';

    // Si ja s'han seleccionat les primeres cartes
    if ( ids_pokemons.length !== 0 ) {
        for (let id_pokemon of ids_pokemons) {
            getDataPokemon(id_pokemon);
        }
    } 
    
    else {
        firstCards();
    }

}