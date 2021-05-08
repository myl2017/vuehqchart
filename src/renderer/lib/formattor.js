// 富文本编辑器的内容只获得文字去掉标签
function removeTAG(str) {
  return str.replace(/<[^>]+>/g, '')
}

export default removeTAG
