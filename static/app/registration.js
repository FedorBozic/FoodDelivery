Vue.component('registration', {
    data: function () {
		return {
			user: {}
		}
    },
    template: ` 
	<div>
		<h1>TEST</h1>
		<input type="text" v-model="user.username" >
		<input type="text" v-model="user.firstName" >
		<input type="text" v-model="user.lastName" >
		<input  type="button" value="Register" v-on:click="register()"/>
	</div>
	`,


    methods: {
        init: function () {

        },
        register: function () {
            let self = this;
            axios.post('users/newBuyer', JSON.stringify(this.user))
                .then(function (response) {
                    alert(response.data);
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
        }
    },
    mounted() {
        axios.get('users/currentUser')
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.error(err);
            })
    }
});