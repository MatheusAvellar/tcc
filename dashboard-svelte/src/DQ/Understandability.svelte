<script>
import { Stable, Sconfig } from "../stores.js";

let table = $Stable;
let config = $Sconfig;
</script>

<ul>
{#each config[table] as c}
  <li>
    <p class="column-name">
      <b>{c.name}</b>
      {#if c.unit !== "n/a"}
        (<span>{c.unit}</span>)
      {:else}
        <span class="warn-2">(sem unidade)</span>
      {/if}
    </p>
    {#if c.description}
      <p class="description">{c.description}</p>
    {:else}
      <p class="description warn-2">(sem descrição)</p>
    {/if}
  </li>
{/each}
</ul>

<style>
.column-name, .description {
  padding: 0 .5em;
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