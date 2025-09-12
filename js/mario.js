function renderCards(page, pokemons, perPage) {
    const viewCards = document.querySelector("#conteinerCards");
    viewCards.innerHTML = ""; // Limpiar antes de insertar

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pagePokemons = pokemons.slice(start, end);

    pagePokemons.forEach((pokemon) => {
        let { name, height, image, types, weight } = pokemon;
        name = name.charAt(0).toUpperCase() + name.slice(1);

        let labelTypes = "";
        types.forEach((type) => {
            labelTypes += `
                <p class="text-white bg-gray-600 rounded-full w-20 flex items-center justify-center">
                    ${type}
                </p>`;
        });

        viewCards.innerHTML += `
            <div class="border-1 border-gray-400 bg-linear-to-b from-gray-500 to-gray-900 h-90 w-60 gap-3 rounded-lg flex flex-col items-center justify-center">
                <div class="w-full flex items-center justify-between">
                    <h2 class="text-white w-full mx-4 bg-black/50 text-md font-bold rounded-full flex items-center justify-center">
                        ${name}
                    </h2>
                </div>
                <div class="h-50 w-50 contain-content flex items-center justify-center rounded-lg">
                    <img src="${image}" alt="${name}">
                </div>
                <section class="w-45 flex items-center justify-between">
                    ${labelTypes}
                </section>
                <button class="hover:cursor-pointer hover:bg-red-500 hover:scale-110 transition duration-150 text-white h-8 w-40 bg-red-800 hover:border-red-400 border-1 border-red-500 text-sm font-bold rounded-full flex items-center justify-center gap-2">
                    POKEDEX
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6ZM7.5 6h.008v.008H7.5V6Zm2.25 0h.008v.008H9.75V6Z" />
                    </svg>
                </button>
            </div>
        `;
    });
}

function renderPagination(currentPage, totalPages) {
    const pagination = document.querySelector("#pagination");
    pagination.innerHTML = "";

    // Botón anterior
    pagination.innerHTML += `
        <button onclick="changePage(${currentPage - 1})"
            class="px-3 py-1 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-200'}"
            ${currentPage === 1 ? 'disabled' : ''}>
            &lt;
        </button>`;

    // Números de página
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            pagination.innerHTML += `<button class="px-3 py-1 rounded-lg bg-gray-600/50 text-white">${i}</button>`;
        } else {
            pagination.innerHTML += `<button onclick="changePage(${i})" class="px-3 py-1 rounded-lg hover:bg-gray-200">${i}</button>`;
        }
    }

    // Botón siguiente
    pagination.innerHTML += `
        <button onclick="changePage(${currentPage + 1})"
            class="px-3 py-1 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-200'}"
            ${currentPage === totalPages ? 'disabled' : ''}>
            &gt;
        </button>`;
}

function cardsPokemon(arrayPokemons) {
    let currentPage = 1;
    const perPage = 10;
    const totalPages = Math.ceil(arrayPokemons.length / perPage);

    // Inicialización
    renderCards(currentPage, arrayPokemons, perPage);
    renderPagination(currentPage, totalPages);

    // Cambiar página
    window.changePage = function(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderCards(currentPage, arrayPokemons, perPage);
        renderPagination(currentPage, totalPages);
    };
}

export { cardsPokemon };