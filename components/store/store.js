import {createStore, combineReducers, applyMiddleware} from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import tokenReducer from './reducers/reducer';

const chalkReducer = combineReducers({
    tokenReducer
})
const middelware = applyMiddleware(thunk, createLogger());
const store = createStore(chalkReducer, middelware);
store.subscribe = () =>{
    // console.log('Store')
}

export default store;
