<template>
  <div class="divGrid">
    <keep-alive>
      <Item />
    </keep-alive>
  </div>
</template>

<script>
import Item from "@/components/item.vue"

export default {
  name: 'itens',
  components:{Item},
  data: function(){
    return {
    }
  },
  computed:{
    itens(){
      return this.$store.state.itens
    }
  },
  mounted() {
  },
  methods:{
  }


}
</script>

<style>
  .divGrid{
    display: flex;
    max-width: 98vw;
  }
  .divGrid table >thead >th{
    max-width: 98vw;
    border: 1px solid #aaa;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    width: 5vw !important;
    max-width: 5vw !important;
    color: #4472c4;
    font-weight: 700;
    vertical-align: middle;
  }
  .acao{
    color: #43a047  ;
  }

</style>
