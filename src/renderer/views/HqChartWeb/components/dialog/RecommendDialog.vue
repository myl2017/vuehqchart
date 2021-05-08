<template>
    <div class="recommenddialog-wrapper">
        <section class="recommenddialog">
            <ul class="head">
                <li>
                    <div>好友推荐</div>
                </li>
                <li @click="onClose"><img src="../../../../assets/icons/dialog/close.png" alt=""/></li>
            </ul>
            <div class="content">
                <p>链接复制成功，您可以粘贴到QQ、微信、邮件、 微博等，您的好友点击链接即可前往下载</p>
                <small>感谢您对连币的信任与支持！</small>
            </div>
        </section>
        <section class="mask"></section>
    </div>
</template>

<script>
  import eventBus from '@/utils/bus'

  export default {
    name: 'RecommendDialog',
    methods: {
      onClose() {
        eventBus.$emit('closeRecommend', null)
      }
    }
  }
</script>

<style lang="scss" scoped>
    .recommenddialog-wrapper {
        .recommenddialog {
            width: 460px;
            background: #fff;
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2020;
            border-radius: 10px;

            ul.head {
                width: 460px;
                height: $dialogHeadHigh;
                background: #FFF4EB;
                border-radius: 10px 10px 0px 0px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-left: 20px;
                padding-right: 20px;

                li > div {
                    font-size: $fontSize16;
                    color: #333333;
                }

                li > img {
                    width: 18px;
                    height: 18px;
                }
            }

            .content {
                padding: 30px 36px 48px 36px;
                text-align: center;

                > p {
                    font-size: $fontSize14;
                    color: #F66C00;
                    line-height: 24px;
                    margin-bottom: 22px;
                }

                > small {
                    font-size: 14px;
                    color: rgba(0, 136, 255, 1);
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
