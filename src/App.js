// 2、使用配置好的路由对象
import router from './router/index.js'
// <RouterProvider>组件的作用是将路由器对象传递给 React 组件树，使其能够访问路由上下文和相关的路由功能。
import { RouterProvider } from 'react-router-dom';

// 根组件，包含整个应用的主要结构和路由配置
function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
