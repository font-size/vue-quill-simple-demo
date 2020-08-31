<template>
  <div id="app">
    {{msg}}
    <quill v-model="msg"/>
  </div>
</template>

<script>
import quill from './components/quill'
export default {
  name: 'App',
  components: {
    quill
  },
  data(){
    return {
      msg: ''
    }
  }
}
</script>
