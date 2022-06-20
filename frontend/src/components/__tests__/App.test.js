import 'setimmediate'
setImmediate(() => {
  setTimeout
});

import React from "react"
import {render, screen, cleanup, fireEvent, queryByAttribute} from "@testing-library/react"
import "@testing-library/jest-dom"
import App from "../../App"
const getById = queryByAttribute.bind(null, 'id');


describe("App Componet", () => {

    it("should see 'Speed Typing Test", () => {
        render(<App />);
        expect(screen.getByText('Speed Typing Test')).toBeInTheDocument();
    })

    it("should click in register icon", () => {
        const dom = render(<App />);
        const register = getById(dom.container, '2');
        fireEvent.click(register);
        expect(screen.getByText('Please enter your details')).toBeInTheDocument();
    })

    it("should write nickname into register nickname input", () => {
        const dom = render(<App />);
        const nickname = getById(dom.container, 'email');
        fireEvent.change(nickname, {target: {value: "test12"}} );
        expect(nickname.value).toBe("test12");
    })

    it("should write password into register password input", () => {
      const dom = render(<App />);
      const password1 = getById(dom.container, 'password');
      fireEvent.change(password1, {target: {value: "test12"} });
      expect(password1.value).toBe("test12");
    })

    it("should repeat password into register password repeat input", () => {
      const dom = render(<App />);
      const password2 = getById(dom.container, 'passwordRepeat');
      fireEvent.change(password2, {target: {value: "test12"} });
      expect(password2.value).toBe("test12");
    })

    it("should click register button",  () => {
        const dom = render(<App />);
        const button = getById(dom.container, 'register');
        fireEvent.click(button);
        
    })

    it('calls reload function', () => {
      window.location.reload(true);
    });


    it("should click in login icon", () => {
      const dom = render(<App />);
      const login = getById(dom.container, '1');
      fireEvent.click(login);
      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    })

    it("should write nickname into login nickname input", () => {
      const dom = render(<App />);
      const nickname = getById(dom.container, 'email');
      fireEvent.change(nickname, {target: {value: "test"} });
      expect(nickname.value).toBe("test");
    })

    it("should write password into login password input", () => {
      const dom = render(<App />);
      const password = getById(dom.container, 'passwordLog');
      fireEvent.change(password, {target: {value: "test"} });
      expect(password.value).toBe("test");
    })

    
    it("should click login button",  () => {
        const dom = render(<App />);
        const button = getById(dom.container, 'login');
        fireEvent.click(button);
    })

    it("should see 5 icons",  () => {
      const dom = render(<App />);
      const icons = dom.container.getElementsByClassName('nav-text');
      expect(icons.length).toBe(5);
   })


   it("should click singleplayer icon", () => {
    const dom = render(<App />);
    const singleplayer = getById(dom.container, '2');
    fireEvent.click(singleplayer);
    expect(screen.getByText("Press play when you are ready to start")).toBeInTheDocument();
  })

  it("should click play", () => {
    const dom = render(<App />);
    const button = dom.container.getElementsByClassName('replay');
    fireEvent.click(button);
    const panel = dom.container.getElementsByClassName('gamePanel');
    expect(panel).toBeInTheDocument();
  })

  it("should click multiplayer icon", () => {
    const dom = render(<App />);
    const multiplayer = getById(dom.container, '1');
    fireEvent.click(multiplayer);
    expect(screen.getByText("Press button to create new room:")).toBeInTheDocument();
  })

  it("should click Create New Room", () => {
    const dom = render(<App />);
    const button = dom.container.getElementsByClassName('multi');
    fireEvent.click(button);
    expect(screen.getByText("To play with friends send them this code:")).toBeInTheDocument();
  })

  it("should click settings icon", () => {
    const dom = render(<App />);
    const settings = getById(dom.container, '3');
    fireEvent.click(settings);
    const panel = dom.container.getElementsByClassName('userData');
    expect(panel).toBeInTheDocument();
  })

  it("should click home icon", () => {
    const dom = render(<App />);
    const home = getById(dom.container, '1');
    fireEvent.click(home);
    expect(screen.getByText('Speed Typing Test')).toBeInTheDocument();
  })

  it("should click logout icon", () => {
    const dom = render(<App />);
    const home = getById(dom.container, '4');
    fireEvent.click(home);
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  })



})



