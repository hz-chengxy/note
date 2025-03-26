import { createContext } from 'react'

let { Provider, Consumer } = createContext({show: 'false'})

export {
  Provider,
  Consumer
}