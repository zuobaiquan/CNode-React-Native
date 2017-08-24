import React, {Component, PropTypes}from 'react'
import {
    View,
    ListView,
    Image,
    Text,
    ScrollView,
    StyleSheet,
} from 'react-native'
import _ from 'lodash'
import {decorate as mixin} from 'react-mixin'
import TopicListItem from './TopicListItem/TopicListItem'
import TopicListHelper from './TopicListHelper'
import IconButton from '../../base/IconButton'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {night, light}from './style'

const initialState = {
    data: [],
    isFetching: true
}

@mixin(PureRenderMixin)
class TopicList extends Component {

    constructor(props, context) {
        super(props, context);
        this._renderTopicItem = this._renderTopicItem.bind(this)
        this._onEndReachedHandler = this._onEndReachedHandler.bind(this)
        this._renderFooterHandler = this._renderFooterHandler.bind(this)
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
        this.state = initialState
        this.help = new TopicListHelper(props)
    }

    static propTypes = {
        limit: PropTypes.number,
        mdrender: PropTypes.bool,
        tab: PropTypes.string
    }

    static defaultProps = {}

    componentDidMount() {
        this.help.getData({
            page: this.state.data.length
        }).then(data => {
            this.setState({
                data: this.state.data.concat(data),
                isFetching: false
            })
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tab !== this.props.tab) {
            this.help.updateHelper(nextProps)
            this.setState(initialState)
            this.help.getData({
                page: this.state.data.length
            }).then(data => {
                this.setState({
                    data: this.state.data.concat(data),
                    isFetching: false
                })
            })
        }
    }

    render() {
        const {data} = this.state
        const loading = _.isEmpty(this.state.data);
        const styles = this.props.setting.night ? night : light;
        return (
            <View style={styles.container}>
                <ListView
                    style={styles.listView}
                    dataSource={this.dataSource.cloneWithRows(data)}
                    renderRow={this._renderTopicItem}
                    enableEmptySections={true}
                    initialListSize={10}
                    onEndReachedThreshold={0}
                    onEndReached={this._onEndReachedHandler}
                    renderFooter={this._renderFooterHandler}
                />
                {
                    !loading && (
                        <View style={styles.addTopic}>
                            <IconButton
                                name="add-topic"
                            />
                        </View>
                    )
                }
            </View>
        )
    }

    _renderTopicItem(rowData) {
        if (_.isNil(rowData)) {
            return null;
        }
        return (
            <TopicListItem
                {...rowData}
                night={this.props.setting.night}
            />
        );
    }

    _renderFooterHandler() {
        const styles = this.props.setting.night ? night : light;
        if (this.state.isFetching) {
            return (
                <View style={styles.loadingContainer}>
                    <Image
                        source={require('../../asset/image/loading.gif')}
                        style={styles.loading}
                    />
                </View>
            )
        } else {
            return null;
        }
    }

    _onEndReachedHandler() {
        this.setState({
            isFetching: true
        })
        this.help.getData({
            page: this.state.data.length
        }).then(data => {
            this.setState({
                data: this.state.data.concat(data),
                isFetching: false
            })
        })
    }
}

export default TopicList