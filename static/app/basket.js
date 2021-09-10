Vue.component('basket', {
    data: function () {
		return {
			cart: {},
			orders: [],
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
		}
    },
    template: `
	<div class="container">
		<div class="row">
			<div class="col-xl-8">
				<div class="profile-card js-profile-card" style="margin-top:100px; padding-bottom:0px; min-height:100px">
		       		<div class="profile-card__cnt js-profile-cnt">
						<div class="profile-card__name" style="color:white; background-color: rgba(250, 30, 20); text-align:left; padding-left:10px; border-radius: 10px 10px 0px 0px">
							<div class="row d-flex justify-content-between">
								<div class="col-sm-2">
			    				<div class="row">
			    					<div class="col-sm-2"><h4 style="min-width:100px;text-align:left; margin:20px">My Basket</h4></div>
			    				</div>
			    			</div>
			    		</div>
						</div>
					</div>
					
					<div class="row" v-for="(item,index) in cart.cartItems" v-bind:style="[(index < cart.cartItems.length - 1) ? itemBorderStyle : itemBorderStyleNoBorder]">
						<div class="col-sm-7 mr-auto">
							<div class="row"><h4><strong>{{item.item.name}}</strong></h4></div>
							<div class="row" style="margin-left: 10px; text-align: left; ">{{item.item.description}}</div>
						</div>
						<div class="col-sm-2 my-auto">
							<h2 style="margin-top:5px"><strong>{{item.item.price*item.count}}$</strong><i class="fas fa-times" style="color:rgba(250, 30, 20); float:right" @click="deleteCartItem(i)"></i></h2>
							<h4 style="margin-top:5px"><input type="text" class="discrete-textbox" v-model="item.count"></h4>
						</div>
						<div class="col-sm-3">
							<div class="row"><img :src="item.item.image" alt="" style="max-width:100%; height:auto; border-radius: 10px"/></div>
						</div>
					</div>
		       	</div>
			</div>
			<div class="col-xl-4">
				<div class="profile-card__cnt js-profile-cnt" style="margin-top:70px; padding-bottom:0px; min-height:100px">
					<div class="profile-card__name" style="color:white; background-color: rgba(250, 30, 20); text-align:left; padding-left:10px; border-radius: 10px 10px 0px 0px; margin-bottom:0px">
						<h5 class="card-title mb-0" style="text-align:left">Total</h5>
						<h1 style="color:white; text-align:left; margin-bottom:0px; padding-bottom:10px"><strong>{{totalprice}}$</strong></h1>
					</div>
					<div class="card-body" style="background: -webkit-gradient(linear, left top, right top, from(darkgreen), to(forestgreen)); background: linear-gradient(to right, darkgreen, forestgreen); color:white" @click="checkout()">
						<h4><strong>CHECKOUT</strong></h4>
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
        
        deleteCartItem: function(item)
        {
        	
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
    computed: {
    	totalprice() {
    		totalpriceResult = 0
    		for(let ciId in this.cart.cartItems){
	            let ci = this.cart.cartItems[ciId];
	            totalpriceResult += (ci.count*ci.item.price)
	        }
    		return Number.parseFloat(totalpriceResult).toPrecision(3);
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