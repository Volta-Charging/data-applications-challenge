

class StationListElement extends React.Component {
	render(){
		return (
			<div>
				<li className="stationName">{this.props.name}</li>
				<li className="address">{this.props.street_address}</li>
				<li className="address">{this.props.city}, {this.props.state}, {this.props.zip_code}</li>
			</div>
			)
	}
}


const url = 'https://api.voltaapi.com/v1/stations';

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			stations:[],
			search: ""
		};
	}
	componentDidMount(){
		// Grab data from Volta API
		fetch(url)
		.then((resp)=> resp.json())
		.then(function(data){
			this.setState({stations: data});
			}.bind(this))
		.catch(function(error){
			console.log("Error: ", error)
		})
	}
	updateSearch(event){
		this.setState({search: event.target.value.substr(0,20)});
	}

	filterStations(){
		return this.state.stations.filter(
			(station) => {
				
				let params = ['name','street_address','city','state']
				let searchQuery = this.state.search.toLowerCase()
				return params.some((param) =>
				{	
					if (station[param]===undefined || station[param]===null || station[param].toLowerCase().indexOf(searchQuery)==-1){
						return false
					}
					return true
				})
			});

		
	}
	render(){

		let {stations} = this.state;
		let filtered=this.filterStations();
		
		return (
			<div>
			<h1>Volta Charging Stations</h1>
			<h4>by Olga Ayvazyan</h4>
			<input type="text" value={this.state.search} placeholder="Search station name, address, city or state..." onChange={this.updateSearch.bind(this)}/>

			<ul>{filtered.map((station) => <StationListElement {...station} />)}</ul>
			</div>
				)
				
	}
}

ReactDOM.render(<App />, document.getElementById('stationslist'));

