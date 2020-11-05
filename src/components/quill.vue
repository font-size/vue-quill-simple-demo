<template>
  <div id="app">
    <div class="quill-editor">
      <a-modal v-model="visible" title="秀米" width="90%" :footer="null" :maskClosable="false" :centered="true" :keyboard="false">
        <div v-if="visible">
          <iframe src="./pluging/xiumi-ue-dialog-v5.html" frameborder="0" width="100%" :height="(fullheight - 150)+'px'" id="xiumiIframe"></iframe>
        </div>
      </a-modal>
      <a-modal v-model="visible2" title="135编辑器" width="90%" :footer="null" :maskClosable="false" :centered="true" :keyboard="false">
        <div v-if="visible2">
          <iframe src="./pluging/135EditorDialogPage.html" frameborder="0" width="100%" :height="(fullheight - 150)+'px'" id="xiumiIframe"></iframe>
        </div>
      </a-modal>
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
            <button id="custom-button-xiumi" title="秀米" @click="showModal"></button>
          </span>
          <span class="ql-formats">
            <button id="custom-button-135" title="135编辑器" @click="showModal2"></button>
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
import blotSelect from './blot'
blotSelect(Quill)
export default {
  name: 'quill',
  props: {
    content: String,
    value: String
  },
  data(){
    return {
      quill: null,
      selection: {},
      visible: false,
      visible2: false,
      fullheight: document.documentElement.clientHeight,
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
  watch:{
    content(newVal) {
      if (this.quill) {
        if (newVal && newVal !== this.editorContent) {
          this.editorContent = newVal
          this.quill.clipboard.dangerouslyPasteHTML(newVal)
        } else if(!newVal) {
          this.quill.setText('')
        }
      }
    },
    // Watch editorContent change
    value(newVal) {
      if (this.quill) {
        if (newVal && newVal !== this.editorContent) {
          this.editorContent = newVal
          // this.quill.clipboard.dangerouslyPasteHTML(newVal)
        } else if(!newVal) {
          this.quill.setText('')
        }
      }
    },
  },
  mounted () {
    // 初始化编辑器
    this._initEditor()
    // 把setRichText暴露到window上
    window.setRichText = this.setRichText
  },
  methods:{
    // 初始化编辑器
    _initEditor () {
      // 获取编辑器的DOM容器
      let editorDom = this.$el.querySelector('.editor')
      // 初始化编辑器
      this.quill = new Quill(editorDom, this.options)
      // 文字变化时监听事件
      this.quill.on('text-change', () => {
        this.emitChange()
        this.selection = this.quill.getSelection()
      })
      // 光标选择变化时监听事件
      this.quill.on('selection-change', () => {
        this.selection = this.quill.getSelection()
      })
      // 插入内容
      this.firstSetHtml()
      this.listenPaste()
      this.$emit('ready', this.quill)
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
    },
    firstSetHtml() {
      if(this.value) {
        // 判断是否有秀米和或135元素
        if(this.value.indexOf('xiumi.us') > -1 || this.value.indexOf('135editor.com') > -1 ) {
          let originNode =  new DOMParser().parseFromString(this.value,'text/html').body.childNodes
          // const nodeList = document.querySelectorAll(".ql-editor > *")
          this.nodesInQuill(originNode)
        } else {
          // 正常插入
          this.quill.clipboard.dangerouslyPasteHTML(this.value)
          // this.$refs.editor.children[0].innerHTML = this.value
        }
      }
    },
    nodesInQuill(originNode) {
      for(let i = originNode.length - 1; i >= 0; i --) {
        if(originNode[i].localName === 'section') {
          this.setRichText(originNode[i].outerHTML, 0)
        } else {
          this.quill.clipboard.dangerouslyPasteHTML(0, originNode[i].outerHTML)
        }
      }
    },
    listenPaste() {
      document.querySelector('.quill-editor').addEventListener('paste', (e) => {
        const msg = (e.clipboardData || window.clipboardData).getData('text/html') // 获取粘贴板文本
         if(msg) {
            if(msg.indexOf("xiumi.us") > -1 || msg.indexOf("_135editor") > -1) {
              let value = new DOMParser().parseFromString(msg,'text/html').body.childNodes // 获取nodes
              console.log(value)
              e.preventDefault() // 阻止复制动作
              e.stopPropagation()// 阻止冒泡
              this.nodesInQuill(value) // 根据不同标签，使用不同的插入方法
            }
          }
      })
    },
    setRichText(e, t) {
      const index = this.selection?this.selection.index: 0
      this.quill.insertEmbed(t || index, 'AppPanelEmbed', e)
      this.visible = false
      this.visible2 = false
    },
    setData(e, t) {
      const index = this.selection?this.selection.index: 0
      this.quill.clipboard.dangerouslyPasteHTML(t || index, e)
    },
    showModal() {
      this.visible = true
    },
    showModal2() {
      this.visible2 = true
    }
  }
}
</script>

<style>
@import './css/quillSize.css';
.editor {
  height: 400px;
}
#toolbar button {
  outline:none
}
#custom-button-xiumi, #custom-button-135 {
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
  background-image: url('https://dl.xiumi.us/connect/ue/xiumi-connect-icon.png');
}
#custom-button-xiumi:hover {
  background-image: url('https://dl.xiumi.us/connect/ue/xiumi-connect-icon.png');
}
#custom-button-135 {
  background-image: url('http://static.135editor.com/img/icons/editor-135-icon.png');
}
#custom-button-135:hover {
  background-image: url('http://static.135editor.com/img/icons/editor-135-icon.png');
}
</style>
