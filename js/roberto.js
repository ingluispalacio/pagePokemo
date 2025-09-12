import { getPokemonByName } from "./david.js";

/**
 * Nombre:getFirst150PokemonDetails
 * Parametros: Ninguno
 * Devuelve: Los primeros 150 pokemones de la Api con sus detalles de nombre, imagen, tipos peso y altura
 * Descripcion: Busca en la primer url de la Api para obtener cada nombre con sus especificaciones, después obtiene
 * los detalles de cada pokemon haciendo un map para recorrer cada uno,
 */

async function getFirst150PokemonDetails() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");

    if (!response.ok) {
      throw new Error("Error al cargar la lista de Pokémon");
    }

    const data = await response.json();

    // Fetch details for each Pokémon
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);

        if (!res.ok) {
          throw new Error(`Error al cargar datos de ${pokemon.name}`);
        }

        const details = await res.json();

        return {
          name: details.name,
          image: details.sprites.other["official-artwork"].front_default,
          types: details.types.map((t) => t.type.name),
        };
      })
    );

    return pokemonDetails;
  } catch (error) {
    console.error("Error encontrando al Pokémon:", error.message);
    return [];
  }
}

/**
 * Nombre:getFullPokemonInfo
 * Parametros: nombre del poquemon y función para encontrar los url del pokemón dado
 * Devuelve: Todos los detalles del pokemón que se recibirá en la pokdex
 * Descripcion: Incluida en lineas de código
 */

async function getFullPokemonInfo(name, getPokemonByNameCallback) {
  try {
    /* Obtener usando la función de david */
    const data = await getPokemonByNameCallback(name);

    /* Obtener las especies que hay */
    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();

    /* Obtiene la url de la cadena de evoluciones*/
    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();

    /* Sacar cada uno de los tipos con sus urls y asignarlos a cada una de las promesas */
    const types = data.types.map((t) => t.type.name);
    const typeDataPromises = data.types.map((t) =>
      fetch(t.type.url).then((res) => res.json())
    );
    const typeDataArray = await Promise.all(typeDataPromises);

    /* Va guardand las debilidades en un arreglo nuevo que se obtienen de los datos de type */
    const weaknesses = [];

    typeDataArray.forEach((typeData) => {
      typeData.damage_relations.double_damage_from.forEach((type) => {
        if (!weaknesses.includes(type.name)) {
          weaknesses.push(type.name);
        }
      });
    });

    /* Obtener la categoria en español si no lo encuentra pone desconocido*/
    const genus =
      speciesData.genera.find((g) => g.language.name === "es")?.genus ||
      "Desconocido";

    /* De la parte de cada evolución creamos un arreglo ************************************ */
    let evolutions = [];

    async function getEvolutionsWithImages(chain) {
      const evoList = [];

      async function traverse(chainNode) {
        const name = chainNode.species.name;
        try {
          const evoData = await getPokemonByNameCallback(name);
          evoList.push({
            name: name,
            image: evoData.sprites.front_default,
          });
        } catch (err) {
          evoList.push({ name: name, image: null });
        }

        if (chainNode.evolves_to.length > 0) {
          await traverse(chainNode.evolves_to[0]);
        }
      }

      await traverse(chain);
      return evoList;
    }

    evolutions = await getEvolutionsWithImages(evoData.chain);

    /* Obtener imagenes atras y adelante */
    const images = {
      front: data.sprites.front_default,
      back: data.sprites.back_default,
    };

    /* Sacar cada una de las especificaciones que faltan en otro objeto para pon */
    const stats = {};
    data.stats.forEach((stat) => {
      stats[stat.stat.name] = stat.base_stat;
    });

    /* Meter cada una de las habilidades en un nuevo arreglo */
    const abilities = data.abilities.map((a) => a.ability.name);

    /* Poner la altura y peso en kg y m */
    const height = `${data.height / 10} m`;
    const weight = `${data.weight / 10} kg`;

    /* Construir el objeto final */
    return {
      name: data.name,
      images: images,
      height: height,
      wheight: weight,
      category: genus,
      abilities: abilities,
      types: types,
      weakness: weaknesses,
      stats: stats,
      evolutions,
    };
  } catch (error) {
    console.error("Error al obtener la info completa del Pokémon:", error);
    return null;
  }
}

export { getFirst150PokemonDetails, getFullPokemonInfo };
