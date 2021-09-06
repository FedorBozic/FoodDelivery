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
	                        <div class="col-sm-4 bg-c-lite-green user-profile">
	                            <div class="card-block text-center text-white">
	                                <div class="m-b-25"> <img src="Bronze_Icon.png" class="img-radius" alt="User-Profile-Image"> </div>
	                                <h6 class="f-w-600">{{currentUser.username}}</h6>
	                            </div>
	                        </div>
	                        <div class="col-sm-8">
	                            <div class="card-block">
	                                <h6 class="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
	                                <div class="row">
	                                    <div class="col-sm-6">
	                                        <p class="m-b-10 f-w-600">First Name</p>
	                                        <h6 class="text-muted f-w-400">{{currentUser.firstName}}</h6>
	                                    </div>
	                                    <div class="col-sm-6">
	                                        <p class="m-b-10 f-w-600">Last Name</p>
	                                        <h6 class="text-muted f-w-400">{{currentUser.lastName}}</h6>
	                                    </div>
	                                </div>
	                            </div>
	                        </div>
	                    </div>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>
	`,
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