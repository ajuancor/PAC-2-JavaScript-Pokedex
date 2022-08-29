import { getDataAllPokemon, getDataPokemon } from '../services/getPokemons.js';
var starters_pokemon = [];
var first_pokemon = [];
var second_pokemon = [];

// Inici del codi
getStarterPokemon();
loopStarterPokemon();

// Listeners
const select_pokemon = document.querySelector('.list-card-pokemon');
select_pokemon.addEventListener('click', function(card) {
    //console.log(card.target.dataset.pokeid);
    
    selectPokemon(card);
    
});

// Obté 10 pokemons aleatoris
function getStarterPokemon() {
    if ( starters_pokemon.length === 0 ) {
        // No para fins a tenir 10 números
        while ( starters_pokemon.length < 10 ) {
            
            // Obté un id aleatori
            const id = getRandomId(905);
            
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
            const pkm = await getDataPokemon(id_pokemon);
    
            // Construeix una carta i la pinta
            buildCardPokemon(pkm);
        }

        loader('none');
    }
}

async function selectPokemon(card) {
    const id_pokemon = card.target.dataset.pokeid;

    // Obté les dades d'un pokemon
    const pkm = await getDataPokemon('https://pokeapi.co/api/v2/pokemon/' + id_pokemon);
    console.log(pkm);

    if ( pkm !== '' ) {
        if ( first_pokemon.length === 0 ) {
            console.log('first');
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
        
        // Si el primer pokemon té més atac i el segon té menys defensa
        if ( first_pokemon.stats[1].base_stat > second_pokemon.stats[2].base_stat ) {
            html = "<h1>"+ first_pokemon.name +" ataca i guanya a "+ second_pokemon.name +"</h1>";
            console.log('entro');
        } else if ( first_pokemon.stats[1].base_stat <= second_pokemon.stats[2].base_stat) {
            html = "<h1>"+ first_pokemon.name +" ataca i perd contra "+ second_pokemon.name +"</h1>";
        } else {
            html = "<h1>No hi ha guanyadors</h1>";
        }

        battle.innerHTML = html;
    }

}
 
function buildCardPokemon(pokemon) {
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

    // MORE INFO
    template.querySelector('.btn-more-info').setAttribute('onclick', 'changeURL('+pokemon.id+');');
    
    /*template.querySelector('.btn-more-info').setAttribute('id', 'pokemon-more-'+pokemon.id);
    const btn_more = template.querySelector('#pokemon-more-'+pokemon.id);
    btn_more.addEventListener('click', function(){
        alert('hola');
    });*/

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