import { getFirst150PokemonDetails, fillModal } from "./roberto.js";
import { cardsPokemon, showLoading, searchByName, searchByType } from "./mario.js";
import { getPokemonByName } from "./david.js";
import { initModal } from "./luis.js";

showLoading();

(async () => {
  try {
    const pokemons = await getFirst150PokemonDetails();
    cardsPokemon(pokemons);
    document.querySelector("#searchPokemon").addEventListener("input", (e) => {
    searchByName(pokemons, e.target.value);
  });

  // Buscar por tipo
  document.querySelector("#filterType").addEventListener("change", (e) => {
    searchByType(pokemons, e.target.value);
  });
    const { openModal } = initModal("openBtn", "modal", "overlay", "closeBtn");
    document.addEventListener("click", (e) => {
      if (e.target.closest(".openBtn")) {
        openModal();
        const btn = e.target.closest(".openBtn");
        const pokemonName = btn.dataset.pokemon;
        fillModal(pokemonName, getPokemonByName);
      }
    });
  } catch (error) {
    // viewCards.innerHTML = `
    //   <p class="text-red-600 font-semibold">Error al cargar los Pokémon 😢</p>
    // `;
    console.error(error);
  }
})();
