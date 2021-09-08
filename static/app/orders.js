Vue.component('orders', {
        data: function () {
        	return{
        		currentUser: {},
				restaurant: {},
				orders: [],
				restaurantName: '',
				priceFrom: '',
				priceTo: ''
       		}
        },
        template: `
        <div class="container">
		<div>
			<input type="text" placeholder="Restaurant Name" v-model="restaurantName">
			<input type="text" placeholder="Price Lower" v-model="priceFrom">
			<input type="text" placeholder="Price Upper" v-model="priceTo">
			<button type="button" v-on:click="getOrders">Search</button>
		</div>
		    <div class="container-fluid p-0" style="margin-top:100px">
				<div class="row">
					<div class="col-xl-8">
						<table class="table table-striped" style="width:100%">
							<thead style="background-image: linear-gradient(to right,rgba(236, 48, 20) 0%,rgba(250, 30, 20, 0.9) 100%); color:white">
								<tr>
									<th>Username</th>
									<th>Status</th>
									<th>Upgrade</th>
								</tr>
							</thead>
							<tbody v-for="order in orders">
								<tr>
									<td>{{order.customerName}}</td>
								</tr>
								<tr>
									<td>{{order.status}}</td>
								</tr>
								<tr>
									<td><button v-if="currentUser.role && (((order.status === 'PROCESSING' || order.status === 'PREPARATION') && currentUser.role === 'MANAGER') || ((order.status === 'AWAITING_DELIVERY' || order.status === 'IN_TRANSPORT') && currentUser.role === 'DELIVERY'))" v-on:click="upgradeOrderStatus(order)">Upgrade</button></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
		
			</div>
		</div>
    	`,
    	methods: {
        	upgradeOrderStatus: function (order) {
        		let self = this;
	        	axios.put('orders/upgradestatus', JSON.stringify(order))
	                .then(res => {
	                    axios.get('orders/' + this.$route.params.id)
		                .then(res => {
		                	self.orders = res.data;
		                	window.location.href = "#/orders/" + self.$route.params.id;
		                })
	                })
	                .catch(err => {
	                    alert(err.response.data);
	                })
	        },
	        
        	getOrders: function() {
        		let params = '?' + 'restaurantName=' + this.restaurantName + '&priceFrom=' + this.priceFrom + '&priceTo=' + this.priceTo;
        		axios.get('orders/getorders/' + this.$route.params.id)
                .then(res => {
                	self.orders = res.data;
                })
	        }
	
	    },
		mounted() {
        	let self = this;
        	axios.get('users/currentUser')
            .then(res => {
				self.currentUser = res.data
				self.restaurant = self.currentUser.restaurant;
          		this.getOrders();
            })
        }
    }
);