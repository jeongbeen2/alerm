import axios from "axios";
import { useEffect } from "react";
import io from "socket.io-client";
import styled from "@emotion/styled";
import "./reset.css";

import { useState } from "react";

const Body = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(2, 7, 21);
`;

const Contents = styled.div`
  width: 400px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > * {
    margin: 10px 0;
  }
`;

const Title = styled.span`
  color: #fff;
  font-size: 22px;
  font-weight: 700;
`;

const Button = styled.button`
  width: 200px;
  height: 2rem;
  cursor: pointer;
`;

const TimeInput = styled.input`
  width: 200px;
  height: 2rem;
`;

const Home = () => {
  const [time, setTime] = useState("");

  const setNotiButton = async (time) => {
    const instance = axios.create({
      baseURL: "http://localhost:8080",
    });

    instance({
      method: "post",
      url: "/time",
      data: {
        time: time,
      },
    })
      .then((res) => {
        console.log("res: ", res);
      })
      .catch((xhr) => {
        console.log("xhr: ", xhr);
      });
  };

  useEffect(() => {
    const socket = io("http://localhost:8080");
    socket.on("notification", (notification) => {
      console.log("Received notification:", notification);
      alert("notification:::", notification);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Body>
        <Contents>
          <Title>시간을 지정해주세요.</Title>
          <TimeInput
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              console.log("time:: ", time);
              setNotiButton(time);
            }}
          >
            Submit
          </Button>
        </Contents>
      </Body>
    </>
  );
};

export default Home;
