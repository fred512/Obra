<template>
<div class="conteudoGrid" :class="{'zoom':zoom}">
  <div class="table">
    <div class="tr header" @dblclick="zoom=!zoom">
      <div class="td header" style="width:9%" >Item</div>
      <div class="td header" style="width:9%">Orgão</div>
      <div class="td header" style="width:9%">Código</div>
      <div class="td header" style="width:30%">Descrição</div>
      <div class="td header" style="width:5%">Unid</div>
      <div class="td header" style="width:9%">Qtde&nbsp;</div>
      <div class="td header" style="width:9%">Valor Unit</div>
      <div class="td header" style="width:9%">Valor Total</div>
      <div class="td header" style="width:10%">
        <div class="acao">
          <i class="fa fa-times-circle-o text-danger fa-1x" 
            @click="mostraalerta=false;mostraerro=!mostraerro;"
            :class="{'filtrado':mostraerro}"></i>
          <i class="fa fa-exclamation-circle text-warning" 
            @click="mostraerro=false;mostraalerta=!mostraalerta;"
            :class="{'filtrado':mostraalerta}"></i>
          <i class="fa fa-plus-square fa-1x text-light" @click="addRow()" title="Inserir Item"></i>
        </div>
      </div> 
    </div>
    <div class="tr" v-for="(item,i) in itens" :key="i" @keyup.esc="saiSemGravar(item)" 
        :class="{'composicao':item.composicao,'erro':item.erro.length,'LinhaPar':i%2==0,
        'Selected':item.selecionado,'alerta':item.alerta.length,
        'Grupo':(item.orgao==''&&item.codigo==''&&item.unid==''&&item.qtd==''&&item.vlComBDI==''),
        'Totais':item.descr.indexOf('Total')>-1&&item.codigo!==''}"
        @click="selecionaItem(i)" :ref="'tr-'+i" :id="'linha'+i"
        v-show="!mostraerro&&!mostraalerta||(mostraerro&&item.erro.length>0)||(mostraalerta&&item.alerta.length>0)">
      <div class="td">
        <div>
          <input type="text" v-model="item.item" :disabled="!item.edita" :class="{'editavel':item.edita}"/>
        </div>
      </div>
      <div class="td">
        <div :class="{'hide':(item.orgao==''&&item.codigo==''&&item.unid==''&&item.qtd==''&&item.vlComBDI==''&&!item.add)}">
          <input type="text" v-model="item.orgao" @input="pesquisaOrgaos" :ref="'itm-'+i" 
             :disabled="!item.edita" :class="{'editavel':item.edita}">
          <Autocomplete :campo1="0" :campo2="1"
            :arrayRegistros="registrosOrgao" :class="{'emcima':emcima,'autocompleteAtivo':item.edita}" 
            @retorno="selecionaOrgao($event)"/>
        </div>
      </div>
      <div class="td">
        <div :class="{'hide':(item.orgao==''&&item.codigo==''&&item.unid==''&&item.qtd==''&&item.vlComBDI==''&&!item.add)}">
          <input type="text" id="codigo" v-model="item.codigo" @change="codigo" :disabled="!item.edita"
              :class="{'editavel':item.edita}">
        </div>
      </div>
      <div class="td">
        <div class="descricao">
          <b-form-textarea v-model="item.descr" style="text-align:left" :class="{'editavel':item.edita}"
            @input="pesquisa($event)" tabindex="0" :disabled="!item.edita"
            rows="1" max-rows="6"></b-form-textarea>
          <ul class="autocomplete" ref="auto"
              v-if="Object.keys(ItensPesquisados).length" :class="{'emcima':emcima,'autocompleteAtivo':item.edita}">
            <li v-for="(ItemPesquisado,i) in ItensPesquisados" :key="i" 
                 class="itenLi" tabindex="-1"
                @click="selecItemPesquisado(ItemPesquisado)">
              <textarea type="text" :value="ItemPesquisado.descr" 
                @keyup.enter="selecItemPesquisado(ItemPesquisado)"
                ></textarea>
            </li>
          </ul>
        </div>
      </div>
      <div class="td">
        <div :class="{'hide':(item.orgao==''&&item.codigo==''&&item.unid==''&&item.qtd==''&&item.vlComBDI==''&&!item.add)}">
          <input type="text" v-model="item.unid" :disabled="!item.edita" :class="{'editavel':item.edita}">
        </div>
      </div>
      <div class="td">
        <div :class="{'hide':(item.orgao==''&&item.codigo==''&&item.unid==''&&item.qtd==''&&item.vlComBDI==''&&!item.add)}">
          <input type="number" @change="item.qtd.replace(',','.')"  :disabled="!item.edita"
            @keyup.enter="gravaItem($event,item)" v-model="item.qtd" :ref="'qtd-'+i"
            :class="{'editavel':item.edita}">
        </div>
      </div>
      <div class="td">
        <div :class="{'hide':(item.orgao==''&&item.codigo==''&&item.unid==''&&item.qtd==''&&item.vlComBDI==''&&!item.add)}">
          <input type="text" v-model="item.vlComBDI" @keyup.enter="gravaItem($event,item)"
            :disabled="!item.edita" :class="{'editavel':item.edita}">
        </div>
      </div>
      <div class="td" title="Valor Total do Item">
        <span>{{parseFloat(item.valortot)>0?item.valortot:''}}</span>
      </div>
      <div class="td">
        <div class="acoes">
          <div @click="gravaItem($event,item)" title="Grava Item" v-if="item.edita==true">
            <i class="fa fa-check-square-o text-success"></i>
          </div>
          <div @click="saiSemGravar(item)" title="Sai sem gravar Item" v-if="item.edita==true">
            <i class="fa fa-times text-secondary"></i>
          </div>
          <div @click="editaItem(item)" title="Edita Item" v-if="item.edita==false">
            <i class="fa fa-edit text-info"></i>
          </div>
          <div @click="excluiItem(item)" title="Exclui Item" v-if="item.edita==false">
            <i class="fa fa-trash text-danger"></i>
          </div>
          <!-- <div @click="item.info=true;show=!show" title="Crítica Item"> -->
          <div title="Crítica Item" :id="'info-'+i">
            <i class="fa fa-info-circle text-primary" 
              v-if="(item.orgao!==''&&item.codigo!=='')"></i>
          </div>
        </div>
      </div>
      <b-popover :target="'info-'+i" triggers="hover" placement="left" variant="info"
          >
        <template v-slot:title>Detalhes do Item</template>
        <b-row class="infoItem">
          <div>
            <strong> Item : </strong><span> {{item.item}}</span>
          </div>
          <div>
            <strong> Orgão :</strong> {{item.orgao}}
          </div>
          <div>
            <strong>Data Base : </strong>{{item.base.toUpperCase()}}
          </div>
          <div>
            <strong>Código : </strong>{{item.codigo}}
          </div>
          <div>
            <strong>Unid : </strong>{{item.unid}}
          </div>
          <div>
            <strong>Qtde :</strong> {{item.qtd}}
          </div>
          <div>
            <strong>Preço Referencial : </strong>{{isNaN(item.valor)||item.valor==0?'':item.valor}}
          </div>
          <div>
            <strong>Preço Unitário : </strong>{{isNaN(item.vlComBDI)||item.vlComBDI==0?'':item.vlComBDI}}
          </div>
          <div>
            <strong>Preço Total : </strong>{{parseFloat(item.valortot)>0?item.valortot:''}}
          </div>
        </b-row>
        <b-row class="infoItem">
          <div>
            <strong>Descrição : </strong>{{item.descr}}
          </div>
        </b-row>
        <b-row class="infoItem" v-if="item.erro.length">
          <div>
            <strong>Erros : </strong>{{item.erro.length}}<br>
            <div v-for="(erro,index1) in item.erro" :key="index1" class="infoErro">
              <i class="fa fa-thumbs-down text-danger fa-2x"></i>
                &nbsp;{{erro.erro}}
            </div>
          </div>
        </b-row>
        <b-row class="infoItem" v-if="item.alerta.length">
          <div>
            <strong>Avisos : </strong>{{item.alerta.length}}<br>
            <div v-for="(alerta,indexa) in item.alerta" :key="indexa" class="infoErro">
              <i class="fa fa-exclamation-triangle text-warning fa-2x"></i>
                &nbsp;{{alerta.alerta}}
            </div>
          </div>
        </b-row>
      </b-popover>
    </div>
  </div>
  <Loading :loading="loading" />
</div>
</template>

<script>
import Autocomplete from './autocomplete'
import Loading from './loading'
import apiMixin from '../apiMixin'
export default {
  name: 'itensPlanilha',
  components:{Autocomplete,Loading},
  props: [],
  mixins:[apiMixin],
  data: function(){
    return {
      zoom:false,
      add:false,
      emcima:false,
      jafoi:false,
      BDI:'',
      orgao:'',
      base:'',
      UF:'',
      desonerado:'',
      orgaos:[],
      bases:[],
      descr:'',
      ItensPesquisados:[],
      registrosBase:'',
      registrosOrgao:[],
      focus:99,
      mostraerro:false,
      mostraalerta:false,
    }
  },
  methods:{
    editaItem(item){
      this.itens.map(function(el){
        return el.edita=false
      })
      this.selecionado=item.id
      item.edita=true
    },
    chamaItens(){
      this.$bvModal.show('modal-itens')
    },
    toast(msg,variant) {
      this.$bvToast.toast(msg, {
        title: `Mensagem`,
        toaster: 'b-toaster-top-center',
        solid: true,
        variant:variant,
      })
    },
    naoedita(item){
      if (item.descr=='') setTimeout(function(){ item.edita=false }, 1000);
      this.ItensPesquisados=[]
    },
    selecionaOrgao(item){
      this.itens[this.selecionado].orgao=item.orgao
      this.itens[this.selecionado].base=item.base
      this.registrosOrgao=[]
      // this.$forceUpdate()
    },
    async codigo({type, target}){
      if (type=='change'){
        var item=this.itens[this.selecionado]
        var BDI=this.params.BDI
        var url='codigo.asp?uf='+this.params.UF+'&codigo='+target.value+
         '&base='+this.itens[this.selecionado].base+'&orgao='+this.itens[this.selecionado].orgao
        var referencia= await this.$http.get(url)
        .then(res => {
          return res.data[0]
        })
        if (referencia==''||referencia==undefined) return ''
        var valor=0
        if (this.params.desonerado==1){
          valor=referencia.precodeson
        } else{
          valor=referencia.precooner
        }
        item.valor=valor
        item.unid=referencia.unid
        item.descr=referencia.descr
        item.vlComBDI=parseFloat(valor*(1+(BDI/100))).toFixed(2)
        item.valortot=parseFloat(item.vlComBDI*item.qtd).toFixed(2)
        this.$refs["qtd-" + (this.selecionado)][0].focus()
        this.$forceUpdate()
      }
    },
    pesquisaOrgaos({target}){
      if (target.value.length<4) return
      if (this.itens[this.selecionado].orgao=='') return
      var base=this.params.base
      this.$http.get('carregaorgao.asp?uf='
        +this.params.UF+'&orgao='+target.value+'&base='+base)
      .then(res => {
        var regs=[],flag=false
        if (JSON.stringify(res.data).toLowerCase().indexOf(base.toLowerCase())>0) flag=true
        for (var i=0;i<Object.keys(res.data).length;i++){
          if (flag&&res.data[i].base==base) regs.push(res.data[i])
          if (!flag&&res.data[i].base!==base) regs.push(res.data[i])
          if (regs.length>0) return
        }
        this.registrosOrgao=regs
        this.$forceUpdate()
      })
    },
    removeAcento(text){       
        text = text.toLowerCase();                                                         
        text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
        text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
        text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
        text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
        text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
        text = text.replace(new RegExp('[Ç]','gi'), 'c');
        return text;                 
    },
    pesquisa(el){
      var target=el.toString()
      if (target.length<6) return
      if (this.itens[this.selecionado].orgao=='') {
        this.toast('Informe o orgão para consultar itens','warning')
        return
      }
      this.$store.commit('setLoading',true);
// this.loading=true
      var url='descricao.asp?uf='
        +this.params.UF+
        '&descr='+this.removeAcento(target)+
        '&orgao='+this.itens[this.selecionado].orgao+
        '&base='+this.itens[this.selecionado].base
      this.$http.get(url)
      .then(res => {
        this.ItensPesquisados=res.data
        this.$store.commit('setLoading',false);
        // this.loading=false
        this.$forceUpdate()
      })
    },
    selecItemPesquisado(ItemPesquisado){
      this.itens[this.selecionado].orgao=ItemPesquisado.orgao
      this.itens[this.selecionado].codigo=ItemPesquisado.codigo
      this.itens[this.selecionado].descr=ItemPesquisado.descr
      this.itens[this.selecionado].base=ItemPesquisado.base
      if (this.params.desonerado=="1"){
        this.itens[this.selecionado].valor=ItemPesquisado.precodeson
      }
      else{
        this.itens[this.selecionado].valor=ItemPesquisado.precooner
      }
      this.itens[this.selecionado].unid=ItemPesquisado.unid
      this.itens[this.selecionado].vlComBDI=parseFloat(this.itens[this.selecionado].valor*(1+(this.params.BDI/100))).toFixed(2)
      this.$bvModal.hide('modal-1')
      this.$refs["qtd-" + (this.selecionado)][0].focus()
      this.ItensPesquisados=[]
    },
    selecionaItem(i){
      this.itens.forEach(function(k){
        k.selecionado=false
        // k.edita=false
      })
      if (i>=this.itens.length) i=this.itens.length-1
      this.itens[i].selecionado=true
      this.selecionado=i
      this.add=false
      // var elem=this.$refs["tr-" + (this.selecionado)][0]
      // setTimeout(() => {
      //   elem.scrollIntoViewIfNeeded()
      //   elem.scrollIntoView()
      //   document.querySelector('#app > div.conteudo > div.grid').scrollTop=elem.offsetTop-200
      // }, 100,elem);
      this.$forceUpdate()
    },
    saiSemGravar(item){
      item.edita=false
      var i=item.id
      this.ItensPesquisados=[]
      this.jafoi=false
      this.emcima=false
      if (item.descr=='') this.itens.splice(i,1)
      this.$store.commit('calculatotal');
    },
    async gravaItem(e,item){
      if (e.srcElement.id=='codigo') return
      var critica = await this.criticaItem(item,this.params,this)
      item.erro = JSON.parse(critica.split('||')[0])
      item.alerta = JSON.parse(critica.split('||')[1])
      var refer=critica.split("||")[2]
      if (item.valor == ""&&refer!==undefined) item.valor = critica.split('||')[2]
      this.$store.commit('gravaItens', this.itens);
      var i=item.id
      this.selecionado=i
      if (item.add){
        this.addRow()
        this.add=false
      }
      item.edita=false
      item.add=false
      this.ItensPesquisados=[]
      this.$store.commit('calculatotal');
      this.$forceUpdate()
    },
    excluiItem(item){
      var id=item.id
      this.itens.splice(id,1)
      this.$store.commit('gravaItens', this.itens);
      localStorage.setItem('itens', JSON.stringify(this.itens));
      this.$store.commit('calculatotal');
    },
    consulta(){
      this.$http.get('carregaorgao.asp?uf=ES'
      ).then(res=>{
        this.orgaos=res.data
        this.orgao='Escolha o Orgão'
      })
      this.$http.get('carregabase.asp?uf='+this.UF
      ).then(res=>{
        this.bases=res.data
      })
      this.$bvModal.show('modal-1')
    },
    async addRow(){
      if (this.mostraerro||this.mostraalerta){
        alert ('Desative os filtros de Erro/Alerta para inserir itens')
        return
      }
      if (this.params.base==undefined||this.params.base==''){
        alert ('É necessário selecionar uma Data Base para inserir itens')
        return
      }
      if (this.itens.length>1&&this.selecionado==undefined){
        alert('Selecione um item para inserir outro item apos este !')
        return
      }
      this.$forceUpdate()
      this.add=true
      var indice=0
      var item={"id":"","item":"","orgao":"","codigo":"","base":this.params.base,"descr":"","unid":"","qtd":"","valor":"","valortot":"","selecionado":true,"edita":true,"vlComBDI":0,"add":true,'erro':[],'alerta':[]}
      if (this.itens.length>0){
        indice=this.selecionado
        item.id=indice+1
        item.edita=true
        item.base=this.itens[indice].base
        item.orgao=this.itens[indice].orgao
        this.itens.splice(indice+1,0,item)
        this.selecionado=indice+1
      }
      else{
        this.itens.push(item)
        for (var id=1;id<this.itens.length;id++){
          this.item.id=id
        } 
      }
      this.selecionado=indice+1
      this.jafoi=true
      this.emcima=false
      setTimeout(() => {
        var elem=this.$refs["tr-" + (this.selecionado)][0]
        document.querySelector('#app > div.conteudo > div.grid').scrollTop=elem.offsetTop-200
      }, 200);
    },
  },
  updated(){
    if (this.add) {
      this.add=false
      var linha=this.selecionado
      this.$refs["itm-" + (linha)][0].focus()
      this.$refs["tr-" + (linha)][0].scrollIntoView()
    }  
    if ((this.itens.length-this.selecionado)<4&&this.itens.length>5){
      this.emcima=true
      this.jafoi=false
    }
  },
  created(){
    setTimeout(() => {
      this.selecionado=0
    }, 1500);
  },
  watch:{
    itens:{
      handler: function(novo){
        // this.$store.commit('gravaItens', novo);
        this.$store.commit('calculatotal')
        novo
      },
      deep:true   
    },
  },
  mounted() {
    // const self=this
    // window.addEventListener("keypress", e => {
    //   if (e.keyCode==43) {
    //     e.stopPropagation()
    //     e.preventDefault()
    //     self.addRow()
    //   }
    // });
  },
  computed:{
    loading(){
      return this.$store.state.loading
    },
    itens(){
      return this.$store.state.itens
    },
    params(){
      return this.$store.state.params
    },
    // ItensFiltrados(){
    //   var itensfiltrados=[]
    //   if (this.mostraerro){
    //     itensfiltrados=this.itens.filter(item=>{
    //       return item.erro.length
    //     })
    //   }
    //   else if (this.mostraalerta){
    //     itensfiltrados=this.itens.filter(item=>{
    //       return item.alerta.length&&!item.erro.length
    //     })
    //   }
    //   else{
    //     itensfiltrados = this.itens
    //   }
    //   return itensfiltrados
    // },
    // disparaAtualizacao(){
    //   return this.$store.state.disparaAtualizacao
    // }
  },

}
</script>

<style>
  .descricao{
    margin: 10px auto !important;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .conteudoGrid{
    width: 100%;
    max-width: 98vw;
    position: relative;
  }
  .table  > .tr > .td {
    height: 100%;
    max-width: 98vw;
    vertical-align: middle !important;
  }
  .table >  .tr > .td > div   {
    height: 100% !important;    
    vertical-align: middle !important;
    width: 100%;
  }
  .table > .tr > .td:nth-child(6),
  .table > .tr > .td:nth-child(7),
  .table > .tr > .td:nth-child(8),
  .table > .tr > .td:nth-child(6) >div > span,
  .table > .tr > .td:nth-child(7) >div > span,
  .table > .tr > .td:nth-child(8) >div > span
  {
    text-align: right;
    width: fit-content;
    max-width: 170px;
  }
  .table > .tr > .td:nth-child(9){
    text-align: right;
    vertical-align: middle !important;
    font-weight: 700;
  }
  .table > .header.tr {
    margin-top: 0;
    max-width: 98vw;
  }
  .table > .header > .tr > .th{
    color: #4472c4;
    padding-top: 0 !important;
    border:1px solid rgba(0,0,0,0.3) !important;
  }
  .table{
    border-spacing: 0;
    max-width: 98vw;
  }
  .acoes div{
    display: flex !important;
    justify-content: space-around !important;
    align-items: center;
    width: 30%;
  }
  .divGrid{
    height: 100%;
  }
  .divGrid > table >tbody>tr >td{
    color: #4472c4;
    width: 7vw !important;
    max-width: 7vw !important;
    vertical-align: middle;
    padding: 3px;
  }
  .table > .tr {
    max-width: 98vw;
    border:1px solid rgba(255,255,255,0.9);
    color: #4472c4;
  }
  .form-inline{
    margin:10px auto !important;
  }
  .table > .tr > .td > div {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px;
    position: relative;
  }
  .table > .tr > .td > div > textarea,
  .table > .tr > .td > div > select,
  .table > .tr > .td > div > input{
    width: 100% ;
    /* font-size: 0.9rem; */
    color: #4472c4;
    padding: 1px;
    font-size: .9rem;
    text-align: center;
    background-color: transparent;
    border:none;
    vertical-align: middle;
    overflow: hidden !important;
  }
  .table > .tr > .td:nth-child(1) {
    width: fit-content;
  }
  .table > .tr > .td:nth-child(4){
    text-align: left;
  }
  .table > .tr.header> .td:nth-child(6),
  .table > .tr.header> .td:nth-child(7){
    text-align: center;
  }
  .table > .tr.header> .td:nth-child(7) ,
  .table > .tr > .td:nth-child(7) div ,
  .table > .tr > .td:nth-child(7) input {
    /* width: fit-content; */
    max-width: 160px;;
  }
  .table > .tr.header> .td:nth-child(6) ,
  .table > .tr > .td:nth-child(6) div ,
  .table > .tr > .td:nth-child(6) input {
    max-width: 140px;
    width: fit-content;
  }
  .table >tbody > tr >td:last-child i:last-child{
    color:#e53935 ;
  }
  table >tbody > tr >td:last-child i:first-child{
    color: #43a047;
    margin-top: 10px;
  } 
  .tr.LinhaPar{
    background-color: rgba(213, 213, 213, 0.8);
  }
  .Selected{
    /* background-color: #ffab40 !important; */
    border:2px solid rgba(68,114,196,0.6);
    -webkit-box-shadow: inset 0px 0px 4px 4px rgba(68,114,196,.7);
    -moz-box-shadow: inset 0px 0px 4px 4px rgba(68,114,196,.7);
    box-shadow: inset 0px 0px 4px 4px rgba(68,114,196,.7);
    position: relative;
  }
  #base{
    width: 100px;
    text-transform: uppercase;
  }
  #descr{
    /* width: 90%; */
    height: 35px;
  }
  label{
    margin-bottom: -1px !important;
  }
  #orgao,#base{
    color: #4472c4 !important;
    width: auto;
    height: 35px;
  }
  ul.autocomplete{
    list-style-type: none;
    display:none;
    padding-inline-start:0 !important;
    margin-top:-8px !important;
    margin-left: 0px !important;
  }
  ul.autocompleteAtivo{
    display: block;
  }
  ul.autocomplete > li >textarea{
    background-color:#fff9c4 !important;
    padding: 0.4rem 0.4rem !important;
    font-weight: 400;
    resize: none;
    color: #1b5e20;
    text-decoration: none;
    border-radius: 3px;
    width: 100%;
    background-color: transparent;
    border:none;
  }
  ul.autocomplete > li >textarea:focus{    
    background-color: #1b5e20 !important;
    color: #fff9c4;
  }


  /*Here is the magic:*/
  .td.header {
    background-color: #4472c4;
    color: #fff;
    position: sticky;
    top:0px;
    z-index: 1;
    font-weight: 600 !important;
  }
  .td.header.acao{
    width: auto;
    display: flex;
    justify-content: space-between;
  }
  .table {
    display: table;
    width: 100%;
  }
  .tr {
    display: table-row;
  }

  .thead {
    display: table-header-group;
  }
  .table > .tr > .td:last-child i{
    margin: 5px;
    font-size: 1.5rem;
    padding: 0;
  }
  .table > .header.tr > .td:last-child i{
    font-size:30px;
    padding: 5px 0;
  }
  .td, .th {
    padding: 5px;
    display: table-cell;
  }
  .th {
    display: table-header-group;
  }
  .fa-edit{
    margin-top: 8px !important;
  }
  .Grupo{
    background-color:rgba(40, 167, 69, 0.3) !important;
    -webkit-box-shadow: inset 0px 0px 3px 1px rgba(68,114,196,.6);
    -moz-box-shadow: inset 0px 0px 3px 1px rgba(68,114,196,.6);
    box-shadow: inset 0px 0px 3px 1px rgba(68,114,196,.6);
    color:#fff !important;
  }
  .Grupo .td div,
  .Grupo .td div textarea,
  .Grupo .td div input{
    font-size: 1.3rem !important;
    font-weight: bold !important;
    text-align: right;
  }
  .Totais .td div,
  .totais .td span{
    justify-content: flex-end !important;
    font-weight: 700;
  }
  .Totais .td:nth-child(9) > div{
    justify-content: center !important;
  }
  .alerta input,
  .alerta textarea,
  .alerta{
    color: #ffc107!important;
    font-weight: 700;
  }
  .erro,
  .erro textarea,
  .erro input{
    color: #dc3545 !important;
    font-weight: 700;
  }
  .acoes{
    display: flex;
    justify-content: space-around !important;
  }
  .hide{
    display:none !important;
  }
  .popover{
    max-width: 80% !important;
    right: 100px !important;
    -webkit-box-shadow: inset 0px 0px 3px 2px rgba(68,114,196,.6);
    -moz-box-shadow: inset 0px 0px 3px 2px rgba(68,114,196,.6);
    box-shadow: inset 0px 0px 3px 2px rgba(68,114,196,.6);
  }
  .infoItem{
    display: flex !important;
    justify-content: flex-start !important;
    padding: 5px;
  }
  .infoItem div{
    margin-left: 15px;
    border-bottom: 1px solid #aaa;
    border-left: 1px solid #aaa;
    padding: 3px;
  }
  .editavel{
    background-color: #fff9c4 !important;
    border:1px solid #aaa;
  }
  .table .tr:hover{
    /* color: #43a047  !important; */
    /* background-color: rgba(187, 222, 251, 0.4) !important; */
    background-color: rgba(0,0,0,.3) !important;
    -webkit-box-shadow: inset 0px 0px 4px 4px rgba(0,0,0,.21);
    -moz-box-shadow: inset 0px 0px 4px 4px rgba(0,0,0,.21);
    box-shadow: inset 0px 0px 4px 4px rgba(0,0,0,.21);
  }
  .zoom{
    transform: scale(0.5);
  }
  .filtrado{
    border-bottom: 3px solid #fff;
  }
</style>
