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
  // [o] Credibility
  // [o] Accessibility
  // [ ] Compliance
  // [ ] Confidentiality
  // [ ] Efficiency
  // [ ] Traceability
  // [o] Availability
  // [o] Portability
  // [o] Recoverability
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
<hr>
<h2>Análise manual</h2>
<p>
  Nem todas as características de qualidade de dados definidas pela ISO/IEC 25012
  podem ser automaticamente analisadas. Abaixo estão as características que não
  puderam ser automaticamente analisadas:
</p>
<ol>
  <li>
    <ItemWrapper name="Credibilidade" expandable="no">
      <article slot="description">
        <p>
          A dimensão de <i>credibilidade</i> mede a autenticidade de dados; se
          eles vêm de fontes críeis, se são considerados verdadeiros.
        </p>
        <p>
          Os dados são disponibilizados pela Prefeitura da Cidade do Rio de
          Janeiro, em parceria com o Instituto Pereira Passos. Ambos são
          autoridades renomadas e presume-se a autenticidade de seus dados.
        </p>
      </article>
    </ItemWrapper>
  </li>
  <li>
    <ItemWrapper name="Acessibilidade" expandable="no">
      <article slot="description">
        <p>
          A dimensão de <i>acessibilidade</i> mede o quão facilmente dados podem
          ser acessados e compreendidos por qualquer usuário. Por exemplo, dados
          guardados exclusivamente como imagens não são acessíveis a usuários
          cegos ou com pouca visão, e deveriam ser guardados em formato textual
          também.
        </p>
        <p>
          Todos os dados do banco são textuais, ainda que com metadados
          indicando quando são numéricos. Não deve haver inacessibilidade para
          usuários cegos, com baixa visão, daltônicos, total ou parcialmente
          surdos, ou quaisquer outras necessidades especiais.
        </p>
      </article>
    </ItemWrapper>
  </li>
  <li>
    <ItemWrapper name="Conformidade" expandable="no">
      <article slot="description">
        <p></p>
      </article>
    </ItemWrapper>
  </li>
  <li>
    <ItemWrapper name="Confidencialidade" expandable="no">
      <article slot="description">
        <p></p>
      </article>
    </ItemWrapper>
  </li>
  <li>
    <ItemWrapper name="Eficiência" expandable="no">
      <article slot="description">
        <p></p>
      </article>
    </ItemWrapper>
  </li>
  <li>
    <ItemWrapper name="Rastreabilidade" expandable="no">
      <article slot="description">
        <p></p>
      </article>
    </ItemWrapper>
  </li>
  <li><ItemWrapper name="Disponibilidade" expandable="no">
      <article slot="description">
        <p>
          A dimensão de <i>disponibilidade</i> mede o "<i>uptime</i>" dos dados,
          seja durante o dia a dia, ou durante operações como backups ou
          períodos de uso intenso da plataforma. Esta dimensão também é difícil
          de se medir automaticamente sem acesso a um banco de dados secundário
          com informações de <i>uptime</i> disponível.
        </p>
        <p>
          Uma análise superficial pode ajudar a sanar esse problema, por ora: o
          site data.rio utiliza a plataforma ArcGIS, que facilita configurações
          de alta disponibilidade (vide artigo
          <a href="https://enterprise.arcgis.com/en/portal/latest/administer/windows/configure-highly-available-system.htm">Configure highly available ArcGIS Enterprise</a>).
          Contudo, também há um aviso na plataforma que backups (e outras
          atividades com uso intenso de rede) podem afetar a performance da
          rede.
        </p>
        <blockquote>
          <p>
            Backup creation is a network-intensive process and can affect
            network performance. It is recommended that you perform full backups
            while there is less traffic on your network
          </p>
          <cite>
            — <a href="https://enterprise.arcgis.com/en/portal/latest/administer/windows/overview-backup-restore-web-gis.htm">ArcGIS Enterprise Backups</a>
          </cite>
        </blockquote>
      </article>
    </ItemWrapper>
  </li>
  <li>
    <ItemWrapper name="Portabilidade" expandable="no">
      <article slot="description">
        <p>
          A dimensão de <i>portabilidade</i> mede o quão facilmente dados podem
          ser movidos, substituídos ou instalados, sendo preservada sua
          qualidade existente.
        </p>
        <p>
          Mais uma vez, não é tão simples construir um algoritmo para isso dado
          que não temos controle da plataforma original em que os dados são
          disponibilizados. Contudo, o fato de que os dados puderam ser baixados
          sem perda de qualidade conhecida atesta à alta portabilidade da
          plataforma.
        </p>
      </article>
    </ItemWrapper>
  </li>
  <li>
    <ItemWrapper name="Recuperabilidade" expandable="no">
      <article slot="description">
        <p>
          A dimensão de <i>recuperabilidade</i> mede a preservação de operações
          anteriores e da qualidade dos dados em evento de falha. Para uma
          melhor recuperabilidade, gerentes de sistemas podem realizar backups,
          ou utilizar sistemas de versionamento para preservar mudanças que
          podem ser desfeitas, como Git ou SVN.
        </p>
        <p>
          Novamente, sem um conhecimento interno do funcionamento da plataforma,
          não é trivial determinar (especialmente de forma automática) se os
          dados possuem uma boa recuperabilidade ou não. Uma indicação negativa
          se dá nos metadados disponíveis para as tabelas, que apontam (<a href="https://services1.arcgis.com/OlP4dGNtIcnD3RYf/arcgis/rest/services/Qualidade_do_ar_dados_horarios_2011_2018/FeatureServer/2">exemplo</a>)
          que os dados não são versionados. Ou seja, mudanças ao banco são
          finais e possivelmente não são reversíveis.
        </p>
        <p>
          É possível, contudo, que os dados sejam importados para essa
          plataforma a partir de outro banco, e lá eles possuam versionamento
          apropriado.
        </p>
      </article>
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