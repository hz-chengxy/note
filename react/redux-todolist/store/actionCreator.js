const removeAction = (index) => {
  return {
    type: 'REMOVE_DATA',
    index
  }
}

const putdataAction = task => {
  return {
    type: 'PUT_DATA',
    task
  }
}

const setdataAction = data => {
  return {
    type: 'SET_DATA',
    data
  }
}

// thunk中间件的意义就是：1、return了一个函数出去，而不一定非要是扁平对象。 2、挂载上了dispatch这个方法，可以异步方法转到正常的同步方法，相当于vue中的action =》 mutation
const loaddataAction = () => {
  return dispatch => {
    fetch('/position.json')
      .then(response => response.json())
      .then(result => {
        dispatch(setdataAction(result.result))
      })
  }
}

export {
  removeAction,
  putdataAction,
  loaddataAction,
  setdataAction
}