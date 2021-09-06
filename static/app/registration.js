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
					  <details>
						<summary>Test Dropdown</summary>
						<ul>
							<li>Item 1</li>
							<li>Item 2</li>
							<li>Item 3</li>
							<li>Item 4</li>
							<li>Item 5</li>
							<li>Item 1</li>
							<li>Item 2</li>
							<li>Item 3</li>
							<li>Item 4</li>
							<li>Item 5</li>
						</ul>
					</details>
					</div>
					<div class="col">
					  <input type="date" class="dateOfBirthPicker">
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