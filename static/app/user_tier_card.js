Vue.component('user_tier_card',{
    template: `
	<div class="col-sm-4" :style="{ background: profileTierGradient }">
	    <div class="card-block text-center text-white">
	        <span class="decorative_circle"></span>
	        <h6 class="f-w-600">{{currentUser.username}}</h6>
	    </div>
	</div>
	`,

    data(){
        return {
        	currentUser: {},
			angle: '50',
      		color1: 'gold',
      		color2: 'palegoldenrod'
      	}
    },

    computed : {
        profileTierGradient(){
        return `linear-gradient(${this.angle}deg, ${this.color1}, ${this.color2})`
      }
    },

    methods : {
        activeThisButton(){
	
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
})