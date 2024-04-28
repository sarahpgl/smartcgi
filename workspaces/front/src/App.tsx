import { RecoilRoot } from 'recoil'
import './App.css'
import { SocketManagerProvider } from './components/websocket/SocketManagerProvider'
import Test from './components/game/test'

function App() {
  return (
    <>
    <h1> App </h1>
      <RecoilRoot>
        <SocketManagerProvider>
          <div>Hello</div>
          <Test/>
        </SocketManagerProvider>
<div> Hello </div>
      </RecoilRoot>
    </>
  )
}

export default App
