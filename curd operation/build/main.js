import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faCheck, faXmark, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { createRouter, createWebHistory } from 'vue-router';
import AllUsers from './Components/AllUsers.vue';
import { createPinia } from 'pinia';
import AddUser from './Components/AddUser.vue';
import EditUser from './Components/EditUser.vue';
library.add(faTrash, faPenToSquare, faCheck, faXmark, faArrowDown, faArrowUp);
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: AllUsers },
        { path: '/addUser', component: AddUser },
        { path: '/editUser/:id', component: EditUser, props: true }
    ]
});
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
//# sourceMappingURL=main.js.map