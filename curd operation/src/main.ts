
import { createApp } from 'vue'
import App from './App.vue'

import './style.css'

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faCheck, faXmark, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { createPinia } from 'pinia';
import router from './Routes/routes.js';

library.add(faTrash, faPenToSquare, faCheck, faXmark, faArrowDown, faArrowUp);

const app = createApp(App) 

app.use(createPinia())
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
