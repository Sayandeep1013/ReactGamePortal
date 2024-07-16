import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FaUser, FaRobot, FaCog, FaSignOutAlt } from "react-icons/fa";

const ProfileContainer = styled.div`
  position: relative;
`;

const AvatarButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: none;
  padding: 0;
  background: none;
  position: relative;
  z-index: 2; /* Ensure it is above the sidebar */
}
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #202123;
  border-radius: 10px;
  padding: 8px 0;
  margin-top: 8px;
  width: 220px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  z-index: 2;
`;

const UserGreeting = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 12px;
  }

  span {
    color: #fff;
    font-size: 14px;
  }
`;

const Separator = styled.div`
  height: 1px;
  background-color: #4d4d4f;
  margin: 8px 16px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #2a2b32;
    border-radius: 10px;
  }

  svg {
    margin-right: 12px;
    font-size: 16px;
  }
`;

const LogoutItem = styled(MenuItem)`
  color: #ec5e5e;
`;

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ProfileContainer ref={dropdownRef}>
      <AvatarButton onClick={toggleMenu}>
        <AvatarImage src="/public/UserPfp.jpg" alt="User" />
      </AvatarButton>
      {isOpen && (
        <DropdownMenu>
          <UserGreeting>
            <img src="/public/UserPfp.jpg" alt="User" />
            <span>Hello Rein!</span>
          </UserGreeting>
          <Separator />
          <MenuItem>
            <FaUser />
            User Profile
          </MenuItem>
          <MenuItem>
            <FaRobot />
            Budući
          </MenuItem>
          <MenuItem>
            <FaCog />
            Settings
          </MenuItem>
          <Separator />
          <LogoutItem>
            <FaSignOutAlt />
            Log out
          </LogoutItem>
        </DropdownMenu>
      )}
    </ProfileContainer>
  );
};

export default UserProfile;
