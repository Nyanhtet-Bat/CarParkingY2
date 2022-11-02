<template>
  <q-page :style-fn="myTweak" padding>
  
    <q-tabs
              v-model="paymentTab"
              class="text-teal"
            >
              <q-tab name="creditcardTab" icon="credit_card" label="Credit Card" />
              <q-tab name="qrcodeTab" icon="qr_code" label="QR code" />
              <q-tab name="cashTab" icon="payments" label="Cash" />
            </q-tabs>
             <q-separator />
             <q-tab-panels v-model="paymentTab" animated>
              <q-tab-panel name="creditcardTab">
                <div class="text-h6">Mails</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </q-tab-panel>
              <q-tab-panel name="qrcodeTab">
                <div class="text-h6">Alarms</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </q-tab-panel>
              <q-tab-panel name="cashTab">
                <div class="text-h6">Movies</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </q-tab-panel>
             </q-tab-panels>
  </q-page>
</template>

<script>
export default {
  data(){
    return{
      paymentTab: "creditcardTab"
    }
  }
}
</script>

<style>

</style>