import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, Auth } from "./pages";
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const queryClient = new QueryClient()
  return <QueryClientProvider client={queryClient}>
    <Suspense fallback={<div> Loading... </div>}>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Suspense>
    <ToastContainer />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
}

export default App;
