import { createStore, combineReducers } from './redux.min.js'
import pics from './pics'
import userInfo from './userInfo'

export default createStore(combineReducers({
  pics,
  userInfo
})) 