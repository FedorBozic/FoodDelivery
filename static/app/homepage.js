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
	  		filter: ""
		}
    },
    template: `
	<div>
		<div>
			<input type="text" placeholder="Naziv" v-model="filter">
			<select v-model="type">
				<option value="ALL">All</option>
				<option value="ITALIAN">Italijanski</option>
				<option value="CHINESE">Kineski</option>
				<option value="GRILL">Gril</option>
				<option value="PIZZERIA">Picerija</option>
			</select>
			<select v-model="rating">
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
			</select>
			<div>
			  <input type="checkbox" id="open" name="open" v-model="open">
			  <label for="open">Show open only</label>
			</div>
			<button type="button" v-on:click="getRestaurants">Search</button>
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
						<h2 v-html="highlightMatches(r.name)"></h2>
						<span>{{r.type}}</span>
						
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
        highlightMatches(text) {
		    const matchExists = text
		      .toLowerCase()
		      .includes(this.filter.toLowerCase());
		    if (!matchExists) return text;
		
		    const re = new RegExp(this.filter, "ig");
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
			    const searchTerm = this.filter.toLowerCase();
			    return (
			    	name.includes(searchTerm)
			    );
		    });
		}
	},
    mounted() {
        this.getRestaurants();
    }
});