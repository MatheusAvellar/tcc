<script>
import { Stable, Scolumns, Sconfig } from "../stores.js";
import { getContext } from "svelte";

const URL = getContext("URL");

let config = $Sconfig;
</script>

{#each Object.keys(config) as k}
  <p>
    {k}: {config[k]}
  </p>
{/each}

<style></style>