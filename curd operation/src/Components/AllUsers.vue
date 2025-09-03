<template>
  <table class="w-[99%] border-collapse mt-2 text-center p-4 text-[18px] mb-2 h-[80%] mx-auto border-b-2">
    <thead class="">
      <tr class="bg-gray-200 p-7 text-md">
        <th class="p-2.5">Sr. no</th>
        <th class="p-2.5">Id</th>
        <th class="relative p-2.5">
          First Name
          <span v-if="firstnameUparrow" class="absolute"
            ><font-awesome-icon
              icon="arrow-up"
              class="text-[14px] p-2 cursor-pointer"
              @click="sortTableByFirstname('firstname')" /></span
          ><span v-else class="absolute"
            ><font-awesome-icon
              icon="arrow-down"
              class="text-[14px] p-2 cursor-pointer"
              @click="sortTableByFirstname('firstname')"
          /></span>
        </th>
        <th class="p-2.5">Last Name</th>
        <th class="relative p-2.5">
          Date of Birth
          <span v-if="dobUparrow" class="absolute"
            ><font-awesome-icon
              icon="arrow-up"
              class="text-[14px] p-2 cursor-pointer"
              @click="sortTableByDateOfBirth('dob')" /></span
          ><span v-else class="absolute"
            ><font-awesome-icon
              icon="arrow-down"
              class="text-[14px] p-2 cursor-pointer"
              @click="sortTableByDateOfBirth('dob')"
          /></span>
        </th>
        <th class="p-2.5">Mobile No.</th>
        <th class="p-2.5">Address</th>
        <th class="p-2.5"></th>
      </tr>
    </thead>
    <tbody class="text-center ">
      <tr v-for="(item, index) in this.userStore.users" :key="index" class="even:bg-blue-50">
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

  <div class="flex items-center justify-center">
  <div
    class="pagination-controls flex justify-center gap-[15px] text-[17px] p-[13px]"
  >
    <button
      @click="goToPage(this.userStore.currentPage - 1)"
      :disabled="this.userStore.currentPage === 1"
      class="cursor-pointer"
    >
      Previous
    </button>
    <button
      v-for="page in this.userStore.totalPages"
      :key="page"
      @click="goToPage(page)"
      :class="this.userStore.currentPage == page ? 'text-blue-600 font-bold' : ''"
      class="cursor-pointer"
    >
      {{ page }}
    </button>
    <button
      @click="goToPage(this.userStore.currentPage + 1)"
      :disabled="this.userStore.currentPage === this.userStore.totalPages"
      class="cursor-pointer"
    >
      Next
    </button>
  </div>
  <div class="right-[5rem] absolute text-md">
    <!-- <button class="button">Add User</button> -->
     <router-link to="/addUser" class="button">Add User</router-link>
  </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/userStore"
import axios from "axios";

export default {
  setup() {
    const userStore = useUserStore();
    console.log(userStore);
    return { userStore };
  },
  data() {
    return {
      // tabledata: [],
      
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

    };
  },

  methods: {
    async fetchData(sortOrder = this.userStore.sortColumnOrder) {
      await this.userStore.fetchData({ sortColumn: this.userStore.sortColumn, sortOrder, currentPage: this.userStore.currentPage, usersPerPage: this.userStore.usersPerPage })
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

    goToPage(pageNumber) {
      if (pageNumber < 1 || pageNumber > this.userStore.totalPages) return;
      this.userStore.currentPage = pageNumber;
      this.fetchData();
    },

    async deleteuser(id) {
      // this.showdelete = !this.showdelete
      try {
        await this.userStore.deleteUser(id);
        await this.userStore.fetchData();
        this.showcancelbtn();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },

    canceldelete() {
      this.showcancelbtn();
    },
    
    showupdatebtn(user) {
      // this.formdata = { ...user };
      // this.showupdate = !this.showupdate;
      // this.showsubmit = !this.showsubmit;
      // console.log("User data for update:", this.formdata);
      this.$router.push('/editUser/' + user.id);
    },

    showcancelbtn() {
      this.showdeleteicons = !this.showdeleteicons;
      this.showcancelicon = !this.showcancelicon;
    },
  },
   mounted() {
    this.fetchData();
  },
};
</script>
