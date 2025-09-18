<template>
    <h1 class="text-5xl w-full text-center bg-green-500 text-white p-4 mb-6">
      Admin Login
    </h1>
    <form @submit.prevent="submitForm" class="space-y-8 flex flex-col items-center justify-center p-4">
        <div class="labeldiv">
            <label for="email" class="label">Email</label>
            <input
            v-model="loginData.email"
            type="email"
            id="email"
            class="input"
            required
            />
        </div>
        <div class="labeldiv">
            <label for="password" class="label">Password</label>
            <input
            v-model="loginData.password"
            type="password"
            id="password"
            class="input"
            required
            />
        </div>
        <button type="submit" class="button">Login</button>
    </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { LoginInput } from '../types/types';
import { useUserStore } from '../stores/userStore';
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

const userStore = useUserStore();

    const loginData = reactive<LoginInput>({
        email: '',
        password: ''
    })

    const submitForm = async () => {
        await userStore.adminLogin(loginData);
        if(userStore.isAuthorized){
            router.push('/admin');
        } else {
            alert("Login failed. Incorrect email or password.");
        }
        loginData.email = '';
        loginData.password = '';
    }

    

</script>