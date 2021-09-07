Vue.component('userview', {
        data: function () {
        	return{
        		users: {},
        		user: {
        			gender: 'MALE'
        		},
        		currentUser: {},
        		angle: '50',
	      		defaultColor1: 'red',
	      		defaultColor2: 'blue'
       		}
        },
        template: `
        <div class="container">
		    <div class="container-fluid p-0">
				<h1 class="h3 mb-3">Users</h1>
				<div class="row">
					<div class="col-xl-8">
						<div class="card">
							<div class="card-header pb-0">
								<h5 class="card-title mb-0">Users</h5>
							</div>
							<div class="card-body">
								<table class="table table-striped" style="width:100%">
									<thead>
										<tr>
											<th>Username</th>
											<th>First Name</th>
											<th>Last Name</th>
											<th>Tier</th>
											<th>Role</th>
										</tr>
									</thead>
									<tbody v-for="user in users">
										<tr>
											<td>{{user.username}}</td>
											<td>{{user.firstName}}</td>
											<td>{{user.lastName}}</td>
											<td><span class="badge" v-bind:style="{ background: profileTierGradientSmall(user) }">{{user.type.name}}</span></td>
											<td>{{user.role}}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
		
					<div class="col-xl-4">
						<div class="card">
							<div class="card-header">
								<h5 class="card-title mb-0">Add User</h5>
							</div>
							<div class="card-body">
		
								<input type="text" placeholder="Username" v-model="user.username" style="margin-bottom:10px; width:100%" >
								<input type="password" placeholder="Password" v-model="user.password" style="margin-bottom:10px; width:100%">
								<div class="form-row" style="margin-bottom:10px; width:100%">
									<div class="col">
									  <input type="text" placeholder="First Name" v-model="user.firstName" style="margin-bottom:10px; width:100%" >
									</div>
									<div class="col">
									  <input type="text" class="form_control" placeholder="Last Name" v-model="user.lastName" >
									</div>
								</div>
								<div class="form-row" style="margin-bottom:10px; width:100%">
									<div class="col">
									  <select name="gender" v-model="user.gender" >
										  <option value="FEMALE">Female</option>
										  <option value="MALE">Male</option>
									  </select>
									</div>
									<div class="col">
									  <input type="date" class="dateOfBirthPicker" v-model="user.birthday">
									</div>
								</div>
								<div class="form-row" style="margin-bottom:10px; width:100%">
									<div class="col">
									  <select name="role" v-model="user.role" >
										  <option value="CUSTOMER">Customer</option>
										  <option value="MANAGER">Manager</option>
										  <option value="DELIVERY">Delivery</option>
									  </select>
									 </div>
								</div>
								<input type="button" value="Add" class="generic_button" v-on:click="register()"/>
							</div>
						</div>
					</div>
				</div>
		
			</div>
		</div>
    	`,
    	methods: {
    		profileTierGradientSmall: function(user){
			if(user != null && user.type != null)
			{
				return `linear-gradient(${this.angle}deg, ${user.type.firstColor}, ${user.type.secondColor})`
			}
	        return `linear-gradient(${this.angle}deg, ${this.defaultColor1}, ${this.defaultColor2})`
	      	},
	      	register: function () {
	            let self = this;
	            axios.post('users/adduser', JSON.stringify(this.user))
	                .then(function (response) {
	                    axios.get('getUsers')
	                        .then(res => {
								self.users = res.data;
	                            window.location.href = "#/userview";
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
        	let self = this;
            let tmp = '?';
        	axios.get('getUsers')
            .then(res => {
                self.users = res.data;
                axios.get('users/currentUser')
                .then(res => {
                	self.currentUser = res.data
                })
            })
        }
    }
);