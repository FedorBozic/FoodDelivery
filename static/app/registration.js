Vue.component('registration', {
    data: function () {
		return {
			user: {},
			currentUser: {}
		}
    },
    template: `
	<div class="login-reg-panel">			
		<div class="register-info-box">
			<h2>Have an account?</h2>
			<p>Click here to log in instead</p>
			<label for="log-login-show">Log in</label>
			<input type="radio" name="active-log-panel">
		</div>
							
		<div class="white-panel">
			<div class="register-show">
				<h2>REGISTER</h2>
				<input type="text" placeholder="Username" v-model="user.username" >
				<input type="password" placeholder="Password" v-model="user.password" >
				<div class="form-row">
					<div class="col">
					  <input type="text" placeholder="First Name" v-model="user.firstName" >
					</div>
					<div class="col">
					  <input type="text" class="form_control" placeholder="Last Name" v-model="user.lastName" >
					</div>
				</div>
				<input type="button" value="Register" v-on:click="register()"/>
			</div>
		</div>
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
                    axios.get('users/currentUser')
                        .then(res => {
                        	self.$root.$emit('login', res.data);
                            window.location.href = "#/";
                        })
                        .catch(err => {
                            console.error(err);
                        })
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
			axios.get('getUsers');
        }
    },
    mounted() {
        axios.get('users/currentUser')
            .then(res => {
            	this.currentUser = res.data;
                console.log(res);
            })
            .catch(err => {
                console.error(err);
            })
    }
});