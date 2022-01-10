<script>
import { Stable, Scolumns, Sprecision } from "../stores.js";
import { getContext } from "svelte";

const URL = getContext("URL");

let tablename = $Stable;
let columns = $Scolumns;
let precision = $Sprecision;

$: {
  // Fetches precision of REAL columns
  fetchRealPrecision(tablename, columns);
}

async function fetchRealPrecision(table, columns) {
  if(Object.keys($Sprecision).length > 0)
    return;

  if(!table || !columns)
    return;

  const promises = [];
  columns.forEach(col => {
    if(col.type === "REAL")
      promises.push(fetch(`${URL}/precision/${table}/${col.name}`));
  });

  const response = await Promise.all(promises);
  const readables = [];
  response.forEach(r => readables.push(r.json()));
  const jsons = await Promise.all(readables);
  const out = {};
  jsons.forEach(row => {
    const obj = row.data[0];
    const orgkey = Object.keys(obj)[0];
    const key = orgkey.split("-")[0];
    const value = obj[orgkey];
    out[key] = value;
  });
  Sprecision.set(out);
  precision = out;
}
</script>

<article>
  <h4>Variáveis com casas decimais</h4>
  <p>
    Esta é uma lista da maior precisão encontrada, em número de casas decimais,
    de todas as colunas de tipo ponto flutuante (REAL).
  </p>
  <ul>
  <!-- TODO: melhorar essa visualização aqui -->
  {#each Object.keys(precision) as col}
    <li>
      <p class="column-name">{col}</p>
      {#if precision[col] < 2}
        <p class="status">{precision[col]} casa decimal</p>
      {:else}
        <p class="status">{precision[col]} casas decimais</p>
      {/if}
    </li>
  {:else}
    <p>Carregando...</p>
  {/each}
  </ul>
  <h4>Variáveis sem casas decimais</h4>
  <p>
    Abaixo estão as variáveis que não possuem casas decimais, por serem do
    tipo inteiro (INTEGER), texto (TEXT) ou outro.
  </p>
  <ul>
    {#each columns as col}
      {#if col.type !== "REAL"}
        <li>
          <p class="column-name">{col.name}</p>
          <p class="column-type">Possui tipo {col.type}</p>
        </li>
      {/if}
    {:else}
      <p>Carregando...</p>
    {/each}
  </ul>
</article>

<style>
.column-name {
  font-weight: bold;
  padding: 0 .5em;
}
.status, .column-type {
  padding: .25em .5em;
}

ul, li {
  margin: 0;
  list-style: none;
}
ul {
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: .5em;
}
@media screen and (max-width: 750px) {
  ul {
    grid-template-columns: 1fr 1fr;
  }
}
@media screen and (max-width: 550px) {
  ul {
    grid-template-columns: 1fr;
  }
}
li {
  background-color: #f9f9f9;
  padding: 0.25em 0;
}
li p {
  margin: 0;
}
</style>