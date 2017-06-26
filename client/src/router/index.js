/* eslint-disable */

import Vue from 'vue';
import Router from 'vue-router';
import List from '@/components/List';
import Item from '@/components/Item';
import Dashboard from '@/components/Dashboard';
import Board from '@/components/Board';

Vue.component('List', List);
Vue.component('Item', Item);
Vue.component('Board', Board);

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
    },
  ],
});

export default router;
