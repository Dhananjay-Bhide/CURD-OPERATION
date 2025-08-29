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

      sortColumnOrder: "asc",
      sortDateOrder: "desc",
      sortColumn: "",

      currentPage: 1,
      usersPerPage: 5,
      totalPages: 1,
      totalUsers: 0,

      // selectedOption: ''
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

    async fetchData(sortOrder = this.sortColumnOrder) {
      try {
        const response = await axios.get(`http://localhost:3000/api/users?sort_column=${this.sortColumn}&sort_order=${sortOrder}&currentPage=${this.currentPage}&usersPerPage=${this.usersPerPage}`);
        console.log(response.data);
        this.tabledata = response.data.data.users;
        this.totalPages = response.data.data.totalPages;
        this.totalUsers = response.data.data.totalCount;
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
          this.tabledata = response.data.data;
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

    async sortTableByFirstname(sortColumn) {
      // console.log(sortColumn)
      try {
        if (this.sortColumnOrder == "asc") {
          this.sortColumnOrder = "desc";
        } else {
          this.sortColumnOrder = "asc";
        }
        this.sortColumn = sortColumn;

        await this.fetchData(this.sortColumnOrder);
        console.log(this.tabledata);
        this.firstnameUparrow = !this.firstnameUparrow;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async sortTableByDateOfBirth(sortColumn) {
      // console.log(sortColumn)
      try {
        if (this.sortDateOrder == "asc") {
          this.sortDateOrder = "desc";
        } else {
          this.sortDateOrder = "asc";
        }
        this.sortColumn = sortColumn;
        await this.fetchData(this.sortColumnOrder);

        // this.tabledata = response.data.data;
        console.log(this.tabledata);
        this.dobUparrow = !this.dobUparrow;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    prevPage() {
      if(this.currentPage > 1){
        this.currentPage--;
        this.fetchData();
      }
    },
    nextPage() {
      if(this.currentPage < this.totalPages){
        this.currentPage++;
        this.fetchData();
      }
    },
    goToPage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchData();
    }
  },

  mounted() {
    this.fetchData();
  },

  // computed: {
  //   paginatedItems() {
  //     const startIndex = (this.currentPage - 1) * this.usersPerPage;
  //     const endIndex = startIndex + this.usersPerPage;
  //     return this.tabledata.slice(startIndex, endIndex);
  //   },
  //   totalPages(){
  //     return Math.ceil(this.tabledata.length / this.usersPerPage);
  //   }
  // },
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
    <!-- <select name="" id="" v-model="selectedOption">
      <option value="firstname">First Name</option>
      <option value="id">Id</option>
    </select> -->
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
                sortTableByFirstname('firstname')
              " /></span
          ><span v-else class="absolute"
            ><font-awesome-icon
              icon="arrow-down"
              class="text-[14px] p-2 cursor-pointer"
              @click="sortTableByFirstname('firstname')"
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
                sortTableByDateOfBirth('dob')
              " /></span
          ><span v-else class="absolute"
            ><font-awesome-icon
              icon="arrow-down"
              class="text-[14px] p-2 cursor-pointer"
              @click="sortTableByDateOfBirth('dob')"
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

  <div class="pagination-controls flex justify-center gap-[15px] text-[17px] p-[13px]">
      <button @click="prevPage()" :disabled="currentPage === 1" class="cursor-pointer">Previous</button>
      <button 
        v-for="page in totalPages" 
        :key="page" 
        @click="goToPage(page)" 
        :class="currentPage==page ? 'text-blue-600 font-bold' : ''" class="cursor-pointer"
      >
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="cursor-pointer">Next</button>
    </div>
</template>

