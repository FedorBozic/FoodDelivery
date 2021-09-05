Vue.component('userview', {
        data: function () {
        	return{
        		users: {},
        		currentUser: {}
       		}
        },
        template: `
        <div>
        	<h1 v-if="currentUser != null">{{currentUser.username}}</h1>
			<table>
			  	<tr>
				    <th>Username</th>
				    <th>Ime</th>
				    <th>Prezime</th>
			  	</tr>
			  	<tr v-for="user in users">
				    <td>{{user.username}}</td>
				    <td>{{user.firstName}}</td>
				    <td>{{user.lastName}}</td>
			  	</tr>
			</table>
		</div>
    	`,
		mounted() {
        	let self = this;
            let tmp = '?';
            //Object.entries({datum: this.datum, kompanija: this.kompanija, polaziste: this.polaziste}).forEach(([key, val]) => tmp = tmp + key + '=' + val + '&');
        	axios.get('getUsers')
            .then(res => {
                this.users = res.data;
                axios.get('users/currentUser')
                .then(res => {
                	this.currentUser = res.data
                })
            })
        }
    }
);