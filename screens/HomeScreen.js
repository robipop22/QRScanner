import React from 'react';
import {
  StyleSheet,
  View,
	Text,
	LayoutAnimation,
	Dimensions
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
			errMessage: null
		}
	}
	
  static navigationOptions = {
    header: null,
  }
	
	componentDidMount() {
		this.requestCameraPermission()
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
		const { order_name, products } = data
		if ( order_name && products ) {
			return (
				<View style={{flex: 1, marginTop: 30}}>
					<Text style={{marginBottom: 15, fontSize: 16}}>{order_name}</Text>
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
		promiseRequest('GET', Api())
			.then( resp => {
				this.setState({
					data: resp,
					scan: false
				})
			})
			.catch( err => {
			
			})
	}

  render() {
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
        <Button
	        containerViewStyle={styles.buttonContainer}
	        large
	        rightIcon={{type: 'material-community',name: 'qrcode'}}
	        title='Scan'
	        onPress={this.startScanning}/>
	      {
		      this.state.scan ?
			      <View>
				      <BarCodeScanner
					      onBarCodeRead={this.scanCode}
					      style={{
					        flex: 1,
						      height: Dimensions.get('window').height,
						      width: Dimensions.get('window').width,
					      }}
				      />
				      <Button
					      containerViewStyle={[styles.buttonContainer, {bottom: 100}]}
					      large
					      rightIcon={{type: 'material-community',name: 'cancel'}}
					      title='Cancel'
					      onPress={this.cancelScan}/>
			      </View>
		      :
	          null
	      }
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
	  alignItems: 'center',
	  paddingTop: Constants.statusBarHeight,
	  backgroundColor: '#ecf0f1',
  },
	buttonContainer: {
  	height: 30,
		width: 100,
		position: 'absolute',
		alignSelf: 'center',
		bottom: 50
	}
});
