
import { createApp } from 'vue'
import App from './App.vue'

import './style.css'

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

library.add(faTrash, faPenToSquare, faCheck, faXmark);

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
