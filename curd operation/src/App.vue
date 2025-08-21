<script>
import axios from "axios";

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
      showsubmit: true,
      showupdate: false,
      // showdelete: false,
      showdeleteicons: true,
      showcancelicon: false,

      errormessage: null,

      searchTerm: "",

      firstnameUparrow: true,
      dobUparrow: true,

      sortColumnOrder: "desc",
      sortDateOrder: "desc",
      // sortColumn: "firstname",
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
      this.errormessage = null;
      try {
        const response = await axios.post(
          `http://localhost:3000/api/users`,
          this.formdata
        );
        console.log(response.data);
        this.tabledata.push(response.data);
      } catch (error) {
        if (error.response) {
          console.error(error.response.data);
          this.errormessage = error.response.data.error;
          alert(this.errormessage);
        } else {
          console.error("Error submitting form:", error);
        }
      }
      console.log(this.tabledata);
      // this.firstName = "";
      // this.lastName = "";
      this.formdata.firstname = "";
      this.formdata.lastname = "";
      this.formdata.dob = "";
      this.formdata.mobile = "";
      this.formdata.address = "";

      this.fetchData();
    },

    async fetchData() {
      try {
        const response = await axios.get(`http://localhost:3000/api/users`);
        console.log(response.data);
        this.tabledata = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async searchUser(searchTerm) {
      if (searchTerm == "") {
        return this.fetchData();
      } else {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/users/${searchTerm}`
          );
          console.log(response.data);
          this.tabledata = response.data;
        } catch (error) {
          console.error("Error searching data:", error);
        }
      }
    },

    showupdatebtn(user) {
      this.formdata = { ...user };
      this.showupdate = !this.showupdate;
      this.showsubmit = !this.showsubmit;
      console.log("User data for update:", this.formdata);
    },

    async updateUser() {
      try {
        // console.log("Updating user:", user.id);
        const response = await axios.put(
          `http://localhost:3000/api/users/${this.formdata.id}`,
          this.formdata
        );
        console.log(response.data);
        const index = await this.tabledata.findIndex(
          (u) => u.id === this.formdata.id
        );
        if (index !== -1) {
          this.tabledata[index] = { ...this.formdata }; // update the table row
        }
        this.fetchData();
      } catch (error) {
        console.error("Error updating data:", error);
      }

      this.showupdate = !this.showupdate;
      this.showsubmit = !this.showsubmit;

      this.formdata.firstname = "";
      this.formdata.lastname = "";
      this.formdata.dob = "";
      this.formdata.mobile = "";
      this.formdata.address = "";
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

    showcancelbtn() {
      this.showdeleteicons = !this.showdeleteicons;
      this.showcancelicon = !this.showcancelicon;
    },

    async deleteuser(id) {
      // this.showdelete = !this.showdelete
      try {
        console.log("Deleting user with ID:", id);
        await axios.delete(`http://localhost:3000/api/users/${id}`);
        this.fetchData();
        this.showcancelbtn();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },

    canceldelete() {
      this.showcancelbtn();
    },

    async sortTableByFirstname(sortColumn, sortOrder) {
      // console.log(sortColumn)
      try {
        if (this.sortColumnOrder == "asc") {
          this.sortColumnOrder = "desc";
        } else {
          this.sortColumnOrder = "asc";
        }
        // console.log("this is try block")
        const response = await axios.get(
          `http://localhost:3000/api/users?sort_column=${sortColumn}&sort_order=${sortOrder}`
        );
        this.tabledata = response.data;
        console.log(this.tabledata);
        this.firstnameUparrow = !this.firstnameUparrow;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async sortTableByDateOfBirth(sortColumn, sortOrder) {
      // console.log(sortColumn)
      try {
        if (this.sortDateOrder == "asc") {
          this.sortDateOrder = "desc";
        } else {
          this.sortDateOrder = "asc";
        }
        // console.log("this is try block")
        const response = await axios.get(
          `http://localhost:3000/api/users?sort_column=${sortColumn}&sort_order=${sortOrder}`
        );
        this.tabledata = response.data;
        console.log(this.tabledata);
        this.dobUparrow = !this.dobUparrow;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>

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
      <div class="flex items-center justify-center gap-2">
        <button
          v-show="showupdate"
          @click.prevent="updateUser()"
          class="button"
        >
          Update
        </button>
        <button v-show="showupdate" class="button" @click="cancelupdate()">
          Cancel
        </button>
      </div>
    </form>
  </div>
  <div class="flex justify-end items-center mr-6">
    <input
      type="text"
      placeholder="Search by First Name"
      class="p-1.5 mr-2 border-2 rounded-md"
      v-model="searchTerm"
    />
    <button
      @click="searchUser(searchTerm)"
      class="bg-blue-500 text-white p-2 rounded-xl text-md cursor-pointer"
    >
      Search
    </button>
  </div>
  <table class="w-full border-collapse mt-4 text-center p-4 text-[18px] mb-2">
    <thead class="">
      <tr class="bg-gray-200 p-4">
        <th>Sr. no</th>
        <th>Id</th>
        <th class="relative">
          First Name
          <span v-if="firstnameUparrow" class="absolute"
            ><font-awesome-icon
              icon="arrow-up"
              class="text-[14px] p-2 cursor-pointer"
              @click="
                sortTableByFirstname('firstname', this.sortColumnOrder)
              " /></span
          ><span v-else class="absolute"
            ><font-awesome-icon
              icon="arrow-down"
              class="text-[14px] p-2 cursor-pointer"
              @click="sortTableByFirstname('firstname', this.sortColumnOrder)"
          /></span>
        </th>
        <th>Last Name</th>
        <th class="relative">
          Date of Birth
          <span v-if="dobUparrow" class="absolute"
            ><font-awesome-icon
              icon="arrow-up"
              class="text-[14px] p-2 cursor-pointer"
              @click="
                sortTableByDateOfBirth('dob', this.sortDateOrder)
              " /></span
          ><span v-else class="absolute"
            ><font-awesome-icon
              icon="arrow-down"
              class="text-[14px] p-2 cursor-pointer"
              @click="sortTableByDateOfBirth('dob', this.sortDateOrder)"
          /></span>
        </th>
        <th>Mobile No.</th>
        <th>Address</th>
        <th></th>
      </tr>
    </thead>
    <tbody class="text-center">
      <tr v-for="(item, index) in tabledata" :key="index" class="">
        <td>{{ index + 1 }}</td>
        <td>{{ item.id }}</td>
        <td>{{ item.firstname }}</td>
        <td>{{ item.lastname }}</td>
        <td>{{ item.dob }}</td>
        <td>{{ item.mobile }}</td>
        <td>{{ item.address }}</td>
        <td>
          <div
            class="flex justify-center items-center gap-1"
            v-show="showdeleteicons"
          >
            <font-awesome-icon
              icon="pen-to-square"
              @click="showupdatebtn(item)"
              class="cursor-pointer text-blue-500 hover:text-blue-700 text-xl"
            />
            <font-awesome-icon
              icon="trash"
              @click="showcancelbtn()"
              class="cursor-pointer text-red-500 hover:text-red-700 text-xl"
            />
          </div>
          <div
            v-show="showcancelicon"
            class="flex justify-center items-center gap-1"
          >
            <font-awesome-icon
              icon="check"
              @click="deleteuser(item.id)"
              class="cursor-pointer text-green-500 hover:text-green-700 text-xl"
            />
            <font-awesome-icon
              icon="xmark"
              @click="canceldelete()"
              class="cursor-pointer text-red-500 hover:text-red-700 text-xl"
            />
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- <div v-if="showdelete">
    <p>Are you sure you want to delete this user?</p>
    <button @click="deleteuser(item.id)">Yes</button>
    <button @click="showdelete = false">No</button>
  </div> -->
</template>

<!-- <style>
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

div input,
textarea {
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
</style> -->
