import {createStore,applyMiddleware,compose} from 'redux'
import logger from 'redux-logger'
import rootReducer from '../reducer'
import thunk from 'redux-thunk'
import {autoRehydrate} from 'redux-persist-immutable'


const middlewares = [thunk]

if(process.env.NODE_ENV == 'development'){
    middlewares.push(logger)
}
const createStoreWithMiddleware = compose(applyMiddleware(...middlewares),
    window.devToolsExtension ? window.devToolsExtension() : f => f)(createStore)

const configureStore = (initialState)=>{
    return createStoreWithMiddleware(rootReducer,initialState,compose(autoRehydrate()))
}

export default configureStore