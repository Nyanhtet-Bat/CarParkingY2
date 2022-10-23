<template>
  <q-form @submit.prevent="onSubmit" class="q-gutter-md" ref="myLoginForm">
    <q-input v-model="date" filled type="date" hint="Native date" />

    <div>
      <q-select
        standout
        v-model="time"
        :options="options"
        label="Choose your hour!    "
        display-value-html
        :display-value="time ? `<strong>${time.label}</strong>` : ''"
      />
    </div>

    <div>
      <q-btn color="deep-orange" glossy label="Submit" type="submit" />
    </div>
  </q-form>

  <q-table
    title="Customer Details"
    :rows="customers"
    :columns="columns"
    row-key="id"
  />
</template>

<script>
import { defineComponent } from "vue";
import { customerSubmitStore } from "../stores/customerdataStore.js"

export default defineComponent({
  name: "UserPage",
  data() {
    return {
      id: 1,
      date: "2021-08-12",
      model: null,
      time: null,
      customers: [],
      options: [
        { label: "1 hour   :   $1.00", hour: "1", fees: "$1.00" },
        { label: "2 hour   :   $1.50", hour: "2", fees: "$1.50" },
        { label: "3 hour   :   $2.00", hour: "3", fees: "$2.00" },
        { label: "4 hour   :   $2.50", hour: "4", fees: "$2.50" },
        { label: "All day   :   $3.00", hour: "All Day", fees: "$3.00" },
        { label: "Quaterly   :   $115.00", hour: "Quaterly", fees: "$115.00" },
      ],
      columns: [
        { name: "id", label: "ID", field: "id" },
        { name: "date", label: "Date", field: "date" },
        { name: "time", label: "Time", field: "time" },
        { name: "fee", label: "Fee", field: "fee" },
      ],
      storeCustomer: customerSubmitStore(),
    };
  },
  methods: {
    onSubmit() {
      this.customers.push({
        id: this.id++,
        date: this.date,
        time: this.time.hour,
        fee: this.time.fees,
      });
      this.storeCustomer.date = this.date;

      this.storeCustomer.time = this.time.hour;
      this.storeCustomer.fees = this.time.fee;
    },
  },
});
</script>

<style></style>
