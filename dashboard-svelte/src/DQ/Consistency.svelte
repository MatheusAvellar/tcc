<script>
import { Stable, Sconfig, Sinconsistent } from "../stores.js";
import { getContext } from "svelte";

const URL = getContext("URL");

let config = $Sconfig;
let tablename = $Stable;

let consistency = [];

let inconsistent = $Sinconsistent;

$: {
  updateConfig(config);

  checkConsistency(tablename, consistency);
}

// Upon a config update, this will find the variables to be checked
function updateConfig(column_config) {
  let temp_consistency = [];

  column_config.forEach(c => {
    if("consistency" in c)
      temp_consistency.push(c);
  });

  consistency = temp_consistency;
}

async function checkConsistency(table, con_list) {
  if(!table) return;
  if(inconsistent.length > 0) return;

  const promises = [];
  con_list.forEach(c => {
    const in_cols = c.consistency.columns.join(c.consistency.operation);
    promises.push(
      fetch(`${URL}/consistent/${table}/${in_cols}/${c.name}`)
    );
  })

  const response = await Promise.all(promises);
  const readables = [];
  response.forEach(r => readables.push(r.json()));

  const jsons = await Promise.all(readables);
  const out = [];
  jsons.forEach(row => {
    out.push(row.data);
  });
  Sinconsistent.set(out);
  inconsistent = out;
}
// TODO: redundante; essa função já existe em Completeness.svelte
function format(num) {
  return Number(num).toLocaleString("en-US", { maximumFractionDigits: 2 });
}
</script>

<article>
  <h4>Variáveis com restrições de consistência</h4>
  <ul>
    {#each inconsistent as i}
      <li>
        <p class="column-name">
          Restrição: <b>{i.name}</b>
        </p>
        <p class="status {i.count > 0 ? "warn-4" : ""}">
          Quantidade de valores inconsistentes: <b>{format(i.count)}</b>
        </p>
        {#if i.count > 0}
          <p class="status">
            Maior divergência negativa: <b>{format(i.diff.negative)}</b>
            <!-- TODO: adicionar unidade? -->
          </p>
          <p class="status">
            Maior divergência positiva: <b>{format(i.diff.positive)}</b>
          </p>
        {/if}
      </li>
    {:else}
      <p>...</p>
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