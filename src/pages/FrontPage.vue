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
                  <q-date
                    v-model="date1"
                    mask="YYYY-MM-DD HH:mm"
                    :options="optionfn"
                  >
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
          <q-btn color="deep-orange" glossy label="Check Out" type="submit" />
        </div>
      </q-form>

      <q-table
        title="Customer Details"
        :rows="customers"
        :columns="columns"
        row-key="id"
      />
      <div> {{ fees }}</div>

      <q-dialog v-model="payment" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-form
              @submit="onSubmit"
              @reset="onReset"
              class="q-gutter-md"
            >
            <div>Your payment {{ fees }} $ is due. Please select payment method!!</div>
            <q-tabs
              v-model="tab"
              class="text-teal"
            >
              <q-tab name="Tab creditcardTab" icon="credit_card" label="Mails" />
              <q-tab name="alarms" icon="alarm" label="Alarms" />
              <q-tab name="movies" icon="movie" label="Movies" />
            </q-tabs>
              
              <div>
                <q-btn label="Submit" type="submit" color="primary"/>
                <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
              </div>
            </q-form>
            

          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="white" v-close-popup />
            <q-btn flat label="Confirm" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      
    </q-page>
  </div>
</template>

<script>
// import HeaderComp from "src/components/HeaderComp.vue";
import { defineComponent } from "vue";
import { customerSubmitStore } from "../stores/customerdataStore.js";
import { Notify } from "quasar";

export default defineComponent({
  name: "FrontPage",
  // components: { HeaderComp },

  data() {
    return {
      id: 1,
      date1: "2022-02-01 12:44",
      date2: "2022-02-01 13:30",
      model: null,
      time: null,
      customers: [],
      fees: null,
      payment: false,
      options: ["Credit Card", "QR code", "Pay by Cash"],

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
      // let fees = null;
      const parkindate = new Date(this.date1);
      const parkoutdate = new Date(this.date2);
      let monthdiff = parkoutdate.getMonth() - parkindate.getMonth();
      let daydiff = parkoutdate.getDate() - parkindate.getDate();
      let hourdiff = parkoutdate.getHours() - parkindate.getHours();
      if (monthdiff > 0) {
        this.fees = monthdiff * 115;
      } else if (monthdiff == 0) {
        if (daydiff > 0) {
          this.fees = daydiff * 3;
        } else if (daydiff == 0) {
          if (hourdiff > 4) {
            this.fees = 3;
          } else if (hourdiff <= 4 && hourdiff > 3) {
            this.fees = 2.5;
          } else if (hourdiff <= 3 && hourdiff > 2) {
            this.fees = 2.0;
          } else if (hourdiff <= 2 && hourdiff > 1) {
            this.fees = 1.5;
          } else if (hourdiff <= 1 && hourdiff > 0) {
            this.fees = 1.0;
          } else {
            Notify.create({
              type: negative,
              message: "Please enter valid date and hour"
            })
          }
        }
      } else {
        Notify.create({
              type: negative,
              message: "Please enter valid date and hour"
            })
      }
      console.log(this.fees);

      if (this.fees != null) {
        const data = {
          parkindate: this.parkindate,
          parkoutdate: this.parkoutdate,
          fees: this.fees,
          id: this.id,
        };
        this.$api
          .post("/auth/user", data)
          .then((res) => {
            if (res.status == 200) {
              console.log(res.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });

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
    optionfn(date1) {
      return date1 >= Date.now();
    },
  },
});
</script>

<style></style>
