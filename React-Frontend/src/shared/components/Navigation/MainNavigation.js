import React from "react";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./MainNavigation.css";

export default function MainNavigation() {
  const [bool, setBool] = useState(false);
  return (
    <>
      {bool && (
        <Backdrop
          onClick={() => {
            setBool(false);
          }}
        />
      )}
      <SideDrawer show={bool} reset={() => setBool(false)}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={() => {
            setBool(true);
          }}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">RoamLog</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
}
