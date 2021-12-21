<script>
import { Stable } from "./stores.js";
let tablename = $Stable;

export let name;

let loaded = false;
function clicked() {
  loaded = true;
}
</script>

<details>
  <summary>
    <h3>{name}</h3>
  </summary>
  <slot name="description"/>
  {#if !tablename}
    <p> Aguardando a seleção de uma tabela </p>
  {:else}
    {#if !loaded}
      <button on:click={clicked}>Clique para analisar</button>
    {:else}
      <slot name="content"/>
    {/if}
  {/if}
</details>

<style>
h3 {
  display: inline-block;
  margin: 0;
  user-select: none;
  cursor: pointer;
}
button {
  display: inline-block;
  background: unset;
  border: 0;
  padding: 0;
  color: #0089c7;
  cursor: pointer;
}
button:hover {
  text-decoration: underline;
}
</style>