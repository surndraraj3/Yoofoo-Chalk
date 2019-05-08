const initialState = {
  authToken: ""
};

export default function tokenReducer(state = initialState, action) {
    let st = state;
    switch (action.type) {
      case 'LoginToken': {
        st = { ...state, authToken: action.payload};
        console.log('st', st);
        break;
      }
      case 'GetTokenValue': {
          st = {...state}
      }
  
      default: {
        return st;
      }
    }
    return st;
  }
// export default tokenReducer;
