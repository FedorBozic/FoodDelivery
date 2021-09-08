Vue.component('awaitingdeliveryorders', {
        data: function () {
        	return{
        		currentUser: {},
				restaurant: {},
				orders: [],
				userdeliveries: []
       		}
        },
        template: `
        <div class="container">
		    <div class="container-fluid p-0" style="margin-top:100px">
				<div class="row">
					<div class="col-xl-8">
						<table class="table table-striped" style="width:100%">
							<thead style="background-image: linear-gradient(to right,rgba(236, 48, 20) 0%,rgba(250, 30, 20, 0.9) 100%); color:white">
								<tr>
									<th>Username</th>
									<th>Status</th>
									<th>Request</th>
								</tr>
							</thead>
							<tbody v-for="order in orders">
								<tr>
									<td>{{order.customerName}}</td>
									<td>{{order.status}}</td>
									<td><button v-on:click="requestDelivery(order)">Request</button></td>
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
									<th>Username</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody v-for="userdelivery in userdeliveries">
								<tr>
									<td>{{userdelivery.order.customerName}}</td>
									<td>{{userdelivery.order.status}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
    	`,
    	methods: {
        	requestDelivery: function (order) {
        		let self = this;
        		console.log("here")
        		axios.post('delivery/requestdelivery/' + self.currentUser.uuid, JSON.stringify(order))
	            .then(res => {
	            	axios.get('orders/awaitingdeliveryorders/' + self.currentUser.uuid)
	                .then(res => {
	                	self.orders = res.data;
	                	axios.get('delivery/userdeliveries', JSON.stringify(self.currentUser))
	                	.then(res => {
	                		self.userdeliveries = res.data;
	                		window.location.href = "#/awaitingdeliveryorders";
	                	})
	                })
	            })
	            .catch(err => {
	                alert(err.response.data);
	            })
	        }
	
	    },
		mounted() {
        	let self = this;
			console.log("got here")
        	axios.get('users/currentUser')
            .then(res => {
				self.currentUser = res.data
				if(self.currentUser) {
	                axios.get('orders/awaitingdeliveryorders/' + self.currentUser.uuid)
	                .then(res => {
	                	self.orders = res.data;
	                	axios.get('delivery/userdeliveries/' + self.currentUser.uuid)
	                	.then(res => {
	                		self.userdeliveries = res.data;
	                	})
	                })
                }
                else
                {
                	window.location.href = "#/login";
                }
            })
        }
    }
);