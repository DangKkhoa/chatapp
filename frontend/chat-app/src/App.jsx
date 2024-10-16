import Chatroom from "./component/chat/Chatroom";
import Register from "./component/auth/Register";
import Login from "./component/auth/Login";

// import { Navigate } from "react-router-dom";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import PrivateChats from "./component/chat/PrivateChats";

const router = createBrowserRouter([
  
  {
    path: "/auth/register",
    element: <Register/>,
  },
  {
    path: "/auth/login",
    element: <Login/>
  },
  {
    path: "/",
    element: <Navigate to="/chat" replace/>
  },
  {
    path: "/chat",
    element: <Chatroom/>
  },
  {
    path: "/chat/private/:id",
    element: <PrivateChats />
  }

]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;