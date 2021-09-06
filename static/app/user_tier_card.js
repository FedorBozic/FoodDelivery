Vue.component('user_tier_card',{
    template: `
	<div class="col-sm-4" :style="{ background: profileTierGradient }" v-if="currentUser != null">
	    <div class="card-block text-center text-white">
	        <span class="decorative_circle">
				<h4 class="tierNameTitle" v-bind:style="{ color: profileTierName }" >{{currentUser.type.name}}</h4>
			</span>
	        <h6 class="f-w-600">{{currentUser.username}}</h6>
	    </div>
	</div>
	`,

    data(){
        return {
        	currentUser: {},
			angle: '50',
      		defaultColor1: 'red',
      		defaultColor2: 'blue'
      	}
    },

    computed : {
        profileTierGradient(){
		if(this.currentUser != null && this.currentUser.type != null)
		{
			return `linear-gradient(${this.angle}deg, ${this.currentUser.type.firstColor}, ${this.currentUser.type.secondColor})`
		}
        return `linear-gradient(${this.angle}deg, ${this.defaultColor1}, ${this.defaultColor2})`
      },
		profileTierName(){
        return `${this.currentUser.type.firstColor}`
      }
    },

    methods : {
        activeThisButton(){
	
      }
    },

	mounted() {
		let self = this;
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