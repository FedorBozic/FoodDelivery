Vue.component('customerorders', {
        data: function () {
        	return{
        		currentUser: {},
				orders: [],
				comment: {
					text: '',
					rating: 3
				},
				itemBorderStyle: {
					margin: '10px', 
					padding: '10px',
					'border-bottom': '2px dotted rgba(250, 30, 20)'
				},
				itemBorderStyleNoBorder: {
					margin: '10px', 
					padding: '10px'
				},
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
									<input type="date" placeholder="Date from" aria-describedby="button-addon1" class="form-control border-0 bg-light" v-model="filterDateFrom">
									<div class="input-group-append">
										<button id="button-addon1" type="submit" class="btn btn-link text-primary" v-on:click="sort('date')"><i class="fa fa-sort"></i></button>
									</div>
								</div>
							</div>
							<div class="p-1 bg-light rounded rounded-pill shadow-sm mb-4">
								<div class="input-group">
									<input type="date" placeholder="Date from" aria-describedby="button-addon1" class="form-control border-0 bg-light" v-model="filterDateTo">
								</div>
							</div>
							<select v-model="filterStatus" style="max-width:100%">
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
			    					<div class="col-sm-2"><h4 style="min-width:100px;text-align:left; margin:20px">{{order.restaurantName}}</h4></div>
			    					<div class="col-sm-2"><h4 style="text-align:left">{{order.price}}$</h4></div>
			    					<div class="col-sm-2"><h4 style="width:400px; text-align:right">{{order.date}}</h4></div>
			    				</div>
			    			</div>
			    			<div class="col-sm-2">
			    				<h4 style="min-width:100px;text-align:center; margin:10px; margin-right:20px">
			    					<i v-if="order.status === 'PROCESSING'" class="fa fa-times" @click="cancelOrder(order)"></i>
			    					<i v-if="order.status === 'PREPARATION'" class="fa fa-spinner fa-spin"></i>
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
				
				<div class="row" v-if="order.status === 'DELIVERED' && !order.commented">
					<div class="col-sm-7 mr-auto">
						<div class="row"><h4 style="margin-left:30px"><strong>Leave a Rating</strong></h4></div>
						<div class="row" style="margin-left: 10px; margin-bottom:20px; text-align: left; "><textarea placeholder="Description" v-model="comment.text" style="min-width:300px; max-width:600px; height:150px"></textarea></div>
					</div>
						<div class="col-sm-3">
							<div class="reviews">
		                        <i class="fas fa-star" @click="setRating(1)"></i>
		                        <i class="fas fa-star" v-if="comment.rating >= 2" @click="setRating(2)"></i>
		                        <i class="fas fa-star" v-if="comment.rating >= 3" @click="setRating(3)"></i>
		                        <i class="fas fa-star" v-if="comment.rating >= 4" @click="setRating(4)"></i>
		                        <i class="fas fa-star" v-if="comment.rating >= 5" @click="setRating(5)"></i>
		                        <i class="far fa-star" v-if="comment.rating < 2" @click="setRating(2)"></i>
		                        <i class="far fa-star" v-if="comment.rating < 3" @click="setRating(3)"></i>
		                        <i class="far fa-star" v-if="comment.rating < 4" @click="setRating(4)"></i>
		                        <i class="far fa-star" v-if="comment.rating < 5" @click="setRating(5)"></i>
	                        </div>
	                        <button class="generic_button" v-on:click="leaveComment(order)">Confirm</button>
	                    </div>
					</div>
				</div>
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
	        },
	        
	        setRating: function(r) {
	        	this.comment.rating = r
	        },
	        
	        leaveComment: function(item) {
	        	let self = this;
	        	this.comment.restaurant = item.items[0].item.restaurant
	        	this.comment.customer = this.currentUser.uuid
	        	this.comment.order = item.uuid
	        	axios.post('comments/newcomment', JSON.stringify(this.comment))
                .then(function (response) {
		        	self.getOrders()
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
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
			
			convertJsonDateToRaw(date) {
				date = date.split('-')
				return (parseInt(date[0]) - 1970)*31536000000 + (parseInt(date[1])-1)*2629800000 + parseInt(date[2])*86400000;
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
				    const restaurantName = sortedOrder.restaurantName.toString().toLowerCase();
				    const price = sortedOrder.price
				    const date = Date.parse(sortedOrder.date)
				    const status = sortedOrder.status
				    
				    const restaurantNameSearchTerm = this.filterRestaurantName.toLowerCase();
				    const priceFromSearchTerm = this.filterPriceFrom;
				    const priceToSearchTerm = this.filterPriceTo;
				    const DateFromSearchTerm = this.convertJsonDateToRaw(this.filterDateFrom);
				    const DateToSearchTerm = this.convertJsonDateToRaw(this.filterDateTo);
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
                axios.get('orders/getcustomerorders/' + self.currentUser.uuid)
                .then(res => {
                	self.orders = res.data;
                })
            })
        }
    }
);