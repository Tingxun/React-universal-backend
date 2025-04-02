import { Navigate } from "react-router-dom";

function RouterAuth({children}) {
  // 登录拦截
  if (!localStorage.getItem('token')) {
    return <Navigate to='/login' replace />
  }else {
    return children;
  }
}

export default RouterAuth;