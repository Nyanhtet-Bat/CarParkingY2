<template>
  <q-page padding>
    <!-- <div>
    <q-btn color="primary" icon="check" 
    label="OK" 
    @click="showErrDialog('This is an example error.')" />
  </div> -->
    <div v-if="dataReady">
      <!-- display qtable -->
      <q-table
        title="Payment Update"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :pagination="paginations"
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>
            <q-td key="hourly" :props="props">
              {{ props.row.hourly }}
            </q-td>
            <q-td key="daily" :props="props">
              {{ props.row.daily }}
            </q-td>
            <q-td key="monthly" :props="props">
              {{ props.row.monthly }}
            </q-td>
            <q-td key="actions">
              <q-btn
                color="primary"
                icon="edit"
                flat
                round
                @click="editRecord(props.row)"
              />
              <!-- <q-btn
                  color="primary"
                  icon="delete"
                  flat
                  round
                  @click="deleteRecord(props.row)"
                /> -->
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <br />
      <!-- <q-table
        title="List of Methods"
        :rows="rows1"
        :columns="columns1"
        row-key="id"
        :pagination="paginations"
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>

            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>

            <q-td key="actions">
              <q-btn
                outline
                style="color: darkblue"
                label="Completed"
                @click="updateMethod(props.row)"
              />
              <q-btn
                outline
                style="color: darkred"
                label="Rejected"
                @click="deleteMethod(props.row)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table> -->
    </div>
    <div v-else class="flex flex-center">
      <!-- display circular progress -->
      <q-circular-progress
        indeterminate
        size="90px"
        color="lime"
        center-color="grey-8"
        track-color="transparent"
        class="q-ma-md"
      />
    </div>
    <!-- Edit Dialog -->
    <q-dialog v-model="form_edit" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="edit" color="primary" text-color="white" />
          <span class="q-ml-sm text-h6"> Edit User ID: {{ input.id }} </span>
        </q-card-section>
        <q-card-section>
          <q-input v-model="input.hourly" type="number" label="hourly" />
          <q-input v-model="input.daily" type="number" label="daily" />
          <q-input v-model="input.monthly" type="number" label="monthly" />

          <!-- 1048576 = 1MB -->
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            v-close-popup
            @click="onCancelEdit()"
          />
          <q-btn
            flat
            label="Edit"
            color="primary"
            v-close-popup
            @click="onEdit()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Delete Dialog -->
    <q-dialog v-model="form_del" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white" />
          <span class="q-ml-sm text-h6"> Delete user ID: {{ input.id }} </span>
        </q-card-section>
        <q-card-section>
          <span class="q-ml-sm"> Fullname: {{ input.fullname }} </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="NO" color="primary" v-close-popup />
          <q-btn
            flat
            label="YES"
            color="primary"
            v-close-popup
            @click="onDelete()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <DialogComponent v-model="showDialog" :propDialog="dialog" />
  </q-page>
</template>

<script>
import { Notify } from "quasar";
import DialogComponent from "../components/DialogComponent.vue";
import { useLoginUserStore } from "../stores/loginUserStore.js";
//   const defaultAvatar = "default-avatar.png";
export default {
  name: "ListUserPage",
  components: { DialogComponent },
  data() {
    return {
      dataReady: false,
      storeLogUser: useLoginUserStore(),
      showDialog: false,
      dialog: {
        icon: "",
        msg: "",
        btnType: "",
        iconColor: "",
      },
      rows: [],
      columns: [
        {
          name: "id",
          label: "ID",
          align: "center",
          field: "id",
          sortable: true,
        },
        {
          name: "hourly",
          label: "Hourly",
          align: "left",
          field: "hourly",
          sortable: true,
        },
        {
          name: "daily",
          label: "Daily",
          align: "left",
          field: "daily",
          sortable: true,
        },
        {
          name: "monthly",
          label: "Monthly",
          align: "left",
          field: "monthly",
          sortable: true,
        },
        {
          name: "actions",
          label: "Actions",
          align: "left",
          field: "actions",
        },
      ],
      paginations: { rowsPerPage: 10 },
      input: [],
      form_edit: false,
      uploadFile: null,
      form_del: false,
    };
  },
  methods: {
    showErrDialog(err) {
      this.showDialog = true;
      this.dialog.icon = "error";
      this.dialog.iconColor = "negative";
      this.dialog.msg = err;
      this.dialog.btnType = "Error";
    },
    getAllUsers() {
      this.$api
        .get("/payment/fees")
        .then((res) => {
          if (res.status == 200) {
            this.rows = res.data;
          }
          console.log(res.data.daily);
        })
        .catch((err) => {
          Notify.create({
            type: "negative",
            message: "Unauthorized",
          });
        });
      
    },
    editRecord(record) {
      // console.log(record);
      this.input = record;
      this.form_edit = true;
    },
    //   onRejected(rejectedEntries) {
    //     let msg;
    //     if (rejectedEntries[0].failedPropValidation == "accept")
    //       msg = "Only images (jpg, jpeg, png) are allowed.";
    //     else if (rejectedEntries[0].failedPropValidation == "max-file-size")
    //       msg = "File size cannot be larger than 1MB.";
    //     Notify.create({
    //       type: "negative",
    //       message: msg,
    //     });
    //   },

    onCancelEdit() {
      this.getAllUsers();
    },
    onEdit() {
      // if (this.uploadFile == "") this.uploadFile = null;
      // if (this.uploadFile) {
      //   //user changed avartar
      //   const formData = new FormData();
      //   formData.append("singlefile", this.uploadFile);
      //   this.$api
      //     .post("/file/upload", formData)
      //     .then((res) => {
      //       if (res.status == 200) {
      //         //continue submit form data to API
      //         this.submitEditData(res.data.uploadFileName);
      //         this.uploadFile = null;
      //       }
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       this.showDialog(err);
      //     });
      // } else {
      //user did not change avartar, submit form data to API
      this.submitEditData();
      // }
      // console.log("call getalluser")
      this.getAllUsers();
    },
    submitEditData() {
      // let img = "";
      // if (filename == null) {
      //   if (this.input.img == null) img = null;
      //   else img = this.getFileName(this.input.img);
      // } else img = filename;
      const data = {
        hourly: this.input.hourly,
        daily: this.input.daily,
        monthly: this.input.monthly,
      };
      console.log("sumit data: " + data);
      // const headers = {
      //   "x-access-token": this.storeLogUser.accessToken,
      // };
      this.$api
        .put("/payment/" + this.input.id, data)
        .then((res) => {
          if (res.status == 200) {
            Notify.create({
              type: "positive",
              message: "Updated user ID: " + res.data.id,
            });
            // if (this.storeLogUser.userid == res.data.id) {
              this.storeLogUser.hourly = res.data.hourly;
              this.storeLogUser.daily = res.data.daily;
              this.storeLogUser.monthly = res.data.monthly;
            // }

          }
        })
        .catch((err) => {
          console.log(err);
          this.showDialog(err);
        });
    },
    //   getFileName(filePath) {
    //     return filePath.substr(filePath.lastIndexOf("/") + 1);
    //   },
    //   deleteRecord(record) {
    //     this.input = record;
    //     this.form_del = true;
    //   },
    //   onDelete() {
    //     const headers = {
    //       "x-access-token": this.storeLogUser.accessToken,
    //     };
    //     this.$api
    //       .delete("/auth/" + this.input.id, { headers })
    //       .then((res) => {
    //         if (res.status == 200) {
    //           Notify.create({
    //             type: "positive",
    //             message: "Deleted user ID: " + res.data.id,
    //           });
    //           if (this.storeLogUser.userid == res.data.id) {
    //             this.storeLogUser.clearStorage();
    //             this.$router.push("/");
    //           } else {
    //             // console.log("call")
    //             this.getAllUsers();
    //           }
    //         }
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         this.showErrDialog(err);
    //       });
    //   },
    // },
  },
  async mounted() {
    await this.getAllUsers();
    this.dataReady = true;
  },
};
</script>

<style></style>
