<template>
  <div>
    <el-dialog
      title="服务协议："
      :visible.sync="dialogVisible"
      :before-close ="handleClose"
      width="80%"
      height="100%">
      <iframe src="https://www.lianbi.io/declaration.html" frameborder="0" width="100%" height="600px"></iframe>
    </el-dialog>
  </div>
</template>
 
<script>
  import eventBus from '@/utils/bus.js'
  export default {
    data () {
      return {
        dialogVisible: true
      }
    },
  //  created() {
  //     this.getEventData()
  //   },
    methods: {
      // getEventData() {
      //   eventBus.$on('closeAgreementDialog', data => {
      //     this.dialogVisible = true
      //   })
      // },
       handleClose()
       {
          eventBus.$emit('closeAgreementDialog', true)
       }  
    } 
  }
</script>