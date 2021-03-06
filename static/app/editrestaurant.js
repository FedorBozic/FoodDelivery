Vue.component('editrestaurant', {
    data: function () {
		return {
			restaurants: {},
			restaurant: {
				location: {
					address: {}
				},
				items: {}
			},
			currentUser: null,
			managers: [],
			manager: {
				firstName: '',
				lastName: '',
				username: '',
				password: '',
				role: 'MANAGER',
				type: 'STAFF',
				gender: 'FEMALE',
			},
			addManagerMode: false
		}
    },
    template: `
	<div>
		<div class="restaurant-view-wrapper">
		  <div class="profile-card js-profile-card">
		    <div class="profile-card__img">
		     	<label for="image" style="margin: 0px; padding: 0; width:100%; height:100%;">
					<img v-if="restaurant.logo" :src="'data:image/png;base64,' + restaurant.logo" />
					<img v-else src="/Add_Image.jpg" alt="" style="max-width:100%; max-height:100%;" />
				</label>
				<input type="file" v-on:change="convertImage" id="image" name="image" accept="image/*" style="display:none">
		    </div>
		
		    <div class="profile-card__cnt js-profile-cnt">
		    	<h4 class="m-b-20 p-b-5 b-b-default f-w-600" style="margin-left:20px; margin-right: 20px">Basic Information</h4>
		       	<div class="row" style="margin-left:20px; margin-right: 20px">
	               	<div class="col-sm-4">
	                   	<p class="m-b-10 f-w-600" style="text-align:left">Name</p>
	                   	<h6 class="f-w-400" style="margin-left:-3px"><input type="text" class="discrete-textbox-black" placeholder="Name" v-model="restaurant.name" ></h6>
	               	</div>
	               	<div class="col-sm-4">
	                   	<p class="m-b-10 f-w-600">Type</p>
	                   	<h6 class="f-w-400"><select v-model="restaurant.type" style="max-width:100%">
							<option value="ITALIAN">Italijanski</option>
							<option value="CHINESE">Kineski</option>
							<option value="GRILL">Gril</option>
							<option value="PIZZERIA">Picerija</option>
						</select></h6>
	               	</div>
	           	</div>
	           	<h4 v-if="addManagerMode" class="m-b-20 p-b-5 b-b-default f-w-600" style="margin-left:20px; margin-right: 20px; margin-top:20px">Manager</h4>
	           	<div v-if="addManagerMode" class="row" style="margin-left:20px; margin-right: 20px">
	               	<div class="col-sm-4">
	                   	<p class="m-b-10 f-w-600" style="text-align:left">Username</p>
	                   	<h6 class="f-w-400" style="margin-left:-3px"><input type="text" class="discrete-textbox-black" placeholder="Username" v-model="manager.username" ></h6>
	               	</div>
	               	<div class="col-sm-4">
	                   	<p class="m-b-10 f-w-600">First Name</p>
	                   	<h6 class="f-w-400"><input type="text" class="discrete-textbox-black" style="text-align:center" placeholder="First Name" v-model="manager.firstName" ></h6>
	               	</div>
	               	<div class="col-sm-4">
	                   	<p class="m-b-10 f-w-600" style="text-align:right">Last Name</p>
	                   	<h6 class="f-w-400" style="margin-left:-3px"><input type="text" class="discrete-textbox-black" style="text-align:right" placeholder="Last Name" v-model="manager.lastName" ></h6>
	               	</div>
	           	</div>
	           	<div v-if="addManagerMode" class="row" style="margin-left:20px; margin-right: 20px">
	               	<div class="col-sm-4">
	                   	<p class="m-b-10 f-w-600" style="text-align:left">Password</p>
	                   	<h6 class="f-w-400" style="margin-left:-3px"><input type="password" class="discrete-textbox-black" placeholder="Password" v-model="manager.password" ></h6>
	               	</div>
	               	<div class="col-sm-4">
	                   	<p class="m-b-10 f-w-600">Gender</p>
	                   	<h6 class="f-w-400"><select name="gender" v-model="manager.gender" >
							<option value="FEMALE">Female</option>
							<option value="MALE">Male</option>
						</select></h6>
	               	</div>
	               	<div class="col-sm-4">
	                   	<p class="m-b-10 f-w-600" style="text-align:right">Date of Birth</p>
	                   	<h6 class="f-w-400" style="margin-left:-3px"><input type="date" class="dateOfBirthPicker" v-model="manager.birthday"></h6>
	               	</div>
	           	</div>
	           	<h4 class="m-b-20 p-b-5 b-b-default f-w-600" style="margin-left:20px; margin-right: 20px; margin-top:20px">Location</h4>
	           	<div class="row" style="margin-left:20px; margin-right: 20px">
	               	<div class="col-sm-3">
	                   	<p class="m-b-10 f-w-600" style="text-align:left">Street</p>
	                   	<h6 class="f-w-400" style="margin-left:-3px"><input type="text" class="discrete-textbox-black" placeholder="Street" v-model="restaurant.location.address.streetAddress" ></h6>
	               	</div>
	               	<div class="col-sm-3">
	                   	<p class="m-b-10 f-w-600">City</p>
	                   	<h6 class="f-w-400"><input type="text" class="discrete-textbox-black" style="text-align:center" placeholder="City" v-model="restaurant.location.address.townName" ></h6>
	               	</div>
	               	<div class="col-sm-3">
	                   	<p class="m-b-10 f-w-600">Postal Code</p>
	                   	<h6 class="f-w-400"><input type="text" class="discrete-textbox-black" style="text-align:center" placeholder="Postal Code" v-model="restaurant.location.address.zipCode" ></h6>
	               	</div>
	               	<div class="col-sm-3">
	                   	<p class="m-b-10 f-w-600" style="text-align:right">Lat/Lon</p>
	                   	<div class="row" style="margin-left:55px">
	                   		<h6 class="f-w-400" style="width: 40px; float: right"><input type="number" class="discrete-textbox-black" style="text-align:right" placeholder="Lat" v-model="restaurant.location.latitude" ></h6>
	               			<h6 class="f-w-400" style="width: 40px; float: right"><input type="number" class="discrete-textbox-black" style="text-align:right" placeholder="Lon" v-model="restaurant.location.longitude" ></h6>
	               		</div>
	               	</div>
	           	</div>
	           	<input type="button" class="generic_button" style="float:right" value="Confirm" :disabled="!canConfirm" v-bind:style="[true ? {opacity:0.9} : {opacity:0.3}]" v-on:click="addRestaurant()"/>
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
                self.restaurant.logo = reader.result.split(',')[1];
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
        
        addRestaurant() {
			let self = this
			let sendRestaurant = {
				address: this.restaurant.location.address.streetAddress,
				townName: this.restaurant.location.address.townName,
				postalCode: this.restaurant.location.address.zipCode,
				latitude: this.restaurant.location.latitude,
				longitude: this.restaurant.location.longitude,
				uuid: this.restaurant.uuid,
				name: this.restaurant.name,
				type: this.restaurant.type,
				manager: this.restaurant.manager.uuid,
				logo: this.restaurant.logo,
				status: this.restaurant.status,
			};
        	axios.put('restaurants/edit', JSON.stringify(sendRestaurant))
                .then(function (response) {
		            window.location.href = "#/restaurant/" + self.$route.params.id;
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
        },
        
        addRestaurantWithoutManager: function() {
        },
        
        addRestaurantWithManager: function() {
	
        },
        
		options() {
			let manager_list = [];
			console.log(this.managers.length);
			for(let m in this.managers){
				manager_list.push(m.username);
				return manager_list;
			}
			return manager_list;
		}
    },
    computed:{
    	canConfirm(){
    		return true
    	}
		/*options(){
			let manager_list = [];
			console.log(this.managers.length);
			for(let m in this.managers){
				manager_list.push(m.username);
				return manager_list;
			}
			return manager_list;
		}*/
  	},
    mounted() {
		let self = this
        this.getRestaurants();
        axios.get('users/currentUser')
            .then(res => {
            	this.currentUser = res.data;
            	if(this.currentUser == null)
		    	{
		    		window.location.href = "#/registration";
		    	}
		    	else {
		    		axios.get('restaurants/' + self.$route.params.id)
	       			.then(res => {
						self.restaurant = res.data
						axios.get('users/' + self.restaurant.manager)
						.then( res => {
							self.restaurant.manager = res.data
						})
					})
                	this.getAvailableManagers();
                }
            })
            .catch(err => {
                console.error(err);
            });
    }
});