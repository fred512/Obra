<template>
  <div class="conteudoParams">
    <div class="campos">
      <div class="field" title="Seleciona UF">
        UF:&nbsp;
        <input type="text" v-model.lazy="params.UF" @change="saveParams()" />
      </div>
      <div class="field" title="Define BDI">
        BDI:&nbsp;
        <input
          type="number"
          step="0.01"
          min="0"
          max="80"
          v-model.lazy="params.BDI"
          @change="saveParams()"
        />
      </div>
      <div class="field" style="position:relative" title="Seleciona Data Base Disponível">
        Data Base:&nbsp;
        <b-form-select v-model="params.base" :options="registros" @change="saveParams()"></b-form-select>
      </div>
      <div class="field">
        <b-form-checkbox
          switch
          variant="danger"
          @change.native="saveParams()"
          v-model="params.desonerado"
          value="1"
          unchecked-value="0"
        >Desonerado</b-form-checkbox>
      </div>
      <div class="field">
        <div title="Curva ABC" @click="curvaABC()" v-show="browser.name!='Firefox'">
          <i class="fa fa-bar-chart fa-2x"></i>
        </div>
        <div title="Totaliza Planilha" @click="totalizaItens()">
          <i class="fa fa-calculator fa-2x"></i>
        </div>
        <div title="Relátorio de Irregularidades" @click="divergencias()">
          <i class="fa fa-bug fa-2x" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <div class="acoesParams">
      <div @click="escolheArquivo()" title="Importa Planilha .xlsx">
        <i class="fa fa-long-arrow-up text-success fa-2x"></i>
        <i class="fa fa-file-excel-o text-success fa-2x"></i>
      </div>
      <div @click="onexport(itens,'PlanilhadeObra')" title="Exporta em formato .xlsx">
        <i class="fa fa-file-excel-o fa-2x text-success"></i>
        <i class="fa fa-long-arrow-down text-success fa-2x"></i>
      </div>
      <div @click="limpaPlanilha()" title="Limpa Planilha">
        <i class="fa fa fa-trash fa-2x text-danger" aria-hidden="true"></i>
      </div>
    </div>
    <b-modal id="modal-2" size="xl" hide-footer centered title="Carrega Planilha .xlsx">
      <div class="d-block" style="text-align: center !important;">
        <span class="titulo">Informe os parâmetros do projeto</span>
        <div class="campos">
          <div class="field" title="Define BDI">
            BDI:
            <input
              type="number"
              step="0.01"
              min="0"
              max="80"
              v-model.lazy="newparams.BDI"
              style="width:70px"
            />
          </div>
          <div class="field" style="position:relative" title="Seleciona Data Base da planilha">
            Data Base:
            <b-form-select v-model.lazy="newparams.base" :options="registros"></b-form-select>
          </div>
          <div class="field">
            <b-form-checkbox
              size="lg"
              switch
              variant="danger"
              v-model.lazy="newparams.desonerado"
              value="1"
              unchecked-value="0"
            >Desonerado</b-form-checkbox>
          </div>
        </div>
        <span class="titulo">Selecione uma planilha que tenha este layout de colunas</span>
        <div class="table">
          <div class="tr header">
            <div class="td header">Item</div>
            <div class="td header">Orgão</div>
            <div class="td header">Código</div>
            <div class="td header" style="min-width:50px;">Descrição</div>
            <div class="td header">Unid</div>
            <div class="td header">Qtde</div>
            <div class="td header">Valor Unit</div>
            <div class="td header">Valor Total</div>
          </div>
          <div class="tr" style="font-size:12px;">
            <div class="td">Sequenciamento dos Itens</div>
            <div class="td">Orgão de referência</div>
            <div class="td">Código de referência</div>
            <div class="td" style="min-width:50px;">Descrição do Item</div>
            <div class="td">Unidade</div>
            <div class="td">Qtde do Item</div>
            <div class="td">Preço Unitário</div>
            <div class="td">Preço Total</div>
          </div>
        </div>
        <div class="d-block">
          <b-form-file
            id="nomeplanilha"
            v-model.lazy="file"
            :state="Boolean(file)"
            placeholder="Escolha a planilha a ser lida..."
            style="text-align:left !important;"
            :value="file"
            accept=".xlsx, .xls"
            @change="carregaArquivo()"
          ></b-form-file>

          <span class="titulo">Informe os dados da planilha</span>
          <div class="camposplanilha">
            <div class="field" title="Seleciona a guia da planilha">
              Nome da Guia:
              <b-form-select v-model.lazy="guia" :options="guias"></b-form-select>
              <!-- <input type="text" v-model.lazy="guia" style="width:350px !important"> -->
            </div>
            <div class="field" title="Define Primeira linha com Itens">
              1 &ordf; Linha:
              <input type="number" step="1" min="0" max="80" v-model="linha1" />
            </div>
            <div class="field" title="Define Primeira coluna com Itens">
              1 &ordf; Coluna:
              <input
                type="text"
                maxlength="1"
                v-model="coluna1"
                style="width:50px !important"
              />
            </div>
          </div>
        </div>
        <b-button class="mt-3" block variant="warning" @click="readSheet()">Carregar</b-button>
      </div>
    </b-modal>
    <b-modal
      id="modal-ABC"
      size="xl"
      scrollable
      hide-footer
      centered
      title="Curva ABC"
      class="modalABC"
      @hide="closeABC"
      header-bg-variant="info"
      body-bg-variant="info"
    >
      <template v-slot:modal-title>
        <span>Curva ABC</span>
        <div @click="onexport(arrayABC,'CurvaABC')" title="Exporta Curva ABC em formato .xlsx">
          <i class="fa fa-file-excel-o fa-1x"></i>
          <i class="fa fa-long-arrow-down fa-1x"></i>
        </div>
      </template>
      <b-table
        striped
        header-variant="info"
        table-variant="success"
        :fields="fields"
        :small="small"
        :items="arrayABC"
      ></b-table>
    </b-modal>
    <b-modal
      id="modal_atualiza"
      centered
      content-class="shadow"
      header-bg-variant="light"
      header-text-variant="info"
      body-bg-variant="light"
      body-text-variant="danger"
      footer-bg-variant="light"
      title="Atualiza Itens"
      @ok="atualizaItens()"
    >
      <p class="my-2">
        Um dos parâmetros da planilha foi alterado !
        Deseja atualizar os itens desta planilha com base nessa alteração?
      </p>
    </b-modal>
    <Progress :progressstate="progressstate" :max="max" />
    <Loading :loading="lendo" />
  </div>
</template>

<script>
import XLSX from "xlsx";
import Progress from "./progress";
import apiMixin from "../apiMixin";
import Loading from "./loading";
export default {
  name: "Params",
  components: { Loading, Progress },
  mixins: [apiMixin],
  data: function() {
    return {
      oldparams: "",
      file: [],
      emcima: false,
      registros: [],
      showAlert: false,
      newparams: {
        UF: "",
        base: "",
        desonerado: "1",
        BDI: ""
      },
      fields: [
        { key: "Seq", sortable: false },
        { key: "item", sortable: true, label: "Item" },
        { key: "orgao", sortable: false, label: "Órgão" },
        { key: "codigo", sortable: false, label: "Código" },
        { key: "descr", sortable: false, label: "Descrição" },
        { key: "unid", sortable: false, label: "Unid" },
        { key: "qtd", sortable: false, label: "Qtde" },
        { key: "vlComBDI", sortable: true, label: "Preço Unit" },
        { key: "valortot", sortable: true, label: "Preço Total" },
        { key: "Perc", sortable: true, label: "%" },
        { key: "Acumulado", sortable: true, label: "%Acum" }
      ],
      small: true,
      atualiza: "",
      arrayABC: [],
      linha1: 7,
      coluna1: "A",
      lendo: false,
      guia: "",
      max: 0,
      progressstate: 0,
      workbook: "",
      guias: []
    };
  },
  methods: {
    toast(msg, variant) {
      this.$bvToast.toast(msg, {
        title: `Mensagem`,
        toaster: "b-toaster-top-center",
        solid: true,
        variant: variant
      });
    },
    async atualizaItens() {
      /* eslint-disable */
      if (this.itens.length == 0) return;
      var BDI = this.params.BDI;
      var desonerado = this.params.desonerado;
      var base = this.params.base;
      var UF = this.params.UF;
      var itens = [...this.itens];
      this.max = itens.length;
      async function getCodigo(self) {
        for (var i = 0; i < itens.length; i++) {
          self.progressstate = self.progressstate + 1;
          var item = itens[i],
            url;
          item.erro = [];
          if (
            item.orgao !== "" &&
            item.codigo !== "" &&
            item.orgao.toUpperCase().indexOf("COMP") < 0 &&
            item.orgao.toUpperCase().indexOf("CCU") < 0 &&
            item.orgao.toUpperCase().indexOf("C.C.U") < 0
          ) {
            var novabase = base;
            if (item.orgao.toUpperCase() !== "SINAPI")
              novabase = await self.$http
                .get(
                  "carregaorgao.asp?uf=" +
                    UF +
                    "&base=" +
                    base +
                    "&orgao=" +
                    item.orgao
                )
                .then(res => {
                  return res.data[0].base;
                })
                .catch(error => {
                  return "";
                });
            if (novabase !== "") {
              url =
                "codigo.asp?uf=" +
                UF +
                "&codigo=" +
                item.codigo +
                "&base=" +
                novabase +
                "&orgao=" +
                item.orgao;
              var novo = await self.$http.get(url).then(res => {
                return res.data[0];
              });
              if (novo == undefined) {
                (item.valor = 0), (item.valortot = "");
              } else {
                if (desonerado == "1") {
                  item.valor = parseFloat(
                    novo.precodeson * (1 + BDI / 100)
                  ).toFixed(2);
                } else {
                  item.valor = parseFloat(
                    novo.precooner * (1 + BDI / 100)
                  ).toFixed(2);
                }
              }
              item.base = novabase;
              item.vlComBDI = item.valor;
              item.valortot = parseFloat(item.qtd * item.vlComBDI).toFixed(2);
              var critica = await self.criticaItem(item, self.params, self, 1);
              var erro = critica.split("||")[0];
              if (erro) item.erro = JSON.parse(erro);
              var alerta = critica.split("||")[1];
              if (alerta) item.alerta = JSON.parse(alerta);
              var refer = critica.split("||")[2];
              if (refer > 0) item.valor = refer;
              self.itens[i] = item;
            } else {
              if (item.orgao.indexOf("COMP") > -1) {
                item.composicao = true;
              } else {
                item.erro.push({
                  erro: "Item não encontrado no orgão/data base"
                });
              }
            }
          }
        }
      }
      await getCodigo(this);
      this.itens = itens;
      (this.max = 0), (this.progressstate = 0);
      this.toast("Itens atualizados com sucesso !", "success");
    },
    confirmUpdate() {
      this.$bvModal.show("modal_atualiza");
    },
    gravabase(result) {
      this.params.base = result.base;
      this.saveParams();
    },
    totalizaItens() {
      this.$store.commit("totalizaItens");
    },
    pesquisaBases() {
      if (this.params.UF == undefined) return;
      var url = "carregabase.asp?uf=" + this.params.UF;
      return this.$http.get(url).then(res => {
        var regs = [];
        regs.push({ value: "", text: "Data Base" });
        for (var i = 0; i < Object.keys(res.data).length; i++) {
          regs.push({
            value: res.data[i].base,
            text: res.data[i].base
          });
        }
        return regs;
      });
    },
    saveParams() {
      this.$store.commit("gravaParams", this.params);
    },
    escolheArquivo() {
      if (this.params.UF == "") {
        this.toast("Selecione uma UF antes de importar planilhas !", "danger");
        return;
      }
      this.$bvModal.show("modal-2");
    },
    async salvaItens(res) {
      var itens = [];
      this.max = res.length;
      var col = parseInt(this.coluna1.toUpperCase().charCodeAt() - 64);
      for (var i = this.linha1 - 3; i < Object.keys(res).length - 1; i++) {
        var item = {
          item: "",
          orgao: "",
          base: this.params.base,
          descr: "",
          unid: "",
          qtd: "",
          valor: "",
          erro: "",
          valortot: "",
          selecionado: false,
          edita: false,
          vlComBDI: 0
        };
        item.item = Object.values(res[i])[col - 1];
        item.orgao = Object.values(res[i])[col];
        item.codigo = Object.values(res[i])[col + 1];
        item.descr = Object.values(res[i])[col + 2];
        item.unid = Object.values(res[i])[col + 3];
        item.qtd = Object.values(res[i])[col + 4];
        if (item.qtd !== "") item.qtd = parseFloat(item.qtd).toFixed(2);
        item.vlComBDI = Object.values(res[i])[col + 5];
        if (item.vlComBDI !== "")
          item.vlComBDI = parseFloat(item.vlComBDI).toFixed(2);
        item.valortot = Object.values(res[i])[col + 6];
        var critica = await this.criticaItem(item, this.params, this);
        var erro = critica.split("||")[0];
        if (erro) item.erro = JSON.parse(erro);
        var alerta = critica.split("||")[1];
        if (alerta) item.alerta = JSON.parse(alerta);
        var refer = critica.split("||")[2];
        if (refer > 0 && refer !== undefined) item.valor = refer;
        var itemcritica = critica.split("||")[3];
        if (itemcritica != "" && itemcritica != undefined)
          item.base = itemcritica;
        if (
          item.descr.toLowerCase() !== "total" &&
          item.descr.toLowerCase().indexOf("sub-total") < 0 &&
          item.descr.toLowerCase().indexOf("subtotal") < 0 &&
          item.descr !== ""
        ) {
          itens.push(item);
        }
        this.progressstate = this.progressstate + 1;
      }
      res = itens;
      this.itens = res;
      this.$store.commit("gravaItens", res);
      this.$store.commit("calculatotal");
      this.$forceUpdate();
      this.max = 0;
      this.progressstate = 0;
    },
    carregaArquivo() {
      var file = document.getElementById("nomeplanilha").files[0];
      if (file == "") {
        alert("Selecione uma planilha !");
        return;
      }
      this.toast(
        "Aguarde a leitura da planilha. Isso pode demorar um pouco...",
        "primary"
      );
      this.lendo = true;
      this.$forceUpdate();
      this.$store.commit("gravaItens", []);
      this.itens = [];
      var tis = this;
      // alert('aguarde...')
      setTimeout(() => {
        this.carregaArquivocontinua(file, tis);
      }, 2500);
    },
    async carregaArquivocontinua(file, tis) {
      var reader = new FileReader();
      async function fixdata(data) {
        var o = "",
          l = 0,
          w = 10240;
        for (; l < data.byteLength / w; ++l)
          o += String.fromCharCode.apply(
            null,
            new Uint8Array(data.slice(l * w, l * w + w))
          );
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
      }
      reader.onload = async function(e) {
        var data = e.target.result;
        tis.lendo = true;
        var fixedData = await fixdata(data);
        var workbook = XLSX.read(btoa(fixedData), { type: "base64" });
        var guias = [];
        for (var x = 0; x < workbook.SheetNames.length; x++) {
          guias.push(workbook.SheetNames[x]);
        }
        tis.guias = guias;
        tis.workbook = workbook;
        tis.lendo = false;
        tis.toast(
          "Planilha carregada. Informe os dados da planilha...",
          "success"
        );
        tis.$forceUpdate();
      };
      reader.readAsArrayBuffer(file);
      this.params.BDI = this.newparams.BDI;
      this.params.base = this.newparams.base;
      this.params.desonerado = this.newparams.desonerado;
      this.saveParams();
    },
    async readSheet() {
      if (
        this.newparams.BDI == "" ||
        this.newparams.base == "" ||
        this.guia == ""
      ) {
        this.toast("Informe Data Base e/ou BDI e/ou Nome da Guia", "danger");
        return;
      }
      var worksheet = this.workbook.Sheets[this.guia];
      var results = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      this.salvaItens(results);
      this.$bvModal.hide("modal-2");
    },
    curvaABC() {
      if (this.itens.length < 1) return;
      var itens = this.itens;
      var arrayABC = [],
        arrayItens = [],
        total = parseFloat(this.$store.state.totvalor);
      this.itens.forEach(function(item, i) {
        if (item.codigo !== "" && item.valortot > 0) {
          if (
            JSON.stringify(arrayItens).indexOf(
              '"Codigo":"' + item.codigo + '"'
            ) < 0
          ) {
            var temp = itens.filter(function(el) {
              return el.codigo == item.codigo;
            });
            var totItem = temp.reduce(function(tot, el) {
              return (tot += parseFloat(el.valortot));
            }, 0);
            var totqtd = temp.reduce(function(tot, el) {
              return (tot += parseFloat(el.qtd));
            }, 0);
            var perc = ((totItem.toFixed(2) * 100) / total).toFixed(2);
            var itemABC = {
              Seq: "",
              item: item.item,
              orgao: item.orgao,
              codigo: item.codigo,
              descr: item.descr,
              unid: item.unid,
              qtd: totqtd,
              vlComBDI: item.vlComBDI,
              valortot: totItem,
              Perc: perc
            };
            arrayItens.push(itemABC);
          }
        }
      });
      var arrayItens = arrayItens.sort(function(a, b) {
        if (a.valortot > b.valortot) return -1;
        if (a.Vl_valortotTotal < b.valortot) return 1;
      });
      var acum = 0,
        seq = 1;
      arrayABC = arrayItens.map(function(el) {
        el.Seq = seq++;
        acum += parseFloat(el.Perc);
        var vari = "";
        if (acum < 81) vari = "danger";
        el._rowVariant = vari;
        el.Acumulado = acum.toFixed(0);
        return el;
      });
      arrayABC = arrayABC.filter(function(el) {
        return el.Acumulado < 100;
      });
      this.arrayABC = arrayABC;
      this.$bvModal.hide("modal-ABC");
      this.$bvModal.show("modal-ABC");
    },
    divergencias() {
      var rel = this.itens.filter(function(el) {
        return el.erro != "" || el.alerta != "";
      });
      this.onexport(rel, "Divergencias");
    },
    onexport(arrayExport, relatorio) {
      // On Click Excel download button
      var itens = [];
      var itenscomerro = [];
      arrayExport.forEach(function(v, k) {
        var item = {
          Item: v.item,
          Orgao: v.orgao,
          Codigo: v.codigo,
          Descrico: v.descr,
          Unid: v.unid,
          Qtd: v.qtd,
          PrecoUnitário: v.vlComBDI,
          PrecoTotal: v.valortot
        };
        if (relatorio == "CurvaABC") {
          item.Perc = v.Perc;
          item.Acumulado = v.Acumulado;
        }
        if (relatorio == "Divergencias") {
          var numdiv = Math.max.apply(null, [v.erro.length, v.alerta.length]);
          for (var i = 0; i < numdiv; i++) {
            var itemerro = { ...item };
            itemerro.Irregularidade = "";
            itemerro.Alerta = "";
            if (v.erro[i] != undefined)
              itemerro.Irregularidade = v.erro[i].erro;
            if (v.alerta[i] != undefined) itemerro.Alerta = v.alerta[i].alerta;
            itenscomerro.push(itemerro);
          }
        } else {
          itens.push(item);
        }
      });
      if (relatorio == "Divergencias") {
        itens = itenscomerro;
      }
      var Itens = XLSX.utils.json_to_sheet(itens);
      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new(); // make Workbook of Excel

      // add Worksheet to Workbook
      // Workbook contains one or more worksheets
      XLSX.utils.book_append_sheet(wb, Itens, "Itens"); // sheetAName is name of Worksheet
      var wscols = [
        { wpx: 40 },
        { wpx: 70 },
        { wpx: 70 },
        { wpx: 450 },
        { wpx: 50 },
        { wpx: 40 },
        { wpx: 70 },
        { wpx: 90 }
      ];
      if (relatorio == "Divergencias") {
        wscols.push({ wpx: 350 });
        wscols.push({ wpx: 350 });
      }
      if (relatorio == "CurvaABC") {
        wscols.push({ wpx: 35 });
        wscols.push({ wpx: 35 });
      }
      Itens["!cols"] = wscols;
      // export Excel file
      XLSX.writeFile(wb, relatorio + ".xlsx"); // name of the file is 'book.xlsx'
    },
    limpaPlanilha() {
      if (!confirm("Deseja apagar os dados desta planilha ?")) return;
      this.$store.commit("gravaParams", {
        BDI: "",
        UF: "",
        base: "",
        desonerado: ""
      });
      this.$store.commit("gravaItens", []);
      setTimeout(
        () => {
          this.$store.commit("calculatotal");
        },
        1000,
        this
      );
    },
    closeABC() {
      this.arrayABC = [];
      this.$bvModal.hide("modal-ABC");
    }
  },
  beforeMount() {
    this.oldparams = JSON.stringify(this.params);
  },
  watch: {
    params: {
      handler: function(newVal) {
        if (
          this.oldparams.indexOf('"UF":""') < 0 &&
          JSON.stringify(newVal) !== this.oldparams &&
          newVal.UF !== "" &&
          this.itens.length > 0
        ) {
          this.$bvModal.show("modal_atualiza");
        }
        this.oldparams = JSON.stringify(this.params);
      },
      deep: true
    }
  },
  computed: {
    params() {
      return this.$store.state.params;
    },
    itens() {
      return this.$store.state.itens;
    },
    browser() {
      return JSON.parse(localStorage.getItem("browser"));
    }
  },
  asyncComputed: {
    bases() {
      if (this.params.UF == undefined || this.params.UF.length < 2) return "";
      var url = "carregabase.asp?uf=" + this.params.UF;
      return this.$http.get(url,
        { headers: {
          'Content-type': 'application/json'
        }}
      ).then(res => {
        var regs = [];
        for (var i = 0; i < Object.keys(res.data).length; i++) {
          regs.push({
            value: res.data[i].base,
            text: res.data[i].base
          });
        }
        this.registros = regs;
        return regs;
      });
    }
  }
};
</script>

<style >
.emcima {
  margin: auto;
}
.acoesParams,
.campos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #4472c4;
  border: 1px solid #4472c4;
  border-radius: 5px;
  position: relative;
  padding: 5px 10px;
  -webkit-box-shadow: inset 0px 0px 8px 1px rgba(0, 0, 0, 0.35);
  -moz-box-shadow: inset 0px 0px 8px 1px rgba(0, 0, 0, 0.35);
  box-shadow: inset 0px 0px 8px 1px rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
}
.campos {
  flex-grow: 1;
  margin-right: 10px;
  flex-wrap: wrap;
  display: flex;
  justify-content: space-around;
}
.conteudoParams {
  display: flex;
  justify-content: space-between;
}
#modal-2 > .field input[type="checkbox"] {
  transform: scale(1.2) !important;
}
.camposplanilha {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #4472c4;
  border: 1px solid #4472c4;
  border-radius: 5px;
  position: relative;
  padding: 5px 10px;
  -webkit-box-shadow: inset 0px 0px 8px 1px rgba(0, 0, 0, 0.35);
  -moz-box-shadow: inset 0px 0px 8px 1px rgba(0, 0, 0, 0.35);
  box-shadow: inset 0px 0px 8px 1px rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
}
.camposplanilha > .field:nth-child(1) {
  margin: 0 !important;
}
.camposplanilha > .field:nth-child(1) select {
  min-width: 300px !important;
}
.camposplanilha > .field:nth-child(2) input {
  min-width: 50px !important;
}
.camposplanilha > .field:nth-child(3) {
  width: 50px !important;
}
/* #modal-2___BV_modal_body_ > div:nth-child(1) > div.campos > div:nth-child(1) input{
      width: 40px !important;
    } */
#modal-2 > .field:nth-child(2) input {
  width: 40px !important;
}
#modal-2 > .field:nth-child(3) input {
  width: 80px !important;
}
#modal-2 > .field select {
  padding: 0px;
  padding-left: 5px;
  max-width: 115px !important;
}
.field input,
.field select {
  font-size: 1.2rem;
  max-width: 100px;
  text-transform: uppercase;
  text-align: center;
  margin-right: 35px;
  color: #4472c4;
  max-height: 35px;
  border: 1px solid #4472c4;
  border-radius: 3px;
}
.campos .field:nth-child(1) input {
  width: 40px;
}
.campos .field select {
  padding-top: 0px !important;
  padding-left: 4px;
  padding-right: 10px;
  padding-bottom: 0 !important;
  min-width: calc(8vw) !important;
}
.field {
  color: #4472c4;
  margin-left: 15px;
  font-weight: 600;
  white-space: nowrap;
  display: flex;
  align-items: center;
}
.campos > div > div > i,
.acoesParams > div {
  flex: 1 1 auto;
  border-radius: 5px;
  margin: 5px;
  -webkit-box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.35);
  -moz-box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.35);
  box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
  padding: 7px;
}
.acoesParams > div {
  width: 70px;
  padding: 7px;
  white-space: nowrap;
}
.titulo {
  font-size: 1.8rem;
  color: #4472c4;
}
.table.b-table > thead > tr > th {
  background-color: #2e7d32 !important;
  color: #fff;
}
.table.b-table {
  width: fit-content !important;
}
.modal-dialog-centered.modal-dialog-scrollable .modal-content {
  width: calc(80vw) !important;
}
.modal-title {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
.modal-title div {
  color: #76ff03;
  padding: 7px 10px;
  border-radius: 9px;
  -webkit-box-shadow: inset 0px 0px 8px 1px rgba(118, 255, 3, 0.8);
  -moz-box-shadow: inset 0px 0px 8px 1px rgba(118, 255, 3, 0.8);
  box-shadow: inset 0px 0px 8px 1px rgba(118, 255, 3, 0.8);
  box-sizing: border-box;
}
</style>
