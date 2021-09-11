Vue.component('orders', {
        data: function () {
        	return{
        		currentUser: {},
				restaurant: {},
				orders: [],
				requests: [],
				customers: [],
				restaurantName: '',
				priceFrom: '',
				priceTo: '',
				dateFrom: '',
				dateTo: '',
				itemBorderStyle: {
				margin: '10px', 
				padding: '10px',
					'border-bottom': '2px dotted rgba(250, 30, 20)'
				},
				itemBorderStyleNoBorder: {
					margin: '10px', 
					padding: '10px'
				},
				currentSort:'customerName',
				currentSortDir:'asc',
				filterCustomerName: '',
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
									<input type="search" placeholder="Customer Name" aria-describedby="button-addon1" class="form-control border-0 bg-light" v-model="filterCustomerName">
									<div class="input-group-append">
										<button id="button-addon1" type="submit" class="btn btn-link text-primary" v-on:click="sort('customerName')"><i class="fa fa-sort"></i></button>
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
        
        
		    <div class="profile-card js-profile-card" style="margin-top:100px; padding-bottom:0px; min-height:100px" v-for="order in sortedOrders">
        		<div class="profile-card__cnt js-profile-cnt">
		    		<div class="profile-card__name" style="color:white; background-color: rgba(250, 30, 20); text-align:left; padding-left:10px; border-radius: 10px 10px 0px 0px">
		    			<div class="row d-flex justify-content-between">
		    				<div class="col-sm-2">
			    				<div class="row">
			    					<div class="col-sm-2"><h4 style="min-width:100px;text-align:left; margin:20px">{{order.customerName}}</h4></div>
			    					<div class="col-sm-2"><h4 style="text-align:left">{{order.price}}</h4></div>
			    				</div>
			    			</div>
			    			<div class="col-sm-2">
			    				<h4 style="min-width:100px;text-align:center; margin:10px; margin-right:20px">
			    					<i v-if="order.status === 'PROCESSING'" class="fas fa-hourglass" @click="upgradeOrderStatus(order)"></i>
			    					<i v-if="order.status === 'PREPARATION'" class="fa fa-spinner fa-spin" @click="upgradeOrderStatus(order)"></i>
			    					<i v-if="order.status === 'AWAITING_DELIVERY'" class="fas fa-truck-loading"></i>
			    					<i v-if="order.status === 'IN_TRANSPORT'" class="fa fa-truck"></i>
			    					<i v-if="order.status === 'DELIVERED'" class="fa fa-check"></i>
			    					<i v-if="order.status === 'CANCELLED'" class="fa fa-ban"></i>
			    				</h4>
			    			</div>
			    		</div>
		    		</div>
		    	</div>
		    	
		    	<div class="row" v-for="(item,index) in order.items" v-bind:style="[(index < order.items.length - 1) ? itemBorderStyle : itemBorderStyleNoBorder]">
					<div class="col-sm-7 mr-auto">
						<div class="row"><h4><strong>{{item.item.name}}</strong></h4></div>
						<div class="row" style="margin-left: 10px; text-align: left; ">{{item.item.description}}</div>
					</div>
					<div class="col-sm-2"><h2 style="margin-top:5px"><strong>{{item.item.price}}$</strong></h2></div>
					<div class="col-sm-3">
						<div class="row"><img :src="item.item.image" alt="" style="max-width:100%; height:auto; border-radius: 10px"/></div>
					</div>
				</div>
				
				<div v-if="requests && order.status == 'AWAITING_DELIVERY'">
			    	<h4 class="m-b-20 p-b-5 b-b-default f-w-600" style="margin-left:20px; margin-right: 20px">Delivery Requests</h4>
				   	<div class="row" v-for="request in requests" v-if="request.order.uuid == order.uuid && !request.approved">
			    		<div class="col-sm-5" style="margin-left:20px">
			    			{{request.requester.username}}
				   		</div>
				   		<div class="col-sm-6">
				   			<button class="generic_button" v-on:click="approveDeliveryRequest(request)">APPROVE</button>
				   		</div>
				   	</div>
			    </div>
        	</div>
        	
        	<table class="table table-striped" style="width:100%">
				<thead style="background-image: linear-gradient(to right,rgba(236, 48, 20) 0%,rgba(250, 30, 20, 0.9) 100%); color:white">
					<tr>
						<th @click="sort('username')">Username</th>
						<th @click="sort('firstName')">First Name</th>
						<th @click="sort('lastName')">Last Name</th>
					</tr>
				</thead>
				<tbody v-for="u in customers">
					<tr>
						<td>{{u.username}}</td>
						<td>{{u.firstName}}</td>
						<td>{{u.lastName}}</td>
					</tr>
				</tbody>
			</table>
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
	                    axios.get('orders/' + self.$route.params.id)
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
			}
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
				    const customerName = sortedOrder.customerName.toString().toLowerCase();
				    const price = sortedOrder.price
				    const date = Date.parse(sortedOrder.date)
				    const status = sortedOrder.status
				    
				    const customerNameSearchTerm = this.filterCustomerName.toLowerCase();
				    const priceFromSearchTerm = this.filterPriceFrom;
				    const priceToSearchTerm = this.filterPriceTo;
				    const DateFromSearchTerm = Date.parse(this.filterDateFrom);
				    const DateToSearchTerm = Date.parse(this.filterDateTo);
				    const statusSearchTerm = this.filterStatus;
				    return (
				    	customerName.includes(customerNameSearchTerm) && (!priceFromSearchTerm || price >= priceFromSearchTerm) && (!priceToSearchTerm || price <= priceToSearchTerm)
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
				self.restaurant = self.currentUser.restaurant
                axios.get('orders/' + self.$route.params.id)
                .then(res => {
                	self.orders = res.data;
                	axios.get('delivery/opendeliveryrequestsforrestaurant/' + self.restaurant.uuid)
                	.then(res => {
                		self.requests = res.data;
                		axios.get('users/getCustomersOfRestaurant')
                		.then( res => {
                			self.customers = res.data
                		})
                	})
                })
            })
        }
    }
);