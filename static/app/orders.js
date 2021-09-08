Vue.component('orders', {
        data: function () {
        	return{
        		currentUser: {},
				restaurant: {},
				orders: []
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
								</tr>
							</thead>
							<tbody v-for="order in orders">
								<tr>
									<td>{{order.customerName}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
		
			</div>
		</div>
    	`,
		mounted() {
        	let self = this;
        	axios.get('users/currentUser')
            .then(res => {
				self.currentUser = res.data
				self.restaurant = self.currentUser.restaurant
                axios.get('orders/getordersrestaurant')
                .then(res => {
                	self.orders = res.data;
                })
            })
        }
    }
);