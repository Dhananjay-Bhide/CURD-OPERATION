import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import type { LoginInput, User } from "../types/types.js";

export type UserInput = Omit<User, "id">;

export const useUserStore = defineStore("user", () => {
  const users = ref<User[]>([]);
  const totalPages = ref(0);
  const totalUsers = ref(0);
  const currentPage = ref(1);
  const usersPerPage = ref(5);

  const isAuthorized = ref(false);

  async function fetchData({
    sort_column = "",
    sort_order = "",
    currentPageVal = currentPage.value,
    usersPerPageVal = usersPerPage.value,
    search = "",
  } = {}): Promise<void> {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users?sort_column=${sort_column}&sort_order=${sort_order}&currentPage=${currentPageVal}&usersPerPage=${usersPerPageVal}&search=${search || ""}`
      );
      users.value = response.data.data.users as User[];
      totalPages.value = response.data.data.totalPages;
      totalUsers.value = response.data.data.totalCount;
      currentPage.value = currentPageVal;
      usersPerPage.value = usersPerPageVal;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function addUser(newUser: UserInput): Promise<void> {
    try {
      const response = await axios.post(`http://localhost:3000/api/users`, newUser, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      users.value.push(response.data.data as User);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }

  async function getUserById(userId: number): Promise<User | null | undefined> {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      const users: User[] = response.data.data;
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  }

  async function updateUser(userId: number, data: UserInput): Promise<void> {
    try {
      const response = await axios.put(`http://localhost:3000/api/users/${userId}`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      const index = users.value.findIndex((user) => user.id === userId);
      if (index !== -1) {
        users.value[index] = response.data.data as User;
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  async function deleteUser(userId: number): Promise<void> {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      users.value = users.value.filter((user) => user.id !== userId);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  async function adminLogin(loginData: LoginInput): Promise<void> {
    try{
      const response = await axios.post(`http://localhost:3000/api/login`, loginData);
      console.log("Login response: ", response.data);
      // Handle login success (e.g., store token, redirect, etc.)
      localStorage.setItem("token", response.data.token);
      if(response.data.token){
        isAuthorized.value = true;
      } else {
        isAuthorized.value = false;
      }
    } catch(error){
      console.error("Error during admin login: ", error);
    }
  }

  return {
    users,
    totalPages,
    totalUsers,
    currentPage,
    usersPerPage,
    fetchData,
    addUser,
    getUserById,
    updateUser,
    deleteUser,
    adminLogin,
    isAuthorized
  };
});
