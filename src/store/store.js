import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)
Vue.use(axios)
export default new Vuex.Store({
  axios:axios,
  state:{
    itens:[],
    loading:false,
    params:[
      {'BDI':'','UF':'','base':'','desonerado':'1'}
    ],
    baseURL:'',
    totvalor:'',
    atualiza:false,
    disparaAtualizacao:false,
    inicio:false
  },
  mutations:{
    setLoading(state,payload){
      state.loading=payload
    },
    gravaParams(state,payload){
      state.params=payload
      var reg={
        "UF":payload.UF,
        "base":payload.base,
        "desonerado":payload.desonerado,
        "BDI":payload.BDI
      }
      localStorage.setItem("params",JSON.stringify(reg))
    },
    totalizaItens(state){
      let itens=state.itens
      if (itens){
        var item=0,total=0
        itens=itens.filter(function(el){
          return el.descr.indexOf("Total")<0&&el.descr!==''?el:''
        })
        var valortotal=0
        for (var i=0;i<itens.length;i++){
          itens[i].edita=false
          if (itens[i].valor!=='') {
            itens[i].vlComBDI=parseFloat(itens[i].valor*(1+(state.params.BDI/100))).toFixed(2)
            itens[i].valortot=parseFloat(itens[i].qtd*itens[i].vlComBDI).toFixed(2)
          }
          if (itens[i].unid==''&&itens[i].codigo==''){
            itens[i].item=parseInt(item)+1
            item=itens[i].item+'.'+0
            if (total) {
              var totgrupo={"item":"","orgao":"","base":"","descr":"SubTotal","unid":"","qtd":"","valor":"","valortot":parseFloat(total).toFixed(2),"selecionado":true,"edita":false,'erro':[],'alerta':[]}
              itens.splice(i,0,totgrupo)
              total=0
              i++
            }
          }
          else{
            // var itm=item.split('.')
            // itm[itm.length-1]=parseInt(itm[itm.length-1])+1
            // itens[i].item=itm.join('.')
            // item=itens[i].item
            var precisao=3
            if (parseInt(item)>9) precisao=4
            item=(parseFloat(item)+0.01).toPrecision(precisao)
            itens[i].item=item
            total+=(itens[i].qtd*itens[i].vlComBDI)
            valortotal+=(itens[i].qtd*itens[i].vlComBDI)
          }
        }
        if (total) {
          totgrupo={"item":"","orgao":"","base":"","descr":"SubTotal","unid":"","qtd":"","valor":"","valortot":parseFloat(total).toFixed(2),"selecionado":true,"edita":false,'erro':[],'alerta':[]}
          itens.splice(i,0,totgrupo)
          i++
          var totgeral={"item":"","orgao":"","base":"","descr":"Total Geral","unid":"","qtd":"","valor":"","valortot":parseFloat(valortotal).toFixed(2),"selecionado":true,"edita":false,'erro':[],'alerta':[]}
          itens.splice(i,0,totgeral)
        }
        state.itens=itens
        localStorage.setItem("itens",JSON.stringify(itens))
      }
    },
    calculatotal(state){
      var itens=state.itens
      itens=itens.filter(function(el){
        return el.descr.indexOf("Total")<0&&el.descr!==''?el:''
      })
      var sum = itens.reduce( function( prevVal, elem ) {
        if (elem.descr!=='Total'&&!isNaN(parseFloat(elem.valortot))) prevVal+= parseFloat(elem.valortot)
        return prevVal
      }, 0 );
      state.totvalor=sum
    },
    gravaItens(state,payload){
      if (payload){
        payload=payload.filter(function(el){
          return el.descr.toLowerCase().indexOf("subtotal")?el:''
        })
        var seq=0
        payload=payload.map(function(el){
          el.valortot=parseFloat(el.qtd*el.vlComBDI).toFixed(2)
          el.id=seq
          seq++
          return el
        })
        state.itens=payload
        localStorage.setItem("itens",JSON.stringify(payload))
      }
      else{
        localStorage.removeItem("itens")
      }
      //this.Store.commit.calculatotal()
    },
  }

})