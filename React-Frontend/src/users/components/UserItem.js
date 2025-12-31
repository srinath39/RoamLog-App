import React from "react";
import { Link } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import Avatar from "../../shared/components/UIElements/Avatar";
import "./UserItem.css";

export default function UserItem(props) {
  return (
    <>
      <li className="user-item">
        <Card className={"user-item__content"}>
          <Link to={`/${props.id}/places`}>
            <div className="user-item__image">
              <Avatar
                src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
                alt={props.name}
              />
            </div>
            <div className="user-item__info">
              <h2>{props.name}</h2>
              <h3>
                {props.photocount.length}{" "}
                {props.photocount.length === 1 ? "place" : "places"}
              </h3>
            </div>
          </Link>
        </Card>
      </li>
    </>
  );
}
