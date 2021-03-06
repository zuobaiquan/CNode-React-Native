import React, {PropTypes, Component}from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native'
import moment from 'moment'
import 'moment/locale/zh-cn'
import {night, light} from './styles'
import IconButton from '../../../base/IconButton'
import {post} from '../../../utils/network'
import {URL_PREFIX} from '../../../constant/Constant'
moment.locale('zh-cn')

class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_collect: props.is_collect
        }
        this._onPressHandler = this._onPressHandler.bind(this)
        this._checkIsLogin = this._checkIsLogin.bind(this)
    }

    static contextTypes = {
        navigation: PropTypes.object
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            is_collect: nextProps.is_collect
        })
    }

    render() {
        const {author, create_at} = this.props;
        const styles = this.props.setting.night ? night : light;
        return (
            <View style={styles.headerContainer}>
                <Image
                    style={styles.avatar}
                    source={{uri: author.avatar_url}}
                />
                <View style={styles.contentContainer}>
                    <Text style={styles.contentText}>{author.loginname}</Text>
                    <Text style={styles.contentText}>创建于:{moment(create_at).locale('de').format('ll')}</Text>
                </View>
                <IconButton
                    name="favorite"
                    style={styles.favContainer}
                    selected={this.state.is_collect}
                    onPress={this._onPressHandler}
                    control={true}
                />
            </View>
        );
    }

    _onPressHandler() {
        if (!this._checkIsLogin()) {
            return
        }
        this.operateTopic().then((data) => {
            if (data.success) {
                this.setState({
                    is_collect: !this.state.is_collect
                })
            }
        })

    }

    _checkIsLogin() {
        const {login} = this.props;
        if (!login.isLogin) {
            this.context.navigation.navigate('Login');
            return false
        }
        return true
    }

    async operateTopic() {
        const {id, login} = this.props
        const body = {topic_id: id, accesstoken: login.accessToken}
        let url = URL_PREFIX + '/topic_collect/'
        url += this.state.is_collect ? 'de_collect' : 'collect'
        const data = await post(url, body)
        return data
    }
}

export default Header