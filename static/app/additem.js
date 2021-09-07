Vue.component('additem', {
    data: function () {
		return {
			items: {},
			currentUser: null,
			name: '',
			price: '',
			type: '',
			image: '',
			description: '',
			amount: ''
		}
    },
    template: `
<div>
	<table style="background-color: white">
		<tr>
			<th>Naziv</th>
			<th>Tip</th>
			<th>Opis</th>
			<th>Cena</th>
			<th>Kolicina (g ili ml)</th>
			<th>Slika</th>
		</tr>
		<tr v-for="i in items">
		    <td>{{i.name}}</td>
		    <td>{{i.type}}</td>
		    <td>{{i.description}}</td>
		    <td>{{i.price}}</td>
		    <td>{{i.amount}}</td>
		    <td><img :src="i.image" alt="" width="90" height="90" /></td>
		  </tr>
		</tr>
	</table>
	<div>
		<input type="text" placeholder="Naziv" v-model="name">
		<select v-model="type">
			<option value="FOOD">Hrana</option>
			<option value="DRINK">Pice</option>
		</select>
		<input type="text" placeholder="Opis" v-model="description">
		<input type="text" placeholder="Cena" v-model="price">
		<input type="text" placeholder="Kolicina" v-model="amount">
	 	<input type="file" v-on:change="convertImage" id="image" name="image" accept="image/*">
		<button type="button" v-on:click="addItem">Dodaj</button>
	</div>
</div>
	`,


    methods: {
        init: function () {

        },
        
        getItems: function() {
        	let tmp = '?uuid=' + this.currentUser.restaurant.uuid + '&'; //probaj bez &
            axios.get('users/getItems'+tmp)
            .then(res => {
            	this.items = res.data;
            	for(let iId in this.items){
            		let i = this.i[iId];		
            		if(i.logo != null){
            			i.logo = 'data:image/png;base64,' + i.logo;
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
        
        getCurrentUser: function() {
        	let self = this;
	        axios.get('users/currentUser')
	            .then(res => {
	            	this.currentUser = res.data;
	            	if(this.currentUser == null)
			    	{
			    		window.location.href = "#/registration";
			    	}
			    	else if(this.currentUser.role != 'MANAGER')
			    	{
			    		window.location.href = "#/registration";
			    	}
			    	else {
	                	console.log(res);
	                	window.location.href = "#/additem";
	                	
	                	this.items = this.currentUser.restaurant.items;
		            	for(let iId in this.items){
		            		let i = this.items[iId];
		            		if(i.image != null){
		            			i.image = 'data:image/png;base64,' + i.image;
		            		}
		            	}
	                }
	            })
	            .catch(err => {
	                console.error(err);
	            });
        },
        
        addItem: function() {
        	let self = this;
        	let newItem = {
        		name: this.name,
        		type: this.type,
        		description: this.description,
        		price: this.price,
        		amount: this.amount,
        		image: this.image,
        	};
            axios.post('users/newItem', JSON.stringify(newItem))
                .then(function (response) {
					axios.get('users/currentUser')
					window.location.href = "#/additem";
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
        },
    },
    computed:{
    
  	},
    mounted() {
        this.getCurrentUser();
    }
});