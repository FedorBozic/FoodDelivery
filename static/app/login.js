Vue.component('login', {
    data: function () {
		return {
			user: {},
			currentUser: {}
		}
    },
    template: `
	<div class="login-reg-panel">			
		<div class="register-info-box">
			<h2>Don't have an account'?</h2>
			<p>Click here to register</p>
			<label id="label-register" for="log-register-show">Register</label>
			<input type="radio" name="active-log-panel" id="log-register-show">
		</div>
							
		<div class="white-panel">
			<div class="register-show">
				<h2>LOGIN</h2>
				<input type="text" placeholder="Username" v-model="user.username" >
				<input type="password" placeholder="Password" v-model="user.password" >
				<input type="button" value="Login" v-on:click="login()"/>
			</div>
		</div>
	</div>
	`,


    methods: {
        init: function () {

        },
        login: function () {
            let self = this;
            axios.post('users/login', JSON.stringify(this.user))
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