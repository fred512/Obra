<template>
  <div class="resumo">
    <div class="contato text-info">
      <i class="fa fa-envelope fa-2x" style="cursor:default !important"></i>
      &nbsp;&nbsp;&nbsp;{{contato}}
    </div>
    <div class="tutoriais">
      <i class="fa fa-youtube-play text-danger" v-b-modal.modal-videos></i>
      Video Tutoriais
    </div>
    <div class="tutoriais">
      <i class="fa fa-search" @click="showIframe"></i>
      Pesquisa Itens
    </div>
    <div class="total text-danger">
      <span>Total de Itens:{{itens.length}}</span>
      <span>Total Orçamento: {{valortotal.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}}</span>
    </div>
    <div class="iframe" v-if="iframeWeb">
      <span title="Sair da Pesquisa Itens">
        <i class="fa fa-close fa-3x text-danger" @click="iframeWeb=false"></i>
      </span>
      <b-embed
        type="iframe"
        aspect="21by9"
        src="http://www.netshake.net.br/itensreferencia"
        allowfullscreen
      ></b-embed>
    </div>
    <div class="iframe" v-if="iframeIntranet">
      <span title="Sair da Pesquisa Itens">
        <i class="fa fa-close fa-3x text-danger" @click="iframeIntranet=false"></i>
      </span>
      <b-embed
        type="iframe"
        aspect="21by9"
        src="http://www.gigovvt.es.caixa/itensreferencia"
        allowfullscreen
      ></b-embed>
    </div>
    <div class="iVideos" v-show="iVideos">
      <span title="Sair do Vídeo Tutorial">
        {{tipo}}
        <i class="fa fa-close fa-2x text-danger" @click="iVideos=false"></i>
      </span>
      <video controls src id="videoRef" autoplay>
        -->
        <!-- <source :src="urlVideo" type="video/webm" /> -->
      </video>
    </div>
    <b-modal
      id="modal-videos"
      size="xl"
      header-bg-variant="info"
      header-text-variant="light"
      body-bg-variant="info"
      footer-bg-variant="info"
      body-text-variant="danger"
      ok-only
      hide-backdrop
      content-class="shadow"
      title="Vídeos Tutoriais"
      @ok="$bvModal.hide('modal-videos');mostralinkservidor=false"
    >
      <div class="videos">
        <b-list-group>
          <b-list-group-item v-for="(video,i) in videos" :key="i" @click="exibeVideo(video)">
            <span>{{i+1}}&nbsp;-&nbsp;</span>
            {{video.descricao}}
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "rodape",
  components: {},
  data: function() {
    return {
      player: null,
      iframeWeb: false,
      iframeIntranet: false,
      iVideos: false,
      videos: [],
      mostralinkservidor: false,
      urlVideo: "",
      tipo: ""
    };
  },
  methods: {
    showIframe() {
      var local = location.host;
      if (
        local.indexOf("localhost:8082") > -1 ||
        local.indexOf("www.gigovvt") > -1
      ) {
        this.iframeIntranet = !this.iframeIntranet;
      } else {
        this.iframeWeb = !this.iframeWeb;
      }
    },
    exibeVideo(vid) {
      this.$bvModal.hide("modal-videos");
      this.urlVideo = vid.url;
      this.tipo = vid.descricao;
      var video = document.getElementById("videoRef");
      this.iVideos = true;
      video.src = vid.url;
      video.play();
    }
  },
  mounted() {
    this.$store.commit("calculatotal");
    const self = this;
    this.videos = [
      {
        descricao: "Como digitar uma planilha do zero",
        url: "./videos/PlanilhaZero.webm"
      },
      {
        descricao: "Como carregar uma planilha já existente",
        url: "./videos/CarregaPlanilha.webm"
      },
      {
        descricao: "Verificar irregularidades em uma planilha existente",
        url: "./videos/RelatorioIrregularidades.webm"
      },
      {
        descricao: "Alteração de Data Base de uma planilha existente",
        url: "./videos/AlteraDataBase.webm"
      },
      {
        descricao: "Incluir composições próprias",
        url: "./videos/IncluiComposicao.webm"
      }
    ];
    window.addEventListener("keypress", e => {
      if (e.keyCode == 27) {
        e.stopPropagation();
        self.iframeIntranet = false;
        self.iframeWeb = false;
      }
    });
  },
  computed: {
    valortotal: function() {
      if (isNaN(parseFloat(this.$store.state.totvalor))) return 0;
      return parseFloat(this.$store.state.totvalor);
    },
    itens() {
      return this.$store.state.itens.filter(function(el) {
        return el.codigo !== "" && el.orgao !== "" ? el : "";
      });
    },
    contato() {
      return this.$local.indexOf("www.gigovvt") > -1
        ? "carlos.m.borges@caixa.gov.br"
        : "contato@planilhadeobra.site";
    }
  }
};
</script>

<style>
.total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  font-weight: bold;
}
.resumo {
  padding: 10px;
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  margin-right: 10px;
  color: #4472c4;
}
.tutoriais {
  color: #4472c4;
  font-size: 13px;
  cursor: pointer;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.tutoriais i {
  padding: 0;
  margin-bottom: -5px;
  font-size: 1.6rem;
  margin-bottom: 2px;
}
.atualiza {
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(255, 193, 7, 1);
}
.iframe {
  width: 85%;
  max-height: 50vh;
  margin: 0 auto;
  z-index: 1;
  position: fixed;
  top: 20%;
  left: 7%;
  background-color: #ddd;
}
.iframe span {
  position: fixed;
  top: 21%;
  width: fit-content !important;
  left: 84%;
  z-index: 99;
  font-size: 30px;
  font-weight: bold;
  /* background-color: #ffff00; */
}
.contato i {
  margin-right: 3px;
  font-size: 26px;
}
.contato {
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}
.iVideos {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  z-index: 99;
  position: fixed;
  max-height: 90%;
  top: 5%;
  left: 7%;
  padding: 10px;
  padding-right: 3px !important;
  background-color: rgba(27, 94, 32, 05);
  -webkit-box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 3, 0.8);
  box-shadow: 2px 2px 10px 4px rgba(0, 0, 3, 0.8);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.iVideos video {
  max-height: 85% !important;
  max-width: 90% !important;
}
.iVideos span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 500;
  padding: 0 10px;
  color: #fff;
}
.iVideos span i {
  margin-left: 50px;
}

.list-group-item {
  font-weight: 600;
  cursor: pointer;
  font-size: 1.3rem;
  padding: 0.2rem 1.25rem;
  -webkit-box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 3, 0.8);
  -moz-box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 3, 0.8);
  box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 3, 0.8);
  box-sizing: border-box;
}
</style>