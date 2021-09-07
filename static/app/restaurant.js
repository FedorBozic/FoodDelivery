Vue.component('restaurant', {
    data: function () {
		return {
			restaurant: {},
			currentUser: null,
		}
    },
    template: `
	<div>
		<div class="restaurant-view-wrapper">
		  <div class="profile-card js-profile-card">
		    <div class="profile-card__img">
		      <img :src="restaurant.logo" alt="profile card">
		    </div>
		
		    <div class="profile-card__cnt js-profile-cnt">
		      <div class="profile-card__name">{{restaurant.name}}</div>
		      <div class="profile-card__txt">{{restaurant.type}} from <strong>{{restaurant.location.address.townName}}</strong></div>
		      <div class="profile-card-loc">
		        <span class="profile-card-loc__icon">
		          <svg class="icon"><use xlink:href="#icon-location"></use></svg>
		        </span>
		
		        <span class="profile-card-loc__txt">
		          {{restaurant.location.address.streetAddress}}
		        </span>
		      </div>
		
		      <div class="profile-card-inf">
		        <div class="profile-card-inf__item">
		          <div class="profile-card-inf__title">0</div>
		          <div class="profile-card-inf__txt">Articles</div>
		        </div>
		
		        <div class="profile-card-inf__item">
		          <div class="profile-card-inf__title">0</div>
		          <div class="profile-card-inf__txt">Rating</div>
		        </div>
		
		        <div class="profile-card-inf__item">
		          <div class="profile-card-inf__title">0</div>
		          <div class="profile-card-inf__txt">Comments</div>
		        </div>
		      </div>
		    </div>
		
		</div>
	</div>
	`,
    mounted() {
        axios.get('restaurants/' + this.$route.params.id)
        .then(res => {
            this.restaurant = res.data;
			if(this.restaurant != null && this.restaurant.logo != null){
            	this.restaurant.logo = 'data:image/png;base64,' + this.restaurant.logo;
            }
        })
        .catch(err => {
            console.error(err);
        });
    }
});