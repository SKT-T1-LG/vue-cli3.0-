<template>
  <div class="star" :class="starType">
    <span v-for="(itemClass,key) in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    data(){
      return{

      }
    },
    created(){

    },
    computed: {
      starType() {
        return 'star-' + this.size;
      },
      itemClasses() {
        let result = [];
        let score = Math.floor(this.score * 2) / 2;
        let hasDec = score % 1;
        let integer=Math.floor(score);
        for(let i=0;i<integer;i++){
          result.push(CLS_ON);
        }
        if(hasDec!==0){
          result.push(CLS_HALF);
        }
        while(result.length<LENGTH){
          result.push(CLS_OFF)
        }
        return result
      }
    }
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "~@/assets/less/mixin";
  .star{
    font-size: 0;
    .star-item {
      display: inline-block;
      background-repeat: no-repeat;
    }
    &.star-18 {
      .star-item {
        width: 18px;
        height: 18px;
        margin-right: 4px;
        background-size: 100% 100%;
      }
      &:last-child {
        margin-right: 0;
      }
      .on {
        .bg-image("../../assets/img/star/star24_on")
      }
      .half{
        .bg-image("../../assets/img/star/star24_half")
      }
      .off{
        .bg-image("../../assets/img/star/star24_off")
      }
    }
    &.star-24 {
      .star-item {
        width: 24px;
        height: 24px;
        margin-right: 4px;
        background-size: 100% 100%;
      }
      &:last-child {
        margin-right: 0;
      }
      .on {
        .bg-image("../../assets/img/star/star24_on")
      }
      .half{
        .bg-image("../../assets/img/star/star24_half")
      }
      .off{
        .bg-image("../../assets/img/star/star24_off")
      }
    }
    &.star-36 {
      .star-item {
        width: 36px;
        height: 36px;
        margin-right: 4px;
        background-size: 100% 100%;
      }
      &:last-child {
        margin-right: 0;
      }
      .on {
        .bg-image("../../assets/img/star/star24_on")
      }
      .half{
        .bg-image("../../assets/img/star/star24_half")
      }
      .off{
        .bg-image("../../assets/img/star/star24_off")
      }
    }
  }

</style>
