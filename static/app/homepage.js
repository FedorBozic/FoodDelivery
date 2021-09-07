Vue.component('homepage', {
    data: function () {
		return {
			restaurants: {},
			currentUser: null
		}
    },
    template: `
	<div>
		<div class="d-flex justify-content-center" style="margin-top:20px">
	    	<div class="row row-cols-1 row-cols-md-2" style = "width: 85%;">
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
        	alert("CONVERTING");
        	let file = document.querySelector('#image').files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            let self = this;
            reader.onload = function () {
                self.image = reader.result.split(',')[1];
                alert(self.image);
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        },
        
        addRestaurant: function() {
        	let newRestaurant = {
        		name: this.name,
        		type: this.type,
        		status: this.status,
        		image: this.image
        	};
            axios.post('restaurants/newRestaurant', JSON.stringify(newRestaurant))
                .then(function (response) {
                	alert("Uspesno dodato");
					this.getRestaurants();
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
        },
    },
    mounted() {
        this.getRestaurants();
    }
});