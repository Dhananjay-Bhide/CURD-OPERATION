<script>
import axios from "axios";
import AllUsers from "./Components/AllUsers.vue";
import AddUser from "./Components/AddUser.vue";

export default {
  // components: { AllUsers, AddUser },
  data() {
    return {
      // firstName: '',
      // lastName: '',
    };
  },

  methods: {
    async searchUser(searchTerm) {
      if (searchTerm == "") {
        return this.fetchData();
      } else {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/users/${searchTerm}`
          );
          console.log(response.data);
          this.tabledata = response.data.data;
        } catch (error) {
          console.error("Error searching data:", error);
        }
      }
    },

    

    cancelupdate() {
      this.showupdate = !this.showupdate;
      this.showsubmit = !this.showsubmit;

      this.formdata.firstname = "";
      this.formdata.lastname = "";
      this.formdata.dob = "";
      this.formdata.mobile = "";
      this.formdata.address = "";
    },
  },
};
</script>

<template>
 
  <div class="h-[100vh]">
    <router-view />
  </div>
  
</template>
