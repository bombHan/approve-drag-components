import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import "@/assets/css/index.less";
import router from "./router/index";
import store from "./store/index";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.less";
import validateRules from "@/utils/validateRules";
import api from "@/api/api";
import 'vant/lib/index.css'
import Vant from 'vant'
import TIM from 'tim-js-sdk';
import COS from "cos-js-sdk-v5";
import genTestUserSig from './GenerateTestUserSig'
import echarts from 'echarts'
import components from 'han-components'

let options = {
  SDKAppID: 1400449484// 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let tim = TIM.create(options); // SDK 实例通常用 tim 表示
// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
// tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
// 注册 COS SDK 插件
tim.registerPlugin({'cos-js-sdk': COS});

Vue.use(Antd);
Vue.use(Vant);
Vue.use(components)

Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();
Vue.prototype.validateRules = validateRules;
Vue.prototype.api = api;
window.tim = tim
window.TIM = TIM
Vue.prototype.tim = tim
Vue.prototype.TIM = TIM
Vue.prototype.$genTestUserSig = genTestUserSig;
Vue.prototype.$echarts = echarts

let _this = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

export default _this;
