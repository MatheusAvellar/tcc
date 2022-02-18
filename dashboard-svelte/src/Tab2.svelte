<script>
import ItemWrapper from "./ItemWrapper.svelte";
import Accuracy from "./DQ/Accuracy.svelte";
import Completeness from "./DQ/Completeness.svelte";
import Consistency from "./DQ/Consistency.svelte";
import Currentness from "./DQ/Currentness.svelte";
import Precision from "./DQ/Precision.svelte";
import Understandability from "./DQ/Understandability.svelte";
  // [x] Accuracy
  // [x] Completeness
  // [x] Consistency
  // [x] Currentness
  // [x] Precision
  // [x] Understandability
  // ---------------------
  // [ ] Credibility
  // [ ] Accessibility
  // [ ] Compliance
  // [ ] Confidentiality
  // [ ] Efficiency
  // [ ] Traceability
  // [ ] Availability
  // [ ] Portability
  // [ ] Recoverability
</script>

<h2>Análise automática</h2>
<p>
  Dentre as 15 características de qualidade de dados definidas pela ISO/IEC 25012,
  6 delas foram separadas abaixo para serem verificadas individualmente:
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
  <li>
    <ItemWrapper name="Atualidade">
      <article slot="description">
        <p>
          A dimensão de <i>atualidade</i> mede a corretude temporal de um dado.
          Dados que não mais representam a realidade – ou seja, dados
          <i>desatualizados</i> – são dados com baixa atualidade.
        </p>
        <p>
          Por exemplo, uma tabela de horários de uma estação de trem não pode
          ter dados atualizados somente uma vez por semana; seus dados precisam
          refletir a realidade, pois trens atrasam, se adiantam, são cancelados,
          etc.
        </p>
      </article>
      <Currentness slot="content"/>
    </ItemWrapper>
  </li>
  <li>
    <ItemWrapper name="Precisão">
      <article slot="description">
        <p>
          A dimensão de <i>precisão</i> mede a exatidão ou o nível de
          aproximação usado para representar valores. Por exemplo, uma medição
          de altura de pessoas em metros, sem casas decimais, possui baixa
          precisão.
        </p>
        <p>
          Como a necessidade de uma maior precisão pode ser subjetiva, ou ser
          dependente de fatores externos ao banco de dados, não há um jeito
          fácil de categorizar boas ou más precisões automaticamente. Porém, é
          possível medir a quantidade de casas decimais – ou a falta delas – em
          cada coluna relevante do banco.
        </p>
      </article>
      <Precision slot="content"/>
    </ItemWrapper>
  </li>
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
hr {
  height: 2.5px;
  background-color: #efefef;
  border: 0;
  margin: 4rem auto 3rem;
  width: 50%;
}
</style>