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
        currentUser: null,
        isSignedIn: false
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
            this.isSignedIn = true;
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