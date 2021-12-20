<script>
import { Stables, Sconfig, Stable, Scolumns } from "./stores.js";
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
  if(Object.keys(config).length > 0)
    return;

  const config_response = await fetch(`${URL}/db.conf.json`)
  config = await config_response.json();
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
  }
  // Otherwise, if we already have the columns, return them
  else if($Scolumns && $Scolumns.length > 0) {
    console.log($Scolumns);
    return $Scolumns;
  }
  // If we don't have anything, fetch
  const response = await fetch(`${URL}/info/cols/${table}`)
  const cols = (await response.json()).columns;
  Scolumns.set(cols);
  return cols;
}

function getConfigType(name) {
  if(config[name] instanceof Array) {
    if(config[name].length > 2) {
      return "list";
    } else if(config[name].length == 2) {
      return "range";
    }
    return "N/A";
  }
  return null;
}

function getConfig(name, index) {
  if(config[name] instanceof Array) {
    if(index < 2) {
      return config[name][index];
    }
    return config[name];
  }
  return null;
}
</script>

<section>
  <label for="select-tables">Selecione uma das tabelas do banco de dados:</label>
  <select bind:value={tablename}>
    <option value="" selected disabled>Selecione</option>
    {#await fetchTables}
      <option disabled>Carregando...</option>
    {:then tables}
      {#each tables as table}
        <option>{table.name}</option>
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
        <div>
          {#if getConfigType(column.name) == "range"}
            <p>
              Valores são permitidos entre:
              <span class="value-min">{getConfig(column.name, 0)}</span>&nbsp;e&nbsp;<span class="value-max">{getConfig(column.name, 1)}</span>
            </p>
          {:else if getConfigType(column.name) == "list"}
            <p>Lista de valores permitidos: <span class="value-list">{getConfig(column.name, 2)}</span></p>
          {:else}
            <p>Sem restrição definida.</p>
          {/if}
        </div>
      </li>
    {/each}
    </ul>
  {/await}
</section>

<style>
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
.column-name, .value-min, .value-max {
  font-weight: bold;
}
</style>