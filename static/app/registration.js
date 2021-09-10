Vue.component('registration', {
    data: function () {
		return {
			user: {
                gender: 'MALE',
                role: 'CUSTOMER',
                type: 'BRONZE'
            },
			currentUser: {}
		}
    },
    template: `
	<div class="login-reg-panel">			
		<div class="register-info-box">
			<h2>Have an account?</h2>
			<p>Click here to log in instead</p>
			<a href="#/login"><label id="label-login" for="log-login-show">Login</label></a>
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
				<div class="form-row">
					<div class="col">
					  <select name="gender" v-model="user.gender" >
						  <option value="FEMALE">Female</option>
						  <option value="MALE">Male</option>
					  </select>
					</details>
					</div>
					<div class="col">
					  <input type="date" class="dateOfBirthPicker" v-model="user.birthday">
					</div>
				</div>
				<input type="button" value="Register" class="generic_button" v-on:click="register()"/>
			</div>
		</div>
	</div>
	`,


    methods: {
        init: function () {

        },
        register: function () {
            let self = this;
            axios.post('users/adduser', JSON.stringify(this.user))
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