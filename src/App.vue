<template>
  <div id="app">
    <div class="cabecalho">
      <img alt="PDO logo" src="./assets/logo-pdo-azul.png" />
      <div class="canto">
        <div
          class="botaodoacao"
          bg-variant="warning"
          v-if="local.indexOf('www.gigovvt')==-1&&local.indexOf('localhost:8082')==-1"
        >
          <span>Ajude a manter o site atualizado e funcionando doando um valor clicando no botão.</span>
          <b-button
            text-danger
            v-b-modal.modal-multi-1
            class="mt-3"
            size="sm"
            pill
            variant="warning"
          >Doar</b-button>
        </div>
        <img alt="PDO logo" src="./assets/pdo-logo.png" />
      </div>
    </div>
    <b-modal
      id="modal-multi-1"
      size="lg"
      body-bg-variant="info"
      footer-bg-variant="info"
      header-bg-variant="info"
      title="Escolha uma das opções de doação abaixo"
      body-text-variant="light"
      header-text-variant="light"
      centered
      modal-ok
    >
      <div class="doacao">
        <div class="paypal">
          <h3>Paypal</h3>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="R2WRWGCUQNSBL" />
            <input
              type="image"
              src="https://www.paypalobjects.com/pt_BR/BR/i/btn/btn_donateCC_LG.gif"
              border="0"
              name="submit"
              title="PayPal - The safer, easier way to pay online!"
              alt="Faça doações com o botão do PayPal"
            />
            <img
              alt
              border="0"
              src="https://www.paypal.com/pt_BR/i/scr/pixel.gif"
              width="1"
              height="1"
            />
          </form>
        </div>
        <div class="pagseguro">
          <h3>PagSeguro</h3>
          <form action="https://pagseguro.uol.com.br/checkout/v2/donation.html" method="post">
            <input type="hidden" name="currency" value="BRL" />
            <input type="hidden" name="receiverEmail" value="carlosfredericodemborges@gmail.com" />
            <input type="hidden" name="iot" value="button" />
            <input
              type="image"
              src="https://stc.pagseguro.uol.com.br/public/img/botoes/doacoes/120x53-doar-azul.gif"
              name="submit"
              alt="Pague com PagSeguro - é rápido, grátis e seguro!"
            />
          </form>
        </div>
        <div class="picpay">
          <h3>PicPay</h3>
          <img src="./assets/picpay.png" alt v-b-modal.modal-multi-2 />
        </div>
      </div>
    </b-modal>
    <b-modal id="modal-multi-2" title="Doar com PicPay" ok-only centered>
      <div class="qr-picpay">
        <img src="./assets/pcipay-fred.png" alt />
      </div>
    </b-modal>
    <div class="conteudo">
      <div class="params">
        <keep-alive>
          <Params />
        </keep-alive>
      </div>
      <div class="grid" ref="grid">
        <div class="divGrid">
          <keep-alive>
            <Item />
          </keep-alive>
        </div>
      </div>
    </div>
    <div class="rodape">
      <keep-alive>
        <Rodape />
      </keep-alive>
    </div>
    <div v-show="showAlert" class="browser">
      <div style="text-align:center;width:100%;text-decoration">
        <strong>Atenção !</strong>
      </div>
      <p>Voce está navegando com o {{browser.name}} na versão {{browser.version}}</p>
      <p>Este aplicativo funciona melhor no navegadores/versões abaixo</p>
      <p>- Chrome acima da versão 62</p>
      <p>- Firefox acima da versão 58</p>
      <p>- Opera acima da versão 61</p>
      <p
        v-if="local.indexOf('www.gigovvt')>-1||local.indexOf('localhost:8082')>-1"
      >Voce pode baixar o Chrome na Central de Software, ou atualizar seu Firefox abrindo um chamado no servicos.caixa</p>
      <p>Esses navegadores com versões anteriores à estas irão apresentar imcompatibilidades</p>
      <p>Os navegadores Safari, Edge e InternetExplorer vão apresentar problemas em todas as versões.</p>
      <b-form-checkbox
        v-model="mostraAlerta"
        @change="guardaAlerta()"
        size="lg"
        style="font-size:35px"
      >Não mostrar esta mensagem novamente</b-form-checkbox>
      <b-button class="mt-3" block variant="warning" @click="showAlert=false">Sair</b-button>
    </div>
    <div class="banner">
      <div v-if="local.indexOf('www.gigovvt')>-1||local.indexOf('localhost:8082')>-1">
        <img src="./assets/logo-GIGOV-200x168.png" alt />
        <img src="./assets/reuni.png" alt />
        <img src="./assets/riscocaixa.png" alt />
      </div>
      <div v-else>
        <div id="banner1"></div>
        <!-- <div id="banner2"></div>
        <div id="banner3"></div>-->
        <!-- <img src="./assets/banner1.jpg" alt /> -->
        <!-- <img src="./assets/banner2.jpg" alt />
        <img src="./assets/banner3.jpg" alt />-->
      </div>
    </div>
  </div>
</template>

<script>
import Params from "@/components/params.vue";
import Item from "@/components/item.vue"
import Rodape from "@/components/rodape.vue";
export default {
  name: "app",
  components: { Params, Item, Rodape },
  data: function() {
    return {
      showAlert: false,
      browser: "",
      mostraAlerta: false
    };
  },
  methods: {
    guardaAlerta() {
      localStorage.setItem("guardaAlerta", true);
      this.guardaAlerta = false;
    }
  },
  created() {
    document.title = "Planilha de Obra";
  },
  mounted() {
    if (localStorage.getItem("guardaAlerta")) {
      this.guardaAlerta = localStorage.getItem("guardaAlerta");
    }
    if (localStorage.getItem("itens")) {
      this.$store.commit(
        "gravaItens",
        JSON.parse(localStorage.getItem("itens"))
      );
    }
    if (localStorage.getItem("params")) {
      this.$store.commit(
        "gravaParams",
        JSON.parse(localStorage.getItem("params"))
      );
    }
    const container = this.$el.querySelector(".grid");
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 1500);
    function get_browser() {
      var ua = navigator.userAgent,
        tem,
        M =
          ua.match(
            /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
          ) || [];
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: "IE", version: tem[1] || "" };
      }
      if (M[1] === "Chrome") {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem != null) {
          return { name: "Opera", version: tem[1] };
        }
      }
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
      if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
      }
      return {
        name: M[0],
        version: M[1]
      };
    }
    if (this.guardaAlerta !== "true") {
      var browser = get_browser();
      this.browser = browser;
      if (
        (browser.name == "Chrome" && parseInt(browser.version) < 62) ||
        (browser.name == "Firefox" && parseInt(browser.version) < 58) ||
        (browser.name == "Opera" && parseInt(browser.version) < 61)
      )
        this.showAlert = true;
    }
    localStorage.setItem("browser", JSON.stringify(browser));
    var banner1 = "";
    if (
      this.local.indexOf("www.gigovvt") == -1 &&
      this.local.indexOf("localhost:8082") == -1
    ) {
      banner1 = document.querySelector("body >div:first-child");
      if (banner1 !== null)
        document.getElementById("banner1").appendChild(banner1);
      banner1.style = "display:block";
      // var banner2 = document.querySelector("body >div:nth-child(3)");
      // document.getElementById("banner2").appendChild(banner2);
    }
    if (
      this.local.indexOf("www.planilhadeobra") == -1 &&
      this.local.indexOf("localhost:8080") == -1
    ) {
      banner1 = document.querySelector("body >div:first-child");
      banner1.style = "display:none";
    }
  },
  computed: {
    local() {
      return this.$local;
    }
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  width: 100vw;
}
.canto {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.doacao {
  display: flex;
  justify-content: space-between;
}
.doacao div {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  align-items: center;
  margin: 5px;
  width: 30%;
  height: 140px;
  border: 1px solid rgba(222, 226, 230, 0.6);
}
@-webkit-keyframes blinker {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.5;
  }
}
.picpay img {
  width: 50px;
}
.qr-picpay img {
  border: 1px solid #111;
}
.qr-picpay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.botaodoacao {
  display: flex;
  font-weight: 600;
  font-size: 13px;
  text-align: left;
  justify-content: space-between;
  align-items: center;
  width: 380px;
  margin-right: 18px;
  line-height: 15px;
  max-height: 70px;
  -webkit-box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.35);
  -moz-box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.35);
  box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
  padding: 5px;
  border-radius: 8px;
  color: #dc3545 !important;
  background-color: rgba(255, 245, 157, 0.8);
}
.botaodoacao button {
  text-decoration: blink;
  -webkit-animation-name: blinker;
  -webkit-animation-duration: 1.3s;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-direction: alternate;
  -webkit-box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.35);
  -moz-box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.35);
  box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
  margin: 3px;
  margin-top: 3px !important;
  font-weight: bold;
  color: #dc3545;
  padding: 1px 15px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: grid;
  max-width: calc(99vw);
  grid-template-rows: 10vh 79vh 10vh;
  grid-template-columns: 1fr 120px;
  grid-template-areas:
    "cabecalho cabecalho"
    "conteudo banner"
    "rodape rodape";
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-color: #eceff1;
  overflow: hidden;
  margin: 0 auto;
}
.grid {
  /* border:1px solid #4472C4; */
  border: 1px solid #777;
  border-radius: 5px;
  flex-grow: 1;
  /* max-height: 65vh !important; */
  width: calc(98%) !important;
  margin: 5px auto;
  color: #4472c4;
  overflow: auto;
  position: relative;
}
.banner div {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-right: 0;
  display: flex;
  flex-direction: column;
  height: calc(100%) !important;
}
.banner {
  grid-area: banner;
  /* background-color: #4472c4; */
  margin: 6px 0px;
  border-radius: 5px;
  height: fit-content;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
}
.banner > div > div > div {
  border-radius: 15px;
  transform: scale(0.9);
}
.banner > div,
.banner > div > img,
.banner > div > div {
  width: fit-content;
  flex: 1;
  height: auto;
  /* margin: 1vh auto; */
  border-radius: 8px;
}
.banner > div > div img {
  border-radius: 8px;
}

.rodape {
  height: 90%;
  grid-area: rodape;
  background-color: rgba(119, 119, 119, 0.1);
  width: calc(99%);
  margin: 5px 0 5px 1%;
  margin-bottom: 5px;
  border-radius: 5px;
  -webkit-box-shadow: inset 0px 0px 8px 1px rgba(0, 0, 0, 0.35);
  box-shadow: inset 0px 0px 8px 1px rgba(0, 0, 0, 0.35);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.params {
  max-width: 98vw;
  margin: 5px auto !important;
  width: 98%;
  margin: 3px;
}
.cabecalho {
  grid-area: cabecalho;
  width: 100%;
  max-height: 70px;
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #4472c4;
  align-items: center;
}
.conteudo {
  display: flex;
  flex-direction: column;
  max-height: 81vh;
  max-width: calc(100%);
  flex-grow: 1;
  grid-area: conteudo;
  background-image: url("./assets/logo4-10.png");
}
#app > div.cabecalho > div > img {
  max-width: 60px;
  max-height: 60px;
  margin-right: 10px;
}
#app > div.cabecalho > img {
  max-width: 190px;
  max-height: 100px;
  margin: 10px;
}
.autocomplete {
  float: left;
  position: absolute;
  top: 35px;
  left: 0;
  text-align: left;
  max-height: 250px !important;
  width: 50vw;
  margin: 0 3px;
  overflow: auto;
  font-size: 0.8rem;
  z-index: 99;
  line-height: 16px;
}
.emcima {
  top: auto;
  bottom: 48px !important;
}
.browser {
  position: fixed !important;
  top: 10% !important;
  left: 20%;
  border-radius: 10px;
  text-align: left;
  width: calc(60%) !important;
  height: fit-content !important;
  -webkit-box-shadow: inset 0px 0px 10px 10px rgba(255, 240, 0, 0.65);
  -moz-box-shadow: inset 0px 0px 10px 10px rgba(255, 240, 0, 0.65);
  box-shadow: inset 0px 0px 10px 10px rgba(255, 240, 0, 0.65);
  box-sizing: border-box;
  padding: 25px !important;
  background-color: rgba(153, 0, 0, 0.75);
  color: #fff000;
  font-size: 1rem;
  z-index: 1;
  padding: 10px;
}
.fa {
  cursor: pointer;
}
#banner1 {
  display: none;
}
.divGrid{
  display: flex;
  width:calc(100%)
}
.divGrid table >thead >th{
  max-width: 98vw;
  border: 1px solid #aaa;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  width: 5vw !important;
  max-width: 5vw !important;
  color: #4472c4;
  font-weight: 700;
  vertical-align: middle;
}
.acao{
  color: #43a047  ;
}

</style>
