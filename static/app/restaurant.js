Vue.component('restaurant', {
    data: function () {
		return {
			restaurant: {
				location: {
					address: {}
				},
				items: {}
			},
			itemBeingAdded: {
				name: '',
				price: '',
				restaurant: '',
				type: 'FOOD',
				amount: '',
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
			editingItem: {},
			addingItem: false,
			viewingComments: false,
			comments: [],
			approvedComments: []
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
		    	<div class="profile-card__name">
		    		{{restaurant.name}} 
		    		<i class="fas fa-plus" style="font-size: 1.5rem; color:rgba(250, 30, 20)" v-if="$root.isSignedIn && ($root.currentUser.role == 'ADMIN' || ($root.currentUser.uuid === restaurant.manager)) && !addingItem" v-on:click="addingItem = true"></i>
		    		<i class="fas fa-minus" style="font-size: 1.5rem; color:rgba(250, 30, 20)" v-if="addingItem && restaurant.items.length > 0" v-on:click="addingItem = false"></i>
		    		<i class="fas fa-door-open" style="color: rgba(250, 30, 20)" v-if="$root.isSignedIn && ($root.currentUser.uuid === restaurant.manager)" v-on:click="openOrClose()"></i>
		    		<i class="fas fa-pencil-alt" style="color: rgba(250, 30, 20)" v-if="$root.isSignedIn && ($root.currentUser.uuid === restaurant.manager)" v-on:click="editRestaurant()"></i>
		    		<i class="fas fa-trash-alt" style="color: rgba(250, 30, 20)" v-if="$root.isSignedIn && $root.currentUser.role == 'ADMIN'" v-on:click="deleteRestaurant()"></i>
		    	</div>
		    	<div class="profile-card__name">
		    		{{restaurant.status}} 
		    	</div>
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
		          <div class="profile-card-inf__item" @click="viewingComments = false">
		            <div class="profile-card-inf__title">{{this.articlenumber}}</div>
		            <div class="profile-card-inf__txt">Articles</div>
		          </div>
		        
		          <div class="profile-card-inf__item" @click="viewingComments = true">
		            <div class="profile-card-inf__title">{{calculateAverageRating()}}</div>
		            <div class="profile-card-inf__txt">Rating</div>
		          </div>
		        
		          <div class="profile-card-inf__item" @click="viewingComments = true">
		            <div class="profile-card-inf__title">{{this.comments.length}}</div>
		            <div class="profile-card-inf__txt">Comments</div>
		          </div>
		        </div>
			    
			    <div class="row" v-if="(addingItem || restaurant.items.length < 1) && $root.isSignedIn && ($root.currentUser.role == 'ADMIN' || ($root.currentUser.uuid === restaurant.manager))">
				    <div class="col-sm-5">
						<div class="row" style="margin-top:5px; margin-left:80px">
						 	<h2><input type="text" placeholder="Name" style="width: 170px; font-weight: bolder; font-size: 1.5rem; color: #212529; margin-left:-25px; margin-top:-5px" v-model="itemBeingAdded.name" ></h2>
						 	<i v-if="itemBeingAdded.type === 'DRINK'" @click="itemBeingAdded.type = 'FOOD'" class="fas fa-hamburger" style="font-size: 1.5rem; margin-left:15px; margin-right:5px; margin-top:10px"></i>
						 	<i v-if="itemBeingAdded.type === 'FOOD'" @click="itemBeingAdded.type = 'FOOD'" class="fas fa-hamburger" style="font-size: 1.5rem; margin-left:15px; margin-right:5px; margin-top:10px; color:rgba(250, 30, 20)"></i>
						 	<i v-if="itemBeingAdded.type === 'FOOD'" @click="itemBeingAdded.type = 'DRINK'" class="fas fa-cocktail" style="font-size: 1.5rem; margin-left:5px; margin-right:10px; margin-top:10px"></i>
							<i v-if="itemBeingAdded.type === 'DRINK'" @click="itemBeingAdded.type = 'DRINK'" class="fas fa-cocktail" style="font-size: 1.5rem; margin-left:5px; margin-right:10px; margin-top:10px; color:rgba(250, 30, 20)"></i>
						</div>
						<textarea style="width:250px; height:100px" v-model="itemBeingAdded.description" ></textarea>
					</div>
				    <div class="col-sm-2 my-auto">
				    	<h2 style="width: 170px; font-weight: bolder; font-size: 1.5rem; color: #212529; margin-left:-25px; margin-top:-5px">
				    		<input type="number" class="discrete-textbox-black" style="font-weight: bold; max-width: 50px" v-model="itemBeingAdded.price" >$
				    	</h2>
				    	<h2 style="width: 170px; font-weight: bolder; font-size: 1.5rem; color: #212529; margin-left:-25px; margin-top:-5px">
				    		<input type="number" class="discrete-textbox-black" style="font-weight: bold; max-width: 50px" v-model="itemBeingAdded.amount" >{{unitOfMeasure(itemBeingAdded)}}
				    	</h2>
				    </div>
				    <div class="col-sm-3 my-auto">
						<div class="row">
							<label for="image" style="width:150px; height:150px; border-radius: 10px">
			  		    		<img v-if="image" :src="image" style="width:150px; height:150px; border-radius: 10px"/>
			  					<img v-else src="/Add_Image_Round.jpg" alt="" style="width:150px; height:150px; border-radius: 10px" />
			  				 </label>
			  				 <input type="file" v-on:change="convertImage" id="image" name="image" accept="image/*" style="display:none">
						</div>
					</div>
					<div class="col-sm-2 my-auto" v-if="itemBeingAdded.name && itemBeingAdded.price && itemBeingAdded.amount && image">
						<div class="row">
							<i class="fas fa-plus" style="font-size: 1.5rem; color:rgba(250, 30, 20)" v-on:click="addItem()"></i>
						</div>
					</div>
				</div>
			    
			    <!--IZMENA I POGLED ITEMA-------------->
			    
				<div v-if="!viewingComments && restaurant.items.length > 0" style="border-left: 2px solid rgba(250, 30, 20); border-bottom: 2px solid rgba(250, 30, 20); border-radius: 30px; margin: 10px">
					<div class="row">
						<div style="float:left; margin-left: 30px; margin-top: -15px; padding:3px 10px 3px 10px; border-radius:5px; background-color: rgba(250, 30, 20); color:white"><h3>FOOD</h3></div>
					</div>
				    <div class="row" v-for="(item,index) in restaurant.items" v-bind:style="[(index < restaurant.items.length - 1) ? itemBorderStyle : itemBorderStyleNoBorder]">
					    <div class="col-sm-5">
							<div class="row" v-if="!editingItem.uuid || editingItem.uuid != item.uuid">
								<h4>
									<strong>{{item.name}}</strong>
									<i class="fas fa-cocktail" style="color: rgba(250, 30, 20)" v-if="!editingItem.uuid && item.type == 'DRINK'"></i>
									<i class="fas fa-pencil-alt" style="color: rgba(250, 30, 20)" v-if="$root.isSignedIn && !editingItem.uuid && ($root.currentUser.uuid === restaurant.manager)"  v-on:click="activateEditMode(item)"></i>
									<i class="fas fa-trash-alt" style="color: rgba(250, 30, 20)" v-if="$root.isSignedIn && !editingItem.uuid && ($root.currentUser.uuid === restaurant.manager)" v-on:click="deleteItem(item)"></i>
								</h4>
							</div>
							<div class="row" style="margin-left:15px" v-if="editingItem.uuid && editingItem.uuid === item.uuid">
							 	<h2><input type="text" placeholder="Name" style="width: 170px; font-weight: bolder; font-size: 1.5rem; color: #212529; margin-left:-25px; margin-top:-5px" v-model="editingItem.name" ></h2>
							 	<i v-if="editingItem.type === 'DRINK'" @click="editingItem.type = 'FOOD'" class="fas fa-hamburger" style="font-size: 1.5rem; margin-left:15px; margin-right:5px; margin-top:10px"></i>
							 	<i v-if="editingItem.type === 'FOOD'" @click="editingItem.type = 'FOOD'" class="fas fa-hamburger" style="font-size: 1.5rem; margin-left:15px; margin-right:5px; margin-top:10px; color:rgba(250, 30, 20)"></i>
							 	<i v-if="editingItem.type === 'FOOD'" @click="editingItem.type = 'DRINK'" class="fas fa-cocktail" style="font-size: 1.5rem; margin-left:5px; margin-right:10px; margin-top:10px"></i>
								<i v-if="editingItem.type === 'DRINK'" @click="editingItem.type = 'DRINK'" class="fas fa-cocktail" style="font-size: 1.5rem; margin-left:5px; margin-right:10px; margin-top:10px; color:rgba(250, 30, 20)"></i>
							</div>
							<div class="row" v-if="!editingItem.uuid || editingItem.uuid != item.uuid" style="margin-left: 10px; text-align: left; ">{{item.description}}</div>
							<div class="col-sm-2" v-if="editingItem.uuid && editingItem.uuid === item.uuid"><textarea style="width:250px; height:100px; margin-left:-25px" v-model="editingItem.description" ></textarea></div>
						</div>
					    <div class="col-sm-1 my-auto" v-if="!editingItem.uuid || editingItem.uuid != item.uuid">
					    	<h2 style="margin-top:5px"><strong>{{item.price}}$</strong></h2>
					    	<h4>{{item.amount}} {{unitOfMeasure(item)}}</h4>
					    </div>
					    <div class="col-sm-1 my-auto" v-if="editingItem.uuid && editingItem.uuid === item.uuid">
					    	<h2 style="width: 170px; font-weight: bolder; font-size: 1.5rem; color: #212529; margin-left:-25px; margin-top:-5px">
					    		<input type="number" class="discrete-textbox-black" style="font-weight: bold; max-width: 50px" v-model="editingItem.price" >$
					    	</h2>
					    	<h2 style="width: 170px; font-weight: bolder; font-size: 1.5rem; color: #212529; margin-left:-25px; margin-top:-5px">
					    		<input type="number" class="discrete-textbox-black" style="font-weight: bold; max-width: 50px" v-model="editingItem.amount" >{{unitOfMeasure(editingItem)}}
					    	</h2>
					    </div>
					    <div class="col-sm-4 my-auto">
							<div class="row" v-if="!editingItem.uuid || editingItem.uuid != item.uuid">
								<img :src="item.image" alt="" style="max-width:100%; height:auto; border-radius: 10px; margin-left:50px"/>
							</div>
							<div class="row" v-if="editingItem.uuid && editingItem.uuid === item.uuid">
								<label for="editimage" style="max-width:100%; height:auto; border-radius: 10px; margin-left:50px">
				  		    		<img v-if="item.image" :src="item.image" style="max-width:100%; height:auto; border-radius: 10px"/>
				  					<img v-else src="/Add_Image_Round.jpg" alt="" style="width:150px; height:150px; border-radius: 10px" />
				  				 </label>
				  				 <input type="file" v-on:change="convertEditImage(editingItem)" id="editimage" name="editimage" accept="image/*" style="display:none">
							</div>
						</div>
						<div class="col-sm-2 my-auto">
							<div class="row" style="margin-left:20px" v-if="$root.isSignedIn && editingItem.uuid && editingItem.uuid === item.uuid && ($root.currentUser.uuid === restaurant.manager) && editingItem.uuid === item.uuid">
								<i class="fas fa-check" style="color: rgba(250, 30, 20)" @click="deactivateEditMode(item)"></i>
							</div>
							<div class="row" v-if="$root.isSignedIn && $root.currentUser.role == 'CUSTOMER'" style="margin-left:40px">
								<input type="number" class="discrete-textbox" style="width:40px;" v-model="item.purchase_amount">
								<i class="fas fa-shopping-cart my-auto" style="color: rgba(250, 30, 20); margin-left:5px" @click="addItemToCart(item)"></i>
							</div>
						</div>
				    </div>
				</div>
		    </div>
			
			<h4 v-if="viewingComments" class="m-b-20 p-b-5 b-b-default f-w-600" style="margin-left:20px; margin-right: 20px">Comments</h4>
			<div v-if="viewingComments && comments.length > 0" class="testimonial-box-container">
            <!--BOX-1-------------->
            <div class="testimonial-box" v-for="comment in comments" v-if="($root.currentUser.role == 'ADMIN' || ($root.currentUser.uuid === comment.restaurant.manager) || comment.approved) && !comment.deleted && !comment.rejected">
                <!--top------------------------->
                <div class="box-top">
                    <!--profile----->
                    <div class="profile">
                        <!--name-and-username-->
                        <div class="name-user">
                            <strong>{{comment.customer.firstName + ' ' + comment.customer.lastName}}</strong>
                            <span>@{{comment.customer.username}}</span>
                        </div>
                    </div>
                    <i class="fas fa-check" v-if="!comment.approved" style="color: rgba(250, 30, 20)" @click="approveComment(comment)"></i>
                    <i class="fas fa-times" v-if="!comment.approved" style="color: rgba(250, 30, 20)" @click="rejectComment(comment)"></i>
                    <!--Veoma lazy resenje. Sa vfor moze lakse, ali bude ruznije iz nekog razloga------>
                    <div class="reviews">
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star" v-if="comment.rating >= 2"></i>
                        <i class="fa fa-star" v-if="comment.rating >= 3"></i>
                        <i class="fa fa-star" v-if="comment.rating >= 4"></i>
                        <i class="fa fa-star" v-if="comment.rating >= 5"></i>
                        <i class="far fa-star" v-if="comment.rating < 2"></i>
                        <i class="far fa-star" v-if="comment.rating < 3"></i>
                        <i class="far fa-star" v-if="comment.rating < 4"></i>
                        <i class="far fa-star" v-if="comment.rating < 5"></i>
                    </div>
                </div>
                <!--Comments---------------------------------------->
                <div class="client-comment">
                    <p>{{comment.text}}</p>
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
		loadData: function(self) {
	        axios.get('restaurants/' + self.$route.params.id)
	        .then(res => {
	            self.restaurant = res.data;
	            self.showOnMap();
				if(self.restaurant != null && self.restaurant.logo != null){
	            	self.restaurant.logo = 'data:image/png;base64,' + self.restaurant.logo;
	            }
				for(let i in self.restaurant.items){
			    	if(self.restaurant.items[i].image != null){
			    		self.restaurant.items[i].image = self.restaurant.items[i].image;
			    	}
					self.articlenumber++;
			    }
			    axios.get('comments/' + self.$route.params.id)
			    .then(res => {
			    	self.comments = res.data
			    })
	        })
	        .catch(err => {
	            console.error(err);
	        });
		},
	
		convertImage: function() {
        	let file = document.querySelector('#image').files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            let self = this;
            reader.onload = function () {
                self.image = 'data:image/png;base64,' + reader.result.split(',')[1];
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        },
        
        convertEditImage: function(item) {
        	let file = document.querySelector('#editimage').files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            let self = this;
            reader.onload = function () {
                item.image = 'data:image/png;base64,' + reader.result.split(',')[1];
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
					    		self.restaurant.items[i].image = 'data:image/png;base64,' + self.restaurant.items[i].image;
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
        
        openOrClose: function() {
        	let self = this;
            axios.put('restaurants/openclose', JSON.stringify(self.restaurant))
                .then(function (response) {
					self.loadData(self);
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
        },
        
        editRestaurant: function() {
        	let self = this
        	window.location.href = "#/editrestaurant/" + self.$route.params.id;
        },
        
        deleteRestaurant: function() {
        	let self = this
        	axios.delete('restaurants/deleterestaurant' + '?id=' + self.restaurant.uuid)
        	window.location.href = "#/";
        },
        
        activateEditMode: function(item) {
        	this.editingItem = item
        },
        
        deleteItem: function(item)
        {
        	let self = this
        	axios.delete('users/deleteRestaurantItem' + '?id=' + item.uuid)
        	.then(res => {
        		self.loadData(self)
        	})
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
        
        calculateAverageRating: function() {
        	let self = this
        	result = 0
        	if(this.restaurant && this.restaurant.ratings) {
	        	result = this.restaurant.ratings[0] + this.restaurant.ratings[1]*2 + this.restaurant.ratings[2]*3 + this.restaurant.ratings[3]*4 + this.restaurant.ratings[4]*5
	        	if(result != 0)
	        	{
	        		result = result / (this.restaurant.ratings[0] + this.restaurant.ratings[1] + this.restaurant.ratings[2] + this.restaurant.ratings[3] + this.restaurant.ratings[4])
	        	}
        	}
        	return result;
        },
        
        unitOfMeasure: function(item) {
        	if(item.type === 'DRINK') return 'ml'
        	return 'g'
        },
        
        approveComment: function(comment) {
        	let self = this
        	axios.put('comments/approvecomment/' + comment.uuid, JSON.stringify(comment))
        	.then( res => {
        		self.loadData(self);
        	})
        },
        
        rejectComment: function(comment) {
        	let self = this
        	axios.put('comments/rejectcomment/' + comment.uuid, JSON.stringify(comment))
        	.then( res => {
        		self.loadData(self);
        	})
        },
        
        generateApprovedComments: function() {
        	let self = this
        	for(comment in this.comments)
        	{
        		if(comment.approved && !comment.deleted)
        		{
        			self.approvedComments.push(comment)
        		}
        	}
        }
	},
    mounted() {
    	let self = this
        this.loadData(self);
    }
});