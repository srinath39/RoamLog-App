import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/Validators";
import { VALIDATOR_MINLENGTH } from "../../shared/util/Validators";
import Card from "../../shared/components/UIElements/Card";
import "./placeForm.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";

export default function UpdatePlace() {
  const placeId = useParams().placeId;
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState(null);
  const [formState, inputHandler, setFormData] = useForm({
    inputs: {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    isValid: false,
  });

  useEffect(() => {
    const fetchPlace = async () => {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
      );
      setLoadedPlace(response.place);
      setFormData(
        {
          title: {
            value: response.place.title,
            isValid: true,
          },
          description: {
            value: response.place.description,
            isValid: true,
          },
          address: {
            value: response.place.address,
            isValid: true,
          },
        },
        true
      );
    };
    fetchPlace();
  }, [placeId, sendRequest, setFormData, auth.token]);

  async function submitHandler(e) {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/" + auth.userId + "/places");
    } catch (err) {}
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h1>Could not find Place</h1>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={submitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            placeholder="title"
            label="Title"
            validator={[VALIDATOR_REQUIRE()]}
            errorText="Please Enter a valid Input"
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialIsValid={true}
          />

          <Input
            id="description"
            element="textarea"
            placeholder="description"
            label="description"
            validator={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please Enter a valid Description(Alteast 5 words)"
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialIsValid={true}
          />

          <Input
            id="address"
            element="input"
            type="text"
            placeholder="Address"
            label="Address"
            validator={[VALIDATOR_REQUIRE()]}
            errorText="Please Enter a valid Address"
            onInput={inputHandler}
            initialValue={loadedPlace.address}
            initialIsValid={true}
          />

          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
}
