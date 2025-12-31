import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceItem.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHistory } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

export default function PlaceItem(props) {
  const auth = useContext(AuthContext);
  const [show, showMap] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [confirm, setConfirm] = useState(false);
  const history = useHistory();

  async function showConfirmation() {
    setConfirm(false);
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      //props.deletePlace(props.id);
      history.push("/" + props.creator);
    } catch (err) {}
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={show}
        onCancel={() => showMap(false)}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={() => showMap(false)}>CLOSE</Button>}
      >
        <div className="map-container">
          <h2>THE MAP!</h2>
        </div>
      </Modal>

      <Modal
        show={confirm}
        onCancel={() => setConfirm(false)}
        header={"Are you sure?"}
        footerClass={"place-item__modal-actions"}
        footer={
          <React.Fragment>
            <Button inverse onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button danger onClick={showConfirmation}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to Proceed and Delete this place ?</p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={() => showMap(true)}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creator && auth.isLoggedIn && (
              <Button to={`/place/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creator && auth.isLoggedIn && (
              <Button danger onClick={() => setConfirm(true)}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
}
