const UserView = {template: '<userview></userview>'}
const Registration = {template: '<registration></registration>'}
const Login = {template: '<login></login>'}
const AddRestaurant = {template: '<addrestaurant></addrestaurant>'}


axios.defaults.baseURL = 'http://localhost:8080/api/'
const router = new VueRouter({
    mode: 'hash',
    routes: [
        {path: '/', component: UserView},
		{path: '/registration', component: Registration},
		{path: '/login', component: Login},
		{path: '/addrestaurant', component: AddRestaurant},
    ]
});


var app = new Vue({
    router,
    el: '#application',
    data: {
        currentUser: null,
        isSignedIn: false
    },
    methods: {
        logout: function () {
            let self = this;
            this.$root.$emit('login', null);
            axios
                .get("users/logout")
                .then(function (resp) {
                });

            window.location.href = "#/";
        }
    },
    mounted() {
        axios.get('users/currentUser')
        	.then(res => {
            	this.currentUser = res.data;
            	if(this.currentUser != null)
            	{
            		this.isSignedIn = true;
            	}
            	else
            	{
            		this.isSignedIn = false;
            	}
            })
        this.$root.$on('login', (user) => {
            this.currentUser = user;
            if(user != null)
            {
            	this.isSignedIn = true;
            }
            else
            {
            	this.isSignedIn = false;
            }
        })
    },
    created() {
        axios.get('users/currentUser')
        	.then(res => {
            	this.currentUser = res.data;
            	if(this.currentUser != null)
            	{
            		this.isSignedIn = true;
            	}
            	else
            	{
            		this.isSignedIn = false;
            	}
            })
    }
});