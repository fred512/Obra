<template>
<div class="conteudoGrid">
  <table class="table table-sm table-striped table-hover">
    <thead>
      <tr>
        <th>Item</th>
        <th>Orgão</th>
        <th>Código</th>
        <th>Descrição</th>
        <th>Unid</th>
        <th>Qtde</th>
        <th>Valor Unit</th>
        <th>Valor Total</th>
        <th class="acao">
          <i class="fa fa-plus-square fa-2x" @click.native="addRow()"></i>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item,i) in itens" :key="i" @keyup.enter="gravaItem()"
        :class="{'LinhaPar':i%2==0,'Selected':item.selecionado}"  @click.native="selecionaItem(item,i)">
        <td>
          <div v-if="item.edita">
            <input type="text" v-model="item.item" :ref="'itm-'+i" />
          </div>
          <div v-else>
            <span>{{item.item}}</span>
          </div>
        </td>
        <td>
          <div v-if="item.edita">
            <input type="text" v-model="item.orgao">
          </div>
          <div v-else>
            <span>{{item.orgao}}</span>
          </div>
        </td>
        <td>
          <div v-if="item.edita">
            <input type="text" v-model="item.codigo">
          </div>
          <div v-else>
            <span>{{item.codigo}}</span>
          </div>
        </td>
        <td>
          <div v-if="item.edita" class="descricao">
            <input type="text" v-model="item.descr" style="text-align:left" 
              @input="pesquisa">
          </div>
          <div v-else style="justify-content: flex-start !important;">
            <span>{{item.descr}}</span>
          </div>
        </td>
        <td>
          <div v-if="item.edita">
            <input type="text" v-model="item.unid">
          </div>
          <div v-else>
            <span>{{item.unid}}</span>
          </div>
        </td>
        <td>
          <div v-if="item.edita">
            <input type="text" v-model="item.qtd" :ref="'qtd-'+i">
          </div>
          <div v-else>
            <span>{{item.qtd}}</span>
          </div>
        </td>
        <td>
          <div v-if="item.edita">
            <input type="text" v-model="item.valor">
          </div>
          <div v-else>
            <span>{{item.valor}}</span>
          </div>
        </td>
        <td>
          <span>{{(item.valor*item.qtd)>0?(item.valor*item.qtd):''}}</span>
        </td>
        <td>
          <div class="acoes" v-if="item.edita">
            <i class="fa fa-check-square-o" @click.native="gravaItem()"></i>
            <i class="fa fa-sign-out text-secondary" @click.native="saiSemGravar(i)"></i>
          </div>
          <div class="acoes" v-else>
            <i class="fa fa-edit" @click="item.edita=true"></i>{{item.edita}}
            <i class="fa fa-trash" @click.native="excluiItem(i,0)"></i>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <b-list-group class="autocomplete" >
    <b-list-group-item v-for="(ItemPesquisado,i) in ItensPesquisados" :key="i" @click.native="selecItemPesquisado(ItemPesquisado)">
      {{ItemPesquisado.descr}}
    </b-list-group-item>
  </b-list-group>
</div>
</template>

<script>
export default {
  name: 'itens',
  props: {},
  data: function(){
    return {
      add:false,
      BDI:'',
      orgao:'',
      base:'',
      UF:'',
      desonerado:'',
      orgaos:[],
      bases:[],
      descr:'',
      ItensPesquisados:[],
      file:''
    }
  },
  methods:{
    pesquisa({target}){
      if (target.value.length<5) return
      this.$http.get('http://www.netshake.net.br/obra/asp/descricao.asp?uf='
        +this.params.UF+
        '&descr='+this.itens[this.selecionado].descr+
        '&orgao='+this.itens[this.selecionado].orgao+
        '&base='+this.params.base)
      .then(res => {
        this.ItensPesquisados=res.data
        this.$forceUpdate()
      })
    },
    selecItemPesquisado(ItemPesquisado){
      this.itens[this.selecionado].orgao=ItemPesquisado.orgao
      this.itens[this.selecionado].codigo=ItemPesquisado.codigo
      this.itens[this.selecionado].descr=ItemPesquisado.descr
      this.itens[this.selecionado].base=ItemPesquisado.base
      if (this.params.desonerado){
        this.itens[this.selecionado].valor=ItemPesquisado.precodeson
      }
      else{
        this.itens[this.selecionado].valor=ItemPesquisado.precooner
      }
      this.itens[this.selecionado].unid=ItemPesquisado.unid
      // this.itens[this.selecionado].edita=false
      this.$bvModal.hide('modal-1')
      this.$refs["qtd-" + (this.selecionado)][0].focus()
      this.ItensPesquisados=[]
    },
    selecionaItem(item,i){
      this.itens.forEach(function(k){
        k.selecionado=false
      })
      item.selecionado=!item.selecionado
      this.selecionado=i
      this.add=false
    },
    gravaItem(){
      this.$store.commit('gravaItens', this.itens);
      this.addRow()
    },
    saiSemGravar(i){
      this.itens[this.selecionado].edita=false
      this.ItensPesquisados=[]
      if (this.itens[this.selecionado].descr=='') this.itens.splice(i,1)
    },
    excluiItem(i){
      this.itens[this.selecionado].edita=false
      this.itens.splice(i,1)
      localStorage.setItem('itens', JSON.stringify(this.itens));
    },
    consulta(){
      this.$http.get('http://www.netshake.net.br/obra/asp/carregaorgao.asp?uf=ES'
      ).then(res=>{
        this.orgaos=res.data
        this.orgao='Escolha o Orgão'
      })
      this.$http.get('http://www.netshake.net.br/obra/asp/carregabase.asp?uf='+this.UF
      ).then(res=>{
        this.bases=res.data
      })
      this.$bvModal.show('modal-1')
    },
    addRow(){
      if (this.itens.length>1&&this.selecionado==0){
        alert('Selecione um item para inserir outro apos este !')
        return
      }
      var indice=0
      var item={"item":"","orgao":"","":"","descr":"","unid":"","qtd":"","valor":"","selecionado":true,"edita":true}
      if (this.itens.length>0){
        for (var i=0;i<this.itens.length;i++){
          if (this.itens[i].selecionado){
            if (this.itens[i].selecionado) indice=i
            this.itens[i].selecionado=false
          } 
        }
        this.itens.splice(indice+1,0,item)
      }
      else{
        this.itens.push(item)
      }
      this.selecionado=indice+1
      this.add=true
    },
  },
  updated(){
    if (this.add) {
      this.$refs["itm-" + (this.selecionado)][0].focus()
      this.add=false
    }
  },
  created(){
    if (this.selecionado==undefined) this.selecionado=0
  },
  computed:{
    itens(){
      return this.$store.state.itens
    },
    params(){
      return this.$store.state.params
    }
  },
  mounted(){
  }


// #app > div.conteudo > div.grid > div > table > tbody:nth-child(2) > tr > td:nth-child(1)
}
</script>

<style>
  .descricao{
    display: flex;
    flex-direction: column;
  }
  .conteudoGrid{
    width: 100%;
    position: relative;
  }
  table > thead > tr > th:nth-child(9) i{
    margin-top: 0.3rem !important;
    color: #4472c4;
    margin-left: 5px;
  }
  table > tbody >tr >td {
    height: 100%;  
    vertical-align: middle !important;
  }
  table > tbody >tr >td > div   {
    height: 100% !important;    
    vertical-align: middle !important;
  }
  table > tbody >tr >td:nth-child(8){
    text-align: right;
    vertical-align: middle !important;
    font-weight: 700;
    font-size: 1.2rem;
  }
  table > thead > tr > th{
    padding-top: 0 !important;
    color: #4472c4;
    border:1px solid rgba(0,0,0,0.3) !important;
  }
  table{
    border-spacing: 0;
  }
  .acoes{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .divGrid > table >tbody>tr >td{
    color: #4472c4;
    width: 7vw !important;
    max-width: 7vw !important;
    vertical-align: middle;
    padding: 3px;
  }
  table >tbody > tr:hover{
    color: #43a047  !important;
    background-color: #bbdefb !important;
  }
  table >tbody > tr {
    border:1px solid rgba(255,255,255,0.9);
    color: #4472c4;
  }
  .form-inline{
    margin:10px auto !important;
  }
  table >tbody > tr > td > div {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3px;
  }
  table >tbody > tr > td > div > input{
    width: 95% ;
    height: 100% !important;
    font-size: 1.2rem;
    color: #4472c4;
    text-align: center;
  }
  table >tbody > tr >td:nth-child(1) > div{
    display: flex;  
    justify-content: space-around;
    align-items: center;
  }
  table >tbody > tr >td:nth-child(3) > div > input{
    width: 80% !important;
    margin-right: 10px;
  }
  table >tbody> tr >td:nth-child(3){
    width:10vw !important;
    max-width: 10vw !important;
    white-space: nowrap;
    padding: 3px;
  }
  table >tbody > tr >td:nth-child(4){
    width:30vw !important;
    max-width: 30vw !important;
    text-align: left;
  }
  table >tbody > tr >td:last-child i:last-child{
    color:#e53935 ;
  }
  table >tbody > tr >td:last-child i:first-child{
    color: #43a047;
    margin-top: 10px;
  }
  table >tbody > tr >td:last-child i{
    margin: 5px;
    font-size: 1.4rem;
    padding: 0;
  }
  .LinhaPar{
    background-color: #d5d5d5 !important;
  }
  .Selected{
    /* background-color: #ffab40 !important; */
    border:2px solid rgba(68,114,196,0.6);
  }
  #base{
    width: 100px;
    text-transform: uppercase;
  }
  #descr{
    width: 90%;
    height: 35px;
  }
  label{
    margin-bottom: -1px !important;
  }
  .descricao{
    margin: 10px auto !important;
  }
  #orgao,#base{
    color: #4472c4 !important;
    width: auto;
    height: 35px;
  }
  .list-group{
    max-height: 400px;
    overflow: auto;
  }
  .list-group-item{
    text-align: left;
    padding-left: 3px;
    background-color: #fff9c4 !important;
  }
  .modal-content{
    background-color: #d5d5d5 !important;
    color: #4472c4 !important;
  }
  .dados{
    justify-content: flex-start;
    align-items: center;
  }
  .autocomplete{
    position: absolute;
    top: 30vh;
    height: 40%;
    width: 50vw;
    right: 0;
  }
</style>
