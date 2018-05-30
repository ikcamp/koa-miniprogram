const INITIAL_STATE = {
    datas: null
  }
  const User = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "MODIFY_USER": {
        let { datas } = action
        return Object.assign({}, state, { datas })
      }
      default: {
        return state
      }
    }
  }
  export default User
  