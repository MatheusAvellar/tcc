<script>
import { Stables, Stable, Sconfig, Scolumns, Stotal_rows,
Sout_of_range, Sout_of_list, Sdoor, Snot_nulls,
Sinconsistent, Scurrentness, Sprecision } from "./stores.js";
import { getContext } from "svelte";

const URL = getContext("URL");

const fetchTables = (async () => {
  if($Stables && $Stables.length > 0)
    return $Stables;

  const response = await fetch(`${URL}/info/tables`)
  const tables = (await response.json()).tables;
  Stables.set(tables);
  return tables;
})();

let config = $Sconfig;
(async () => {
  if(config.length > 0)
    return;

  const config_response = await fetch(`${URL}/db.conf.json`)
  config = (await config_response.json()).config;
  Sconfig.set(config);
})();

// Holds the currently selected table name
let tablename = $Stable;

// Promise to be iterated
let columns;
$: {
  // <select> triggers column fetch
  columns = fetchColumns(tablename);
}

async function fetchColumns(table) {
  if(!table || table.length <= 0) {
    return [];
  }

  // If selected table is different, update it
  if(table != $Stable) {
    Stable.set(table);
    Scolumns.set([]);
    Stotal_rows.set(0);
    Sout_of_range.set({});
    Sout_of_list.set({});
    Sdoor.set({});
    Snot_nulls.set({});
    Sinconsistent.set([]);
    Scurrentness.set({});
    Sprecision.set({});
  }

  // Otherwise, if we already have the columns, return them
  else if($Scolumns && $Scolumns.length > 0) {
    return $Scolumns;
  }
  // If we don't have anything, fetch
  const response = await fetch(`${URL}/info/cols/${table}`)
  const cols = (await response.json()).columns;
  Scolumns.set(cols);
  return cols;
}
</script>

<h2>Configuração</h2>
<section>
  <label for="select-tables">Selecione uma das tabelas do banco de dados:</label>
  <!-- FIXME: quando recarrega o componente, ele "seleciona" a primeira opção,
    independente da escolha anterior -->
  <select bind:value={tablename}>
    <option value="" selected disabled>Selecione</option>
    {#await fetchTables}
      <option disabled>Carregando...</option>
    {:then tables}
      {#each tables as table}
        {#if table.name === tablename}
          <option selected>{table.name}</option>
        {:else}
          <option>{table.name}</option>
        {/if}
      {:else}
        <option disabled>Opa! :(</option>
      {/each}
    {/await}
  </select>
</section>
<section>
  {#await columns}
    <p>Carregando...</p>
  {:then columns}
    <p>Essas são as colunas da tabela selecionada:</p>
    <ul>
    {#each columns as column}
      <li>
        <p>
          <span class="column-name">{column.name}</span>
          (<span class="column-type">{column.type}</span>)
        </p>
      </li>
    {/each}
    </ul>
  {/await}
</section>

<style>
h2 {
  margin: 0 0 1rem;
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
  padding: 0.25em 0.5em;
}
li p {
  margin: 0;
}
.column-name {
  font-weight: bold;
}
</style>