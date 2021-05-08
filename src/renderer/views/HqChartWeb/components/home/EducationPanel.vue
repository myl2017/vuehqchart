<template>
  <section class="overview-panel">
    <div class="education-wrap">
      <div class="education-bg"></div>
      <h2>教学专区</h2>
    </div>
    <div class="video-wrap" id="dplayer"></div>
  </section>
</template>

<script>
  import DPlayer from 'dplayer'

  export default {
    name: 'EducationPanel',
    mounted() {
      this.initDPlayer()
    },
    methods: {
      initDPlayer() {
        const dp = new DPlayer({
          container: document.getElementById('dplayer'),
          screenshot: true,
          video: {
            url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
            // pic: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
            thumbnails: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png'
          }
          // subtitle: {
          //   url: 'static/media/web.vtt'
          // }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .education-wrap {
    display: flex;
    align-items: center;
    padding: 18px 0 16px 17px;
    margin-bottom: 16px;


    .education-bg {
      width: 27px;
      height: 26px;
      background: transparent url("../../../../assets/icons/white/enduhuang.png") no-repeat;
      background-size: 100% 100%;
    }

    > h2 {
      font-size: 18px;
      font-weight: bold;
      margin-left: 9px;
    }
  }

  .video-wrap {
    /*width: 565px!important;*/
  }
</style>
