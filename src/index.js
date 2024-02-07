document.addEventListener("DOMContentLoaded", function () {
    let currentPokemonNumber = 1;
    const totalPokemons = 1025;
    const pokemonContainer = document.getElementById("pokemon-container");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const favoriteBtn = document.getElementById("favorite-btn");
    const favoritePokemonContainer = document.getElementById("favorite-pokemon");
    let favoritePokemons = JSON.parse(localStorage.getItem("favoritePokemons")) || [];

    function fetchAndDisplayPokemon() {
        fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemonNumber}`)
            .then(response => response.json())
            .then(data => {
                const pokemonName = data.name;
                const pokemonNumber = data.id;
                const pokemonImageURL = data.sprites.front_default;
                const pokemonTypes = data.types.map(type => type.type.name).join(', ');
                const pokemonWeight = data.weight;
                const pokemonStats = data.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', ');

                const pokemonInfoContainer = document.createElement("div");
                pokemonInfoContainer.classList.add("pokemon-container");
                pokemonInfoContainer.style.background = getColorByType(pokemonTypes);
                console.log("info:", pokemonTypes)
                pokemonInfoContainer.innerHTML = `
                    <h1>${pokemonName}</h1>
                    <p>N°: ${pokemonNumber}</p>
                    <p>Types: ${pokemonTypes}</p>
                    <p>Weight: ${pokemonWeight} kg</p>
                    <p>Stats: ${pokemonStats}</p>
                    <img src="${pokemonImageURL}" alt="${pokemonName}">`;

                pokemonContainer.innerHTML = "";
                pokemonContainer.appendChild(pokemonInfoContainer);
            })
            .catch(error => console.error(`Error fetching Pokémon ${currentPokemonNumber} data:`, error));
    }

    function handlePrevBtn() {
        if (currentPokemonNumber > 1) {
            currentPokemonNumber--;
        } else {
            currentPokemonNumber = totalPokemons;
        }
        fetchAndDisplayPokemon();
    }

    function handleNextBtn() {
        if (currentPokemonNumber < totalPokemons) {
            currentPokemonNumber++;
        } else {
            currentPokemonNumber = 1;
        }
        fetchAndDisplayPokemon();
    }

    function handleFavoriteBtn() {
        fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemonNumber}`)
            .then(response => response.json())
            .then(data => {
                const currentPokemon = {
                    name: data.name,
                    id: data.id,
                    types: data.types.map(type => type.type.name),
                    sprites: {
                        front_default: data.sprites.front_default,
                    },
                };

                if (!isPokemonFavorite(currentPokemon)) {
                    favoritePokemons.push(currentPokemon);
                    localStorage.setItem("favoritePokemons", JSON.stringify(favoritePokemons));
                }

                displayFavoritePokemons();
            })
            .catch(error => console.error(`Error fetching Pokémon ${currentPokemonNumber} data:`, error));
    }

    function createRemoveFavoriteBtn(pokemon) {
        const removeFavoriteBtn = document.createElement("button");
        removeFavoriteBtn.innerText = "Remove Favorite";
        removeFavoriteBtn.addEventListener("click", () => removeFavorite(pokemon));
        return removeFavoriteBtn;
    }

    function removeFavorite(pokemon) {
        favoritePokemons = favoritePokemons.filter(favPokemon => favPokemon.id !== pokemon.id);
        localStorage.setItem("favoritePokemons", JSON.stringify(favoritePokemons));
        displayFavoritePokemons();
    }

    function isPokemonFavorite(pokemon) {
        return favoritePokemons.some(favPokemon => favPokemon.id === pokemon.id);
    }

    function displayFavoritePokemons() {
        favoritePokemonContainer.innerHTML = "";

        favoritePokemons.forEach(pokemon => {
            const favoritePokemonInfo = document.createElement("div");
            favoritePokemonInfo.classList.add("pokemon-container");
            favoritePokemonInfo.style.background = getColorByType(pokemon.types);
            //console.log("Background: ", favoritePokemonInfo.style.background)
            favoritePokemonInfo.innerHTML = `
                <h1>${pokemon.name}</h1>
                <p>N°: ${pokemon.id}</p>
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            `;

            const removeFavoriteBtn = createRemoveFavoriteBtn(pokemon);
            favoritePokemonInfo.appendChild(removeFavoriteBtn);

            favoritePokemonContainer.appendChild(favoritePokemonInfo);
        });
    }

    function getColorByType(types) {
        const colors = {
        bug: '#A8B820',
        dark: '#705848',
        dragon: '#7038F8',
        electric: '#F8D030',
        fairy: '#EE99AC',
        fighting: '#C03028',
        fire: '#F08030',
        flying: '#A890F0',
        ghost: '#705898',
        grass: '#78C850',
        ground: '#E0C068',
        ice: '#98D8D8',
        normal: '#A8A878',
        poison: '#A040A0',
        psychic: '#F85888',
        rock: '#B8A038',
        steel: '#B8B8D0',
        water: '#6890F0'
    };

    // Obtener el primer tipo presente
    const type1 = types[0];

    // Obtener el segundo tipo presente (si existe)
    const type2 = types[1];

    // Asignar colores dependiendo de los tipos presentes
    console.log("types ##: ", types.length)
        if (types.length > 1) {
            console.log("More than 1 type")
            return `linear-gradient(to right, ${colors[type1]}, ${colors[type2]})`;
        } else {
        console.log("Just one type")
            return colors[type1];
        }
    }

    prevBtn.addEventListener("click", handlePrevBtn);
    nextBtn.addEventListener("click", handleNextBtn);
    favoriteBtn.addEventListener("click", handleFavoriteBtn);

    fetchAndDisplayPokemon();
    displayFavoritePokemons();
});
