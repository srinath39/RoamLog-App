import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

export default function UsersPlace() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const reponse = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(reponse.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  function deletePlace(deleteId) {
    setLoadedPlaces(loadedPlaces.map((prevPlace) => prevPlace.id !== deleteId));
  }

  return (
    <>
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
          <div className="center">
            <LoadingSpinner asOverlay />
          </div>
        )}
        {!isLoading && loadedPlaces && (
          <PlaceList
            items={loadedPlaces}
            userId={userId}
            deletePlace={deletePlace}
          />
        )}
      </React.Fragment>
    </>
  );
}
