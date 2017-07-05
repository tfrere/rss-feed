/* eslint-disable */

import Vue from 'vue';
import Router from 'vue-router';
import Draggable from 'vuedraggable';
import VeeValidate from 'vee-validate';
import VueSocketio from 'vue-socket.io';

import List from '@/components/List';
import Item from '@/components/Item';
import Dashboard from '@/components/Dashboard';
import Board from '@/components/Board';
import Modal from '@/components/Modal';
import FeedForm from '@/components/FeedForm';

Vue.component('Draggable', Draggable);

Vue.component('List', List);
Vue.component('Item', Item);
Vue.component('Board', Board);
Vue.component('Modal', Modal);
Vue.component('FeedForm', FeedForm);

Vue.use(VueSocketio, 'http://localhost:5001');
Vue.use(Router);

const validateConfig = {
  errorBagName: 'errors', // change if property conflicts.
  fieldsBagName: 'fields',
  delay: 0,
  locale: 'en',
  dictionary: null,
  strict: true,
  enableAutoClasses: false,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  },
  events: 'input|blur',
  inject: true
};


Vue.use(VeeValidate, validateConfig);

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
