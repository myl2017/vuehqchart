<template>
  <div class="aboutdialog-wrapper">
    <section class="about-dialog">
      <ul class="head">
        <li>
          <img src="../../../../assets/icons/dialog/title.png" alt=""/>
          <div class="title">关于</div>
        </li>
        <li @click="onClose"><img src="../../../../assets/icons/dialog/close.png" alt=""/></li>
      </ul>
      <section class="content">
        <ul class="version">
          <li><img src="../../../../assets/icons/dialog/title.png" alt=""/></li>
          <li>连币选币</li> 
          <li>
             <span >{{"当前版本 ："+versionNum}}</span>
          </li>
          <li>
             <span >{{versionMsg}}</span>
             <span  @click="onUpdateVersion">{{upMsg}}</span>
           </li>
        </ul>
        <article>
          连币选币是中国最权威的人工智能非盈利团体，努力发展并建设智能化领域的
          学术与研究交流平台，本着服务大众，凝聚智慧的宗旨，网站自开办以来尽心竭力
          为广大爱好者、研究人员提供专业、权威的知识服务。国内外人工智能技术发展层
          次不齐，技术以及学术资料零散，让每个对人工智能爱好者、研究人员的学习，工
          作产生极大阻碍，连币选币为了打破这种现状，遂在人工智能爱好者、相关志愿者
          的支持与努力下，顺利诞生，并且在自身功能使用、学术资料、科研资料、科研项
          目、公开课资源、产业动态、名家观察等方面逐渐完善，现已具备了较为成熟的平
          台为广大爱好者、研究人员提供长期、稳定的免费服务。并且在自身功能使用、学
          术资料、科研资料、科研项目、公开课资源、产业动态、名家观察等方面逐渐完善，
          现已具备了较为成熟的平台为广大爱好者、研究人员提供长期、稳定的免费服务。
        </article>
      </section>
    </section>
    <div class="mask"></div>
  </div>
</template>

<script>
  import eventBus from '@/utils/bus'
  import config from '../../../../../../package.json'
  import {getVersion} from '../../../../api/index'
  import {ipcRenderer} from 'electron'

  export default {
    name: 'AboutDialog',
     data() {
      return {
        versionNum: null,
        versionMsg:null,
        upMsg:null,
        versionInfo: {
          desc:null,
          version_number: null,
          link: null,
          is_force: null
        },
      }
    },
     created() {
      this.versionNum = config.version,
      this.onVersion()
     },
    methods: {
      onClose() {
        eventBus.$emit('closeAbout', null)
      },
      onVersion() {
        this.versionInfo.version_number =config.version
        getVersion(this.versionInfo).then(res => {
          this.versionInfo.version_number =res.data.version_number,
          this.versionInfo.desc =res.data.desc,
          this.versionInfo.link =res.data.link,
          this.versionInfo.is_force =res.data.is_force
           console.log(res.data)
          if(config.version!==this.versionInfo.version_number)
          {
              this.versionMsg  = "检测到新版本,"
              this.upMsg  = "立即升级"
          }else
          {
            this.versionMsg = "当前已经是最新版本"
            this.upMsg =null
          }
        })
      },
      onUpdateVersion() {
        if(this.versionInfo)
        {
         if(config.version!==this.versionInfo.version_number)
         {
              ipcRenderer.send('download',JSON.stringify({
              command: 'startDownload',
              versionUrl: this.versionInfo.link
            }));
           this.$message({
                message: '文件开始后台下载',
                type: 'info'
              });
            this.onClose()
         }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .aboutdialog-wrapper {
    .about-dialog {
      width: 640px;
      background: #fff;
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2020;
      border-radius: 10px;

      ul.head {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #FFF4EB;
        padding-left: 21px;
        padding-right: 18px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

        li:first-child {
          display: flex;

          img {
            width: 24px;
            height: 24px;
            margin-right: 10px;
          }

          div {
            font-size: $fontSize16;
            color: #333333;
            display: flex;
            align-items: center;
          }
        }

        li:nth-child(2) {
          img {
            width: 18px;
            height: 18px;
          }
        }
      }

      .content {
        .version {
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 1px solid #EEEEEE;
          margin-left: 23px;
          margin-right: 22px;

          li:first-child {
            margin-top: 10px;
            margin-bottom: 6px;

            img {
              width: 44px;
              height: 46px;
            }
          }

          li:nth-child(2) {
            height: 25px;
            font-size: 18px;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
          }

          li:nth-child(3) {
            height: 20px;
            font-size: 14px;
            color: rgba(153, 153, 153, 1);
            margin-top: 2px;
            margin-bottom: 6px;
          }

          li:nth-child(4) {
            height: 20px;
            font-size: 14px;
            color: rgba(51, 51, 51, 1);
            margin-bottom: 15px;
               span:first-child {
                   color: rgba(51, 51, 51, 1);
              }
              span:nth-child(2) {
                   color: rgb(119, 57, 233);
              }
          }
        }

        article {
          margin-top: 10px;
          margin-bottom: 66px;
          color: #666666;
          margin-left: 23px;
          margin-right: 25px;
          text-align: justify;
          line-height: 22px;
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
