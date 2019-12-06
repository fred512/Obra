<template>
    <div class="progresscard" v-show="max>1" >
      <b-progress :max="max" show-progress animated show-value
         class="progresso" variant="warning" height="2.5rem">
          <b-progress-bar :value="progressstate" class="td header">
            Atualizando: <strong>{{ progressstate }} / {{ max }}</strong>
          </b-progress-bar>
      </b-progress>
    </div>
</template>

<script>
export default {
  name:'progresso',
  props:['progressstate','max']
}
</script>

<style>
  .progresso{
    width: 65%;
    margin: 10px auto !important;
    background-color: #795548 !important;
  }
  .progresscard{
    width: 90% !important;
    margin-top: 0;
    height: 3.5rem;
    position: relative;
    border-radius: 4px;
    z-index: 1;
    top: 40vh;
    left: 2%;
    background-color: #795548;
  }
</style>
