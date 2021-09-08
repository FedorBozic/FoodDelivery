Vue.component('orders', {
        data: function () {
        	return{
        		currentUser: {},
				restaurant: {},
				orders: [],
				requests: [],
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
									<td>{{order.status}}</td>
									<td><button v-if="currentUser.role && (((order.status === 'PROCESSING' || order.status === 'PREPARATION') && currentUser.role === 'MANAGER') || ((order.status === 'AWAITING_DELIVERY' || order.status === 'IN_TRANSPORT') && currentUser.role === 'DELIVERY'))" v-on:click="upgradeOrderStatus(order)">Upgrade</button></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				
				<div class="row">
					<div class="col-xl-8">
						<table class="table table-striped" style="width:100%">
							<thead style="background-image: linear-gradient(to right,rgba(236, 48, 20) 0%,rgba(250, 30, 20, 0.9) 100%); color:white">
								<tr>
									<th>Customer</th>
									<th>Requester</th>
									<th>Approve</th>
								</tr>
							</thead>
							<tbody v-for="request in requests">
								<tr>
									<td>{{request.order.customerName}}</td>
									<td>{{request.requester.username}}</td>
									<td><button v-if="currentUser.role && currentUser.role === 'MANAGER'" v-on:click="approveDeliveryRequest(request)">Approve</button></td>
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
	        },
	        
	        approveDeliveryRequest: function (deliveryRequest) {
        		let self = this;
	        	axios.post('delivery/approvedelivery/' + self.currentUser.uuid, JSON.stringify(deliveryRequest))
	                .then(res => {
	                    axios.get('orders/' + this.$route.params.id)
		                .then(res => {
		                	self.orders = res.data;
		                	axios.get('delivery/opendeliveryrequestsforrestaurant/' + self.restaurant.uuid)
		                	.then(res => {
		                		self.requests = res.data;
		                		window.location.href = "#/orders/" + self.$route.params.id;
		                	})
		                })
	                })
	                .catch(err => {
	                    alert(err.response.data);
	                })
	        },
	
	    },
		mounted() {
        	let self = this;
        	axios.get('users/currentUser')
            .then(res => {
				self.currentUser = res.data
				self.restaurant = self.currentUser.restaurant
                axios.get('orders/' + this.$route.params.id)
                .then(res => {
                	self.orders = res.data;
                	axios.get('delivery/opendeliveryrequestsforrestaurant/' + self.restaurant.uuid)
                	.then(res => {
                		self.requests = res.data;
                	})
                })
            })
        }
    }
);