Vue.component('customerorders', {
        data: function () {
        	return{
        		currentUser: {},
				orders: [],
				itemBorderStyle: {
					margin: '10px', 
					padding: '10px',
					'border-bottom': '2px dotted rgba(250, 30, 20)'
				},
				itemBorderStyleNoBorder: {
					margin: '10px', 
					padding: '10px'
				}
       		}
        },
        template: `
        <div class="container">
        	<div class="profile-card js-profile-card" style="margin-top:100px; padding-bottom:0px; min-height:100px" v-for="order in orders">
        		<div class="profile-card__cnt js-profile-cnt">
		    		<div class="profile-card__name" style="color:white; background-color: rgba(250, 30, 20); text-align:left; padding-left:10px; border-radius: 10px 10px 0px 0px">
		    			<div class="row d-flex justify-content-between">
		    				<div class="col-sm-2">
			    				<h4 style="min-width:100px;text-align:left; margin:10px">{{order.restaurantName}}</h4>
			    			</div>
			    			<div class="col-sm-2">
			    				<h4 style="min-width:100px;text-align:center; margin:10px; margin-right:20px">
			    					<i v-if="order.status === 'PROCESSING'" class="fa fa-times" @click="cancelOrder(order)"></i>
			    					<i v-if="order.status === 'PREPARATION'" class="fa fa-spinner fa-spin"></i>
			    					<i v-if="order.status === 'AWAITING_DELIVERY'" class="fa fa-truck"></i>
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
						<div class="row"><img :src="'data:image/png;base64,' + item.item.image" alt="" style="max-width:100%; height:auto; border-radius: 10px"/></div>
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