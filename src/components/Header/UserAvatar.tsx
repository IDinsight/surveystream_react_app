import styled from "styled-components";

const AvatarWrapper = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #fb8c14;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 300;
  font-family: "Lato", sans-serif;
  font-size: 15px;
`;

function getInitials(name: string) {
  const nameArray = name.split(" ");
  const initials = nameArray.map((word: string) =>
    word.charAt(0).toUpperCase()
  );
  return initials.join("");
}

function UserAvatar({ name }: { name: string }) {
  const initials = getInitials(name);

  return <AvatarWrapper>{initials}</AvatarWrapper>;
}

export default UserAvatar;
