Vue.component('user_tier_card',{
    template: `
	<div class="col-sm-4" :style="{ background: profileTierGradient }" v-if="currentUser && currentUser.type">
	    <div class="card-block text-center text-white">
	        <span class="decorative_circle">
				<h4 class="tierNameTitle" v-bind:style="{ color: profileTierName }" >{{currentUser.type.name}}</h4>
				<h6 class="f-w-600">{{currentUser.type.discount}}% discount</h6>
			</span>
			<h6 class="f-w-600" v-if="nextrank">{{currentUser.points}}/{{nextrank.pointRequirement}} to {{nextrank.name}}</h6>
	        <h4 class="f-w-600">{{currentUser.username}}</h4>
	    </div>
	</div>
	`,

    data(){
        return {
        	currentUser: {},
			angle: '50',
      		defaultColor1: 'red',
      		defaultColor2: 'blue',
      		nextrank: ''
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
			if(this.currentUser && this.currentUser.type) {
        		return `${this.currentUser.type.firstColor}`
        	}
        	else
        	{
        		return null
        	}
      	}
    },

	mounted() {
		let self = this;
        axios.get('users/currentUser')
            .then(res => {
            	self.currentUser = res.data;
            	axios.get('users/getnextrank')
            	.then( res => {
            		self.nextrank = res.data
            	})
            })
            .catch(err => {
                console.error(err);
            })
    }
})