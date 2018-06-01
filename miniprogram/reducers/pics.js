const INITIAL_STATE = {
  data: []
}
const Pics = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "MODIFY_PICS": return { state, ...action.data }
    default: return state
  }
}
export default Pics
