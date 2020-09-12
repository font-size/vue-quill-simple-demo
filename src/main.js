import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);

Vue.config.productionTip = false;

// Vue.prototype.$quill = quill;
new Vue({
  render: h => h(App)
}).$mount('#app')
