import SERVER from "../server/index"
const INITIAL_STATE = {
  datas: []
}
const Pics = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "MODIFY_PICS": {
      let { datas } = action
      return Object.assign({}, state, { datas })
    }
    default: {
      return state
    }
  }
}
export default Pics
