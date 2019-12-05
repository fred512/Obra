<template>
<div>

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
</template>

<script>
import Autocomplete from './autocomplete'
export default {
  name:'linha',
  components:{Autocomplete},
  props:['itens'],

}
</script>

<style>

</style>
