Vue.component('basket', {
    data: function () {
		return {
			cart: {},
			orders: [],
			currentUser: null,
			totalprice: 0
		}
    },
    template: `
	<div class="container">
		<div class="row">
		    <div class="container-fluid p-0" style="margin-top:100px">
				<div class="row">
					<div class="col-xl-8" v-if="cart">
						<table class="table table-striped" style="width:100%">
							<thead style="background-image: linear-gradient(to right,rgba(236, 48, 20) 0%,rgba(250, 30, 20, 0.9) 100%); color:white">
								<tr>
									<th>Name</th>
									<th>Amount</th>
									<th>Price</th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<tbody v-for="i in cart.cartItems">
								<tr>
									<td>{{i.item.name}}</td>
									<td>{{i.count}}</td>
									<td>{{i.item.price * i.count}}</td>
									<td><img :src="'data:image/png;base64,' + i.item.image" style="width:100px; height: 100px"/></td>
									<td><i class="fa fa-trash"></i></td>
								</tr>
							</tbody>
						</table>
					</div>
					
					<div class="col-xl-4">
						<div class="card">
							<div class="card-header">
								<h5 class="card-title mb-0" style="text-align:left">Total</h5>
								<h1 style="color:white; text-align:left"><strong>{{totalprice}}$</strong></h1>
							</div>
							<div class="card-body" style="background: -webkit-gradient(linear, left top, right top, from(darkgreen), to(forestgreen)); background: linear-gradient(to right, darkgreen, forestgreen); color:white">
								<h4><strong>CHECKOUT</strong></h4>
								<input type="button" value="Register" class="generic_button" v-on:click="checkout()"/>
							</div>
						</div>
					</div>
				</div>
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
				
				if(this.cart != null && this.cart.cartItems != null)
				{
	            	for(let ciId in this.cart.cartItems){
	            		let ci = this.cart.cartItems[ciId];
	            		this.totalprice += (ci.count*ci.item.price)
	            		if(ci.image != null){
	            			ci.image = 'data:image/png;base64,' + ci.image;
	            		}
	            		else{
	            			ci.image = '';
	            		}
	            	}
                }
            })
            .catch(err => {
                console.error(err);
            })
        },
        
        getOrders: function () {
        	axios.get('orders/getorders')
            .then(res => {
            	this.orders = res.data;
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
        
        checkout: function () {
            let self = this;
            axios.post('orders/checkout', JSON.stringify(this.currentUser))
                .then(function (response) {
                	axios.get('users/getCart')
		            .then(res => {
		            	self.cart = res.data;
						if(self.cart != null && self.cart.cartItems != null)
						{
			            	for(let ciId in self.cart.cartItems){
			            		let ci = self.cart.cartItems[ciId];
			            		self.totalprice += (ci.count*ci.item.price)
			            		if(ci.image != null){
			            			ci.image = 'data:image/png;base64,' + ci.image;
			            		}
			            		else{
			            			ci.image = '';
			            		}
			            	}
		            	}
		                window.location.href = "#/basket";
		            })
		            .catch(err => {
		                console.error(err);
		            })
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
        }
    },
    mounted() {
    	let self = this
        axios.get('users/currentUser')
            .then(res => {
            	self.currentUser = res.data;
            	if(self.currentUser == null)
		    	{
		    		window.location.href = "#/registration";
		    	}
		    	else if(self.currentUser.role != 'CUSTOMER')
		    	{
		    		window.location.href = "#/registration";
		    	}
		    	else {
                	this.getCart();
                	this.getOrders();
                }
            })
            .catch(err => {
                console.error(err);
            });
    }
});