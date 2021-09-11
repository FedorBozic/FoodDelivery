Vue.component('userview', {
        data: function () {
        	return{
        		users: {},
        		user: {
        			uuid: 'nouuid',
        			gender: 'MALE'
        		},
        		currentUser: {},
        		angle: '50',
	      		defaultColor1: 'red',
	      		defaultColor2: 'blue',
	      		currentSort:'username',
  				currentSortDir:'asc',
  				filterUsername: '',
  				filterFirstName: '',
  				filterLastName: '',
  				filterRole: '',
  				filterType: ''
       		}
        },
        template: `
        <div class="container">
        	<div class="row mb-3" style="margin-top: 20px">
				<div class="col-lg-4 mx-auto">
					<div class="bg-white p-3 rounded shadow">
						<form action="">
							<div class="p-1 bg-light rounded rounded-pill shadow-sm mb-4">
								<div class="input-group">
									<input type="search" placeholder="Username" aria-describedby="button-addon1" class="form-control border-0 bg-light" v-model="filterUsername">
								</div>
							</div>
							<div class="p-1 bg-light rounded rounded-pill shadow-sm mb-4">
								<div class="input-group">
									<input type="search" placeholder="First Name" aria-describedby="button-addon1" class="form-control border-0 bg-light" v-model="filterFirstName">
								</div>
							</div>
							<div class="p-1 bg-light rounded rounded-pill shadow-sm mb-4">
								<div class="input-group">
									<input type="search" placeholder="Last Name" aria-describedby="button-addon1" class="form-control border-0 bg-light" v-model="filterLastName">
								</div>
							</div>
							<select v-model="filterRole" style="max-width:100%">
								<option value=""></option>
								<option value="CUSTOMER">Customer</option>
								<option value="DELIVERY">Delivery</option>
								<option value="MANAGER">Manager</option>
								<option value="ADMIN">Admin</option>
							</select>
							<select v-model="filterType" style="max-width:100%">
								<option value=""></option>
								<option value="BRONZE">Bronze</option>
								<option value="SILVER">Silver</option>
								<option value="GOLD">Gold</option>
								<option value="STAFF">Staff</option>
								<option value="ADMIN">Admin</option>
							</select>
						</form>
					</div>
				</div>
			</div>
		    <div class="container-fluid p-0" style="margin-top:100px">
				<div class="row">
					<div class="col-xl-8">
						<table class="table table-striped" style="width:100%">
							<thead style="background-image: linear-gradient(to right,rgba(236, 48, 20) 0%,rgba(250, 30, 20, 0.9) 100%); color:white">
								<tr>
									<th @click="sort('username')">Username</th>
									<th @click="sort('firstName')">First Name</th>
									<th @click="sort('lastName')">Last Name</th>
									<th>Tier</th>
									<th>Role</th>
								</tr>
							</thead>
							<tbody v-for="u in sortedUsers" @click="changeUserEditingMode(u)">
								<tr>
									<td>{{u.username}}</td>
									<td>{{u.firstName}}</td>
									<td>{{u.lastName}}</td>
									<td><span class="badge" v-if="u.type && u.type.name" v-bind:style="{ background: profileTierGradientSmall(u) }">{{u.type.name}}</span></td>
									<td>{{u.role}}</td>
								</tr>
							</tbody>
						</table>
					</div>
		
					<div class="col-xl-4">
						<div class="card">
							<div class="card-header">
								<h5 v-if="this.user.uuid === 'nouuid'" class="card-title mb-0">Add User</h5>
								<h5 v-if="this.user.uuid != 'nouuid'" class="card-title mb-0">Edit User</h5>
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
								<input v-if="this.user.uuid === 'nouuid'" type="button" value="Add" class="generic_button" v-on:click="register()"/>
								<input v-if="this.user.uuid != 'nouuid'" type="button" value="DEL" class="generic_button" v-on:click="deleteUser()"/>
								<input v-if="this.user.uuid != 'nouuid'" type="button" value="Confirm" class="generic_button" v-on:click="register()"/>
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
	        },
	        deleteUser: function () {
	            let self = this;
	            axios.delete('users/deleteuser' + '?id=' + this.user.uuid)
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
	        },
	        changeUserEditingMode: function(u) {
	        	let self = this
	        	if(this.user === u)
	        	{
	        		this.user = {
	        			uuid: 'nouuid',
        				gender: 'MALE',
        				username: '',
        				firstName: '',
        				lastName: '',
        				type: ''
	        		}
	        	}
	        	else
	        	{
	        		this.user = u
	        	}
	        },
	        sort: function(s) {
	        	let self = this
				if(s === this.currentSort) {
					self.currentSortDir = self.currentSortDir==='asc'?'desc':'asc';
				}
			  	this.currentSort = s;
			}
    	},
    	computed: {
			sortedUsers : function() {
				resultData =  Object.values(this.users).sort((a,b) => {
					let direction = 1;
					if(this.currentSortDir === 'desc') direction = -1;
					if(a[this.currentSort] < b[this.currentSort]) return -1 * direction;
					if(a[this.currentSort] > b[this.currentSort]) return 1 * direction;
					return 0;
				});
				return resultData.filter(sortedUser => {
				    const username = sortedUser.username.toString().toLowerCase();
				    const firstName = sortedUser.firstName
				    const lastName = sortedUser.lastName
				    const userRole = sortedUser.role
				    const userType = sortedUser.type.name
				    
				    const usernameSearchTerm = this.filterUsername.toLowerCase();
				    const firstNameSearchTerm = this.filterFirstName.toLowerCase();
				    const lastNameSearchTerm = this.filterLastName.toLowerCase();
				    const roleSearchTerm = this.filterRole;
				    const typeSearchTerm = this.filterType;
				    return (
				    	username.includes(usernameSearchTerm) && firstName.includes(firstNameSearchTerm) && lastName.includes(lastNameSearchTerm)
				    		&& userRole.includes(roleSearchTerm) && userType.includes(typeSearchTerm) 
				    );
			    });
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