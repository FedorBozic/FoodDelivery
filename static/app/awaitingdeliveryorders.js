Vue.component('awaitingdeliveryorders', {
        data: function () {
        	return{
        		currentUser: {},
				restaurant: {},
				orders: [],
				userdeliveries: [],
				mydeliveries: [],
				currentSort:'restaurantName',
				currentSortDir:'asc',
				filterRestaurantName: '',
				filterDateFrom: '',
				filterDateTo: '',
				filterPriceFrom: '',
				filterPriceTo: '',
				filterStatus: '',
       		}
        },
        template: `
        <div class="container">
        	<div class="row mb-3" style="margin-top: 20px">
				<div class="col-lg-4 mx-auto">
					<div class="bg-white p-3 rounded shadow">
						<form action="">
							<div class="p-1 bg-light rounded rounded-pill shadow-sm mb-4">
								<div class="input-group">
									<input type="search" placeholder="Restaurant Name" aria-describedby="button-addon1" class="form-control border-0 bg-light" v-model="filterRestaurantName">
									<div class="input-group-append">
										<button id="button-addon1" type="submit" class="btn btn-link text-primary" v-on:click="sort('restaurantName')"><i class="fa fa-sort"></i></button>
									</div>
								</div>
							</div>
							<div class="p-1 bg-light rounded rounded-pill shadow-sm mb-4">
								<div class="input-group">
									<input type="search" placeholder="Price from" aria-describedby="button-addon1" class="form-control border-0 bg-light" v-model="filterPriceFrom">
									<div class="input-group-append">
										<button id="button-addon1" type="submit" class="btn btn-link text-primary" v-on:click="sort('price')"><i class="fa fa-sort"></i></button>
									</div>
								</div>
							</div>
							<div class="p-1 bg-light rounded rounded-pill shadow-sm mb-4">
								<div class="input-group">
									<input type="search" placeholder="Price to" aria-describedby="button-addon1" class="form-control border-0 bg-light" v-model="filterPriceTo">
								</div>
							</div>
							<div class="p-1 bg-light rounded rounded-pill shadow-sm mb-4">
								<div class="input-group">
									<input type="datetime-local" placeholder="Date from" aria-describedby="button-addon1" class="form-control border-0 bg-light" v-model="filterDateFrom">
									<div class="input-group-append">
										<button id="button-addon1" type="submit" class="btn btn-link text-primary" v-on:click="sort('date')"><i class="fa fa-sort"></i></button>
									</div>
								</div>
							</div>
							<div class="p-1 bg-light rounded rounded-pill shadow-sm mb-4">
								<div class="input-group">
									<input type="datetime-local" placeholder="Date from" aria-describedby="button-addon1" class="form-control border-0 bg-light" v-model="filterDateTo">
								</div>
							</div>
							<select v-model="filterStatus" style="max-width:100%">
								<option value=""></option>
								<option value="PROCESSING">Processing</option>
								<option value="PREPARATION">Preparation</option>
								<option value="AWAITING_DELIVERY">Awaiting Delivery</option>
								<option value="IN_TRANSPORT">In Transport</option>
								<option value="DELIVERED">Delivered</option>
								<option value="CANCELLED">Cancelled</option>
							</select>
						</form>
					</div>
				</div>
			</div>
        
        	<div class="tabs-container" style="margin-top:100px">
					<div class="tabs-block">
						<div class="tabs">
							<input type="radio" name="tabs" id="tab1" checked="checked" />
							<label for="tab1" style="background-image: linear-gradient(to right,rgba(236, 48, 20) 0%,rgba(250, 30, 20, 0.9) 100%)">My Deliveries</label>
							<div class="tab" style="padding:0px;margins:0px;border-radius:20px">
								<table class="table table-striped" style="width:100%">
									<thead style="background-image: linear-gradient(to right,rgba(236, 48, 20) 0%,rgba(250, 30, 20, 0.9) 100%); color:white">
										<tr>
											<th>Restaurant</th>
											<th>Status</th>
											<th>Upgrade</th>
										</tr>
									</thead>
									<tbody v-for="mydelivery in mydeliveries">
										<tr>
											<td>{{mydelivery.order.restaurantName}}</td>
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
											<th>Restaurant</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody v-for="userdelivery in userdeliveries">
										<tr>
											<td>{{userdelivery.order.restaurantName}}</td>
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
											<th>Restaurant</th>
											<th>Price</th>
											<th>Status</th>
											<th>Request</th>
										</tr>
									</thead>
									<tbody v-for="order in sortedOrders">
										<tr>
											<td>{{order.restaurantName}}</td>
											<td>{{order.price}}</td>
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
	                	axios.get('delivery/userdeliveries/' + self.currentUser.uuid)
	                	.then(res => {
	                		self.userdeliveries = res.data;
	                		window.location.href = "#/awaitingdeliveryorders";
	                	})
	                })
	            })
	            .catch(err => {
	                alert(err.response.data);
	            })
	        },
			
			sort: function(s) {
		       	let self = this
				if(s === this.currentSort) {
					self.currentSortDir = self.currentSortDir==='asc'?'desc':'asc';
				}
			  	this.currentSort = s;
			},
			
	        highlightMatches(text, filter) {
			    const matchExists = text
			      .toLowerCase()
			      .includes(filter.toLowerCase());
			    if (!matchExists) return text;
			
			    const re = new RegExp(filter, "ig");
			    return text.replace(re, matchedText => `<strong>${matchedText}</strong>`);
			},
	    },
	    computed: {
			sortedOrders : function() {
				resultData =  Object.values(this.orders).sort((a,b) => {
					let direction = 1;
					if(this.currentSortDir === 'desc') direction = -1;
					if(a[this.currentSort] < b[this.currentSort]) return -1 * direction;
					if(a[this.currentSort] > b[this.currentSort]) return 1 * direction;
					return 0;
				});
				return resultData.filter(sortedOrder => {
				    const restaurantName = sortedOrder.restaurantName.toString().toLowerCase();
				    const price = sortedOrder.price
				    const date = Date.parse(sortedOrder.date)
				    const status = sortedOrder.status
				    
				    const restaurantNameSearchTerm = this.filterRestaurantName.toLowerCase();
				    const priceFromSearchTerm = this.filterPriceFrom;
				    const priceToSearchTerm = this.filterPriceTo;
				    const DateFromSearchTerm = Date.parse(this.filterDateFrom);
				    const DateToSearchTerm = Date.parse(this.filterDateTo);
				    const statusSearchTerm = this.filterStatus;
				    return (
				    	restaurantName.includes(restaurantNameSearchTerm) && (!priceFromSearchTerm || price >= priceFromSearchTerm) && (!priceToSearchTerm || price <= priceToSearchTerm)
				    		&& (!DateFromSearchTerm || date >= DateFromSearchTerm) && (!DateToSearchTerm || date <= DateToSearchTerm) && status.includes(statusSearchTerm)
				    );
			    });
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