<script>
import ItemWrapper from "./ItemWrapper.svelte";
import Accuracy from "./DQ/Accuracy.svelte";
import Completeness from "./DQ/Completeness.svelte";
import Consistency from "./DQ/Consistency.svelte";
import Understandability from "./DQ/Understandability.svelte";
  // [x] Accuracy
  // [x] Completeness
  // [x] Consistency
  // [ ] Credibility
  // [ ] Currentness
  // [ ] Accessibility
  // [ ] Compliance
  // [ ] Confidentiality
  // [ ] Efficiency
  // [ ] Precision
  // [ ] Traceability
  // [x] Understandability
  // [ ] Availability
  // [ ] Portability
  // [ ] Recoverability
</script>

<h2>Análise</h2>
<p>
  As 15 características de qualidade de dados definidas pela ISO/IEC 25012
  foram separadas abaixo para serem analisadas individualmente:
</p>
<ol>
  <li>
    <ItemWrapper name="Acurácia">
      <article slot="description">
        <p>
          A dimensão de <i>acurácia</i> mede o quanto os dados estão em um domínio
          correto.
        </p>
        <p>
          Aqui, a acurácia é calculada baseada em intervalos permitidos para dados.
          Por exemplo, medições de temperatura possuem, aqui, um intervalo permitido
          de 8 a 50°C. Quaisquer medições fora desse intervalo são consideradas
          incorretas, e de baixa acurácia.
        </p>
      </article>
      <Accuracy slot="content"/>
    </ItemWrapper>
  </li>
  <li>
    <ItemWrapper name="Completude">
      <article slot="description">
        <p>
          A dimensão de <i>completude</i> mede a quantidade de dados não faltantes.
        </p>
        <p>
          Aqui, a completude é calculada baseada na razão entre dados não nulos e o
          total de medições. Ela é representada abaixo nesse formato:<br>
          <code>[ não nulos ] / [ total ] ([ porcentagem ])</code>
        </p>
      </article>
      <Completeness slot="content"/>
    </ItemWrapper>
  </li>
  <li>
    <ItemWrapper name="Consistência">
      <article slot="description">
        <p>
          A dimensão de <i>consistência</i> mede a existência de contradições
          e incoerências dentre os dados.
        </p>
        <p>
          A exemplo, um dado que mede o total gasto em materiais não ser igual
          à soma dos gastos é um dado inconsistente.
        </p>
      </article>
      <Consistency slot="content"/>
    </ItemWrapper>
  </li>
  <li><ItemWrapper name="Credibilidade"><xxx slot="content"/></ItemWrapper></li>
  <li><ItemWrapper name="Atualidade"><xxx slot="content"/></ItemWrapper></li>
  <li><ItemWrapper name="Acessibilidade"><xxx slot="content"/></ItemWrapper></li>
  <li><ItemWrapper name="Conformidade"><xxx slot="content"/></ItemWrapper></li>
  <li><ItemWrapper name="Confidencialidade"><xxx slot="content"/></ItemWrapper></li>
  <li><ItemWrapper name="Eficiência"><xxx slot="content"/></ItemWrapper></li>
  <li><ItemWrapper name="Precisão"><xxx slot="content"/></ItemWrapper></li>
  <li><ItemWrapper name="Rastreabilidade"><xxx slot="content"/></ItemWrapper></li>
  <li>
    <ItemWrapper name="Compreensibilidade">
      <article slot="description">
        <p>
          A dimensão de <i>compreensibilidade</i> mede o quão apropriadamente
          dados podem ser lidos e interpretados por usuários.
        </p>
        <p>
          Compreensibilidade é um fator subjetivo, e sua análise não é
          facilmente automatizada. Porém, dois fatores objetivos que podem ser
          medidos são:
        </p>
        <p>
          1. A presença de unidades de medida para todas as medições que as
          necessitam; e<br>
          2. A presença de descrição ou explicação do significado de cada
          característica medida.
        </p>
      </article>
      <Understandability slot="content"/>
    </ItemWrapper>
  </li>
  <li><ItemWrapper name="Disponibilidade"><xxx slot="content"/></ItemWrapper></li>
  <li><ItemWrapper name="Portabilidade"><xxx slot="content"/></ItemWrapper></li>
  <li><ItemWrapper name="Recuperabilidade"><xxx slot="content"/></ItemWrapper></li>
</ol>

<style>
h2 {
  margin: 0;
}
ol {
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 1.5em;
}
</style>