import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
    strict: true,
    state: {
        users: [
            {
                username: 'admin',
                email: 'admin@admin.com',
                password: 'admin'
            },
            {
                username: 'root',
                email: 'root@admin.com',
                password: 'root'
            }
        ]

    },
    getters: {},
    mutations: {},
    actions: {}
}

