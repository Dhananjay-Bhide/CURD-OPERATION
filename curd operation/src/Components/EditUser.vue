<template>
  <div id="app" class="flex flex-col items-center justify-center">
    <h1 class="text-5xl w-full text-center bg-green-500 text-white p-4 mb-6">
      EDIT FORM
    </h1>
    <form
      class="space-y-8 flex flex-col items-center justify-center p-4"
    >
      <div class="labeldiv">
        <label for="firstname" class="label">First Name</label>
        <input
          type="text"
          id="firstname"
          v-model="formdata.firstname"
          class="input"
          required
        />
      </div>
      <div class="labeldiv">
        <label for="lastname" class="label">Last Name</label>
        <input
          type="text"
          id="lastname"
          v-model="formdata.lastname"
          class="input"
          required
        />
      </div>
      <div class="labeldiv">
        <label for="dob" class="label">Date of Birth</label>
        <input
          type="date"
          id="dob"
          v-model="formdata.dob"
          class="input"
          required
        />
      </div>
      <div class="labeldiv">
        <label for="mobile" class="label">Mobile No.</label>
        <input
          type="tel"
          id="mobile"
          v-model="formdata.mobile"
          class="input"
          required
        />
      </div>
      <div class="labeldiv">
        <label for="address" class="label">Address</label>
        <textarea
          name="address"
          id="address"
          v-model="formdata.address"
          class="input"
          required
        ></textarea>
      </div>
      <div class="flex items-center justify-center gap-2">
        <button
          @click.prevent="updateUser()"
          class="button"
        >
          Update
        </button>
        <button class="button" @click="cancelupdate()">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import type { User } from '../types/types';
import { onMounted, ref } from 'vue';

    const userStore = useUserStore();
    const router = useRouter();
    const route = useRoute();

    type UserInput = Omit<User, 'id'>;

     const formdata = ref<UserInput>({
        firstname: "",
        lastname: "",
        dob: "",
        mobile: null as unknown as number,  // to avoid type error
        address: "",
      });

    const loadUserData = async () => {
      const userId = Number(route.params.id);
      try {
        const response = await userStore.getUserById(userId);
        console.log("Fetched user data:", response);
        if(response){
        formdata.value = { ...response };         // Populate formdata with the fetched user data
        // console.log("Loaded user data:", this.formdata);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    const updateUser = async () => {
      try {
        const userId = Number(route.params.id);
        await userStore.updateUser(userId, formdata.value);
        console.log("User updated successfully");
        await userStore.fetchData();
        router.push('/');
      } catch (error) {
        console.error("Error updating user:", error);
      }
    };

    const cancelupdate = () => {
      router.push('/');
    }
    
  onMounted(() => {
    loadUserData();
  })
</script>
