<template>
  <div class="infodialog-wrapper">
    <section class="infodialog">
      <ul class="head">
        <li>&nbsp;</li>
        <li @click="onClose"><img src="../../../../assets/icons/dialog/close.png" alt=""/></li>
      </ul>
      <section class="content">
        <ul class="tips">
          <li>{{currentInfo.title}}</li>
          <li>
            <div>{{currentInfo.post_date}}</div>
            <div>来源: {{currentInfo.source.name}}</div>
          </li>
        </ul>
        <article class="new-c-content" v-html="currentInfo.content"></article>
      </section>
    </section>
    <div class="mask"></div>
  </div>
</template>

<script>
  import eventBus from '@/utils/bus'

  export default {
    name: 'InfoDialog',
    props: {
      currentInfo: {
        type: Object
      }
    },
		mounted() {
			this.preventAclick()
		},
    methods: {
      onClose() {
        eventBus.$emit('closeInfo', null)
      },
			preventAclick(){
				let aTagBox = window.document.getElementsByClassName("new-c-content")
        let aTag = aTagBox[0].getElementsByTagName('a')
				for(let i = 0; i < aTag.length; i++){
					aTag[i].onclick = function(event) {
					event.preventDefault();
          // return false
          // 这两个都可以阻止
					}
        }	
      }
    },
    watch: {
			currentInfo: {
				handler(){
          let page = this
          // 必须加一个定时器，不然获取到的是上一次的值
					setTimeout(function(){
						page.preventAclick()
					}, 100)
				}
			}
		}
  }
</script>

<style lang="scss">
  .infodialog-wrapper {
    .infodialog {
      article {
        p {
          color: #333;
          text-align: justify;
          font-size: 16px;
          font: 16px/1.6 arial, microsoft yahei, tahoma, sans-serif;
          margin-bottom: 10px;
          text-indent: 2em;
        }

        img {
          max-width: 60%;
          height: 100%;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          justify-content: center;
        }

      }
    }
  }
</style>
<style lang="scss" scoped>
  /** {*/
  /*  outline: 2px solid red;*/
  /*}*/

  .infodialog-wrapper {
    .infodialog {
      width: 70%;
      background: #fff;
      position: fixed;
      top: 10%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2020;
      border-radius: 10px;

      ul.head {
        width: 100%;
        height: $dialogHeadHigh;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #FFF4EB;
        padding-left: 21px;
        padding-right: 18px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

        li:nth-child(2) {
          img {
            width: 18px;
            height: 18px;
          }
        }
      }

      .content {
        padding-left: 14%;
        padding-right: 14%;
        /*width: 96%;*/
        height: 650px;
        overflow-x: hidden;
        overflow-y: scroll;

        .tips {
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 1px solid #EEEEEE;
          margin-left: 23px;
          margin-right: 22px;

          li:first-child {
            margin-top: 12px;
            margin-bottom: 26px;
            font-size: 22px;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
          }

          li:nth-child(2) {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 25px;
            font-size: 18px;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);

            div:first-child {
              font-size: 14px;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
            }

            div:nth-child(2) {
              font-size: 14px;
              font-weight: 400;
              color: rgba(161, 158, 156, 0.3);
            }
          }
        }

        article {
          margin: 10px 24px 20px 24px;
        }
      }
    }

    .mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: .5;
      background: #000;
      z-index: 2019;
      width: 100%;
      height: 100%;
    }
  }
</style>
