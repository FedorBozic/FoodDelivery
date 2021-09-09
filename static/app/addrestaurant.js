Vue.component('addrestaurant', {
    data: function () {
		return {
			restaurants: {},
			currentUser: null,
			managers: [],
			name: '',
			type: '',
			manager: {
				firstName: '',
				lastName: '',
				username: '',
				password: '',
				role: 'MANAGER',
				type: 'STAFF',
				gender: 'FEMALE',
			},
			location: '',
			townName: '',
			address: '',
			status: 'OPEN',
			image: '',
			addManagerMode: false
		}
    },
    template: `
	<div>
		<div class="restaurant-view-wrapper">
		  <div class="profile-card js-profile-card">
		    <div class="profile-card__img">
		     	<label for="image" style="margin: 0px; padding: 0; width:100%; height:100%;">
					<img v-if="image" :src="'data:image/png;base64,' + image" />
					<img v-else src="/Add_Image.jpg" alt="" style="max-width:100%; max-height:100%;" />
				</label>
				<input type="file" v-on:change="convertImage" id="image" name="image" accept="image/*" style="display:none">
		    </div>
		
		    <div class="profile-card__cnt js-profile-cnt">
		    	<h4 class="m-b-20 p-b-5 b-b-default f-w-600" style="margin-left:20px; margin-right: 20px">Basic Information</h4>
		       	<div class="row" style="margin-left:20px; margin-right: 20px">
	               	<div class="col-sm-4">
	                   	<p class="m-b-10 f-w-600" style="text-align:left">Name</p>
	                   	<h6 class="f-w-400" style="margin-left:-3px"><input type="text" class="discrete-textbox-black" placeholder="Name" v-model="name" ></h6>
	               	</div>
	               	<div class="col-sm-4">
	                   	<p class="m-b-10 f-w-600">Type</p>
	                   	<h6 class="f-w-400"><select v-model="type" style="max-width:100%">
							<option value="ITALIAN">Italijanski</option>
							<option value="CHINESE">Kineski</option>
							<option value="GRILL">Gril</option>
							<option value="PIZZERIA">Picerija</option>
						</select></h6>
	               	</div>
	               	<div class="col-sm-4">
	                   	<p class="m-b-10 f-w-600" style="text-align:right">Manager</p>
	                   	<h6 class="f-w-400">
	                   		<button class="addManager" style="height:23px" v-on:click="addManagerMode = !addManagerMode">
								<div class="pretext">
									<h5 v-if="!addManagerMode" style="padding-bottom:0px; margin-bottom:0px">+</h5>
									<h5 v-if="addManagerMode" style="padding-bottom:5px; margin-bottom:0px">-</h5>
								</div>
							</button>
							<select v-if="managers.length > 0 && !addManagerMode" v-model="manager" style="width:100px; float:right; margin-right: 0px">
								<option v-for="m of managers" :value="m">{{m.firstName}} {{m.lastName}}</option>
							</select>
						</h6>
	               	</div>
	           	</div>
		    </div>
			
			
			<svg hidden="hidden">
			  <defs>
			    <symbol id="icon-location" viewBox="0 0 32 32">
			      <title>location</title>
			      <path d="M16 31.68c-0.352 0-0.672-0.064-1.024-0.16-0.8-0.256-1.44-0.832-1.824-1.6l-6.784-13.632c-1.664-3.36-1.568-7.328 0.32-10.592 1.856-3.2 4.992-5.152 8.608-5.376h1.376c3.648 0.224 6.752 2.176 8.608 5.376 1.888 3.264 2.016 7.232 0.352 10.592l-6.816 13.664c-0.288 0.608-0.8 1.12-1.408 1.408-0.448 0.224-0.928 0.32-1.408 0.32zM15.392 2.368c-2.88 0.192-5.408 1.76-6.912 4.352-1.536 2.688-1.632 5.92-0.288 8.672l6.816 13.632c0.128 0.256 0.352 0.448 0.64 0.544s0.576 0.064 0.832-0.064c0.224-0.096 0.384-0.288 0.48-0.48l6.816-13.664c1.376-2.752 1.248-5.984-0.288-8.672-1.472-2.56-4-4.128-6.88-4.32h-1.216zM16 17.888c-3.264 0-5.92-2.656-5.92-5.92 0-3.232 2.656-5.888 5.92-5.888s5.92 2.656 5.92 5.92c0 3.264-2.656 5.888-5.92 5.888zM16 8.128c-2.144 0-3.872 1.728-3.872 3.872s1.728 3.872 3.872 3.872 3.872-1.728 3.872-3.872c0-2.144-1.76-3.872-3.872-3.872z"></path>
			      <path d="M16 32c-0.384 0-0.736-0.064-1.12-0.192-0.864-0.288-1.568-0.928-1.984-1.728l-6.784-13.664c-1.728-3.456-1.6-7.52 0.352-10.912 1.888-3.264 5.088-5.28 8.832-5.504h1.376c3.744 0.224 6.976 2.24 8.864 5.536 1.952 3.36 2.080 7.424 0.352 10.912l-6.784 13.632c-0.32 0.672-0.896 1.216-1.568 1.568-0.48 0.224-0.992 0.352-1.536 0.352zM15.36 0.64h-0.064c-3.488 0.224-6.56 2.112-8.32 5.216-1.824 3.168-1.952 7.040-0.32 10.304l6.816 13.632c0.32 0.672 0.928 1.184 1.632 1.44s1.472 0.192 2.176-0.16c0.544-0.288 1.024-0.736 1.28-1.28l6.816-13.632c1.632-3.264 1.504-7.136-0.32-10.304-1.824-3.104-4.864-5.024-8.384-5.216h-1.312zM16 29.952c-0.16 0-0.32-0.032-0.448-0.064-0.352-0.128-0.64-0.384-0.8-0.704l-6.816-13.664c-1.408-2.848-1.312-6.176 0.288-8.96 1.536-2.656 4.16-4.32 7.168-4.512h1.216c3.040 0.192 5.632 1.824 7.2 4.512 1.6 2.752 1.696 6.112 0.288 8.96l-6.848 13.632c-0.128 0.288-0.352 0.512-0.64 0.64-0.192 0.096-0.384 0.16-0.608 0.16zM15.424 2.688c-2.784 0.192-5.216 1.696-6.656 4.192-1.504 2.592-1.6 5.696-0.256 8.352l6.816 13.632c0.096 0.192 0.256 0.32 0.448 0.384s0.416 0.064 0.608-0.032c0.16-0.064 0.288-0.192 0.352-0.352l6.816-13.664c1.312-2.656 1.216-5.792-0.288-8.352-1.472-2.464-3.904-4-6.688-4.16h-1.152zM16 18.208c-3.424 0-6.24-2.784-6.24-6.24 0-3.424 2.816-6.208 6.24-6.208s6.24 2.784 6.24 6.24c0 3.424-2.816 6.208-6.24 6.208zM16 6.4c-3.072 0-5.6 2.496-5.6 5.6 0 3.072 2.528 5.6 5.6 5.6s5.6-2.496 5.6-5.6c0-3.104-2.528-5.6-5.6-5.6zM16 16.16c-2.304 0-4.16-1.888-4.16-4.16s1.888-4.16 4.16-4.16c2.304 0 4.16 1.888 4.16 4.16s-1.856 4.16-4.16 4.16zM16 8.448c-1.952 0-3.552 1.6-3.552 3.552s1.6 3.552 3.552 3.552c1.952 0 3.552-1.6 3.552-3.552s-1.6-3.552-3.552-3.552z"></path>
			    </symbol>
			  </defs>
			</svg>
			</div>
		</div>
	</div>
	`,


    methods: {
        init: function () {

        },
        
        getRestaurants: function() {
            axios.get('getRestaurants')
            .then(res => {
            	this.restaurants = res.data;
            	for(let rId in this.restaurants){
            		let r = this.restaurants[rId];
            		if(r.location != null && r.location.address != null){
            			let address = r.location.address;
            			r.locationLabel = address.streetAddress + ' ' + address.townName + ' ' + address.zipCode;
            		}
            		else
            			r.location = '';
            			
            		if(r.logo != null){
            			r.logo = 'data:image/png;base64,' + r.logo;
            		}
            	}
                console.log(res);
            })
            .catch(err => {
                console.error(err);
            })
        },
        
        convertImage: function() {
        	let file = document.querySelector('#image').files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            let self = this;
            reader.onload = function () {
                self.image = reader.result.split(',')[1];
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        },
        
        getAvailableManagers: function() {
            axios.get('users/availablemanagers')
        	.then(res => {
            	this.managers = res.data;
            })
            .catch(err => {
                console.error(err);
            });
        },
        
        addRestaurant: function() {
        	let self = this;
        	let newRestaurant = {
        		name: this.name,
        		type: this.type,
        		status: this.status,
        		manager: this.manager.uuid,
        		image: this.image,
        	};
            axios.post('restaurants/newRestaurant', JSON.stringify(newRestaurant))
                .then(function (response) {
					axios.get('getRestaurants')
		            .then(res => {
		            	self.restaurants = res.data;
		            	for(let rId in self.restaurants){
		            		let r = self.restaurants[rId];
		            		if(r.location != null && r.location.address != null){
		            			let address = r.location.address;
		            			r.locationLabel = address.streetAddress + ' ' + address.townName + ' ' + address.zipCode;
		            		}
		            		else
		            			r.location = '';
		            			
		            		if(r.logo != null){
		            			r.logo = 'data:image/png;base64,' + r.logo;
		            		}
		            	}
		            	window.location.href = "#/addrestaurant";
		            })
		            this.getAvailableManagers();
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
        },
        
        addRestaurantWithManager: function() {
        	let self = this;
        	this.manager.role = 'MANAGER';
        	this.manager.type = 'STAFF';
            axios.post('users/adduser', JSON.stringify(this.manager))
                .then(function (response) {
                    alert(response.data);
                    axios.get('users/availablemanagers')
			        	.then(res => {
			            	self.managers = res.data;
							if(self.managers.length > 0){
								self.manager = self.managers[0];
					        	let newRestaurant = {
					        		name: self.name,
					        		type: self.type,
					        		status: self.status,
					        		manager: self.manager.uuid,
					        		image: self.image,
					        	};
					            axios.post('restaurants/newRestaurant', JSON.stringify(newRestaurant))
					                .then(function (response) {
										self.getRestaurants();
										//this.getAvailableManagers();
					                })
					                .catch(function (error) {
					                    alert(error.response.data);
					                });
							}
							
			            })
			            .catch(err => {
			                console.error(err);
			            });
		        	
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
			//axios.get('getUsers');
        },
        
		options() {
			let manager_list = [];
			//alert("TEST");
			console.log(this.managers.length);
			for(let m in this.managers){
				manager_list.push(m.username);
				return manager_list;
			}
			return manager_list;
		}
    },
    computed:{
		/*options(){
			let manager_list = [];
			console.log("TEST");
			console.log(this.managers.length);
			for(let m in this.managers){
				manager_list.push(m.username);
				return manager_list;
			}
			return manager_list;
		}*/
  	},
    mounted() {
        this.getRestaurants();
        axios.get('users/currentUser')
            .then(res => {
            	this.currentUser = res.data;
            	if(this.currentUser == null)
		    	{
		    		window.location.href = "#/registration";
		    	}
		    	else if(this.currentUser.role != 'ADMIN')
		    	{
		    		window.location.href = "#/registration";
		    	}
		    	else {
		    		console.log(res);
                	this.getAvailableManagers();
                }
            })
            .catch(err => {
                console.error(err);
            });
    }
});