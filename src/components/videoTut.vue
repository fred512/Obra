<template>
  <div>
    <span title="Sair do Vídeo Tutorial">
      {{urlVideo}}
      <i class="fa fa-close fa-2x text-danger" @click="iVideos=false"></i>
    </span>
    <!-- <img alt="PDO logo" src="../assets/Videos/logo-pdo-branco.png" /> -->
    <video controls :src="urlVideo" id="videoTut" :key="urlVideo">
      <!-- <source src type="video/webm" /> -->
      <!-- <source src="../assets/Videos/PlanilhaZero.webm" type="video/webm" /> -->
    </video>
    <!-- <b-embed type="iframe" aspect="4by3" controls>
        <source :src="urlVideo"  type="video/webm" />
    </b-embed>-->
  </div>
</template>

<script>
export default {
  name: "videoTut",
  props: ["urlVideo"],
  data: function() {
    return {
      exibe: false
    };
  }
};
</script>


<style>
</style>