<template>
  <div>
    <el-dialog
      title="帮助说明："
      :visible.sync="dialogVisible"
      :before-close ="handleClose"
      width="80%"
      height="100%">
      <iframe src="https://www.lianbi.io/help.html" frameborder="0" width="100%" height="600px"></iframe>
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
    methods: {
       handleClose()
       {
          eventBus.$emit('closeHelp', true)
       }  
    } 
  }
</script>