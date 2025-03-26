import React, { Component } from 'react'

import { CountConsumer } from './Count'
import { Consumer as ShowConsumer } from './showContext'

export default class ChildHood extends Component {
  render() {
    return (
      <div>
        {/* 用CountConsumer取Count中的count变量与对应的增减函数 */}
        <CountConsumer>
          {
            ({count, increment, decrement}) => {
              return (
                <>
                  <div>
                    <button onClick={() => decrement(2)}>-</button>
                  </div>
                  <ShowConsumer>
                    {/* 另一个consumer，因为为被另一套provider包裹，所以只能取createContext中定义的默认值，若未定义默认值，则会报错。 */}
                    {
                      (value) => (
                        <div>{count} / {value.show}</div>
                      )
                    }
                  </ShowConsumer>
                  <div>
                    <button onClick={() => increment(3)}>+</button>
                  </div>
                </>
              )
            }
          }
          
        </CountConsumer>
      </div>
    )
  }
}
