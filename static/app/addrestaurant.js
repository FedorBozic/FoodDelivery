Vue.component('addrestaurant', {
    data: function () {
		return {
			restaurants: {},
			currentUser: null,
			name: '',
			type: '',
			status: '',
			image: ''
		}
    },
    template: `
<div>
	<table style="background-color: white">
		<tr>
			<th>UIID</th>
			<th>Naziv</th>
			<th>Tip</th>
			<th>Status</th>
			<th>Lokacija</th>
		</tr>
		<tr v-for="r in restaurants">
		    <td>{{r.uuid}}</td>
		    <td>{{r.name}}</td>
		    <td>{{r.type}}</td>
		    <td>{{r.status}}</td>
		    <td>{{r.locationLabel}}</td>
		    <td><img :src="r.logo" width="90" height="90"></td>
		  </tr>
		</tr>
	</table>
	<div>
		<input type="text" placeholder="Naziv" v-model="name">
		<select v-model="type">
			<option value="ITALIAN">Italijanski</option>
			<option value="CHINESE">Kineski</option>
			<option value="GRILL">Gril</option>
			<option value="PIZZERIA">Picerija</option>
		</select>
		<select v-model="status">
			<option value="OPEN">Otvoren</option>
			<option value="CLOSED">Zatvoren</option>
		</select>
	 	<input type="file" v-on:change="convertImage" id="image" name="image" accept="image/*">
		<button type="button" v-on:click="addRestaurant">Dodaj</button>
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