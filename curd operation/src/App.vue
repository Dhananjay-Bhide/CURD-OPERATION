<script>
import axios from "axios";
import { onUpdated } from "vue";

export default {
  data() {
    return {
      // firstName: '',
      // lastName: '',
      formdata: {
        firstname: "",
        lastname: "",
        dob: "",
        mobile: "",
        address: "",
      },

      tabledata: [],
    };
  },

  methods: {
    async submitForm() {
      // this.tabledata.push({
      //     firstName: this.firstName,
      //     lastName: this.lastName
      // });
      // this.tabledata.push({
      //   // firstName: this.formdata.firstName,
      //   // lastName: this.formdata.lastName,
      //   // dob: this.formdata.dob,
      //   // mobile: this.formdata.mobile,
      //   // address: this.formdata.address,
      //   ...this.formdata,
      // });
      try {
        const response = await axios.post(
          "http://localhost:3000/users",
          this.formdata
        );
        console.log(response.data);
        this.tabledata.push(response.data);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
      console.log(this.tabledata);
      // this.firstName = "";
      // this.lastName = "";
      this.formdata.firstname = "";
      this.formdata.lastname = "";
      this.formdata.dob = "";
      this.formdata.mobile = "";
      this.formdata.address = "";
    },
    async fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/");
        console.log(response.data);
        this.tabledata = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async updateUser(user) {
      try {
        this.formdata = { ...user };
        console.log("Updating user:", user.id);
        const response = await axios.put(
          `http://localhost:3000/users/${user.id}`,
          this.formdata
        );
        console.log(response.data);
        this.fetchData();
      } catch (error) {
        console.error("Error updating data:", error);
      }
    },
    async deleteuser(id) {
      try {
        console.log("Deleting user with ID:", id);
        await axios.delete(`http://localhost:3000/users/${id}`);
        this.tabledata = this.tabledata.filter((item) => item.id !== id);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<template>
  <div id="app">
    <h1>Registration Form</h1>
    <form @submit.prevent="submitForm">
      <div>
      <label for="firstname">First Name</label>
      <input type="text" id="firstname" v-model="formdata.firstname" />
      </div>
      <div>
      <label for="lastname">Last Name</label>
      <input type="text" id="lastname" v-model="formdata.lastname" />
      </div>
      <div>
      <label for="dob">Date of Birth</label>
      <input type="date" id="dob" v-model="formdata.dob" />
      </div>
      <div>
      <label for="mobile">Mobile No.</label>
      <input type="tel" id="mobile" v-model="formdata.mobile" />
      </div>
      <div>
      <label for="address">Address</label>
      <textarea
        name="address"
        id="address"
        v-model="formdata.address"
      ></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
  <table>
    <thead>
      <tr>
        <th>Id</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Date of Birth</th>
        <th>Mobile No.</th>
        <th>Address</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in tabledata" :key="index">
        <td>{{ item.id }}</td>
        <td>{{ item.firstname }}</td>
        <td>{{ item.lastname }}</td>
        <td>{{ item.dob }}</td>
        <td>{{ item.mobile }}</td>
        <td>{{ item.address }}</td>
        <td>
          <div class="icons">
            <font-awesome-icon icon="trash" @click="deleteuser(item.id)" />
            <font-awesome-icon icon="pen-to-square" @click="updateUser(item)" />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

div h1 {
  font-size: 40px;
  margin-bottom: 30px;
}

div form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

div form div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

div input, textarea {
  /* margin-bottom: 20px; */
  margin-left: 20px;
}

div button {
  justify-content: center;
  display: flex;
  align-items: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

tr,
th,
td {
  border: 1px solid #000;
  text-align: center;
}

.icons {
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  flex-direction: row;
}
</style>
