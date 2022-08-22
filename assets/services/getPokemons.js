// Controller
let controller = new AbortController();
let signal = controller.signal;

const isResponseOk = async (response) => {
    if (!response.ok)
        throw new Error(response.status);
        
    return await response.json();
}

export async function getDataAllPokemon(offset = 0, limit = 905) {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    
    return fetch(url)
        //.then((res) => isResponseOk(res))
        .then((res) => res.json())
        .then((response) => {
            const data = response
            return data;
        })
        .catch(err => console.error("ERROR: ", err.message));
}

export async function getDataPokemon(url) {
    return fetch(url, { signal: controller.signal })
		.then((res) => res.json())
		.then((response) => {
			const data = response
			/* const gifs = data.map((image) => {
				const { images, title, id } = image
				const { url } = image.images.downsized_medium
				return { title, id, url }
			}) */
			return data;
		})
        .catch(err => { 
            console.error("ERROR: ", err.message) 
            return '';
        });
}

/*
export async function abortRequest() {
    signal.addEventListener('abort', () => console.log("abort!"));
    console.log("abort");
}
*/