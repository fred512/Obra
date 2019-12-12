<template>
  <div class="resumo">
    <div class="contato text-info">
      <i class="fa fa-envelope fa-2x"></i> &nbsp;{{contato}}
    </div>
    <div class="tutoriais">
      <i class="fa fa-search" @click="showIframe"></i>
      Pesquisa Itens
    </div>
    <div class="total text-danger">
      <span>
        Total de Itens:{{itens.length}}     
      </span>
      <span>
        Total Orçamento: {{valortotal.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}}
      </span>
    </div>
    <div class="iframe" v-if="iframeWeb">
      <span>Clique no ícone <i class="fa fa-search"></i>' Pesquisa Itens' para sair</span>
      <b-embed
          type="iframe"
          aspect="21by9"
          src="http://www.netshake.net.br/itensreferencia"
          allowfullscreen
        ></b-embed>
    </div>
    <div class="iframe" v-if="iframeIntranet">
      <span>Clique no ícone <i class="fa fa-search"></i>' Pesquisa Itens' para sair</span>
      <b-embed
        type="iframe"
        aspect="21by9"
        src="http://www.gigovvt.es.caixa/itensreferencia"
        allowfullscreen
      ></b-embed>
    </div>
  </div>
</template>

<script>
export default {
  name:'rodape',
  data:function(){
    return{
      iframeWeb:false,
      iframeIntranet:false
    }
  },
  methods:{
    showIframe(){
      var local=location.host
      if (local.indexOf('localhost:8082')>-1||
          local.indexOf('www.gigovvt')>-1) {
            this.iframeIntranet=!this.iframeIntranet
          }else{
            this.iframeWeb=!this.iframeWeb
          }
    },
  },
  mounted(){
    this.$store.commit('calculatotal');
    const self=this
    window.addEventListener("keypress", e => {
      if (e.keyCode==27) {
        e.stopPropagation()
        self.iframeIntranet=false
        self.iframeWeb=false
      }
    });
  },
  computed:{
    valortotal:function(){
      if (isNaN(parseFloat(this.$store.state.totvalor))) return 0
      return parseFloat(this.$store.state.totvalor)
    },
    itens(){
      return this.$store.state.itens.filter(function(el){
        return el.codigo!==''&&el.orgao!==''?el:''
      })
    },
    contato(){
      return this.$local.indexOf('www.gigovvt')>-1 ? "carlos.m.borges@caixa.gov.br": "contato@planilhadeobra.site"
    }
  },
}
</script>

<style>
  .total  {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    font-weight: bold;
  }
  .resumo{
    padding: 10px;
    display:flex;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    margin-right: 10px;
    color:#4472C4;
  }
  .tutoriais{
    color:#4472C4;
    font-size:13px;
    font-weight: 700;
    display:flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .tutoriais i{
    padding: 0;
    margin-bottom: -5px;
    font-size: 1.6rem;
    margin-bottom: 2px;
  }
  .atualiza{
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(255, 193, 7,1);
  }  
  .iframe{
    width: 85%;
    max-height: 50vh;
    margin: 0 auto;
    z-index: 1;
    position: fixed;
    top:20%;
    left:7%;
    background-color: #ddd;
  }
  .iframe span{
    position: fixed;
    top: 21%;
    width: 65%;
    left: 15%;
    z-index: 99;
    font-size: 30px;
    font-weight: bold;
    background-color: #ffff00;
  }
  .contato{
    font-size: 1.2rem;
    font-weight: 600;
    display: flex;
    align-items: center;
  }

</style>