import { createStore, combineReducers } from './redux.min.js'
import pics from './pics'

export default createStore(combineReducers({
  pics: pics
})) 