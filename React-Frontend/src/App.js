import React, { useState, useCallback, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

// import Users from "./users/pages/Users";
// import NewPlace from "./places/pages/NewPlace";
// import UserPlaces from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./users/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

let logoutTimer;

const App = () => {
  const Users = React.lazy(() => import("./users/pages/Users"));
  const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
  const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
  const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
  const Auth = React.lazy(() => import("./users/pages/Auth"));

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [expirationTimeDate, setExpirationTimeDate] = useState(null);

  const login = useCallback((uid, token, expirationTime) => {
    setToken(token);
    setUserId(uid);
    const expirationTimeDate =
      expirationTime || new Date(new Date().getTime() + 1000 * 60 * 60);
    setExpirationTimeDate(expirationTimeDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: expirationTimeDate.toISOString(), // converts the date to string later convert back to date by passing the string to new Date() as a constructor
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setExpirationTimeDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && expirationTimeDate) {
      const remainingTime =
        new Date(expirationTimeDate).getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, expirationTimeDate]);

  useEffect(() => {
    let storage = JSON.parse(localStorage.getItem("userData"));
    if (storage && storage.token) {
      if (new Date(storage.expiration) > new Date()) {
        login(storage.userId, storage.token, new Date(storage.expiration));
      }
    }
  }, [login, logout]);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/place/new" exact>
          <NewPlace />
        </Route>
        <Route path="/place/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
