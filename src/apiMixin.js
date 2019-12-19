
export default {
  methods: {
    async criticaItem(item,args,self,atualiza){
      var erro=[],alerta=[]
      if (item.codigo=='') return JSON.stringify(erro) + '||' + JSON.stringify(alerta)
      if (item.orgao.toString().toUpperCase().indexOf('COMP')>=0
         ||item.orgao.toString().toUpperCase().replace(".","")=="CCU") return JSON.stringify(erro) + '||' + JSON.stringify(alerta)
      var codigo=item.codigo
      var desonerado=args.desonerado
      var orgao=item.orgao
      var BDI=args.BDI
      var uf=args.UF
      var base=item.base
      var url='codigo.asp?uf='+uf+
      '&orgao='+orgao+
      '&base='+base+
      '&codigo='+codigo
      var cadastrado = await self.$http.get(url)
      .then(res => {
        return res.data[0]
      })
//###### varifica item cadastrado #####
        if (item.vlComBDI*item.qtd==0) erro.push({'erro':'Item com Preço/Qtde zerada'})
//###### varifica item cadastrado #####
//###### varifica item cadastrado #####
        if (cadastrado==''||cadastrado==undefined) {
          erro.push({'erro':'Item não cadastrado nesse Orgão/Base/UF'})
          return JSON.stringify(erro) + '||' + JSON.stringify(alerta)
        }
//###### varifica descrição do item cadastrado #####
        if (cadastrado.descr.toUpperCase()!==item.descr.toUpperCase()) alerta.push({'alerta':'Verifique a descrição do item'})
// ##### item repetido com preço diferente <<<se não for atualizaçõ de itens>>>> ####
      if (!atualiza){
        var repetido=self.itens.filter(el=>{
          return el.codigo==item.codigo
        })
        if (repetido.length>1){
          var valorrep=repetido[0].vlComBDI
          var numrep=self.itens.filter(el=>{
            return el.vlComBDI!==valorrep&&item.codigo==el.codigo
          })
          if (numrep.length>0) erro.push({'erro':"Item repetido com valor diferente."})
        }
      }
// ##### verifica valor do item ####
      var valor=''
      if (desonerado=="1"){
        valor=parseFloat(cadastrado.precodeson*(1+(BDI/100))).toFixed(2)
      }
      else{
        valor=parseFloat(cadastrado.precooner*(1+(BDI/100))).toFixed(2)
      }
      if (parseFloat(item.vlComBDI)>parseFloat(valor)&&valor>0){
        erro.push({'erro':'Item com preço maior que a referência'})
      } 
      if (parseFloat(item.vlComBDI)<parseFloat(valor*0.7)&&valor>0){
        alerta.push({'alerta':'Item com preço menor que a 70% da referência'})
      } 
// #####  retorno da crítica #####
      return JSON.stringify(erro) + '||' + JSON.stringify(alerta)  + '||' + valor
    }
  },
}
