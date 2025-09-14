import AddUser from "@/Components/AddUser.vue";
import axios from "axios";
import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
    state: () => ({
        users: [],
        totalPages: 0,
        totalUsers: 0,
        currentPage: 1,
        usersPerPage: 5,
    }),
    actions: {
        async fetchData({ sort_column = 'id', sortOrder = 'asc', currentPage = 1, usersPerPage = 5, search = '' } = {}) {
            try {
                const response = await axios.get(`http://localhost:3000/api/users?sort_column=${sort_column}&sort_order=${sortOrder}&currentPage=${currentPage}&usersPerPage=${usersPerPage}&search=${search || ""}`);
                console.log(response.data);
                this.users = response.data.data.users;
                this.totalPages = response.data.data.totalPages;
                this.totalUsers = response.data.data.totalCount;
                this.currentPage = currentPage;
                this.usersPerPage = usersPerPage;
            }
            catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        async addUser(newUser) {
            try {
                const response = await axios.post(`http://localhost:3000/api/users`, newUser);
                console.log(response.data);
                this.users.push(response.data.data);
            }
            catch (error) {
                console.error("Error adding user:", error);
            }
        },
        async getUserById(userId) {
            try {
                const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
                console.log("Fetched user by ID:", response.data);
                return response.data.data;
            }
            catch (error) {
                console.error("Error fetching user by ID:", error);
                return null;
            }
        },
        async updateUser(userId, data) {
            console.log("Updating user:", userId);
            try {
                const response = await axios.put(`http://localhost:3000/api/users/${userId}`, data);
                console.log(response.data);
                const index = this.users.findIndex((user) => user.id === userId);
                if (index !== -1) {
                    this.users[index] = response.data.data;
                }
            }
            catch (error) {
                console.error("Error updating user:", error);
            }
        },
        async deleteUser(userId) {
            try {
                await axios.delete(`http://localhost:3000/api/users/${userId}`);
            }
            catch (error) {
                console.error("Error deleting user:", error);
            }
        },
    }
});
//# sourceMappingURL=userStore.js.map