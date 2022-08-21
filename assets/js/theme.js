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
function getFirstPokemon() {
    const pokemons = JSON.parse(window.localStorage.getItem('pokemons'));
    return pokemons;
}

async function saveFirstPokemon(ids_pokemons) {
    window.localStorage.setItem('pokemons', JSON.stringify(ids_pokemons));
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
    //location.search = '?pokeID=' + id;

    //history.pushState("", document.title, '?pokeID=' + id);
    location.search = '?pokeID=' + id;
}

/* IMATGES */
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