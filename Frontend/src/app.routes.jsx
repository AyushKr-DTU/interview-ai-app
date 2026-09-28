import { createBrowserRouter } from 'react-router'
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Logout from "./features/auth/pages/Logout";
import Protected from "./features/auth/components/protected";
import Landing from "./features/landing/Landing";
import Home from "./features/interview/pages/home";
import Interview from "./features/interview/pages/interview";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/logout",
        element: <Logout />
    },
    {
        path: "/app",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    }
])
