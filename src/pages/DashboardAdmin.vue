<template>
  <q-page padding>
    <div v-if="dataReady">
      <!-- display qtable -->
      <q-table
        title="List of Users"
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
            <q-td key="parkindate" :props="props">
              {{ props.row.parkindate }}
            </q-td>
            <q-td key="parkoutdate" :props="props">
              {{ props.row.parkoutdate }}
            </q-td>
            <q-td key="fees" :props="props">
              {{ props.row.fees }}
            </q-td>
            <q-td key="status" :props="props">
              {{ props.row.status }}
            </q-td>
            <q-td key="actions">
              <q-btn
                outline
                style="color: darkblue"
                label="Completed"
                @click="completed(props.row)"
              />
              <q-btn
                outline
                style="color: darkred"
                label="Rejected"
                @click="rejected(props.row)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>

      
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
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { Notify } from "quasar";
import { customerSubmitStore } from "../stores/customerdataStore.js";

export default defineComponent({
  name: "DashboardAdmin",
  data() {
    return {
      dataReady: true,
      paginations: { rowsPerPage: 10 },
      input: [],
      rows: [],
      input1:[],
      rows1: [],
      columns1: [
        { name: "id", label: "ID", field: "id" },
        { name: "name", label: "Method", field: "name" },
        {
          name: "actions",
          label: "Actions",
          align: "center ",
          field: "actions",
        },
      ],

      columns: [
        { name: "id", label: "ID", field: "id" },
        { name: "parkindate", label: "In Date", field: "parkindate" },
        { name: "parkoutdate", label: "Out Date", field: "parkoutdate" },
        { name: "fees", label: "Fees", field: "fees" },
        { name: "status", label: "status", field: "status" },
        {
          name: "actions",
          label: "Actions",
          align: "left",
          field: "actions",
        },
      ],
      storeCustomer: customerSubmitStore(),
    };
  },
  methods: {
    getParkData() {
      this.$api
        .get("/park/all")
        .then((res) => {
          if (res.status == 200) {
            this.rows = res.data;
          }
        })
        .catch((err) => {
          Notify.create({
            type: "negative",
            message: "Unauthorized",
          });
          this.$router.push("/");
        });
    },
    
    completed(record) {
      this.input = record;
      const data = {
        status: "Completed",
      };
      this.$api
        .put("/park/" + this.input.id, data)
        .then((res) => {
          if (res.status == 200) {
            Notify.create({
              type: "positive",
              message: "Updated status ID: " + res.data.id,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          // this.showDialog(err);
        });
      this.getParkData();
    },
    rejected(record) {
      this.input = record;
      const data = {
        status: "Rejected",
      };
      this.$api
        .put("/park/" + this.input.id, data)
        .then((res) => {
          if (res.status == 200) {
            Notify.create({
              type: "positive",
              message: "Updated status ID: " + res.data.id,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          // this.showDialog(err);
        });
      this.getParkData();
    },
  },

  async mounted() {
    await this.getParkData();
    
    this.dataReady = true;
  },
});
</script>

<style></style>
