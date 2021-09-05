const UserView = {template: '<userview></userview>'}


axios.defaults.baseURL = 'http://localhost:8080/api/'
const router = new VueRouter({
    mode: 'hash',
    routes: [
        {path: '/', component: UserView},
    ]
});


var app = new Vue({
    router,
    el: '#application'
});