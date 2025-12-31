import React from "react";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/Validators";
import Button from "../../shared/components/FormElements/Button";
import "./placeForm.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

export default function NewPlace() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm({
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
      image: {
        value: null,
        isValid: false,
      },
    },
    isValid: false,
  });

  const history = useHistory();

  async function placeSubmitHandler(e) {
    e.preventDefault();
    try {
      let formData = new FormData(); // formData will take only string or encoded values
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value);

      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      history.push("/");
    } catch (err) {}
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <ImageUpload
          errorText={"please provide an image"}
          id={"image"}
          onInput={inputHandler}
        />
        <Input
          id="title"
          element="input"
          type="text"
          placeholder="title"
          label="title"
          validator={[VALIDATOR_REQUIRE()]}
          errorText="Please Enter a valid Input"
          onInput={inputHandler}
        />

        <Input
          id="description"
          element="textarea"
          type="text"
          placeholder="description"
          label="description"
          validator={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please Enter a valid Description(Alteast 5 words)"
          onInput={inputHandler}
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
        />

        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
}
