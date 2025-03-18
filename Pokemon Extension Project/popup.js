let id = '1';
let currentPokemon = {};
let currentPokemonAttacks = [];

//Shuffle Pokemon id
const shuffleId = () => {
    const newId = String(Math.floor(Math.random() * 1000));
    id = newId;
    console.log('ID', id);
};

// Fetch Pokemon
const fetchPokemon = async () => {
    shuffleId();
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        currentPokemon = await response.json();
        console.log('POKEMON:', currentPokemon);
        await getMoves();
        setPokemon();
    } catch (error) {
        alert(error.message);
    }
};

// Set the new Pokemon details 
const setPokemon = () => {
    const name = document.getElementById('name');
    const hp = document.getElementById('hp');
    const image = document.getElementById('image');

    const attack1_title = document.getElementById('attack1_title');
    const attack2_title = document.getElementById('attack2_title');

    const attack1_desc = document.getElementById('attack1_desc');
    const attack2_desc = document.getElementById('attack2_desc');

    const attack1_accuracy = document.getElementById('attack1_accuracy');
    const attack2_accuracy = document.getElementById('attack2_accuracy');

    const ability1_value = document.getElementById('ability1_value');
    const ability2_value = document.getElementById('ability2_value');
    const ability3_value = document.getElementById('ability3_value');

    name.textContent = currentPokemon?.name;
    hp.textContent = `${currentPokemon?.stats[0]?.base_stat} HP`;
    image.setAttribute('src', currentPokemon?.sprites?.front_default)

    attack1_title.textContent = currentPokemonAttacks[0]?.name.split('-').join(' ');
    attack2_title.textContent = currentPokemonAttacks[1]?.name.split('-').join(' ');

    attack1_accuracy.textContent = currentPokemonAttacks[0]?.accuracy;
    attack2_accuracy.textContent = currentPokemonAttacks[1]?.accuracy;

    attack1_desc.textContent = currentPokemonAttacks[0]?.description;
    attack2_desc.textContent = currentPokemonAttacks[1]?.description;

    ability1_value.textContent = currentPokemon?.stats[1]?.base_stat;
    ability3_value.textContent = currentPokemon?.stats[3]?.base_stat;
    ability3_value.textContent = currentPokemon?.stats[5]?.base_stat;
};

// Select 2 random moves and collect details
const getMoves = async () => {
    const totalMoves = currentPokemon?.moves?.length;

    // Setup two object to store move information
    let move1 = {
        name: '',
        accuracy: null,
        discription: '',
        url: '',
    };
    let move2 = {
        name: '',
        accuracy: null,
        discription: '',
        url: '',
    };

    //Select 2 random moves from moves list
    const randomMove1 = currentPokemon?.moves[Math.floor(Math.random() * totalMoves) - 1];
    const randomMove2 = currentPokemon?.moves[Math.floor(Math.random() * totalMoves) - 1];

    //Set move names and url
    move1 = {
        ...move1,
        name: randomMove1?.move?.name,
        url: randomMove1?.move?.url,
    };
    move2 = {
        ...move2,
        name: randomMove2?.move?.name,
        url: randomMove2?.move?.url,
    };

    try {
        const move1Response = await fetch(move1?.url)
        const move2Response = await fetch(move2?.url)
        if (!move1Response.ok) {
            throw new Error (`Response status: ${move1Response.status}`);
        }
        if (!move2Response.ok) {
            throw new Error (`Response status: ${move2Response.status}`);
        }

        const move1Data = await move1Response.json();
        const move2Data = await move2Response.json();

        console.log(move1Data);
        console.log(move2Data);

        move1 = {
            ...move1,
            description: move1Data?.flavor_text_entries?.find((entry) => entry.language.name === 'en')?.flavor_text,
            accuracy: move1Data?.accuracy,
        };
        move2 = {
            ...move2,
            description: move2Data?.flavor_text_entries?.find((entry) => entry.language.name === 'en')?.flavor_text,
            accuracy: move2Data?.accuracy,
        };

        console.log("Move1:", move1);
        console.log("Move2:", move2);

        currentPokemonAttacks = [move1, move2];
    } catch (error) {
        alert(error.message);
        fetchPokemon();
    }
};

fetchPokemon ();