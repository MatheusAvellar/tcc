<script>
import Tab1 from "./Tab1.svelte";
import Tab2 from "./Tab2.svelte";
import TabCredits from "./TabCredits.svelte";
import { setContext } from "svelte";

let tab = 1;

setContext("URL", "http://localhost:3000");
</script>

<header>
  <h1>Data Quality Dashboard</h1>
</header>
<main>
  <aside>
    <input id="config" bind:group={tab} type="radio" name="tab" value={1}>
    <label for="config" data-selected={tab == 1}>Configuração</label>
    <input id="analise" bind:group={tab} type="radio" name="tab" value={2}>
    <label for="analise" data-selected={tab == 2}>Análise</label>
    <input id="creditos" bind:group={tab} type="radio" name="tab" value={3}>
    <label for="creditos" data-selected={tab == 3}>Créditos</label>
  </aside>
  <section>
    {#if      tab == 1}<Tab1/>
    {:else if tab == 2}<Tab2/>
    {:else            }<TabCredits/>
    {/if}
  </section>
</main>
<footer>
  <hr>
  <p class="disclaimer">
    Desenvolvido por Matheus Avellar como<br>
    parte do Trabalho de Conclusão de Curso<br>
    de Bacharelado em Ciência da Computação,<br>
    na UFRJ.
  </p>
</footer>

<style>
header, main, footer {
  max-width: 1200px;
  margin: auto;
}
h1 {
  margin: 0;
}
main {
  display: grid;
  grid-template-columns: auto 1fr;
}
input[type="radio"] {
  display: none;
}
section, aside {
  padding: 1em;
}
label {
  padding: .25em .5em;
}
[data-selected="true"] {
  background-color: #efefef;
}
footer {
  padding: 1em;
}
hr {
  height: 2.5px;
  background-color: #efefef;
  border: 0;
  margin: 4rem auto 3rem;
  width: 50%;
}
.disclaimer {
  font-size: 85%;
  color: #444;
  text-align: right;
  margin: 0 0 1em;
}
</style>