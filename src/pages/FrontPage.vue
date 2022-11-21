<template>
  <div>
    <!-- <HeaderComp></HeaderComp> -->
    <q-page class="column items-center">
      <h1 class="text-weight-bold transparent">Reserve your place here</h1>
      <h3>We are here to make things easier.</h3>

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
          <div>Select Your Payment</div>
          <select v-model="paymentSelect">
            <option
              v-for="service in services"
              :key="service.id"
              :value="service"
            >
              {{ service.name }}
            </option>
          </select>
        </div>

        <div align="center">
          <q-btn color="deep-orange" glossy label="Check Out" type="submit" />
        </div>
      </q-form>

      <q-dialog v-model="payment" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
              <!-- <div>Your payment {{ fees }} $ is due. Please select payment method!!</div> -->
              <q-tabs v-model="tab" class="text-teal">
                <q-tab
                  name="Tab creditcardTab"
                  icon="credit_card"
                  label="Mails"
                />
                <q-tab name="alarms" icon="alarm" label="Alarms" />
                <q-tab name="movies" icon="movie" label="Movies" />
              </q-tabs>

              <div>
                <q-btn label="Submit" type="submit" color="primary" />
                <q-btn
                  label="Reset"
                  type="reset"
                  color="primary"
                  flat
                  class="q-ml-sm"
                />
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
import { useLoginUserStore } from "../stores/loginUserStore.js";

export default defineComponent({
  name: "FrontPage",
  // components: { HeaderComp },

  data() {
    return {
      storeLogUser: useLoginUserStore(),
      date1: "2022-02-01 12:44",
      date2: "2022-03-01 13:30",
      model: null,
      time: null,
      rows: [],
      fees: null,
      payment: false,
      paymentSelect: {},
      services: [],
      options: ["Credit Card", "QR code", "Pay by Cash"],

      columns: [
        { name: "id", label: "ID", field: "id" },
        { name: "date1", label: "Park In Date", field: "date" },
        { name: "date2", label: "Park Out Date", field: "date" },
        { name: "fee", label: "Fee", field: "fee" },
      ],
      storeCustomer: customerSubmitStore(),
    };
  },
  methods: {
    getMethodData() {
      this.$api
        .get("/method/all")
        .then((res) => {
          if (res.status == 200) {
            this.rows = res.data;
            // console.log(res.data)
            this.services = res.data;
            console.log(this.services);
          }
        })
        .catch((err) => {
          Notify.create({
            type: "negative",
            message: "Unauthorized",
          });
        });
    },

    onSubmit() {
      
      var time = new Date;
      const dateNow = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() 
      const parkindate = new Date(this.date1);
      const parkoutdate = new Date(this.date2);
      const oneDay = 24 * 60 * 60 * 1000; //hours * minutes * seconds * mili
      // let yeardiff = parkoutdate.getFullYear() - parkindate.getFullYear();
      let datediff = Math.round(Math.abs(parkindate - parkoutdate) / oneDay);
      // let milidate = new Date(datediff);
      let monthdiff = parseInt(datediff / 30);
      let daydiff = datediff;

      let hourly = this.storeLogUser.hourly;
      let daily = this.storeLogUser.getDaily;
      let monthly = this.storeLogUser.getMonthly;

      let hourdiff = parkoutdate.getHours() - parkindate.getHours();
      if (monthdiff > 0) {
        this.fees = (monthdiff + 1) * monthly;
      } else if (monthdiff == 0) {
        if (daydiff > 0) {
          this.fees = daydiff * daily;
        } else if (daydiff == 0) {
          if (hourdiff > 0) {
            this.fees = hourdiff * hourly;
          } else {
            Notify.create({
              type: negative,
              message: "Please enter valid hour",
            });
          }
        }
      } else {
        Notify.create({
          type: negative,
          message: "Please enter valid date",
        });
      }

      // console.log(this.storeLogUser.getUserId)

      if (this.fees != null) {
        const data = {
          parkin: parkindate,
          parkout: parkoutdate,
          fees: this.fees,
          status: "Pending",
          userid: this.storeLogUser.userid,
          date: dateNow
        };
        this.$api
          .post("/park/detail", data)
          .then((res) => {
            if (res.status == 200) {
              console.log(res.data);
              Notify.create({
                type : "positive",
                message: "Your transaction has been created."
              })
            }
          })
          .catch((err) => {
            console.log(err);
          });
        console.log(data);
      } else {
        Notify.create({
          type: "Negative",
          message: "Please select valid date",
        });
      }
    },
  },
  async mounted() {
    await this.getMethodData();
    this.dataReady = true;
  },
});
</script>

<style>
select {
  width: 260px;
  padding: 16px 18px;
  border: none;
  border-radius: 4px;
  background-color: #f1f1f1;
}
</style>
