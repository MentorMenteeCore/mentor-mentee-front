import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupAgree from "./pages/SignupAgree";
import Signup from "./pages/Signup";
import Signup2 from "./pages/Signup2";
import SignupRoleSelect from "./pages/SignupRoleSelect";
import Signin from "./pages/Signin";
import FindPW from "./pages/FindPW";
import MentorProfile from "./pages/MentorProfile";
import EditMentorProfile from "./pages/EditMentorProfile";
import MenteeProfile from "./pages/MenteeProfile";
import EditMenteeProfile from "./pages/EditMenteeProfile";
import DepartmentHome from "./pages/DepartmentHome";
import SettingInformation from "./pages/SettingInformation";
import SettingNavigation from "./components/SettingNavigation";
import ChangePW from "./pages/ChangePW";
import Home2 from "./pages/Home2";
import DeleteAccount from "./pages/DeleteAccount";
import Header from "./components/Header";
import { AuthProvider } from "./components/AuthProvider";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          {/* <SearchProvider> */}
          <Routes>
            <Route element={<Header />}>
              <Route path="/" element={<Home2 />} />
              <Route
                path="/departmentHome/:departmentId"
                element={
                  <ProtectedRoute>
                    <DepartmentHome />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile">
                <Route
                  path="mentor"
                  element={
                    <ProtectedRoute>
                      <MentorProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="mentor/edit"
                  element={
                    <ProtectedRoute>
                      <EditMentorProfile />
                    </ProtectedRoute>
                  }
                />
                <Route path="mentee" element={<MenteeProfile />} />
                <Route path="mentee/edit" element={<EditMenteeProfile />} />
              </Route>
              <Route element={<SettingNavigation />}>
                <Route
                  path="/setting/information"
                  element={<SettingInformation />}
                />
                <Route path="/setting/change-pw" element={<ChangePW />} />
                <Route
                  path="/setting/delete-account"
                  element={<DeleteAccount />}
                ></Route>
              </Route>
            </Route>
            <Route path="/join/agree" element={<SignupAgree />} />
            <Route path="/join/info" element={<Signup />} />
            <Route path="/join/info2" element={<Signup2 />} />
            <Route path="/join/roleSelect" element={<SignupRoleSelect />} />
            <Route path="/login" element={<Signin />} />
            <Route path="/login/findpw" element={<FindPW />} />
          </Routes>
          {/* </SearchProvider> */}
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
export default App;
