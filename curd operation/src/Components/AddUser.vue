<template>
  <div id="app" class="flex flex-col items-center justify-center">
    <h1 class="text-5xl w-full text-center bg-green-500 text-white p-4 mb-6">
      CRUD FORM
    </h1>
    <form
      @submit.prevent="submitForm"
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
      <button type="submit" class="button">Submit</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";
import { useRoute, useRouter } from "vue-router";
import type { User } from "../types/types";

const userStore = useUserStore();
const router = useRouter();

type UserInput = Omit<User, "id">;

const formdata = ref<UserInput>({
  firstname: "",
  lastname: "",
  dob: "",
  mobile: null as unknown as number, // to avoid type error
  address: "",
});

// const showsubmit = ref(true);

const submitForm = async () => {
  const newUser: UserInput = {
    ...formdata.value,
    mobile: Number(formdata.value.mobile), // Converting mobile to number because input returns string
  };
  await userStore.addUser(newUser);
  // console.log(this.tabledata);

  formdata.value.firstname = "";
  formdata.value.lastname = "";
  formdata.value.dob = "";
  formdata.value.mobile = null as unknown as number;
  formdata.value.address = "";

  await userStore.fetchData();

  router.push("/");
};
</script>
