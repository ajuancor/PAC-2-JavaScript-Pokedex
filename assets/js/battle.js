import { getDataPokemon } from '../services/getPokemons.js';
var starters_pokemon = [];
var first_pokemon = [];
var second_pokemon = [];

// Inici del codi
getStarterPokemon();
loopStarterPokemon();

// Listeners
let select_pokemon = document.querySelector('.list-card-pokemon');

function createListenerPokemonCard() {
    select_pokemon.addEventListener('click', listenerPokemonCard);
}

function listenerPokemonCard(card) {
    selectPokemon(card);
}

function removeListenerPokemonCard() {
    select_pokemon.removeEventListener('click', listenerPokemonCard);
}

// Obté 10 pokemons aleatoris
function getStarterPokemon() {
    if ( starters_pokemon.length === 0 ) {
        // No para fins a tenir 10 números
        while ( starters_pokemon.length < 10 ) {
            
            // Obté un id aleatori
            const id = getRandomId(905);
            
            // comentari (1): en aqueset punt, potser només guardant el número ID ja n'hi hauria prou. Així l'operació de includes seria una mica (estem parlant de milisegons) més ràpida
            let url_pokemon = 'https://pokeapi.co/api/v2/pokemon/' + id;
            
            // Si id no esta al array l'afegeix
            if ( !starters_pokemon.includes(url_pokemon) && id != 0 && id !== null ) {
                starters_pokemon.push(url_pokemon);
            }
        }
    }
}

// Obté els pokemon i els construeix
async function loopStarterPokemon() {
    if ( starters_pokemon.length !== 0 ) {

        loader('flex');

        for (let id_pokemon of starters_pokemon) {
            // Obté les dades d'un pokemon
            // comentari (2): aquí enllo de passar-li tota la url, també es podria passar només l'id
            const pkm = await getDataPokemon(id_pokemon);
    
            // Construeix una carta i la pinta
            buildCardPokemon(pkm);
        }

        loader('none');

        // Crear el listener per seleccionar cartes
        createListenerPokemonCard();
    }
}

async function selectPokemon(card) {
    const id_pokemon = card.target.dataset.pokeid;

    // Obté les dades d'un pokemon
    const pkm = await getDataPokemon('https://pokeapi.co/api/v2/pokemon/' + id_pokemon);

    if ( pkm !== '' ) {
        if ( first_pokemon.length === 0 ) {
            first_pokemon = pkm;
            
            card.target.classList.remove('ocult-card');
            card.target.classList.add('first-card');
            //return 'first-card';
        }

        else if ( second_pokemon.length === 0 ) {
            second_pokemon = pkm;

            card.target.classList.remove('ocult-card');
            card.target.classList.add('second-card');
            //return 'second-card';
            battleCards();
        }

        else {
            battleCards();
        }
    }

    else {
        return false;
    }
}

function battleCards() {
    const battle = document.querySelector('.detail-battle');
    let html = '';

    if ( first_pokemon.length !== 0 && second_pokemon.length !== 0 ) {
        const name_first_pokemon = first_pokemon.name.charAt(0).toUpperCase() + first_pokemon.name.slice(1);
        const name_second_pokemon = second_pokemon.name.charAt(0).toUpperCase() + second_pokemon.name.slice(1);

        // Si el primer pokemon té més atac i el segon té menys defensa
        if ( first_pokemon.stats[1].base_stat > second_pokemon.stats[2].base_stat ) {
            html = "<h1>"+ name_first_pokemon +" ataca i guanya a "+ name_second_pokemon +"</h1>";
        } else if ( first_pokemon.stats[1].base_stat <= second_pokemon.stats[2].base_stat) {
            html = "<h1>"+ name_first_pokemon +" ataca i perd contra "+ name_second_pokemon +"</h1>";
        } else {
            html = "<h1>No hi ha guanyadors</h1>";
        }

        // FINISH BATTLE
        battle.innerHTML = html;
        battle.parentElement.style.display = 'block';

        select_pokemon.classList.remove('selected-cards');
        
        // Elimina els listener per a que l'usuari no pugui triar més cartes
        // comentari: bon punt a tenir en compte!
        removeListenerPokemonCard();

        // Es mou fins al resultat final
        goToDetailBattle();
    }
}
 
// comentari: bon ús de templates per construïr les cartes
function buildCardPokemon(pokemon) {
    const template = document.querySelector('#template-card-pkm').content;
    const fragment = document.createDocumentFragment();

    const name_pokemon = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    // ID
    const pokeid = template.querySelector('.card');
    pokeid.dataset.pokeid = pokemon.id;

    // TITLE
    template.querySelector('.card-title').innerHTML = name_pokemon;

    // IMAGES
    // Front
    if ( pokemon.sprites.front_default != null ) {
        template.querySelector('.front .img-card-pokemon').setAttribute('src', pokemon.sprites.front_default);
    } else {
        template.querySelector('.front .img-card-pokemon').setAttribute('src', './assets/img/default-pokemon.png');
    }
    template.querySelector('.front .img-card-pokemon').setAttribute('alt', name_pokemon);

    // Back
    if ( pokemon.sprites.back_default != null ) {
        template.querySelector('.back .img-card-pokemon').setAttribute('src', pokemon.sprites.back_default);
    } else {
        template.querySelector('.back .img-card-pokemon').setAttribute('src', './assets/img/default-pokemon.png');
    }
    template.querySelector('.back .img-card-pokemon').setAttribute('alt', name_pokemon);

    //template.querySelector('.card-image').setAttribute('src', gif.url);
    //template.querySelector('.card-image').setAttribute('alt', gif.title);
    
    // STATS
    // Types
    if ( pokemon.types[0].type.name != null ) {
        template.querySelector('.content-types-pokemon').innerHTML = selectPokemonType(pokemon.types[0].type.name);
    }
    
    if ( pokemon.types.hasOwnProperty(1) ) {
        if ( pokemon.types[1].type.name != null ) {
            template.querySelector('.content-types-pokemon').innerHTML += selectPokemonType(pokemon.types[1].type.name);
        }
    }

    // Attack & Defense        
    template.querySelector('.stat-attack').innerHTML = pokemon.stats[1].base_stat;
    template.querySelector('.stat-defense').innerHTML = pokemon.stats[2].base_stat;

    const clone = template.cloneNode(true);
    fragment.appendChild(clone);

    printCardPokemon(fragment);
}

// Pinta les cartes
function printCardPokemon(html, name_class = "list-card-pokemon") {
    const list = document.querySelector("#pokemon-list ."+name_class);
    //list.innerHTML += html;
    list.append(html);
}

function goToDetailBattle() {
    var detail_battle = document.getElementById("battle-detail");

    detail_battle.scrollIntoView({block: "start", behavior: "smooth"});
}