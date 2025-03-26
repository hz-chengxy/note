const defaultState = {
  list: []
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case 'SET_DATA':
      return {
        ...state,
        list: action.data
      }
    case 'PUT_DATA':
      return {
        list: [
          ...state.list,
          action.task
        ]
      }
    case 'REMOVE_DATA':
      let newList = state.list.filter((value, index) => {
        return index !== action.index
      })
      return {
        ...state,
        list: newList
      }
    default:
      return state
  }
}