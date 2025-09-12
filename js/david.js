/**
 * Nombre:getPokemonByName
 * Parametros:name
 * Devuelve:Un objeto con los datos de un pokemon
 * Descripcion:consulta los datos de un nombre y devuelve los datos relacionados
 */
async function getPokemonByName(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  const data = await response.json();
  return data;
}
export {getPokemonByName};