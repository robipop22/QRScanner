import React from 'react';
import {
  StyleSheet,
  View,
	Text,
	AsyncStorage,
	Dimensions,
	ActivityIndicator
} from 'react-native';

import { BarCodeScanner, Permissions, Constants } from 'expo'

import { promiseRequest } from '../utils/index'

import { Button, ListItem } from 'react-native-elements'

import Api from '../constants/Api'

export default class HomeScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			hasCameraPermission: null,
			data: [],
			scan: false,
			errMessage: null,
			stores: [],
			isLoading: true
		}
	}
	
  static navigationOptions = {
    header: null,
  }
	
	componentDidMount() {
		this.requestCameraPermission()
		AsyncStorage.getItem('storeData')
			.then( stores => {
				this.setState({stores: stores ? JSON.parse(stores) : [], isLoading: false})
			})
			.catch( err => {
				this.setState({stores: []})
			})
	}
	
	requestCameraPermission = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({
			hasCameraPermission: status === 'granted',
		});
	}
	
	startScanning = () => {
		this.setState({scan: true})
	}
	
	cancelScan = () => {
		this.setState({scan: false})
	}
	
	renderData = () => {
		const {data} = this.state
		const { order_name, products, customer, order_value } = data
		if ( order_name && products ) {
			return (
				<View style={{flex: 1, marginTop: 30}}>
					<Text style={{marginBottom: 15, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>{order_name}</Text>
					<View style={styles.headerContainer}>
						<Text style={{fontSize: 18, marginLeft: 35, flex: 1, fontWeight: 'bold'}}>{customer}</Text>
						<Text style={{fontSize: 18, marginRight: 35, fontWeight: 'bold', color: '#96be4f'}}>{order_value}</Text>
					</View>
					{
						products.map( (item, index) =>
							<ListItem
								containerStyle={{ marginLeft: 15, marginRight: 15 }}
								underlayColor='#7a7a7a'
								key={index}
								title={`${item.quantity} X ${item.product}`}
								subtitle={''}
								titleStyle={styles.listItem}
								hideChevron={true}
								onPress={() => { return false }}
							/>
						)
					}
				</View>
			)
		} else {
			return null
		}
	}
	
	scanCode = result => {
		this.getData(result.data)
	}
	
	getData = code => {
		const filteredObj = this.state.stores.filter( obj => obj.active)
		const { domain, apiKey, apiPass } = filteredObj[0]
		promiseRequest('GET',  Api(domain, apiKey, apiPass, code))
			.then( resp => {
				if(resp.success) {
					this.setState({
						data: resp,
						scan: false
					})
				} else {
					this.setState({
						errMessage: 'No items with the requested data',
						scan: false
					})
				}
				
			})
			.catch( err => {
				console.log('err', err)
			})
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
	      {
	      	this.state.hasCameraPermission ?
			      this.renderData()
		      :
		        <Text>No camera permission</Text>
	      }
	      {
	      	this.state.errMessage ?
			      <View style={{flex: 1, marginTop: 30}}>
				      <Text style={{marginBottom: 15, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>{this.state.errMessage}</Text>
			      </View>
		      :
			      null
	      }
	      <View style={styles.btnContainer}>
	        <Button
		        containerViewStyle={styles.buttonContainer}
		        borderRadius={50}
		        textStyle={{color: '#FFF'}}
		        backgroundColor={'#96be4f'}
		        rightIcon={{type: 'material-community',name: 'qrcode'}}
		        title='Scan'
		        onPress={this.startScanning}/>
		      {
			      this.state.scan ?
				      <View style={styles.btnContainer}>
					      <BarCodeScanner
						      onBarCodeRead={this.scanCode}
						      style={{
						        flex: 1,
							      height: Dimensions.get('window').height,
							      width: Dimensions.get('window').width,
						      }}
					      />
					      <Button
						      containerViewStyle={styles.buttonContainer}
						      borderRadius={50}
						      textStyle={{color: '#FFF'}}
						      backgroundColor={'#f44336'}
						      rightIcon={{type: 'material-community',name: 'cancel'}}
						      title='Cancel'
						      onPress={this.cancelScan}/>
				      </View>
			      :
		          null
		      }
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
	buttonContainer: {
  	height: 50,
		width: 200,
		position: 'absolute',
		bottom: 50,
		borderRadius: 5
	},
	btnContainer: {
  	flex: 1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 50,
		marginBottom: 30
	},
	listItem: {
		fontSize: 16,
		color: '#666'
	},
});
