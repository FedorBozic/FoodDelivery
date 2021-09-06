Vue.component('profile', {
    data: function () {
		return {
			user: {},
			currentUser: {}
		}
    },
    template: `
	<div class="profile-box">
	    <div class="padding">
	        <div class="row container justify-content-center">
	            <div class="col-xl-6 col-md-12">
	                <div class="card user-card-full">
	                    <div class="row m-l-0 m-r-0">
	                        <user_tier_card component-type="user_tier_card" ></user_tier_card>
	                        <div class="col-sm-8">
	                            <div class="card-block">
	                                <h6 class="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
	                                <div class="row">
	                                    <div class="col-sm-6">
	                                        <p class="m-b-10 f-w-600">First Name</p>
	                                        <h6 class="text-muted f-w-400"><input type="text" class="discrete-textbox" v-model="currentUser.firstName" ></h6>
	                                    </div>
	                                    <div class="col-sm-6">
	                                        <p class="m-b-10 f-w-600">Last Name</p>
	                                        <h6 class="text-muted f-w-400"><input type="text" class="discrete-textbox" v-model="currentUser.lastName" ></h6>
	                                    </div>
	                                </div>
	                            </div>
	                            <input type="button" class="generic_button" value="Edit" v-on:click="edit()"/>
	                        </div>
	                    </div>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>
	`,
	methods: {
        edit: function () {
            axios.put('users/edit', JSON.stringify(this.currentUser))
                .then(res => {
                    alert("Successfully updated profile!");
                })
                .catch(err => {
                    alert(err.response.data);
                })
        }

    },
    mounted() {
        axios.get('users/currentUser')
            .then(res => {
            	this.currentUser = res.data;
                console.log(res);
            })
            .catch(err => {
                console.error(err);
            })
    }
});