const UserView = {template: '<userview></userview>'}
const Registration = {template: '<registration></registration>'}


axios.defaults.baseURL = 'http://localhost:8080/api/'
const router = new VueRouter({
    mode: 'hash',
    routes: [
        {path: '/', component: UserView},
		{path: '/registration', component: Registration},
    ]
});


var app = new Vue({
    router,
    el: '#application',
    data: {
        currentUser: null
    },
    mounted() {
        axios.get('users/currentUser')
    }
});