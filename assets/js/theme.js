/* THEME (DARK & LIGHT) */
const body = document.querySelector('#main-body');

let theme = window.localStorage.getItem('theme');
if ( ! theme ) { 
    theme = 'light';
}

selectTheme(theme);

const radios_theme = document.querySelectorAll('input[name="theme"]');

radios_theme.forEach( x => {
    x.addEventListener('change', function() {
        selectTheme(this.value);
    });
});

function selectTheme(color) {
    switch (color) {
        case 'dark':
            console.log('dark');

            // Es clica el botó light
            const btn_dark = document.querySelector('#dark_theme');
            btn_dark.checked = true;

            body.classList.add('dark');
            body.classList.remove('light');
            window.localStorage.setItem('theme','dark');
            break;

        case 'light':
        default:
            console.log('light');

            // Es clica el botó light
            const btn_light = document.querySelector('#light_theme');
            btn_light.checked = true;

            body.classList.add('light');
            body.classList.remove('dark');
            window.localStorage.setItem('theme','light');
            break;
    }
}

/* POKEMON */
// Manipula dades del localStorage
function getFirstPokemon() {
    const pokemons = JSON.parse(window.localStorage.getItem('pokemons'));
    return pokemons;
}

async function saveFirstPokemon(ids_pokemons) {
    window.localStorage.setItem('pokemons', JSON.stringify(ids_pokemons));
}

async function deleteFirstPokemon() {
    window.localStorage.removeItem('pokemons');
}

/* RANDOM ID's */
// Genera número aleatori
function getRandomId(max) {
    console.log('random');
    return Math.floor(Math.random() * max);
}

/* URLs */
/*
function clearParamsURL() {
    location.href = location.href.replace(location.search,'');
}
*/

/*
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
*/

// Canvia l'URL
function changeURL(id) {
    //history.pushState("", document.title, '?pokeID=' + id);
    location.search = '?pokeID=' + id;
}

/* LOADER */
// Mostrar spinner
// Status possibles -> Visible = 'flex'
//                  -> Ocult = 'none'
function loader(status) {
    const buttons = document.querySelector('button');
    
    // Deshabilitem o habilitem tots els botons de la pàgina
    if (status === 'flex') {
        buttons.disabled = true;
    } else {
        buttons.disabled = false;
    }

    const spinner = document.querySelector('.content-spinner');
    spinner.style.display = status;
}

/* IMATGES */
// Retorna l'icona del tipus del Pokémon
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