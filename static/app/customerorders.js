Vue.component('customerorders', {
        data: function () {
        	return{
        		currentUser: {},
				orders: []
       		}
        },
        template: `
        <div class="container">
		    <div class="container-fluid p-0" style="margin-top:100px" v-for="order in orders">
				<div class="card-header">
					<div class="row">
						{{order.restaurantName}}
						{{order.status}}
						{{order.price}}
					</div>
				</div>
				<div class="row">
					<div class="col-xl-8">
						<table class="table table-striped" style="width:100%">
							<thead style="background-image: linear-gradient(to right,rgba(236, 48, 20) 0%,rgba(250, 30, 20, 0.9) 100%); color:white">
								<tr>
									<th>Name</th>
									<th>Count</th>
								</tr>
							</thead>
							<tbody v-for="ci in order.items">
								<tr>
									<td>{{ci.item.name}}</td>
									<td>{{ci.count}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			<button v-if="!order.canceled" type="button" v-on:click="cancelOrder(order)" >Cancel</button>
			</div>
		</div>
    	`,
    	methods: {
	        getOrders: function() {
        		axios.get('orders/getcustomerorders/' + this.$route.params.id)
                .then(res => {
                	self.orders = res.data;
                })
	        },
	        
	        cancelOrder: function(order) {
	        	let self = this;
	        	axios.put('orders/cancel/' + order.uuid)
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
                axios.get('orders/getcustomerorders/' + this.$route.params.id)
                .then(res => {
                	self.orders = res.data;
                })
            })
        }
    }
);