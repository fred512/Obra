<template>
  <ul class="autocomplete" v-show="registros.length" :class="{'left':left}" style="width:8vw !important">
    <li v-for="(registro,i) in registros" :key="i" 
        @click="selecionaItem(i)" :tabindex="i-1">
      <textarea :value="Object.values(registro)[campo1]+' | '+Object.values(registro)[campo2]"
        @keyup.enter="selecionaItem(i)">
      </textarea>
    </li>
  </ul>

</template>

<script>
export default {
  name:'autocomplete',
  props:['arrayRegistros','campo1','campo2','left'],
  data: function(){
    return{
      exibe:false
    }
  },
  methods:{
    selecionaItem(i){
      this.$emit('retorno',this.registros[i])
      this.registros.length=0
      this.$forceUpdate()
    }
  },
  computed:{
    registros(){
      return this.arrayRegistros
    }
  }
}
</script>

<style>
  li{
    /* background-color:#fff9c4 !important;
    padding: 0.1rem .1rem !important;
    font-weight: 400;
    color: #1b5e20;
    text-decoration: none;
    border-radius: 3px;
    padding:4px 2px !important;
    border: 1px solid rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: inset 0px 0px 3px 1px rgba(68,114,196,.6);
    -moz-box-shadow: inset 0px 0px 3px 1px rgba(68,114,196,.6);
    box-shadow: inset 0px 0px 3px 1px rgba(68,114,196,.6); */
  }
  .left{
    left:calc(100%/2) !important;
  }

</style>
