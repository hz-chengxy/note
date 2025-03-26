import React, { Component, createContext } from 'react'

const {
  Provider,
  Consumer: CountConsumer
} = createContext({ // 定义了默认值，当未被provider包裹时，也可以直接使用consumer包裹获取默认值和默认函数。
  count: 100,
  increment: () => { console.log(0) },
  decrement: () => { console.log(1) }
})

class CountProvider extends Component {
  constructor(props) {
    super(props)
    this.increment = this.increment.bind(this)
    this.decrement = this.decrement.bind(this)
  }

  state = {
    count: 0
  }

  increment(args) {
    this.setState(state => ({
      count: state.count + args
    }))
  }

  decrement(args) {
    this.setState(state => ({
      count: state.count - args
    }))
  }

  render() {
    return (
      <Provider value={{
        count: this.state.count,
        increment: this.increment,
        decrement: this.decrement
      }}>
        {this.props.children}
      </Provider>
    )
  }
}

export { // 此函数向外暴露一个定义好的provider和起过别名的consumer，provider定义好了完整的count和增减函数。
  CountProvider,
  CountConsumer
}

