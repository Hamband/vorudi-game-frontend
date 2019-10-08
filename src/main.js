import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'

import './assets/global.css';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(BootstrapVue);
import {LayoutPlugin} from 'bootstrap-vue'

Vue.use(LayoutPlugin);

import {ModalPlugin} from 'bootstrap-vue'

Vue.use(ModalPlugin);


import {TablePlugin} from 'bootstrap-vue'

Vue.use(TablePlugin);

import Login from "./components/Login";
import Scoreboard from "./components/Scoreboard";

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        {
            path: '/',
            component: App,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/scoreboard',
            component: Scoreboard
        },
        {
            path: '/login',
            component: Login,
            meta: {
                guest: true
            }
        },
    ],
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('login') == null) {
            next({
                path: '/login',
                params: {nextUrl: to.fullPath}
            })
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (localStorage.getItem('login') == null) {
            next();
        } else {
            next('/');
        }
    } else {
        next();
    }
});


new Vue({

    router,
    component: {
        VueRouter,
    },
    template: `
    <div id="app">
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app');
