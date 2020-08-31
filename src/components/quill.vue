<template>
  <div id="app">
    <div class="quill-editor">
      <div id="toolbar">
         <span class="ql-formats">
            <select class="ql-font"></select>
            <select class="ql-size"></select>
          </span>
          <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-underline"></button>
            <button class="ql-strike"></button>
          </span>
          <span class="ql-formats">
            <select class="ql-color"></select>
            <select class="ql-background"></select>
          </span>
          <span class="ql-formats">
            <button class="ql-script" value="sub"></button>
            <button class="ql-script" value="super"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-header" value="1"></button>
            <button class="ql-header" value="2"></button>
            <button class="ql-blockquote"></button>
            <button class="ql-code-block"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-list" value="ordered"></button>
            <button class="ql-list" value="bullet"></button>
            <button class="ql-indent" value="-1"></button>
            <button class="ql-indent" value="+1"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-direction" value="rtl"></button>
            <select class="ql-align"></select>
          </span>
          <span class="ql-formats">
            <button class="ql-link"></button>
            <button class="ql-image"></button>
            <button class="ql-video"></button>
            <button class="ql-formula"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-clean"></button>
          </span>
          <span class="ql-formats">
            <button id="custom-button-xiumi" title="秀米" @click="showmi"></button>
          </span>
          <span class="ql-formats">
             <select class="ql-size toolbarButton">
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option selected>默认</option>
              <option value="22px">22px</option>
              <option value="24px">24px</option>
              <option value="26px">26px</option>
              <option value="28px">28px</option>
            </select>
          </span>
          <span class="ql-formats">
           <select class="ql-font toolbarButton">
              <option selected="selected"></option>
              <option value="KaiTi">楷体</option>
              <option value="SimSun">宋体</option>
              <option value="SimHei">黑体</option>
              <option value="Microsoft-YaHei">微软雅黑</option>
              <option value="FangSong">仿宋</option>
              <option value="Arial">Arial</option>
              <option value="sans-serif">sans-serif</option>
            </select>
          </span>
      </div>
      <div class="editor" ref="editor"></div>
    </div>
  </div>
</template>

<script>
// 引入原始组件
import * as Quill from 'quill'
// 引入核心样式和主题样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
let sizes = ['14px', '16px','18px','20px','22px','24px','26px','28px'];  
let Size = Quill.import('formats/size');
Size.whitelist = sizes;   
Quill.register(Size, true);
export default {
  name: 'quill',
  components: {
  },
  data(){
    return {
      quill: null,
      options: {
        theme: 'snow',
        modules: {
          // 工具栏的具体配置
          toolbar:  '#toolbar'
        },
        placeholder: '请输入内容...'
      }
    }
  },
  mounted () {
    // 初始化编辑器
    this._initEditor()
  },
  methods:{
    // 初始化编辑器
    _initEditor () {
      // 获取编辑器的DOM容器
      let editorDom = this.$el.querySelector('.editor')
      // 初始化编辑器
      this.quill = new Quill(editorDom, this.options)
      this.quill.on('text-change', () => {
        this.emitChange()
        this.selection = this.quill.getSelection()
      })
    },
    // 更新text-change
    emitChange() {
      let html = this.$refs.editor.children[0].innerHTML
      const quill = this.quill
      const text = this.quill.getText()
      if (html === '<p><br></p>') html = ''
      this.$emit('input', html)
      this.$emit('change', { html, text, quill })
      this.$emit("getConetntLength", this.quill.getLength())
    }
  }
}
</script>

<style>
@import './css/quillSize.css';
.editor {
  height: 400px;
}
#custom-button-xiumi{
  background-size: contain;
  background-repeat: no-repeat;
  height: 16px;
  margin-top: 4px;
  width: 33px;
  padding-right: 8px;
  background-position: center;
  position: relative;
}
#custom-button-xiumi {
  background-image: url('http://xiumi.us/connect/ue/xiumi-connect-icon.png');
}
#custom-button-xiumi:hover {
  background-image: url('http://xiumi.us/connect/ue/xiumi-connect-icon.png');
}
</style>
