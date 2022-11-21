<template>
  <q-page padding>
    <h3>Registered User Only</h3>
    <div v-if="dataReady">
      <!-- display qtable -->

      <q-table
        title="User Purchase History"
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
            <q-td key="userid" :props="props">
              {{ props.row.userid }}
            </q-td>
            <q-td key="status" :props="props">
              {{ props.row.status }}
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
import { useLoginUserStore } from "../stores/loginUserStore"

export default defineComponent({
  name: "UserPage",
  data() {
    return {
      dataReady: false,
      id: 1,
      date: "2021-08-12",
      storeLogUser: useLoginUserStore(),
      // model: null,
      // time: null,
      paginations: { rowsPerPage: 10 },
      rows: [],
      
      columns: [
        { name: "id", label: "ID", field: "id" },
        { name: "parkindate", label: "In Date", field: "parkindate" },
        { name: "parkoutdate", label: "Out Date", field: "parkoutdate" },
        { name: "fees", label: "Fees", field: "fees" },
        {
          name: "status",
          label: "Status",
          align: "left",
          field: "status",
        },
      ],
      storeCustomer: customerSubmitStore(),
    };
  },
  methods: {
    getParkData() {
      this.$api.get("/park/all")
      .then((res) => {
        if(res.status == 200) {
          res.data.forEach((item, key) => {
            if(item.userid == this.storeLogUser.getUserId){
              this.rows.push(item)
            } 
          })
        }
      }
        
      )
      .catch((err) => {
          Notify.create({
            type: "negative",
            message: "Unauthorized",
          });
          // this.storeLogUser.clearStorage();
          // this.$router.push("/");
        })
      
    },
  },

  async mounted() {
    await this.getParkData();
    this.dataReady = true;
  }
});
</script>

<style></style>
