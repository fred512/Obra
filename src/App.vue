<template>
  <div id="app">
    <div class="cabecalho">
      <img alt="PDO logo" src="./assets/logo-pdo-azul.png">
      <div class="botoes">
      </div>
      <img alt="PDO logo" src="./assets/pdo-logo.png">
    </div>
    <div class="conteudo">
      <div class="params">
        <keep-alive>
          <Params/>
        </keep-alive>
      </div>
      <div class="grid" ref="grid">
        <keep-alive>
          <Grid />
        </keep-alive>
      </div>
    </div>
    <div class="rodape">
      <keep-alive>
        <Rodape />
      </keep-alive>
    </div>
    <div class="banner">

    </div>
  </div>
</template>

<script>
import Params from "@/components/params.vue"
import Grid from "@/components/grid.vue"
import Rodape from "@/components/rodape.vue"
export default {
  name: 'app',
  components: { Params,Grid,Rodape  },
  mounted() {
    if (localStorage.getItem('itens')) {
      this.$store.commit('gravaItens',JSON.parse(localStorage.getItem('itens')));
    }
    if (localStorage.getItem('params')) {
      this.$store.commit('gravaParams',JSON.parse(localStorage.getItem('params')));
    }
    const container = this.$el.querySelector(".grid")
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 1500);
  },

}
</script>

<style>
body{
  margin: 0;
  padding: 0;
  max-width: 100vw;
}

.botoes > img{
  max-width: 50px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: grid;
  max-width: calc(98vw);
  grid-template-rows: 10vh 79vh 10vh;
  grid-template-columns: 1fr 10px;
  grid-template-areas: 
    "cabecalho cabecalho"
    "conteudo banner"
    "rodape banner";
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-color: #eceff1 ;
  overflow: hidden;
}
.grid{
  /* border:1px solid #4472C4; */
  border:1px solid #777;
  border-radius: 5px;
  flex-grow: 1;
  /* max-height: 65vh !important; */
  max-width: calc(98%) !important;
  margin:5px auto;
  color:#4472C4;
  overflow: auto;
  position: relative;
}
.banner{
  grid-area: banner;
  height: 100%;
  background-color: #6c757d;
}
.rodape{
  max-width: 98vw;
  height: 90%;
  grid-area: rodape;
  background-color: rgba(119, 119, 119, 0.1);
  width: 98%;
  margin: 5px auto;
  margin-bottom: 5px;
  border-radius: 5px;
  -webkit-box-shadow: inset 0px 0px 8px 1px rgba(0,0,0,0.35);
  box-shadow: inset 0px 0px 8px 1px rgba(0,0,0,0.35);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.params{
  max-width: 98vw;
  margin:5px auto !important;
  width: 98%;
  margin: 3px;
}
.cabecalho{
  grid-area: cabecalho;
  width: 100%;
  max-width: 98vw;
  max-height:70px;
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #4472C4;
  align-items: center;
}
.conteudo{
  display: flex;
  flex-direction: column;
  max-height: 81vh;
  max-width: calc(100%);
  flex-grow: 1;
  grid-area: conteudo;
  background-image: url('./assets/logo4-8.png');
}
#app > div.cabecalho > img:nth-child(3){
  max-width: 48px;
  max-height: 48px;
  margin-right: 15px;
}
#app > div.cabecalho > img{
  max-width: 190px;
  max-height: 100px;
  margin: 10px;
}
.autocomplete{
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
.emcima{
  top: auto;
  bottom: 35px !important;
}
</style>
