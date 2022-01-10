<script>
import { Stable, Sconfig, Sout_of_range, Sout_of_list, Sdoor } from "../stores.js";
import { getContext } from "svelte";

const URL = getContext("URL");

let config = $Sconfig;
let tablename = $Stable;
let out_of_range = $Sout_of_range;
let out_of_list = $Sout_of_list;

// Distinct Out Of Range
let door = $Sdoor;

let range = [];
let list = [];
let any = [];

$: {
  updateConfig(config, tablename);

  checkRanged(tablename, range);
  checkList(tablename, list);

  fetchDistinctRanged(tablename, out_of_range);
}

// Upon a config update, this will refresh the ranged and listed variables
// to be rechecked afterwards
function updateConfig(column_config, tablename) {
  let temp_range = [];
  let temp_list = [];
  let temp_any = [];

  column_config[tablename].forEach(c => {
    if(c.type == "range")
      temp_range.push(c);
    else if(c.type == "list")
      temp_list.push(c);
    else if(c.type == "any")
      temp_any.push(c);
  });

  range = temp_range;
  list = temp_list;
  any = temp_any;
}

// Check for out-of-range values in ranged variables
async function checkRanged(table, range) {
  if(!table) return;
  if(Object.keys(out_of_range).length > 0) return;

  const promises = [];
  range.forEach(r => {
    promises.push(
      fetch(`${URL}/count/${table}/${r.name}/!/${r.value[0]}/${r.value[1]}`)
    );
  })

  const response = await Promise.all(promises);
  const readables = [];
  response.forEach(r => readables.push(r.json()));

  const jsons = await Promise.all(readables);
  const out = {};
  jsons.forEach(row => {
    const key = Object.keys(row.data[0])[0].slice(0, -6);
    const value = row.data[0][`${key}-count`];
    out[key] = value;
  });
  Sout_of_range.set(out);
  out_of_range = out;
}

// Check for unexpected values in listed variables
async function checkList(table, list) {
  if(!table) return;
  if(Object.keys(out_of_list).length > 0) return;

  const promises = [];
  list.forEach(r => {
    promises.push(
      fetch(`${URL}/count/${table}/${r.name}/!/list/${r.value.join(",")}`)
    );
  })

  const response = await Promise.all(promises);
  const readables = [];
  response.forEach(r => readables.push(r.json()));

  const jsons = await Promise.all(readables);
  const out = {};
  jsons.forEach(row => {
    const key = Object.keys(row.data[0])[0].slice(0, -6);
    const value = row.data[0][`${key}-count`];
    out[key] = value;
  });
  Sout_of_list.set(out);
  out_of_list = out;
}

// Fetch values outside of a ranged variable's range
async function fetchDistinctRanged(table, oor) {
  if(Object.keys(door).length > 0) return;

  const promises = [];
  Object.keys(oor).forEach(k => {
    if(oor[k] > 0) {
      for(let i of range) {
        if(i.name === k) {
          promises.push(
            fetch(`${URL}/distinct/${table}/${k}/${i.value[0]}/${i.value[1]}`)
          );
          break;
        }
      }
    }
  })

  const response = await Promise.all(promises);
  const readables = [];
  response.forEach(r => readables.push(r.json()));

  const jsons = await Promise.all(readables);
  const out = {};
  jsons.forEach(row => {
    row.data.forEach(d => {
      const key = Object.keys(d)[0];
      const value = d[key];
      if(!out[key])
        out[key] = [];
      out[key].push(value);
    });
  });

  Sdoor.set(out);
  door = out;
}
</script>

<article>
  <h4>Variáveis de intervalo</h4>
  <ul>
    {#each range as r}
      <li>
        <p class="column-name">
          <b>{r.name}</b>
          <span title="Intervalo permitido">[{r.value.join(", ")}]</span>
        </p>
        {#if out_of_range[r.name] !== undefined}
          {#if out_of_range[r.name] === 0}
            <p class="status">Nenhum valor fora do intervalo.</p>
          {:else if out_of_range[r.name] === 1}
            <p class="status warn-4"><b>1</b> valor fora do intervalo.</p>
          {:else}
            <p class="status warn-4">
              <b>{out_of_range[r.name]}</b> valores fora do intervalo.
            </p>
          {/if}
          {#if door[r.name]}
            <p class="status">
              Foram encontrados os seguintes valores fora do intervalo:
              <b>{door[r.name].join(", ")}</b>.
            </p>
          {/if}
        {:else}
          <p class="status">Carregando...</p>
        {/if}
      </li>
    {/each}
  </ul>
</article>
<article>
  <h4>Variáveis discretas</h4>
  <ul>
    {#each list as l}
      <li>
        <p class="column-name">
          <b>{l.name}</b>
          (<span class="list">{l.value.join(", ")}</span>)
        </p>
        {#if out_of_list[l.name] !== undefined}
          {#if out_of_list[l.name] === 0}
            <p class="status">Nenhum valor inesperado.</p>
          {:else if out_of_list[l.name] === 1}
            <p class="status warn-4"><b>1</b> valor inesperado.</p>
          {:else}
            <p class="status warn-4">
              <b>{out_of_list[l.name]}</b> valores inesperados.
            </p>
          {/if}
          <!-- TODO: adicionar quais valores inesperados foram encontrados? -->
        {:else}
          <p class="status">Carregando...</p>
        {/if}
      </li>
    {:else}
      Nada aqui! :)
    {/each}
  </ul>
</article>
<article>
  <h4>Variáveis sem restrições</h4>
  <ul>
    {#each any as a}
      <li>
        <p class="column-name">
          <b>{a.name}</b>
        </p>
      </li>
    {/each}
  </ul>
</article>

<style>
h4 {
  margin: .75em 0 .5em
}
.column-name {
  padding: 0 .5em;
}
.status {
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

.list {
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 10em;
  white-space: nowrap;
  overflow: hidden;
  vertical-align: text-bottom;
}
</style>