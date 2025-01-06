import React from 'react'
import {Route,Routes} from "react-router-dom"
import HomePage from "./pages/Homepage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import TransactionPage from "./pages/TransactionPage"
import Header from "./components/ui/Header"
import NotFound from "./pages/NotFound"

const App = () => {
  const authUser = true;

  return (
    <>
			{authUser && <Header />}
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/transaction/:id' element={<TransactionPage />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</>
  )
}

export default App