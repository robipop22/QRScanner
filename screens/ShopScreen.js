import React from 'react';
import { StyleSheet, View, Text } from 'react-native'

import { Constants } from 'expo'

import { FormLabel, FormInput, Button } from 'react-native-elements'


export default class ShopScreen extends React.Component {

	static navigationOptions = ({ navigation }) => ({
		title: `${navigation.state.params.title}`,
		headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
		headerStyle:{
			backgroundColor:'white',
		},
	});
	
	constructor (props) {
		super(props)
		this.state = {
			name: this.props.navigation.state.params.name ? this.props.navigation.state.params.name : '',
			domain: this.props.navigation.state.params.domain ? this.props.navigation.state.params.domain : '',
			apiKey: this.props.navigation.state.params.apiKey ? this.props.navigation.state.params.apiKey : '',
			apiPass: this.props.navigation.state.params.apiPass ? this.props.navigation.state.params.apiPass : ''
		}
	}
	
	updateName = (name) => {
		this.setState({name})
	}
	
	updateDomain = (domain) => {
		this.setState({domain})
	}
	
	updateKey = (apiKey) => {
		this.setState({apiKey})
	}
	
	updatePass = (apiPass) => {
		this.setState({apiPass})
	}
	
	handleAdd = () => {
	
	}
	
	handleRemove = () => {
	
	}
	
	render() {
		const { name, domain, apiKey, apiPass } = this.state
		return (
			<View style={styles.container}>
				<FormLabel>Name</FormLabel>
				<FormInput
					onChangeText={this.updateName}
					textInputRef={'name'}
					defaultValue={name}
				/>
				<FormLabel>Domain</FormLabel>
				<FormInput
					onChangeText={this.updateDomain}
					textInputRef={'domain'}
					defaultValue={domain}
				/>
				<FormLabel>Api Key</FormLabel>
				<FormInput
					onChangeText={this.updateKey}
					textInputRef={'apiKey'}
					defaultValue={apiKey}
				/>
				<FormLabel>Api password</FormLabel>
				<FormInput
					onChangeText={this.updatePass}
					textInputRef={'apiPass'}
					defaultValue={apiPass}
				/>
				<Button
					title={this.props.navigation.state.params.title}
					textStyle={{color: '#FFF'}}
					backgroundColor={'#2E7D32'}
					icon={{name: this.props.navigation.state.params.title === 'Add store' ? 'add' : 'edit'}}
					buttonStyle={[styles.btn, {marginTop: 20, marginBottom: 20}]}
					onPress={this.handleAdd}
				/>
				{
					this.props.navigation.state.params.title === 'Add store' ?
						null
					:
						<Button
							title={'Remove store'}
							textStyle={{color: '#FFF'}}
							backgroundColor={'#b71c1c'}
							buttonStyle={styles.btn}
							icon={{name: 'remove-circle'}}
							onPress={this.handleRemove}
						/>
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
	btn: {
		height: 36,
		marginLeft: 20,
		marginRight: 20,
		width: 200
	},
});