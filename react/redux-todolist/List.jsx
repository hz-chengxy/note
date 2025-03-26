import React, { Component } from 'react'

import { connect } from 'react-redux'

import { 
  removeAction,
  loaddataAction
} from './store/actionCreator'

// 映射State到当前组件的Props上
const mapState = state => {
  return {
    list: state.list
  }
}

const mapDispatch = dispatch => {
  return {
    remove(index) {
      dispatch(removeAction(index))
    },

    loadData() {
      dispatch(loaddataAction())
    }
  }
}

@connect(mapState, mapDispatch)
class List extends Component {
  handleClick = (index) => {
    return () => {
      this.props.remove(index)
    }
  }

  componentDidMount() {
    this.props.loadData()
  }

  render() {
    return (
      <ul>
        {
          this.props.list.map((value, index) => {
            let {
              positionId,
              positionName
            } = value
            
            return (
              <li 
                key={positionId}
              >
                {positionName} 
                <button onClick={this.handleClick(index)}>remove</button>
              </li>
            )
          })
        }
      </ul>
    )
  }
}

// 这个connect方法第一次调用的返回值是个高阶组件
export default List
