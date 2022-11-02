import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core"

export const customerSubmitStore = defineStore("customerdata",{
    state: () => ({
        userid: useStorage("userid",""),
        fullname: useStorage("fullname",""),
        parkin: useStorage("parkin",""),
        parkout: useStorage("parkout",""),
        fees: useStorage("fees","")
    }),
    getters: {
        getUserId: (state) => {
            return state.userid;
        },
        getfullname: (state) => {
            return state.fullname;
        },
        getDate: (state) => {
            return state.parkin;
        },
        getTime: (state) => {
            return state.parkout;
        },
        getFees: (state) => {
            return state.fees;
        }
    }
})