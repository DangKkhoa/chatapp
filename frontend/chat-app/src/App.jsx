import Chatroom from "./component/chat/Chatroom";
import Register from "./component/auth/Register";
import Login from "./component/auth/Login";

// import { Navigate } from "react-router-dom";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useParams,
} from "react-router-dom";
import PrivateChats from "./component/chat/PrivateChats";

const ProtectedChatroom = () => {
  const { type, id } = useParams();

  if(!id || type != "public" && type != "private") {
    console.log(id);
    return <Navigate to="/chat" replace/>
  }

  return <Chatroom />
}

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
    element: <Chatroom />
  },
  {
    path: "/chat/:type/:id",
    element: <Chatroom />
  },

]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;