import { getDataAllPokemon, getDataPokemon } from '../services/getPokemons.js';

var starter_pokemon = [];
var id;
var no_cards = false;
let data_pokemon = {};
var working = false;

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
//let controller = new AbortController();
//let signal = controller.signal;
var controllerTime = "";

// Reiniciar pokemons inicials
const restart_starters_pokemon = document.querySelector('#btn-restart-starters');

// Buscador de pokemons
const form_pokemon = document.querySelector('#search-pokemon');
const button_pokemon = document.querySelector('#btn-search-pokemon');


/* LISTENERS */
// Crea un listener per reiniciar les cartes inicials
restart_starters_pokemon.addEventListener('click', restartFirstCards);

// Al escriure el nom d'un pokemon
form_pokemon.addEventListener('keyup', getTextSearcher);

// Al clicar el botó de buscar
button_pokemon.addEventListener('click', getAllPokemon);

checkPokeParams();

// First crides a funcions
if ( pokemon_id ) {
    getDetailPokemon();
} else {
    getAllPokemon();
}

// Espera una mica abans de buscar el contingut del buscador
function getTextSearcher() {
    loader('flex');
    clearTimeout(controllerTime);
    controllerTime = setTimeout(getAllPokemon, 250);
}

// Obté les dades de tots els pokemons
async function getAllPokemon() {
    if ( Object.entries(data_pokemon).length !== 0 ) {
        
        // Formulari per buscar
        if ( form_pokemon.value != '' ) {
           
            clearCardsPokemon();
            
            // Buscador
            const text_search = form_pokemon.value.toLowerCase();
            working = true;
            let exit_search = false;
            
            for( let pokemon of data_pokemon.results ) {
                
                if ( pokemon.name.indexOf(text_search) === 0 && working ) {
                    //console.log(text_search);
                    
                    const pkm = await getDataPokemon(pokemon.url);
                    buildCardPokemon(pkm);

                    if ( !exit_search ) {
                        exit_search = true;
                    }
                }
            }

            working = false;

            if ( !exit_search ) {
                no_cards = true;
                clearCardsPokemon();
                buildCardPokemon('');
            }
            
            loader('none');
        }

        else {
            if ( starter_pokemon.length === 0 ) {
                firstCards();
            }

            else {
                if ( working ) { working = false; }

                // Cartes Originals
                backCardsPokemon();
                loader('none');
            }
        }

    }
    
    else {
        data_pokemon = await getDataAllPokemon();
        //console.log(data_pokemon);
        getAllPokemon();
    }

}

// Fa una crida individual
async function getDetailPokemon() {
    let url_pokemon = 'https://pokeapi.co/api/v2/pokemon/' + pokeParam;
    try {
        let pkm = await getDataPokemon(url_pokemon);
        if ( pkm !== '' ) {
            const url_pokemon_species = 'https://pokeapi.co/api/v2/pokemon-species/' + pokeParam;
        
            const pkm_specie = await getDataPokemon(url_pokemon_species);
            if ( pkm_specie !== '' ) {
                pkm['more_info'] = pkm_specie;
            }

            buildCardPokemon(pkm);
        } else {
            buildCardPokemon('');
            
            setTimeout( function() {
                location.href = "/index.html";
            }, 1500);
        }
    } catch (error) {
        buildCardPokemon('');
        
        setTimeout( function() {
            location.href = "/index.html";
        }, 1500);
    }
}

// Pinta la carta del Pokémon
function buildCardPokemon(pokemon) {
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

        // DESCRIPTION
        let text_description = '';

        // Busquem description en espanyol
        pokemon.more_info.flavor_text_entries.forEach( function(value, index, array) {
            if (value.language.name == 'es') {
                //console.dir(value);
                if (value.version.name == 'red') {
                    text_description = value.flavor_text;
                }

                else if (value.version.name == 'sword' ) {
                    text_description = value.flavor_text;
                }

                else {
                    if (text_description == '') {
                        text_description = pokemon.more_info.flavor_text_entries[index].flavor_text;
                    }
                }
            }
        });

        // Apliquem la description a la carta
        const description = template.querySelector('.description-pokemon');
        if (text_description != '') {
            description.innerHTML = '<p>' + text_description + '</p>';
        }

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

        // Stats
        template.querySelector('.stat-hp').innerHTML = pokemon.stats[0].base_stat;
        template.querySelector('.stat-attack').innerHTML = pokemon.stats[1].base_stat;
        template.querySelector('.stat-defense').innerHTML = pokemon.stats[2].base_stat;
        template.querySelector('.stat-attack-special').innerHTML = pokemon.stats[3].base_stat;
        template.querySelector('.stat-defense-special').innerHTML = pokemon.stats[4].base_stat;
        template.querySelector('.stat-speed').innerHTML = pokemon.stats[5].base_stat;

        const clone = template.cloneNode(true);
		fragment.appendChild(clone);

        printCardPokemon(fragment,'detail-card-pokemon');

        // Aquest funció serveix perquè el footer es mantingui a la part final de la pàgina
        addFooterBottom(false);
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
        template.querySelector('.btn-more-info').setAttribute('onclick', 'changeURL('+pokemon.id+');');
        
        const clone = template.cloneNode(true);
		fragment.appendChild(clone);

        printCardPokemon(fragment);

        // Aquest funció serveix perquè el footer es mantingui a la part final de la pàgina
        addFooterBottom(false);
    }

    else {
        var msg = "No s'han trobat resultats";
        var html = document.createElement('div');
        html.innerHTML = msg;
        html.classList.add('error-message');
        
        const list_error = document.querySelector("#pokemon-list .list-card-pokemon");
        list_error.classList.add('error-list');

        printCardPokemon(html);

        // Aquest funció serveix perquè el footer es mantingui a la part final de la pàgina
        addFooterBottom(true);

        setTimeout(no_cards = false, 500);
    }

    //console.log(pokemon);
}

function backToOriginalList() {
    pokemon_id = false;

    history.pushState("", document.title, window.location.pathname);

    // Neteja la card individual i pinta les primeres cartes
    backCardsPokemon('detail-card-pokemon');
}

// Primeres cartes 
async function firstCards() {
    // Obté cartes de localStorage
    const pokemons = getFirstPokemon();
    if ( pokemons !== null ) {
        starter_pokemon = pokemons;
    }
   
    // console.log(starter_pokemon);

    // Si starter_pokemon esta buit
    if ( starter_pokemon.length === 0 ) {

        // No para fins a tenir 10 números
        while ( starter_pokemon.length < 10 ) {
            
            // Obté un id aleatori
            id = getRandomId(905);
            
            let url_pokemon = 'https://pokeapi.co/api/v2/pokemon/' + id;
            //console.log(url_pokemon);
            
            // Si id no esta al array l'afegeix
            if ( !starter_pokemon.includes(url_pokemon) && id != 0 && id !== null ) {
                starter_pokemon.push(url_pokemon);
            }
        }

        // Guarda les primeres cartes
        saveFirstPokemon(starter_pokemon);
    }

    loader('flex');
    
    for (let id_pokemon of starter_pokemon) {
        // Obté les dades d'un pokemon
        const pkm = await getDataPokemon(id_pokemon);

        // Construeix una carta i la pinta
        buildCardPokemon(pkm);
    }

    loader('none');
}

// Reinicia les cartes inicials
function restartFirstCards() {
    // Esborra els pokemons guardats al localStorage
    deleteFirstPokemon();

    // Neteja el template
    clearCardsPokemon();

    // Buida els pokemons d'aquesta array
    starter_pokemon = [];

    // Torna a seleccionar pokemons
    firstCards();
}

// Torna a les cartes del inici
async function backCardsPokemon(name_class = "list-card-pokemon") {
    clearCardsPokemon(name_class);

    // Buscador visible
    const content_searcher = document.querySelector('.content-searcher');
    content_searcher.style.display = 'flex';

    // Botó tornar al inici ocult
    const list_original = document.querySelector('.list-original');
    list_original.style.display = 'none';

    // Si ja s'han seleccionat les primeres cartes
    if ( starter_pokemon.length !== 0 ) {
        for (let id_pokemon of starter_pokemon) {
            const pkm = await getDataPokemon(id_pokemon);
            buildCardPokemon(pkm);
        }
    } 
    
    else {
        firstCards();
    }
}

// Pinta les cartes
function printCardPokemon(html, name_class = "list-card-pokemon") {
    const list = document.querySelector("#pokemon-list ."+name_class);
    list.append(html);
}

// Neteja les cartes
function clearCardsPokemon(name_class = "list-card-pokemon") {
    const list = document.querySelector("#pokemon-list ."+name_class);
    list.innerHTML = '';
    
    if ( name_class == "list-card-pokemon" ) {
        // Elimina la classe dissenyada per mostrar el contingut dels no resultat o errors
        if ( list.classList.contains('error-list') ) {
            list.classList.remove('error-list')
        }
    }
}