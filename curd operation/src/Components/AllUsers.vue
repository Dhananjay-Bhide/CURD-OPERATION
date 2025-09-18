<template>
  <div class="flex justify-between items-center mt-5">
    <input
      type="search"
      v-model="searchTerm"
      placeholder="Search by First Name"
      class="input w-[300px] mt-0 ml-4"
      @input="fetchData()"
    />
    <div class="right-[3rem] relative text-md">
      <router-link to="/addUser" class="button">Add User</router-link>
    </div>
  </div>
  <table
    class="w-[99%] border-collapse mt-3 text-center p-4 text-[18px] mb-2 h-[80%] mx-auto border-b-2"
  >
    <thead class="">
      <tr class="bg-gray-200 p-7 text-md">
        <th class="p-2.5">Sr. no</th>
        <th class="p-2.5">Id</th>
        <th class="relative p-2.5">
          First Name
          <span v-if="firstNameUparrow" class="absolute"
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
    <tbody class="text-center">
      <tr
        v-for="(item, index) in userStore.users"
        :key="index"
        class="even:bg-blue-50"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ item.id }}</td>
        <td>{{ item.firstname }}</td>
        <td>{{ item.lastname }}</td>
        <td>{{ item.dob }}</td>
        <td>{{ item.mobile }}</td>
        <td>{{ item.address }}</td>
        <td>
          <div class="flex justify-center items-center gap-1">
            <!-- Normal state (show edit + delete) -->
            <template v-if="activeRowId !== item.id">
              <font-awesome-icon
                icon="pen-to-square"
                @click="showUpdateBtn(item)"
                class="cursor-pointer text-blue-500 hover:text-blue-700 text-xl"
              />
              <font-awesome-icon
                icon="trash"
                @click="showCancelBtn(item.id)"
                class="cursor-pointer text-red-500 hover:text-red-700 text-xl"
              />
            </template>

            <!-- Cancel/Confirm state -->
            <template v-else>
              <font-awesome-icon
                icon="check"
                @click="deleteUser(item.id)"
                class="cursor-pointer text-green-500 hover:text-green-700 text-xl"
              />
              <font-awesome-icon
                icon="xmark"
                @click="cancelDelete()"
                class="cursor-pointer text-red-500 hover:text-red-700 text-xl"
              />
            </template>
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
        class="cursor-pointer disabled:opacity-0"
      >
        Previous
      </button>
      <span
        :class="
          userStore.currentPage == userStore.currentPage
            ? 'text-blue-600 font-bold'
            : ''
        "
        class="cursor-pointer"
      >
        {{ userStore.currentPage }} of {{ userStore.totalPages }}
      </span>
      <button
        @click="goToPage(userStore.currentPage + 1)"
        :disabled="userStore.currentPage === userStore.totalPages"
        class="cursor-pointer disabled:opacity-0"
      >
        Next
      </button>
    </div>
    <div class="flex items-center gap-1.5">
      <p>Go to page:</p>
      <select name="gotopage" id="gotopage" v-model="userStore.currentPage" @change="goToPage(userStore.currentPage)" class="input">
        <option 
          v-for="page in userStore.totalPages"
          :key="page"
          class="cursor-pointer"
          :value="page"
          :selected="page === userStore.currentPage"
          for="gotopage"
        >
          {{ page }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/userStore";
import type { User } from "../types/types";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const userStore = useUserStore();
// console.log(userStore);

// const showupdate = ref(false);
// showdelete: false,
const showDeleteIcons = ref(true);
const showCancelIcon = ref(false);

const searchTerm = ref("");

const firstNameUparrow = ref(true);
const dobUparrow = ref(true);

const sortColumnOrder = ref("asc");
const sortDateOrder = ref("desc");
const sortOrder = ref("");
const sortColumn = ref("");

const activeRowId = ref<number | null>(null);

const fetchData = async () => {
  await userStore.fetchData({
    sort_column: sortColumn.value,
    sort_order: sortOrder.value,
    search: searchTerm.value,
  });
};

const sortTableByFirstname = async (sortColumnName: string) => {
  // console.log(sortColumn)
  try {
    if (sortColumnOrder.value == "asc") {
      sortOrder.value = sortColumnOrder.value;
      sortColumnOrder.value = "desc";
    } else {
      sortOrder.value = sortColumnOrder.value;
      sortColumnOrder.value = "asc";
    }
    sortColumn.value = sortColumnName;

    await fetchData();
    // console.log(this.tabledata);
    firstNameUparrow.value = !firstNameUparrow.value;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const sortTableByDateOfBirth = async (sortColumnName: string) => {
  // console.log(sortColumn)
  try {
    if (sortDateOrder.value == "asc") {
      sortOrder.value = sortDateOrder.value;
      sortDateOrder.value = "desc";
    } else {
      sortOrder.value = sortDateOrder.value;
      sortDateOrder.value = "asc";
    }
    sortColumn.value = sortColumnName;

    await fetchData();
    // this.tabledata = response.data.data;
    // console.log(this.tabledata);
    dobUparrow.value = !dobUparrow.value;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const goToPage = (pageNumber: number) => {
  if (pageNumber < 1 || pageNumber > userStore.totalPages) return;
  userStore.currentPage = pageNumber;

  fetchData();
};

const deleteUser = async (id: number) => {
  // this.showdelete = !this.showdelete
  try {
    await userStore.deleteUser(id);
    await userStore.fetchData();
    showCancelBtn(id);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

const cancelDelete = () => {
  activeRowId.value = null;
  // showcancelbtn();
};

const showUpdateBtn = (user: User) => {
  // this.formdata = { ...user };
  // this.showupdate = !this.showupdate;
  // this.showsubmit = !this.showsubmit;
  // console.log("User data for update:", this.formdata);
  router.push("/editUser/" + user.id);
};

const showCancelBtn = (id: number) => {
  activeRowId.value = id;
  showDeleteIcons.value = !showDeleteIcons.value;
  showCancelIcon.value = !showCancelIcon.value;
};

onMounted(() => {
  fetchData();
});
</script>
