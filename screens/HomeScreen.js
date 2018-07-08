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

import { Button } from 'react-native-elements'

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
					<Text style={{marginBottom: 15, fontSize: 20, fontWeight: 'bold'}}>{order_name}</Text>
					<View style={styles.headerContainer}>
						<Text style={{fontSize: 16, marginLeft: 20, flex: 1, fontWeight: 'bold'}}>{customer}</Text>
						<Text style={{fontSize: 16, marginRight: 20, fontWeight: 'bold', color: '#96be4f'}}>{order_value}</Text>
					</View>
					{
						products.map( (item, index) =>
							<Text
								key={index}
								style={{fontSize: 14}}>
								{item.quantity} X ${item.product}
							</Text>
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
		console.log('Api', Api(domain, apiKey, apiPass, code))
		promiseRequest('GET', Api(domain, apiKey, apiPass, code))
			.then( resp => {
				console.log(resp)
				this.setState({
					data: resp,
					scan: false
				})
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
			      <Text>Error: this.state.errorMessage</Text>
		      :
			      null
	      }
	      <View style={styles.btnContainer}>
	        <Button
		        containerViewStyle={styles.buttonContainer}
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
						      containerViewStyle={[styles.buttonContainer]}
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
		width: 100,
		position: 'absolute',
		bottom: 50
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
});
