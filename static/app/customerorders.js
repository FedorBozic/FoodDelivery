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
        	<div class="profile-card js-profile-card" style="margin-top:100px" v-for="order in orders">
        		<div class="profile-card__cnt js-profile-cnt">
		    		<div class="profile-card__name" style="color:white; background-color: rgba(250, 30, 20); text-align:left; padding-left:10px; border-radius: 10px 10px 0px 0px">{{order.restaurantName}}</div>
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
        	</div>
        
        
        
        
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