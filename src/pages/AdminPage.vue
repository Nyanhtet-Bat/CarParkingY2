<template>
  <q-page padding>
    <div>
      <q-input v-model="method_name" type="text" label="Method Name" />
      <q-input v-model="method_visible" type="text" label="Method Status" />
      
      <br />
      <q-btn color="primary" icon="check" label="Add" @click="onClick" />
    </div>
    <br />
    <div>
      
     <q-table
        title="Update Payments"
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

            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>

            <q-td key="visible" :props="props">
              {{ props.row.visible }}
            </q-td>

            <q-td key="actions">
              <q-btn
                color="primary"
                icon="edit"
                flat
                round
                @click="editRecord(props.row)"
              />
              <q-btn
                color="primary"
                icon="delete"
                flat
                round
                @click="deleteRecord(props.row)"
              />
              
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <div>
      <!-- Edit Dialog -->
      <q-dialog v-model="form_edit" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="edit" color="primary" text-color="white" />
            <span class="q-ml-sm text-h6"> Edit Method ID: {{ input.id }} </span>
          </q-card-section>
          <q-card-section>
            <q-input v-model="input.name" type="text" label="Method Name" />
            <q-input v-model="input.visible" type="text" label="Method status" />

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
              label="Confirm"
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
            <span class="q-ml-sm text-h6">
              Delete method ID: {{ input.id }}
            </span>
          </q-card-section>
          <q-card-section>
            <span class="q-ml-sm"> Method: {{ input.name }} </span>
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
    </div>
  </q-page>
</template>

<script>
import { Notify } from "quasar"
export default {
  
  name: "ListUserPage",
  // components: { DialogComponent },
  data() {
    return {
      dataReady: false,
      // storeLogUser: useLoginUserStore(),
      showDialog: false,
      method_name: "",
      method_visible: "",
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
          name: "name",
          label: "Name",
          align: "left",
          field: "name",
          sortable: true,
        },
        {
          name: "visible",
          label: "Visible",
          align: "left",
          field: "visible",
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
    onClick() {
      const data = {
        name: this.method_name,
        visible: this.method_visible
      };
      console.log(data)
      this.$api
        .post("/method/add", data)
        .then((res) => {
          if (res.status == 200) {
            // console.log(res.data);
            
            
            Notify.create({
            type: "positive",
            message: "Add Method Successfully.",
          });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMethodData() {
      this.$api
        .get("/method/all")
        .then((res) => {
          if (res.status == 200) {
            this.rows = res.data;
            // console.log(res.data)
            console.log(this.services)
          }
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
      this.getMethodData();
    },
    onEdit() {
      this.submitEditData();
      this.getMethodData();
    },
    submitEditData() {
      const data = {
        name: this.input.name,
        visible: this.input.visible
      };
      console.log("submit data: " + data);
      this.$api
        .put("/method/" + this.input.id, data)
        .then((res) => {
          if (res.status == 200) {
            Notify.create({
              type: "positive",
              message: "Updated method ID: " + res.data.id,
            });
            // if (this.storeLogUser.userid == res.data.id) {
            // }
          }
        })
        .catch((err) => {
          console.log(err);
          // this.showDialog(err);
        });
    },
    deleteRecord(record) {
      this.input = record;
      this.form_del = true;
    },
    onDelete() {
      this.$api
        .delete("/method/" + this.input.id)
        .then((res) => {
          if (res.status == 200) {
            Notify.create({
              type: "positive",
              message: "Deleted method ID: " + res.data.id,
            });

            // console.log("call")
            this.getMethodData();
          }
        })
        .catch((err) => {
          console.log(err);
          // this.showErrDialog(err);
        });
    },

    
  },
  async mounted() {
    await this.getMethodData();
    this.dataReady = true;
  },
};
</script>

<style></style>
