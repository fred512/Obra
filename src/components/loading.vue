<template>
  <div class="loading" v-if="loading">
    <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
    <span >Carregando...</span>
  </div>

</template>

<script>
export default {
  name:'loading',
  props:['loading'],
  create(){
    this.loading=true
  }

}
</script>

<style>
  .loading{
    width: 100%;
    height: 100%;
    position: fixed;
    top:0;
    left:0;
    background-color: rgba(153, 153, 153, 0.3);
    display:flex;
    z-index: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color:#43a047;
  }
</style>
