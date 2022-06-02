import { BrowserRouter, Routes, Route } from "react-router-dom"
import MenuBar from "./components/MenuBar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AuthorizedBar from "./components/AuthorizedBar";
import Logout from "./pages/context/Logout";
import RequireAuth from "./pages/context/RequireAuth";
import "./App.css"
import {useContext} from "react";
import AuthContext from "./pages/context/AuthProvider";
import SpeedTypingTest from "./pages/SpeedTypingTest";
import SpeedTypingTestMultiplayer from "./pages/SpeedTypingTestMultiplayer"


function App() {
  const { auth } = useContext(AuthContext);
  return (
    <div className="App">
      <BrowserRouter>
          {auth?
              (<AuthorizedBar/>)
              : (<MenuBar/>)
          }

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route element={<RequireAuth />}>
            <Route path="/speedTypingTest" element={<SpeedTypingTest />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="/speedTypingTestMultiplayer" element={<SpeedTypingTestMultiplayer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App