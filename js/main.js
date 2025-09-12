import { getFirst150PokemonDetails } from './roberto.js'
import { cardsPokemon, showLoading } from './mario.js'
import { initModal } from './luis.js'


showLoading();

(async () => {
  try {
    const pokemons = await getFirst150PokemonDetails();

    // Cuando llegan los datos, renderiza
    cardsPokemon(pokemons);
    initModal("openBtn", "modal", "overlay", "closeBtn");
  } catch (error) {
    viewCards.innerHTML = `
      <p class="text-red-600 font-semibold">Error al cargar los Pokémon 😢</p>
    `;
    console.error(error);
  }
})();