<template>
  <q-page padding>
    <h3 align="center">Admin Dashboard for Total, Count and Payment</h3>

    <q-card class="mycard" >
      <div>Date : {{ date }}</div>
      <div 
      v-for="sumTotal in sumTotals"
      :key="sumTotal.total" 
      :value="sumTotal">Total Sum : {{ sumTotal.total }}</div>
    

    <div 
      v-for="pendingCount in pendingCounts"
      :key="pendingCount.pend" 
      :value="pendingCount">Total Pending : {{ pendingCount.pend }}</div>
    

    <div 
      v-for="rejectCount in rejectCounts"
      :key="rejectCount.total" 
      :value="rejectCount">Total Reject : {{ rejectCount.reject }}</div>
    </q-card>
    <br/>
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
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <br />
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
      totalValue: null,
      date: null,
      dialog: {
        icon: "",
        msg: "",
        btnType: "",
        iconColor: "",
      },
      sumTotals: [],
      rejectCounts: [],
      pendingCounts: [],
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
    getDate() {
      var time = new Date;
      this.date = time.getDate() + '/' + (time.getMonth() + 1) + '/' + time.getFullYear()
    },
    getTotalSum() {
      
      this.$api
      .get("/park/totalsum")
      .then((res) => {
        if(res.status == 200) {
          this.sumTotals = res.data
        }
      })
      .catch((err)=> {
        console.log(err)
      })
    },
    getPending() {
      
      this.$api
      .get("/park/pending")
      .then((res) => {
        if(res.status == 200) {
          this.pendingCounts = res.data
        }
      })
      .catch((err)=> {
        console.log(err)
      })
    },getReject() {
      
      this.$api
      .get("/park/rejected")
      .then((res) => {
        if(res.status == 200) {
          this.rejectCounts = res.data
        }
      })
      .catch((err)=> {
        console.log(err)
      })
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

    onCancelEdit() {
      this.getAllUsers();
    },
    onEdit() {
      this.submitEditData();

      this.getAllUsers();
    },
    submitEditData() {
      const data = {
        hourly: this.input.hourly,
        daily: this.input.daily,
        monthly: this.input.monthly,
      };
      console.log("sumit data: " + data);

      this.$api
        .put("/payment/" + this.input.id, data)
        .then((res) => {
          if (res.status == 200) {
            Notify.create({
              type: "positive",
              message: "Updated Payment : " + res.data.id,
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
  },
  async mounted() {
    await this.getAllUsers();
    await this.getTotalSum();
    await this.getDate();
    await this.getPending();
    await this.getReject();
    this.dataReady = true;
  },
};
</script>

<style lang="sass"  >
.mycard
  margin-left: auto
  margin-right: auto
  width: 100%
  max-width: 200px
  background: yellow
</style>
