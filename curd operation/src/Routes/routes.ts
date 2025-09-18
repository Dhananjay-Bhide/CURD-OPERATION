import { createRouter, createWebHistory } from "vue-router";
import AllUsers from "../views/AllUsers.vue";
import AddUser from "../views/AddUser.vue";
import EditUser from "../views/EditUser.vue";
import Login from "../views/Login.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: AllUsers },
        { path: '/addUser', component: AddUser },
        { path: '/editUser/:id', component: EditUser, props: true },
        { path: '/admin', children: [{
            path: '', component: AllUsers
        }, {
            path: 'login', component: Login
        }]}
    ]
})

export default router;
