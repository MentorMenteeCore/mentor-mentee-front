import { useState } from "react";
import { Link } from "react-router-dom";

const SignupRoleSelect = () => {
  const [currentImage, setCurrentImage] = useState("/role.png");

  const handleMouseEnter = (image) => {
    setCurrentImage(image);
  };

  const handleMouseLeave = (image) => {
    setCurrentImage("/role.png");
  };

  const handleClick = (event) => {
    event.preventDefault();
    window.location.href = "/join/info";
  };
  return (
    <>
      <div className="">
        <div className="flex justify-center pt-4">
          <Link to={"/"} className="text-3xl">
            LOGO
          </Link>
        </div>
        <div className="flex h-[calc(100vh-100px)] items-center">
          <div className="w-full flex justify-between">
            <div className="flex w-full justify-center items-center">
              <h2
                onClick={handleClick}
                className="text-[64px] cursor-pointer"
                onMouseEnter={() => handleMouseEnter("/role-grad.png")}
                onMouseLeave={handleMouseLeave}
              >
                Mentor
              </h2>
            </div>
            <div className="">
              <img
                src={currentImage}
                alt="Role"
                className="w-[300px] h-[300px] object-cover"
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <h2
                onClick={handleClick}
                className="text-[64px] cursor-pointer"
                onMouseEnter={() => handleMouseEnter("/role-stu.png")}
                onMouseLeave={handleMouseLeave}
              >
                Mentee
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupRoleSelect;
