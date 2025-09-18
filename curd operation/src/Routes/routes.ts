import { createRouter, createWebHistory } from "vue-router";
import AllUsers from "../Components/AllUsers.vue";
import AddUser from "../Components/AddUser.vue";
import EditUser from "../Components/EditUser.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: AllUsers},
        { path: '/addUser', component: AddUser },
        { path: '/editUser/:id', component: EditUser, props: true }
    ]
})

export default router;
