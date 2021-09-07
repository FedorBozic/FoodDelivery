Vue.component('addrestaurant', {
    data: function () {
		return {
			restaurants: {},
			currentUser: null,
			name: '',
			type: '',
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
						   <img src="/Add_Image.jpg" alt="" style="max-width:100%; max-height:100%;" />
						 </label>
						 <input type="file" v-on:change="convertImage" id="image" name="image" accept="image/*" style="display:none">
				    </figure>
				
				    <div class="card-content">
				      <header class="card-header-restaurant">
				        <h2><input type="text" class="discrete-textbox" placeholder="Naziv" v-model="name"></h2>
				
				        <select v-model="type">
							<option value="ITALIAN">Italijanski</option>
							<option value="CHINESE">Kineski</option>
							<option value="GRILL">Gril</option>
							<option value="PIZZERIA">Picerija</option>
						</select>
						
						<address style="margin-top:10px">
				          <span class="icon-pin" aria-hidden="true"></span>
				          TEST
				        </address>
				      </header>
				    </div>
				
				    <button class="card-button" v-on:click="addRestaurant">+</button>
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
        
        addRestaurant: function() {
        	let self = this;
        	let newRestaurant = {
        		name: this.name,
        		type: this.type,
        		status: this.status,
        		image: this.image
        	};
            axios.post('restaurants/newRestaurant', JSON.stringify(newRestaurant))
                .then(function (response) {
					this.getRestaurants();
					window.location.href = "#/addrestaurant";
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
        },
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
                }
            })
            .catch(err => {
                console.error(err);
            })
    }
});