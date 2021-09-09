Vue.component('homepage', {
    data: function () {
		return {
			restaurants: {},
			currentUser: null,
			name: '',
			type: '',
			location: '',
			rating: '',
			open: false,
			currentSort:'name',
	  		currentSortDir:'asc',
	  		filterName: "",
	  		filterType: "",
	  		filterCity: "",
	      	currentSort:'name',
  			currentSortDir:'asc',
		}
    },
    template: `
	<div>
		<div class="row mb-3" style="margin-top: 20px">
			<div class="col-lg-4 mx-auto">
		    	<div class="bg-white p-3 rounded shadow">
			      	<form action="">
			        	<div class="p-1 bg-light rounded rounded-pill shadow-sm mb-4">
			          		<div class="input-group">
			            		<input type="search" placeholder="Name" aria-describedby="button-addon1" class="form-control border-0 bg-light" v-model="filterName">
			            		<div class="input-group-append">
			              			<button id="button-addon1" type="submit" class="btn btn-link text-primary" v-on:click="sort('name')"><i class="fa fa-sort"></i></button>
			            		</div>
			          		</div>
			        	</div>
			        	<div class="p-1 bg-light rounded rounded-pill shadow-sm mb-4">
			        		<div class="input-group">
			            		<div class="input-group-prepend">
			              			<button id="button-addon2" type="submit" class="btn btn-link text-warning" v-on:click="sort('type')"><i class="fa fa-sort"></i></button>
			            		</div>
			            		<input type="search" placeholder="Type" aria-describedby="button-addon2" class="form-control border-0 bg-light" v-model="filterType">
			          		</div>
			        	</div>
			        	<div class="p-1 bg-light rounded rounded-pill shadow-sm mb-4">
			          		<div class="input-group">
			            		<input type="search" placeholder="City" aria-describedby="button-addon1" class="form-control border-0 bg-light" v-model="filterCity">
			            		<div class="input-group-append">
			              			<button id="button-addon1" type="submit" class="btn btn-link text-primary" v-on:click="sort('location.address.townName')"><i class="fa fa-sort"></i></button>
			            		</div>
			          		</div>
			        	</div>
		      		</form>
		    	</div>
		  	</div>
		</div>
		<div class="d-flex justify-content-center" style="margin-top:20px">
			<div class="row row-cols-1 row-cols-md-2" style = "width: 85%;">
				<div class="col" v-for="r in sortedRestaurants" :key="r.uuid">
				  <article class="restaurant_card">
					<figure class="card-image">
					  <img :src="r.logo" alt="" />
					</figure>
				
					<div class="card-content">
					  <header class="card-header-restaurant">
						<h2 v-html="highlightMatches(r.name, filterName)"></h2>
						<span v-html="highlightMatches(r.type, filterType)"></span>
						<br />
						<span>{{r.status}}</span>
						
						<address style="margin-top:10px">
						  <span class="icon-pin" aria-hidden="true"></span>
						  {{r.locationLabel}}
						</address>
					  </header>
					</div>
				
					<button class="card-button" v-on:click="showRestaurant(r.uuid)">View</button>
				  </article>
				</div>
			</div>
		</div>
	</div>
	`,


    methods: {
        init: function () {

        },
        showRestaurant: function (id) {
            let self = this;
            this.$router.push({name: 'Restaurant', params: {'id': id}});
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
        sort: function(s) {
	       	let self = this
			if(s === this.currentSort) {
				self.currentSortDir = self.currentSortDir==='asc'?'desc':'asc';
			}
		  	this.currentSort = s;
		},
        highlightMatches(text, filter) {
		    const matchExists = text
		      .toLowerCase()
		      .includes(filter.toLowerCase());
		    if (!matchExists) return text;
		
		    const re = new RegExp(filter, "ig");
		    return text.replace(re, matchedText => `<strong>${matchedText}</strong>`);
		}
    },
    computed:{
		sortedRestaurants : function() {
			resultData =  Object.values(this.restaurants).sort((a,b) => {
				let direction = 1;
				if(this.currentSortDir === 'desc') direction = -1;
				if(a[this.currentSort] < b[this.currentSort]) return -1 * direction;
				if(a[this.currentSort] > b[this.currentSort]) return 1 * direction;
				return 0;
			});
			return resultData.filter(sortedRestaurant => {
			    const name = sortedRestaurant.name.toString().toLowerCase();
			    const type = sortedRestaurant.type.toString().toLowerCase();
			    const city = sortedRestaurant.location.address.townName.toString().toLowerCase();
			    const nameSearchTerm = this.filterName.toLowerCase();
			    const typeSearchTerm = this.filterType.toLowerCase();
			    const citySearchTerm = this.filterCity.toLowerCase();
			    return (
			    	name.includes(nameSearchTerm) && type.includes(typeSearchTerm) && city.includes(citySearchTerm)
			    );
		    });
		}
	},
    mounted() {
        this.getRestaurants();
    }
});