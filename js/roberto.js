/**
 * Nombre:getFirst150PokemonDetails
 * Parametros: Ninguno
 * Devuelve: Los primeros 150 pokemones de la Api con sus detalles de nombre, imagen, tipos peso y altura
 * Descripcion: Busca en la primer url de la Api para obtener cada nombre con sus especificaciones, después obtiene
 * los detalles de cada pokemon haciendo un map para recorrer cada uno,
 */

async function getFirst150PokemonDetails() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150')

    if (!response.ok) {
      throw new Error('Error al cargar la lista de Pokémon')
    }

    const data = await response.json()

    // Fetch details for each Pokémon
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url)

        if (!res.ok) {
          throw new Error(`Error al cargar datos de ${pokemon.name}`)
        }

        const details = await res.json()

        return {
          name: details.name,
          image: details.sprites.other['official-artwork'].front_default,
          types: details.types.map((t) => t.type.name),
          height: `${details.height / 10} m`,
          weight: `${details.weight / 10} kg`,
        }
      })
    )

    return pokemonDetails
  } catch (error) {
    console.error('Error encontrando al Pokémon:', error.message)
    return []
  }
}

export { getFirst150PokemonDetails }
