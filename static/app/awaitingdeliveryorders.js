Vue.component('awaitingdeliveryorders', {
        data: function () {
        	return{
        		currentUser: {},
				restaurant: {},
				orders: [],
				userdeliveries: [],
				mydeliveries: []
       		}
        },
        template: `
        <div class="container">
        	<div class="tabs-container" style="margin-top:100px">
					<div class="tabs-block">
						<div class="tabs">
							<input type="radio" name="tabs" id="tab1" checked="checked" />
							<label for="tab1" style="background-image: linear-gradient(to right,rgba(236, 48, 20) 0%,rgba(250, 30, 20, 0.9) 100%)">My Deliveries</label>
							<div class="tab" style="padding:0px;margins:0px;border-radius:20px">
								<table class="table table-striped" style="width:100%">
									<thead style="background-image: linear-gradient(to right,rgba(236, 48, 20) 0%,rgba(250, 30, 20, 0.9) 100%); color:white">
										<tr>
											<th>Username</th>
											<th>Status</th>
											<th>Upgrade</th>
										</tr>
									</thead>
									<tbody v-for="mydelivery in mydeliveries">
										<tr>
											<td>{{mydelivery.order.customerName}}</td>
											<td>{{mydelivery.order.status}}</td>
											<td><button v-on:click="upgradeOrderStatus(mydelivery.order)">Upgrade</button></td>
										</tr>
									</tbody>
								</table>
							</div>

							<input type="radio" name="tabs" id="tab2" />
							<label for="tab2" style="background-image: linear-gradient(to right,rgba(236, 48, 20) 0%,rgba(250, 30, 20, 0.9) 100%)">My Requests</label>
							<div class="tab" style="padding:0px;margins:0px;border-radius:20px">
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

							<input type="radio" name="tabs" id="tab3" />
							<label for="tab3" style="background-image: linear-gradient(to right,rgba(236, 48, 20) 0%,rgba(250, 30, 20, 0.9) 100%)">Available</label>
							<div class="tab" style="padding:0px;margins:0px;border-radius:20px">
								<table class="table table-striped" style="width:100%; margin-bottom:0px">
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
					</div>
				</div>
		</div>
    	`,
    	methods: {
    		refreshInformation: function() {
    			let self = this;
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
		                		 axios.get('delivery/mydeliveries/' + self.currentUser.uuid)
		                		.then(res => {
		                			self.mydeliveries = res.data;
		                		})
		                	})
		                })
	                }
	                else
	                {
	                	window.location.href = "#/login";
	                }
	            })
    		},
    		
    		upgradeOrderStatus: function (order) {
        		let self = this;
	        	axios.put('orders/upgradestatus', JSON.stringify(order))
	                .then(res => {
	                    this.refreshInformation();
	                })
	                .catch(err => {
	                    alert(err.response.data);
	                })
	        },
	        
        	requestDelivery: function (order) {
        		let self = this;
        		console.log("here")
        		axios.post('delivery/requestdelivery/' + self.currentUser.uuid, JSON.stringify(order))
	            .then(res => {
	            	axios.get('orders/awaitingdeliveryorders/' + self.currentUser.uuid)
	                .then(res => {
	                	self.orders = res.data;
	                	axios.get('delivery/userdeliveries' + self.currentUser.uuid)
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
        	axios.get('users/currentUser')
            .then(res => {
				self.currentUser = res.data
				if(self.currentUser) {
	                axios.get('orders/awaitingdeliveryorders/' + self.currentUser.uuid)
	                .then(res => {
	                	self.orders = res.data;
	                	//userdeliveries su zahtevi od trenutnog korisnika, mydeliveries su prihvaceni
	                	axios.get('delivery/userdeliveries/' + self.currentUser.uuid)
	                	.then(res => {
	                		self.userdeliveries = res.data;
	                		 axios.get('delivery/mydeliveries/' + self.currentUser.uuid)
	                		.then(res => {
	                			self.mydeliveries = res.data;
	                		})
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