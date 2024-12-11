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
import ProtectedRoute from "./components/ProtectedRoute";
import MentorList from "./pages/MentorList";
import { saveDepartments } from "./components/SaveDepartments";
import Chatting from "./pages/Chatting";

function App() {
  saveDepartments();

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
              <Route
                path="/mentorList"
                element={
                  <ProtectedRoute>
                    <MentorList />
                  </ProtectedRoute>
                }
              ></Route>

              {/*프로필 관련 라우팅*/}
              <Route path="/profile">
                <Route path="mentor/:nickname" element={<MentorProfile />} />
                <Route path="mentor/edit" element={<EditMentorProfile />} />
                <Route path="mentee/:nickname" element={<MenteeProfile />} />
                <Route path="mentee/edit" element={<EditMenteeProfile />} />
              </Route>

              {/*설정 관련 라우팅*/}
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

              {/*채팅방 라우팅*/}
              <Route path="/chat" element={<Chatting />}></Route>
            </Route>

            {/*회원가입 관련 라우팅*/}
            <Route path="/join/agree" element={<SignupAgree />} />
            <Route path="/join/info" element={<Signup />} />
            <Route path="/join/info2" element={<Signup2 />} />
            <Route path="/join/roleSelect" element={<SignupRoleSelect />} />

            {/*로그인 관련 라우팅*/}
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
