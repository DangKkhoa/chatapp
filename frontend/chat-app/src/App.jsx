import Chatroom from "./component/chat/Chatroom";
import Register from "./component/auth/Register";
import Login from "./component/auth/Login";


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

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
    path: "/:id",
    element: <Chatroom/>
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