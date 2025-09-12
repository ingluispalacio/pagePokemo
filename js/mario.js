//Muestra un spinner mientras se espera datos de la Api
function showLoading() {
    const viewCards = document.querySelector("#conteinerCards");
    viewCards.innerHTML = `
    <div class="col-span-full flex justify-center items-center py-10">
      <div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <span class="ml-3 text-lg font-semibold text-gray-700">Cargando...</span>
    </div>
  `;
}
//Muestra una cantidad (10) de cards por pagina
function renderCards(page, pokemons, perPage) {
    const viewCards = document.querySelector("#conteinerCards");

    viewCards.innerHTML = "";

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pagePokemons = pokemons.slice(start, end);

    pagePokemons.forEach((pokemon) => {
        let { name, image, types } = pokemon;
        name = name.charAt(0).toUpperCase() + name.slice(1);

        let labelTypes = types
            .map(
                (type) => `
        <p class="text-white bg-gray-600 rounded-full px-3 py-1 text-xs font-semibold">
          ${type}
        </p>`
            )
            .join("");
        viewCards.innerHTML += `
        <div class="border border-gray-400 bg-gradient-to-b from-gray-500 to-gray-900 h-80 w-60 gap-3 rounded-lg flex flex-col items-center justify-center p-3 shadow-lg">
          <h2 class="text-white w-full mx-4 bg-black/50 text-md font-bold rounded-full flex items-center justify-center py-1">
            ${name}
          </h2>
          <div class="h-40 w-40 flex items-center justify-center">
            <img src="${image}" alt="${name}" class="max-h-full object-contain">
          </div>
          <section class="flex gap-2 flex-wrap justify-center">
            ${labelTypes}
          </section>
          <button data-pokemon="${name.toLowerCase()}" class="openBtn mt-2 hover:cursor-pointer hover:bg-red-500 hover:scale-105 transition duration-150 text-white h-8 w-40 bg-red-800 hover:border-red-400 border border-red-500 text-sm font-bold rounded-full flex items-center justify-center gap-2">
            POKEDEX
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25V18a2.25 2.25 0 0 0 2.25 
              2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 
              0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 
              2.25 0 0 1 21 6v2.25m-18 
              0h18M5.25 6h.008v.008H5.25V6ZM7.5 
              6h.008v.008H7.5V6Zm2.25 
              0h.008v.008H9.75V6Z" />
            </svg>
          </button>
        </div>
      `;
    });
}


//Crea los botones de la paginacion y la forma de visualizarlos
function renderPagination(currentPage, totalPages) {
    const pagination = document.querySelector("#pagination");
    pagination.innerHTML = "";

    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
    }

    // Boton anterior
    pagination.innerHTML += `
    <button onclick="changePage(${currentPage - 1})"
      class="px-3 py-1 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-200'}"
      ${currentPage === 1 ? 'disabled' : ''}>
      &lt;
    </button>`;

    //verifica si hay paginas antes
    if (start > 1) {
        pagination.innerHTML += `<button onclick="changePage(1)" class="px-3 py-1 rounded-lg hover:bg-gray-200">1</button>`;
        if (start > 2) {
            pagination.innerHTML += `<span class="px-2">...</span>`;
        }
    }

    //paginas que se ven
    for (let i = start; i <= end; i++) {
        if (i === currentPage) {
            pagination.innerHTML += `<button class="px-3 py-1 rounded-lg bg-gray-600/50 text-white">${i}</button>`;
        } else {
            pagination.innerHTML += `<button onclick="changePage(${i})" class="px-3 py-1 rounded-lg hover:bg-gray-200">${i}</button>`;
        }
    }

    //verifica si hay paginas despues
    if (end < totalPages) {
        if (end < totalPages - 1) {
            pagination.innerHTML += `<span class="px-2">...</span>`;
        }
        pagination.innerHTML += `<button onclick="changePage(${totalPages})" class="px-3 py-1 rounded-lg hover:bg-gray-200">${totalPages}</button>`;
    }

    //boton siguiente
    pagination.innerHTML += `
    <button onclick="changePage(${currentPage + 1})"
      class="px-3 py-1 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-200'}"
      ${currentPage === totalPages ? 'disabled' : ''}>
      &gt;
    </button>`;
}
//funcion principal que inicializa las cards y la paginacion
function cardsPokemon(arrayPokemons) {
    let currentPage = 1;
    const perPage = 6; // ahora de 6 en 6
    const totalPages = Math.ceil(arrayPokemons.length / perPage);

    // Inicializacion
    renderCards(currentPage, arrayPokemons, perPage);
    renderPagination(currentPage, totalPages);

    // Cambiar pagina
    window.changePage = function(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderCards(currentPage, arrayPokemons, perPage);
        renderPagination(currentPage, totalPages);
    };
}



export { cardsPokemon, showLoading };