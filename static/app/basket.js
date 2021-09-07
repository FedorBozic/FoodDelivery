Vue.component('basket', {
    data: function () {
		return {
			cart: {},
			currentUser: null,
			totalprice: 0
		}
    },
    template: `
	<div class="container">
		<div class="row">
		    <div class="container-fluid p-0" style="margin-top:100px">
				<div class="row">
					<div class="col-xl-8">
						<table class="table table-striped" style="width:100%">
							<thead style="background-image: linear-gradient(to right,rgba(236, 48, 20) 0%,rgba(250, 30, 20, 0.9) 100%); color:white">
								<tr>
									<th>Name</th>
									<th>Amount</th>
									<th>Price</th>
								</tr>
							</thead>
							<tbody v-for="i in cart.cartItems">
								<tr>
									<td>{{i.item.name}}</td>
									<td>{{i.count}}</td>
									<td>{{i.item.price}}</td>
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