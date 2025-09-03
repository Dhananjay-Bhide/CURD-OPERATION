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
      <button type="submit" v-show="showsubmit" class="button">Submit</button>
      
    </form>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';

export default {
  setup() {
    const userStore = useUserStore();
    console.log(userStore);
    return { userStore };
  },
  data() {
    return {
      formdata: {
        firstname: "",
        lastname: "",
        dob: "",
        mobile: "",
        address: "",
      },
      showsubmit: true,
    };
  },

  methods: {
    async submitForm() {
      
      await this.userStore.addUser(this.formdata);
      console.log(this.tabledata);
 
      this.formdata.firstname = "";
      this.formdata.lastname = "";
      this.formdata.dob = "";
      this.formdata.mobile = "";
      this.formdata.address = "";

      await this.userStore.fetchData();

      this.$router.push('/');
    },
    
  }
};
</script>
