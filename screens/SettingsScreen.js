import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native'

import { Constants } from 'expo'

import { ListItem, Button } from 'react-native-elements'

export default class SettingsScreen extends React.Component {
	static navigationOptions = {
		header: null,
	}
  
  constructor (props) {
    super(props)
    this.state = {
      stores: [
        {
          name: 'tablomag',
          domain: 'domeniu1',
          apiKey: 'cheie',
          apiPass: 'parola'
        },
	      {
		      name: 'tablomag',
		      domain: 'domeniu1',
		      apiKey: 'cheie',
		      apiPass: 'parola',
		      active: true
	      },
	      {
		      name: 'tablomag',
		      domain: 'domeniu1',
		      apiKey: 'cheie',
		      apiPass: 'parola'
	      }
      ]
    }
  }
	
	addShop = () => {
		this.props.navigation.navigate('Shop', {title: 'Add store'})
	}
	
	editShop = (name, domain, apiKey, apiPass) => {
		this.props.navigation.navigate('Shop', {name, domain, apiKey, apiPass, title: 'Edit store'})
	}
	
	renderShop = ({item, i}) => {
		const { name, domain, apiKey, apiPass, active } = item
		return (
			<ListItem
				containerStyle={{ backgroundColor: active ? '#66BB6A' : '#ecf0f1', flex: 1 }}
				underlayColor='#7a7a7a'
				key={i}
				title={name}
				subtitle={domain}
				titleStyle={styles.listItem}
				subtitleStyle={styles.listSubtitle}
				rightIcon={{name: 'edit'}}
				onPress={() => this.editShop(name, domain, apiKey, apiPass)}
			/>
		)
	}

  render() {
  	return (
		  <View style={styles.container}>
			  <View style={styles.headerContainer}>
				  <Text style={{fontSize: 18, marginLeft: 20, flex: 1}}>Your shopify stores</Text>
				  <Button
					  containerStyle={{alignItems: 'center', flex: 1}}
					  buttonStyle={{height: 30}}
					  large
					  title='Add store'
					  backgroundColor={'#03A9F4'}
					  onPress={this.addShop}
				  />
			  </View>
			  <View style={{flex: 1}}>
				  <FlatList
					  removeClippedSubviews={false}
					  keyboardShouldPersistTaps='always'
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
		fontSize: 16,
		color: '#666'
	},
	listSubtitle: {
		fontSize: 14,
		color: '#666666CC'
	}
});