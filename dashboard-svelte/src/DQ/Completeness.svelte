<script>
import { Stable, Scolumns, Stotal_rows, Snot_nulls } from "../stores.js";
import { getContext } from "svelte";

const URL = getContext("URL");

let total_rows = $Stotal_rows;
let not_nulls = $Snot_nulls;

let tablename = $Stable;
let columns = $Scolumns;

$: {
  // Fetches not nulls
  fetchNotNulls(tablename, columns);
  fetchRowCount(tablename);
}

async function fetchNotNulls(table, columns) {
  if(Object.keys(not_nulls).length > 0)
    return;

  if(!table || !columns)
    return;

  const notnullpromises = [];
  columns.forEach(col => {
    notnullpromises.push(fetch(`${URL}/count/${table}/${col.name}/!/null`));
  });

  const response = await Promise.all(notnullpromises);
  const readables = [];
  response.forEach(r => readables.push(r.json()));
  const jsons = await Promise.all(readables);
  jsons.forEach(row => {
    not_nulls[getColumnName(row.data[0])] = getColumnValue(row.data[0]);
  });
  Snot_nulls.set(not_nulls);
  not_nulls = not_nulls;
}

async function fetchRowCount(table) {
  if(!table || total_rows > 0)
    return;

  const response = await fetch(`${URL}/count/${table}`);
  const count = (await response.json()).count;
  Stotal_rows.set(count);
  total_rows = count;
}

function getColumnName(obj) {
  return Object.keys(obj)[0].split("-")[0];
}
function getColumnValue(obj) {
  return Object.values(obj)[0];
}
function getNotNullCount(col) {
  return format(  not_nulls[col]  );
}
function getPercentage(col, total) {
  return format(
    (not_nulls[col] / total)*100
  );
}
function getClass(percentage) {
  const classes = ["warn-0", "warn-1", "warn-2", "warn-3", "warn-4"];
  const scores = [ 100, 75, 50, 25, 0 ];
  for(let i = 0; i < 5; i++) {
    if(percentage >= scores[i])
      return classes[i];
  }
  return "what";
}
function format(num) {
  return Number(num).toLocaleString("en-US", { maximumFractionDigits: 2 });
}
</script>

<!-- TODO: ordenar por completude? -->
<ul>
{#each Object.keys(not_nulls) as col}
  <li>
    <p class="column-name">{col}</p>
    <p class="status {getClass(getPercentage(col, total_rows))}">
      {getNotNullCount(col)}&nbsp;/&nbsp;{format(total_rows)}
      (<strong>{getPercentage(col, total_rows)}%</strong>)
    </p>
  </li>
{:else}
  <p>Carregando...</p>
{/each}
</ul>

<style>
.column-name {
  font-weight: bold;
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
</style>