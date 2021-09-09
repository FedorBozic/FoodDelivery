Vue.component('restaurant', {
    data: function () {
		return {
			restaurant: {
				location: {
					address: {}
				}
			},
			itemBeingAdded: {
				name: '',
				price: '',
				restaurant: '',
				type: 'FOOD',
				amount: 1,
				purchase_amount: 1,
				description: ''
			},
			mapPosition: {latitude: 45.267136, longitude: 19.833549},
			image: '',
			currentUser: null,
			itemBorderStyle: {
				margin: '10px', 
				padding: '10px',
				'border-bottom': '2px dotted rgba(250, 30, 20)'
			},
			itemBorderStyleNoBorder: {
				margin: '10px', 
				padding: '10px'
			},
			articlenumber: 0,
			editingItem: {}
		}
    },
    template: `
	<div>
		<div class="restaurant-view-wrapper">
		  <div class="profile-card js-profile-card">
		    <div class="profile-card__img">
		      <img :src="restaurant.logo" alt="profile card">
		    </div>
		
		    <div class="profile-card__cnt js-profile-cnt">
		    	<div class="profile-card__name">{{restaurant.name}}</div>
		        <div class="profile-card__txt">{{restaurant.type}} from <strong>{{restaurant.location.address.townName}}</strong></div>
	    		 <div class="profile-card-loc">
		         <span class="profile-card-loc__icon">
		         	<svg class="icon"><use xlink:href="#icon-location"></use></svg>
		         </span>
		         
		         <span class="profile-card-loc__txt">
		         	{{restaurant.location.address.streetAddress}}
		          </span>
		        </div>
	    		<div class="col map" id="map" style="margin-top:10px"></div>
		       
		        
		        <div class="profile-card-inf">
		          <div class="profile-card-inf__item">
		            <div class="profile-card-inf__title">{{this.articlenumber}}</div>
		            <div class="profile-card-inf__txt">Articles</div>
		          </div>
		        
		          <div class="profile-card-inf__item">
		            <div class="profile-card-inf__title">0</div>
		            <div class="profile-card-inf__txt">Rating</div>
		          </div>
		        
		          <div class="profile-card-inf__item">
		            <div class="profile-card-inf__title">0</div>
		            <div class="profile-card-inf__txt">Comments</div>
		          </div>
		        </div>
			    
			    <table class="table table-striped" style="width:100%" v-if="$root.isSignedIn && ($root.currentUser.role == 'ADMIN' || ($root.currentUser.uuid === restaurant.manager))">
			    	<tbody>
			    		<tr>
			  			<td><button type="button" v-on:click="addItem">Dodaj</button></td>
			    			<td><input type="text" placeholder="Name" v-model="itemBeingAdded.name"></td>
			  			<td>
			  				<select v-model="itemBeingAdded.type">
			  					<option value="FOOD">Food</option>
			  					<option value="DRINK">Drink</option>
			  				</select>
			  			</td>
			  			<td><input type="text" placeholder="Description" v-model="itemBeingAdded.description"></td>
			  			<td><input type="text" placeholder="Cena" v-model="itemBeingAdded.price" style="width:30px"></td>
			  			<td>
			  				 <label for="image" style="margin: 0px; padding: 0; width:60px; height:60px; border-radius: 3px">
			  		    		<img v-if="image" :src="'data:image/png;base64,' + image" style="width:60px; height: 60px"/>
			  					<img v-else src="/Add_Image.jpg" alt="" style="max-width:60px; max-height:60px;" />
			  				 </label>
			  				 <input type="file" v-on:change="convertImage" id="image" name="image" accept="image/*" style="display:none">
			  			</td>
			    		</tr>
			    	</tbody>
			    </table>
			    
				<div style="border-left: 2px solid rgba(250, 30, 20); border-bottom: 2px solid rgba(250, 30, 20); border-radius: 30px; margin: 10px">
					<div class="row">
						<div style="float:left; margin-left: 30px; margin-top: -15px; padding:3px 10px 3px 10px; border-radius:5px; background-color: rgba(250, 30, 20); color:white"><h3>FOOD</h3></div>
					</div>
				    <div class="row" v-for="(item,index) in restaurant.items" v-bind:style="[(index < restaurant.items.length - 1) ? itemBorderStyle : itemBorderStyleNoBorder]">
					    <div class="col-sm-7 mr-auto">
							<div class="row" v-if="!editingItem.uuid || editingItem.uuid != item.uuid"><h4><strong>{{item.name}}</strong></h4></div>
							<div class="col-sm-2" v-if="editingItem.uuid && editingItem.uuid === item.uuid"><h2 style="margin-top:5px"><strong><input type="text" class="discrete-textbox-black" style="width: 200px; font-weight: bolder; font-size: 1.5rem; color: #212529; margin-left:-25px; margin-top:-5px" v-model="editingItem.name" ></strong></h2></div>
							<div class="row" v-if="!editingItem.uuid || editingItem.uuid != item.uuid" style="margin-left: 10px; text-align: left; ">{{item.description}}</div>
							<div class="col-sm-2" v-if="editingItem.uuid && editingItem.uuid === item.uuid"><input type="text" class="discrete-textbox" style="width:250px; height:100px" v-model="editingItem.description" ></div>
							<div v-if="editingItem.uuid && editingItem.uuid === item.uuid">
								<select v-model="editingItem.type">
				  					<option value="FOOD">Food</option>
				  					<option value="DRINK">Drink</option>
				  				</select>
							</div>
						</div>
					    <div class="col-sm-2" v-if="!editingItem.uuid || editingItem.uuid != item.uuid"><h2 style="margin-top:5px"><strong>{{item.price}}$</strong></h2></div>
					    <div class="col-sm-2" v-if="editingItem.uuid && editingItem.uuid === item.uuid"><h2 style="margin-top:5px"><strong><input type="text" class="discrete-textbox-black" style="font-weight: bold; max-width: 50px" v-model="editingItem.price" >$</strong></h2></div>
					    <div class="col-sm-3">
							<div class="row"><img :src="item.image" alt="" style="max-width:100%; height:auto; border-radius: 10px"/></div>
							<div class="row" v-if="$root.isSignedIn && $root.currentUser.role == 'CUSTOMER'">
								<div class="col-sm-4 mr-auto">
									<input type="text" class="discrete-textbox" style="vertical-align: center; height: 100%; margin-top:4px" placeholder="" v-model="item.purchase_amount">
								</div>
								<div class="col-sm-4">
									<button class="addtocart" style="margin-top:10px" v-on:click="addItemToCart(item)">
									  	<div class="pretext">
									    	<h5 style="padding-bottom:0px; margin-bottom:0px">+</h5>
									  	</div>
									</button>
								</div>
							</div>
							<div class="row" v-if="$root.isSignedIn && !editingItem.uuid && ($root.currentUser.uuid === restaurant.manager)">
								<div class="col-sm-4">
									<button class="generic_button" style="margin-top:10px" v-on:click="activateEditMode(item)">
									  	<div class="pretext">
									    	<h5 style="padding-bottom:0px; margin-bottom:0px">EDIT</h5>
									  	</div>
									</button>
								</div>
							</div>
							<div class="row" v-if="$root.isSignedIn && editingItem && ($root.currentUser.uuid === restaurant.manager) && editingItem.uuid === item.uuid">
								<div class="col-sm-4">
									<button class="generic_button" style="margin-top:10px" v-on:click="deactivateEditMode(item)">
									  	<div class="pretext">
									    	<h5 style="padding-bottom:0px; margin-bottom:0px">OK</h5>
									  	</div>
									</button>
								</div>
							</div>
						</div>
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
	methods : {
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
        
        showOnMap: function () {
            let self = this;
            self.mapPosition.latitude = parseFloat(this.restaurant.location.latitude);
            self.mapPosition.longitude = parseFloat(this.restaurant.location.longitude);
            self.restaurant.latitude = self.mapPosition.latitude;
            self.restaurant.longitude = self.mapPosition.longitude;

            console.log(self.mapPosition.latitude);
            console.log(self.mapPosition.longitude);
            let map = new ol.Map({
                target: 'map',
                interactions: [],
                controls: [],
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([self.mapPosition.longitude, self.mapPosition.latitude]),
                    zoom: 17
                })
            });
        },

		addItem: function() {
        	let self = this;
        	let newItem = this.itemBeingAdded
			newItem.image = this.image
			newItem.restaurant = this.restaurant.uuid
            axios.post('users/newItem', JSON.stringify(newItem))
                .then(function (response) {
					axios.get('restaurants/' + self.$route.params.id)
			        .then(res => {
			            self.restaurant = res.data;
						if(self.restaurant != null && self.restaurant.logo != null){
			            	self.restaurant.logo = 'data:image/png;base64,' + self.restaurant.logo;
			            }
						for(let i in self.restaurant.items){
					    	if(self.restaurant.items[i].image != null){
					    		this.restaurant.items[i].image = 'data:image/png;base64,' + self.restaurant.items[i].image;
					    	}
							self.articlenumber++;
					    }
					    window.location.href = "#/restaurant/" + self.$route.params.id;
			        })
					
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
        },

		addItemToCart: function(item) {
        	let self = this;
        	let itemToCart = item;
			itemToCart.restaurant = this.restaurant.uuid;
            axios.post('users/itemToCart', JSON.stringify(itemToCart))
                .then(function (response) {
					axios.get('users/currentUser')
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
			window.location.href = "#/";
        },
        
        activateEditMode: function(item) {
        	this.editingItem = item
        },
        
        deactivateEditMode: function(item) {
        	this.editingItem = {}
        	axios.post('users/overwriteItem', JSON.stringify(item))
                .then(function (response) {
					axios.get('users/currentUser')
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
        },
	},
    mounted() {
        axios.get('restaurants/' + this.$route.params.id)
        .then(res => {
            this.restaurant = res.data;
            this.showOnMap();
			if(this.restaurant != null && this.restaurant.logo != null){
            	this.restaurant.logo = 'data:image/png;base64,' + this.restaurant.logo;
            }
			for(let i in this.restaurant.items){
		    	if(this.restaurant.items[i].image != null){
		    		this.restaurant.items[i].image = 'data:image/png;base64,' + this.restaurant.items[i].image;
		    	}
				this.articlenumber++;
		    }
        })
        .catch(err => {
            console.error(err);
        });
    }
});