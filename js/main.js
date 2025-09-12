import { getFirst150PokemonDetails, fill } from './roberto.js'
import { cardsPokemon, showLoading } from './mario.js'
import { getPokemonByName } from './david.js'
import { initModal } from './luis.js'



showLoading();

(async () => {
  try {
    const pokemons = await getFirst150PokemonDetails();
    cardsPokemon(pokemons);
    initModal("openBtn", "modal", "overlay", "closeBtn");
    document.addEventListener("click", (e) => {
      if (e.target.closest(".openBtn")) {
        const btn = e.target.closest(".openBtn");
        const pokemonName = btn.dataset.pokemon; 
        fill(pokemonName, getPokemonByName);
      }
    });
  } catch (error) {
    viewCards.innerHTML = `
      <p class="text-red-600 font-semibold">Error al cargar los Pokémon 😢</p>
    `;
    console.error(error);
  }
})();