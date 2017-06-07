import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native'
import {Provider, connect} from 'react-redux'
import {StackNavigator} from 'react-navigation'
import configureStore from './store'
import Portal from './base/Portal'

import UserContent from './component/UserContent'
import TopicDetail from './container/TopicDetailContainer'

import Home from './container/HomeContainer'
import Login from './container/LoginContainer'

const store = configureStore()


const NavigatorApp = StackNavigator({
    Home: {
        screen: Home
    },
    Login: {
        screen: Login
    },
    UserContent: {
        screen: UserContent
    },
    TopicDetail: {
        screen: TopicDetail
    }
})

export default class Enter extends Component {

    render() {
        return (
            <Provider store={store}>
                <View style={{flex: 1}}>
                    <NavigatorApp />
                    <Portal/>
                </View>
            </Provider>
        )
    }
}



