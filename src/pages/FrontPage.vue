<template>
  <div>
    <!-- <HeaderComp></HeaderComp> -->
    <q-page class="column items-center">
      <div class="text-weight-bold transparent">Reserve your place here</div>
      <div>We are here to make things easier.</div>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md" ref="myLoginForm">
        <!-- q date 1 -->
        <div class="q-pa-md" style="max-width: 300px">
          <div>Park In Date</div>
          <q-input filled v-model="date1">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date1" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="date1" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <!-- q date 2 -->
        <div class="q-pa-md" style="max-width: 300px">
          <div>Park Out Date</div>
          <q-input filled v-model="date2">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date2" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="date2" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div align="center">
          <q-btn color="deep-orange" glossy label="Submit" type="submit" />
        </div>
      </q-form>

      <q-table
        title="Customer Details"
        :rows="customers"
        :columns="columns"
        row-key="id"
      />
    </q-page>
  </div>
</template>

<script>
// import HeaderComp from "src/components/HeaderComp.vue";
import { defineComponent } from "vue";
import { customerSubmitStore } from "../stores/customerdataStore.js";

export default defineComponent({
  name: "FrontPage",
  // components: { HeaderComp },

  data() {
    return {
      id: 1,
      date1: "2019-02-01 12:44",
      date2: "2019-02-01 12:44",
      model: null,
      time: null,
      customers: [],

      columns: [
        { name: "id", label: "ID", field: "id" },
        { name: "date1", label: "Park In Date", field: "date1" },
        { name: "date2", label: "Park Out Date", field: "date2" },
        { name: "fee", label: "Fee", field: "fee" },
      ],
      storeCustomer: customerSubmitStore(),
    };
  },
  methods: {
    onSubmit() {
      let fees = null;
      const parkindate = new Date(this.date1);
      const parkoutdate = new Date(this.date2);
      let monthdiff = parkoutdate.getMonth() - parkindate.getMonth();
      let daydiff = parkoutdate.getDate() - parkindate.getDate();
      let hourdiff = parkoutdate.getHours() - parkindate.getHours();
      if (monthdiff > 0) {
        fees = monthdiff * 115;
      } else if (monthdiff == 0) {
        if (daydiff > 0) { fees = daydiff * 3; } 
        else if (daydiff == 0) {
          if (hourdiff > 4) { fees = 3; } 
          else if (hourdiff <= 4 && hourdiff > 3) { fees = 2.5; }
          else if (hourdiff <= 3 && hourdiff > 2) { fees = 2.0; } 
          else if (hourdiff <= 2 && hourdiff > 1) { fees = 1.5; } 
          else if (hourdiff <= 1 && hourdiff > 0) { fees = 1.0; } 
          else { console.log("Please try again"); }
        }
      } else { console.log("Please try again"); }
      console.log(fees);

      if (fees != null) {
        this.customers.push({
          id: this.id++,
          date1: this.date1,
          date2: this.date2,
          fee: fees,
        });
        // this.storeCustomer.date = this.date;

        this.storeCustomer.parkin = this.date1;
        this.storeCustomer.parkout = this.date2;
        this.storeCustomer.fees = fees;
      }
    },
  },
});
</script>

<style></style>
