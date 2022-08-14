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
        });
}

export async function getDataPokemon(url) {
    return fetch(url)
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
}