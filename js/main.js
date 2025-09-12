import { getFirst150PokemonDetails, fillModal } from "./roberto.js";
import {
  cardsPokemon,
  showLoading,
  searchByName,
  searchByType,
  debounce,
} from "./mario.js";
import { getPokemonByName } from "./david.js";
import { initModal } from "./luis.js";

showLoading();

(async () => {
  try {
    const pokemons = await getFirst150PokemonDetails();
    cardsPokemon(pokemons);
    const handleSearchByName = debounce((value) => {
      const filtered = searchByName(pokemons, value);
      cardsPokemon(filtered);
    }, 300);

    document.querySelector("#searchPokemon").addEventListener("input", (e) => {
      handleSearchByName(e.target.value);
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
