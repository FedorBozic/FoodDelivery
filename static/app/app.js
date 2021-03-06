const Homepage = {template: '<homepage></homepage>'}
const UserView = {template: '<userview></userview>'}
const Registration = {template: '<registration></registration>'}
const Login = {template: '<login></login>'}
const AddRestaurant = {template: '<addrestaurant></addrestaurant>'}
const EditRestaurant = {template: '<editrestaurant></editrestaurant>'}
const Restaurant = {template: '<restaurant></restaurant>'}
const Orders = {template: '<orders></orders>'}
const CustomerOrders = {template: '<customerorders></customerorders>'}
const AwaitingDeliveryOrders = {template: '<awaitingdeliveryorders></awaitingdeliveryorders>'}
const Profile = {template: '<profile></profile>'}
const Basket = {template: '<basket></basket>'}
const AddItem = {template: '<additem></additem>'}

axios.defaults.baseURL = 'http://localhost:38080/api/'
const router = new VueRouter({
    mode: 'hash',
    routes: [
        {path: '/', component: Homepage},
		{path: '/registration', component: Registration},
		{path: '/login', component: Login},
		{path: '/userview', component: UserView},
		{path: '/addrestaurant', component: AddRestaurant},
		{path: '/editrestaurant/:id', component: EditRestaurant},
		{path: '/restaurant/:id', name: 'Restaurant', component: Restaurant},
		{path: '/orders/:id/', name: 'Orders', component: Orders},
		{path: '/customerorders/:id/', name: 'CustomerOrders', component: CustomerOrders},
		{path: '/awaitingdeliveryorders', component: AwaitingDeliveryOrders},
		{path: '/profile', component: Profile},
		{path: '/basket', component: Basket},
		{path: '/additem', component: AddItem},
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
            		this.role = this.currentUser.role;
            	}
            	else
            	{
            		this.isSignedIn = false;
            		this.role = null;
            	}
            })
        this.$root.$on('login', (user) => {
            this.currentUser = user;
            if(user != null)
            {
            	this.isSignedIn = true;
            	this.role = this.currentUser.role;
            }
            else
            {
            	this.isSignedIn = false;
            	this.role = null;
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
            		this.role = this.currentUser.role;
            	}
            	else
            	{
            		this.isSignedIn = false;
            		this.role = null;
            	}
            })
    }
});