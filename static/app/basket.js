Vue.component('basket', {
    data: function () {
		return {
			cart: {},
			currentUser: null
		}
    },
    template: `
	<div>
		<div class="d-flex justify-content-center" style="margin-top:20px">
	    	<div class="row row-cols-1 row-cols-md-2" style = "width: 85%;">
		    	<table v-for="i in cart.cartItems" style="background-color: white"><!--:key="i.uuid"-->
				  <tr>
				  	<th>Naziv</th>
				  	<th>Cena</th>
				  	<th>Opis</th>
				  	<th>Tip</th>
				  	<th>Kolicina</th>
				  	<th>Slika</th>
				  </tr>
				  <tr>
				  </tr>
				  	<td>{{i.item.name}}</td>
				  	<td>{{i.item.price}}</td>
				  	<td>{{i.item.description}}</td>
				  	<td>{{i.item.type}}</td>
				  	<td>{{i.count}}</td>
				  	<td><img :src="i.item.image" alt="" /></td>
				  </tr>
				</table>
			</div>
		</div>
	</div>
	`,


    methods: {
        init: function () {

        },
        
        getCart: function () {
        	axios.get('users/getCart')
            .then(res => {
            	this.cart = res.data;
				
            	for(let ciId in this.cart.cartItems){
            		let ci = this.cart.cartItems[ciId];
            		if(ci.image != null){
            			ci.image = 'data:image/png;base64,' + ci.image;
            		}
            		else{
            			ci.image = '';
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
                alert(self.image);
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        },
    },
    mounted() {
        axios.get('users/currentUser')
            .then(res => {
            	this.currentUser = res.data;
            	if(this.currentUser == null)
		    	{
		    		window.location.href = "#/registration";
		    	}
		    	else if(this.currentUser.role != 'CUSTOMER')
		    	{
		    		window.location.href = "#/registration";
		    	}
		    	else {
                	console.log(res);
                	this.getCart();
                }
            })
            .catch(err => {
                console.error(err);
            });
    }
});