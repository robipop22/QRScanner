import React from 'react';
import { StyleSheet, View, Text, FlatList, AsyncStorage, ActivityIndicator } from 'react-native'

import { Constants } from 'expo'

import { ListItem, Button } from 'react-native-elements'

export default class SettingsScreen extends React.Component {
	static navigationOptions = {
		header: null,
	}
  
  constructor (props) {
    super(props)
    this.state = {
      stores: [],
	    isLoading: true
    }
  }
  
  componentDidMount() {
	  AsyncStorage.getItem('storeData')
		  .then( stores => {
		  	this.setState({stores: stores ? JSON.parse(stores) : [], isLoading: false})
		  })
		  .catch( err => {
			  this.setState({stores: []})
		  })
	}
	
  addShopFromAddScreen = (name, domain, apiKey, apiPass, active) => {
	  const { stores } = this.state
	 
		const newStore = {
			name, domain, apiKey, apiPass, active
		}
		if ( active ) {
			for(let i = 0; i < stores.length; i++) {
				stores[i].active = false
			}
		}
	  stores.push(newStore)
	  AsyncStorage.setItem('storeData', JSON.stringify(stores))
		  .then( newStores => {
			  this.setState({stores})
		  })
		  .catch( err => {
			  console.log('err set', err)
		  })
  }
  
	addShop = () => {
		this.props.navigation.navigate('Shop', {title: 'Add store', addShopFct: this.addShopFromAddScreen})
	}
	
	editShopFromEditScreen = (name, domain, apiKey, apiPass, active, i) => {
		const { stores } = this.state
		const objIndex = stores.findIndex((obj, index) => index === i)
		if ( active ) {
			for(let i = 0; i < stores.length; i++) {
				stores[i].active = false
			}
		}
		stores[objIndex].name = name
		stores[objIndex].domain = domain
		stores[objIndex].apiKey = apiKey
		stores[objIndex].apiPass = apiPass
		stores[objIndex].active = active
		
		AsyncStorage.setItem('storeData', JSON.stringify(stores))
			.then( () => {
				this.setState({stores})
			})
			.catch( err => {
				console.log('err set', err)
			})
	}
	
	editShop = (name, domain, apiKey, apiPass, active, i) => {
		this.props.navigation.navigate('Shop', {name, domain, apiKey, apiPass, active, i, title: 'Edit store', editShopFct: this.editShopFromEditScreen, removeStore: this.handleRemove})
	}
	
	
	handleRemove = (i) => {
		const { stores } = this.state
		const objIndex = stores.findIndex((obj, index) => index === i)
		stores.splice(objIndex, 1)
		AsyncStorage.setItem('storeData', JSON.stringify(stores))
			.then( () => {
				this.setState({stores})
			})
	}
	
	renderShop = ({item, index}) => {
		const { name, domain, apiKey, apiPass, active } = item
		return (
			<ListItem
				containerStyle={{ backgroundColor: active ? '#66BB6A' : '#ecf0f1', flex: 1 }}
				underlayColor='#7a7a7a'
				key={index}
				title={name}
				subtitle={domain}
				titleStyle={[styles.listItem, {color: active ? '#fff' : '#666'}]}
				subtitleStyle={[styles.listSubtitle, {color: active ? '#fff' : '#666666CC'}]}
				rightIcon={{name: 'edit', color: active ? '#fff' : '#666'}}
				onPress={() => this.editShop(name, domain, apiKey, apiPass, active, index)}
			/>
		)
	}

  render() {
	  if ( this.state.isLoading ) {
		  return (
			  <View style={{flex: 1, paddingTop: 20}}>
				  <ActivityIndicator />
			  </View>
		  )
	  }
  	return (
		  <View style={styles.container}>
			  <View style={styles.headerContainer}>
				  <Text style={{fontSize: 18, marginLeft: 20, flex: 1}}>Your shopify stores</Text>
				  <Button
					  containerStyle={{alignItems: 'center', flex: 1, borderRadius: 5}}
					  buttonStyle={{height: 50}}
					  borderRadius={50}
					  textStyle={{color: '#FFF'}}
					  backgroundColor={'#0288D1'}
					  title='Add store'
					  onPress={this.addShop}
				  />
			  </View>
			  <View style={{flex: 1}}>
				  <FlatList
					  removeClippedSubviews={false}
					  keyboardShouldPersistTaps='always'
					  extraData={this.state}
					  data={this.state.stores}
					  renderItem={this.renderShop}
					  keyExtractor={(item, index) => index.toString()}
				  />
			  </View>
		  </View>
	  )
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: Constants.statusBarHeight,
		backgroundColor: '#ecf0f1',
	},
	headerContainer: {
	  flexDirection: 'row',
		alignItems: 'center',
		marginTop: 50,
		marginBottom: 30
  },
	listItem: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	listSubtitle: {
		fontSize: 14
	}
});