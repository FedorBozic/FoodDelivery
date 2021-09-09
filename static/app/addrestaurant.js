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
			status: 'OPEN',
			image: ''
		}
    },
    template: `
	<div>
		<div class="d-flex justify-content-center" style="margin-top:20px">
	    	<div class="row row-cols-1 row-cols-md-2" style = "width: 85%;">
	    	   <div class="col">
	    		<article class="restaurant_card">
				    <figure class="card-image" style="margin: 0px; padding: 0;">
				    	<label for="image" style="margin: 0px; padding: 0; width:360px; height:202px;">
				    		<img v-if="image" :src="'data:image/png;base64,' + image" />
							<img v-else src="/Add_Image.jpg" alt="" style="max-width:100%; max-height:100%;" />
						 </label>
						 <input type="file" v-on:change="convertImage" id="image" name="image" accept="image/*" style="display:none">
				    </figure>
				
				    <div class="card-content">
				      <header class="card-header-restaurant">
				        <h2><input type="text" class="discrete-textbox" placeholder="Name" v-model="name"></h2>
				
				        <select v-model="type">
							<option value="ITALIAN">Italijanski</option>
							<option value="CHINESE">Kineski</option>
							<option value="GRILL">Gril</option>
							<option value="PIZZERIA">Picerija</option>
						</select>
						
						<select v-if="managers.length > 0" v-model="manager">
							<option v-for="m of managers" :value="m">{{m.firstName}} {{m.lastName}}</option>
						</select>
						<div v-if="managers.length == 0">
							<input type="text" class="discrete-textbox" placeholder="Username" v-model="manager.username">
							<input type="password" class="discrete-textbox" placeholder="Password" v-model="manager.password">
							<input type="text" class="discrete-textbox" placeholder="First Name" v-model="manager.firstName">
							<input type="text" class="discrete-textbox" placeholder="Last Name" v-model="manager.lastName">
							<select name="gender" v-model="manager.gender" >
							  <option value="FEMALE">Female</option>
							  <option value="MALE">Male</option>
						  </select>
						</div>
						
						<address style="margin-top:10px">
				          <span class="icon-pin" aria-hidden="true"></span>
				          TEST
				        </address>
				      </header>
				    </div>
				
				    <button class="card-button" v-if="managers.length > 0" v-on:click="addRestaurant">+</button>
				    <button class="card-button" v-if="managers.length == 0" v-on:click="addRestaurantWithManager">+</button>
				  </article>
				</div>
		    	<div class="col" v-for="r in restaurants" :key="r.uuid">
				  <article class="restaurant_card">
				    <figure class="card-image">
				      <img :src="r.logo" alt="" />
				    </figure>
				
				    <div class="card-content">
				      <header class="card-header-restaurant">
				        <h2>{{r.name}}</h2>
				        <span>{{r.type}}</span>
				        
				        <address style="margin-top:10px">
				          <span class="icon-pin" aria-hidden="true"></span>
				          {{r.locationLabel}}
				        </address>
				      </header>
				    </div>
				
				    <button class="card-button">View</button>
				  </article>
				</div>
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