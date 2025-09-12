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

const fillModal = async (name, callback) => {
  const modalbody = document.getElementById("bodyModalContent");
  modalbody.innerHTML = `
    <div class="flex flex-col items-center justify-center py-6">
      <div class="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-3 text-gray-700 font-semibold">Cargando información de ${name}...</p>
    </div>
  `;

  try {
    const data = await getFullPokemonInfo(name, callback);

    const stats = Object.entries(data.stats).map(([name, value]) => ({
      name,
      value,
    }));

    const types = data.types || [];
    const abilities = data.abilities || [];

    modalbody.innerHTML = `
      <!-- HEADER -->
      <div class="bg-red-400/90 flex flex-col sm:flex-row sm:justify-between items-center text-center sm:text-left px-4 py-2">
        <h1 id="pokemon-name" class="text-xl sm:text-3xl font-bold text-white capitalize">
          ${data.name}
        </h1>
      </div>

      <!-- MAIN -->
      <div class="p-4 sm:p-6 border-8 border-red-900">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Imagen + Stats -->
          <div class="flex justify-center items-center bg-red-50 border-2 p-4 sm:px-8 rounded-[8px]">
            <div class="bg-red-50 rounded-xl w-full flex flex-col items-center p-4 gap-4 overflow-hidden">
              
              <!-- Imagen -->
              <div class="bg-black w-full flex justify-center rounded-xl">
                <img id="pokemon-image" src="${data.images.front}" alt="${
      data.name
    }" class="w-1/2 sm:w-1/3"/>
              </div>

              <!-- Stats -->
              <div class="w-full mt-4">
                <h3 class="text-base sm:text-lg font-semibold text-black text-center mb-2">Puntos de base</h3>
                <div class="grid grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-center text-black">
                  ${stats
                    .map(
                      (stat) => `
                    <div>
                      <p class="capitalize">${stat.name}</p>
                      <div class="h-16 sm:h-20 bg-gray-200 relative rounded">
                        <div class="absolute bottom-0 left-0 w-full bg-green-500" 
                          style="height:${stat.value / 2}%"></div>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </div>

          <!-- Información -->
          <div class="space-y-4 bg-red-50 border-2 p-4 text-black rounded-[8px]">
            
            <!-- Caja info -->
            <div class="bg-black rounded-lg p-3 sm:p-4 text-sm sm:text-base text-white">
              <p><strong>Altura:</strong> ${data.height}</p>
              <p><strong>Peso:</strong> ${data.wheight}</p>
              <p><strong>Habilidades:</strong> ${abilities.join(", ")}</p>
            </div>

            <!-- Tipo -->
            <div>
              <h3 class="text-base sm:text-lg font-semibold">Tipo</h3>
              <div class="flex space-x-2 mt-2">
                ${types
                  .map(
                    (t) => `
                  <span class="px-2 sm:px-3 py-1 bg-green-400 text-xs sm:text-sm rounded capitalize">${t}</span>
                `
                  )
                  .join("")}
              </div>
            </div>

            <!-- Debilidad -->
            <div>
              <h3 class="text-base sm:text-lg font-semibold">Debilidad</h3>
              <div class="flex space-x-2 mt-2 flex-wrap">
                ${data.weakness
                  .map(
                    (w) => `
                  <span class="px-2 sm:px-3 py-1 bg-red-500 text-xs sm:text-sm rounded capitalize">${w}</span>
                `
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- Evoluciones -->
        <div class="mt-8 bg-green-600 border-2 rounded-xl">
          <h3 class="text-base sm:text-lg font-semibold text-white mb-4 text-center mt-1">Evoluciones</h3>
          <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 text-white mb-2">
            ${data.evolutions
              .map(
                (evo, idx) => `
              <div class="flex flex-col items-center">
                <img class="w-16 h-16 sm:w-20 sm:h-20" src="${
                  evo.image
                }" alt="${evo.name}" />
                <p class="text-xs sm:text-sm capitalize">${evo.name}</p>
              </div>
              ${
                idx < data.evolutions.length - 1
                  ? `<span class="text-xl sm:text-2xl">➡️</span>`
                  : ""
              }
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    modalbody.innerHTML = `
      <p class="text-red-600 font-semibold">Error al cargar la información de ${name} 😢</p>
    `;
    console.error(error);
  }
};

export { getFirst150PokemonDetails, fillModal };
