import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import BGImage from "./assets/logo_and_bg/BG.jpg";

function App() {
  return (
    <div
      className="flex flex-col items-center w-full bg-cover bg-center h-screen min-h-screen text-white  justify-evenly"
      style={{ backgroundImage: `url(${BGImage})` }}
    >
      <RouterProvider router={router} />
      <Toaster />
    </div>
    // <Router>
    //   <Routes>
    //     <Route path="/home" element={<Home />} />
    //     <Route path="/instruction" element={<Instruction />} />
    //     <Route path="/capture" element={<Capture />} />
    //     <Route path="/submitorretake" element={<SubmitOrRetake />} />
    //     <Route path="/avatar" element={<Avatar />} />
    //     <Route path="/preview" element={<Preview />} />
    //   </Routes>
    // </Router>
    // <>
    // <Home />
    // <Instruction />
    // <Capture />
    // <SubmitOrRetake />
    // <Avatar />
    // <Preview />
    // </>
  );
}

export default App;
