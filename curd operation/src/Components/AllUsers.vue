<template>
  <div>
    <input type="search" v-model="searchTerm" placeholder="Search by First Name" class="input w-[300px] mt-4 ml-4 right-0"  @input="fetchData()" />
  </div>
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
      <tr v-for="(item, index) in userStore.users" :key="index" class="even:bg-blue-50">
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
      @click="goToPage(userStore.currentPage - 1)"
      :disabled="userStore.currentPage === 1"
      class="cursor-pointer"
    >
      Previous
    </button>
    <button
      v-for="page in userStore.totalPages"
      :key="page"
      @click="goToPage(page)"
      :class="userStore.currentPage == page ? 'text-blue-600 font-bold' : ''"
      class="cursor-pointer"
    >
      {{ page }}
    </button>
    <button
      @click="goToPage(userStore.currentPage + 1)"
      :disabled="userStore.currentPage === userStore.totalPages"
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

<script setup lang="ts">
import { useUserStore } from "../stores/userStore"
import axios from "axios";
import type { User} from "../types/types";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter()


    const userStore = useUserStore();
    // console.log(userStore);
      
      const showupdate = ref(false);
      // showdelete: false,
      const showdeleteicons = ref(true);
      const showcancelicon = ref(false);
      const errormessage = ref(null);

      const searchTerm = ref("");

      const firstnameUparrow = ref(true);
      const dobUparrow = ref(true);

      const sortColumnOrder = ref("asc");
      const sortDateOrder = ref ("desc");
      const sortColumn = ref("");


    const fetchData = async (sortOrder: string = sortColumnOrder.value) => {
      await userStore.fetchData({ sort_column: sortColumn.value, sortOrder, currentPageVal: userStore.currentPage, usersPerPageVal: userStore.usersPerPage, search: searchTerm.value })
    };

    const sortTableByFirstname = async (sortColumnName: string) => {
      // console.log(sortColumn)
      try {
        if (sortColumnOrder.value == "asc") {
          sortColumnOrder.value = "desc";
        } else {
          sortColumnOrder.value = "asc";
        }
        sortColumn.value = sortColumnName;

        await fetchData(sortColumnOrder.value);
        // console.log(this.tabledata);
        firstnameUparrow.value = !firstnameUparrow.value;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const sortTableByDateOfBirth = async (sortColumnName: string) => {
      // console.log(sortColumn)
      try {
        if (sortDateOrder.value == "asc") {
          sortDateOrder.value = "desc";
        } else {
          sortDateOrder.value = "asc";
        }
        sortColumn.value = sortColumnName;
        await fetchData(sortColumnOrder.value);

        // this.tabledata = response.data.data;
        // console.log(this.tabledata);
        dobUparrow.value = dobUparrow.value;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const goToPage = (pageNumber: number) => {
      if (pageNumber < 1 || pageNumber > userStore.totalPages) return;
      userStore.currentPage = pageNumber;
      fetchData();
    };

    const deleteuser = async (id: number) => {
      // this.showdelete = !this.showdelete
      try {
        await userStore.deleteUser(id);
        await userStore.fetchData();
        showcancelbtn();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };

    const canceldelete = () => {
      showcancelbtn();
    };
    
    const showupdatebtn = (user: User) => {
      // this.formdata = { ...user };
      // this.showupdate = !this.showupdate;
      // this.showsubmit = !this.showsubmit;
      // console.log("User data for update:", this.formdata);
      router.push('/editUser/' + user.id);
    };

    const showcancelbtn = () => {
      showdeleteicons.value = !showdeleteicons.value;
      showcancelicon.value = showcancelicon.value;
    };
    
    onMounted(() => {
    fetchData();
  })
</script>
