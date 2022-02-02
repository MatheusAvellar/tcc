<script>
import { Stable, Sconfig, Scurrentness } from "../stores.js";
import { getContext } from "svelte";

const URL = getContext("URL");

let tablename = $Stable;
let currentness = $Scurrentness;
let config = $Sconfig;

$: {
  // Fetches recent examples of dates
  fetchRealPrecision(tablename, config);
}

async function fetchRealPrecision(table, config) {
  if($Scurrentness.length > 0)
    return;

  if(!table || !config)
    return;

  const promises = [];
  config[table].forEach(col => {
    if(col.isdatetime)
      promises.push(fetch(`${URL}/distinct/${table}/${col.name}`));
  });

  const response = await Promise.all(promises);
  const readables = [];
  response.forEach(r => readables.push(r.json()));
  const jsons = await Promise.all(readables);
  const out = {};
  jsons.forEach(row => {
    row.data.forEach(i => {
      const key = Object.keys(i)[0];
      if(!out[key])
        out[key] = [];

      out[key].push(new Date(i[key]));
    });
  });
  Scurrentness.set(out);
  currentness = out;
  console.log(out);
}

function getDateDifference(datearray) {
  datearray.reverse();

  let min_diff = Infinity;
  let avg_diff = 0;
  let max_diff = 0;

  const l = datearray.length;
  for(let i = 1; i < l; i++) {
    const diff = datearray[i] - datearray[i-1];
    avg_diff += diff;
    if(diff > max_diff)
      max_diff = diff;
    if(diff < min_diff)
      min_diff = diff;
  }
  avg_diff /= (l-1);
  return [ formatDate(min_diff), formatDate(avg_diff), formatDate(max_diff) ];
}

function formatDate(ms) {
  const s = Math.round(ms/1000);
  const day  = ~~( s / (60 * 60 * 24));
  const hour = ~~((s % (60 * 60 * 24)) / (60 * 60));
  const min = ~~(((s % (60 * 60 * 24)) % (60 * 60)) / 60);
  const sec = ~~(((s % (60 * 60 * 24)) % (60 * 60)) % 60);
  let out = "";
  if(day > 0)  out += ` ${day} d `;
  if(hour > 0) out += ` ${hour} h `;
  if(min > 0)  out += ` ${min} min `;
  if(sec > 0)  out += ` ${sec} s`;
  return out;
}
</script>

<article>
  <p>
    As variáveis abaixo possuem valores de data e hora. Os primeiros 100
    intervalos entre cada medição foram analisados em três pontos:
    menor intervalo, maior intervalo, e média entre intervalos.
  </p>
  <ul>
    {#each Object.keys(currentness) as col}
    <li>
      <p class="column-name">{col}</p>
      {#await getDateDifference(currentness[col]) then diff}
        <p class="status">Menor intervalo: <b>{diff[0]}</b></p>
        <p class="status">Maior intervalo: <b>{diff[2]}</b></p>
        <p class="status">Média: <b>{diff[1]}</b></p>
      {/await}
    </li>
    {/each}
  </ul>
</article>

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