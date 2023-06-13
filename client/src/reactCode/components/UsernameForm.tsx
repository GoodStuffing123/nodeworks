import React from "react";

import styled from "styled-components";

const UsernameFormStyles = styled.div`
  position: absolute;
  left: 50vw;
  top: 50vh;
  transform: translate(-50%, -50%);

  text-align: center;

  input[type="text"] {
    text-align: center;
  }
`;

const UsernameForm = ({
  username,
  setUsername,
  onSubmit,
}: {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <UsernameFormStyles>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="username"
          required={true}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br />

        <button type="submit">Connect</button>
      </form>
    </UsernameFormStyles>
  );
};

export default UsernameForm;
