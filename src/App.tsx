import CityPicker from './components/cityForm'
import Index from './components/index'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/select-location",
    element: <CityPicker />,
  }
]);

function App() {

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
