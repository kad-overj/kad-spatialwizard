import * as React from "react";
import {
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
  NativeSelect,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@material-ui/core";
import { useRecoilState, useRecoilValue } from "recoil";
import * as style from "./style.scss";
import { currentTokenState, accountsInfoQuery } from "state/clientJs";

import ErrorBoundary from "components/ErrorBoundary";

import App from "@triply/client.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { pldnToken } from "tokensources";

export interface Props {}
const TokenForm: React.FC<Props> = () => {
  let tokenObj = pldnToken[0];
  const [token, setToken] = useRecoilState(currentTokenState);
  const accounts = useRecoilValue(accountsInfoQuery);
  // The first account is always the token owner
  const tokenOwner = accounts[0];

  const [shouldStoreToken, setShouldStoreToken] = React.useState(true);
  const [currentTokenValue, setCurrentTokenValue] = React.useState("");

  const [tokenError, setTokenError] = React.useState<string>();
  const [state, setState] = React.useState<{ id: string | number; source: string }>({
    id: "",
    source: "",
  });
  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof state;
    setState({
      ...state,
      [name]: event.target.value,
    });
    if (event.target.value == "default") {
      setCurrentTokenValue(tokenObj.value);
    } else {
      setCurrentTokenValue("");
    }
  };

  let helperText;
  if (state.source == "Kadaster") {
    helperText = (
      <FormHelperText>
        Create a new token from {/* TODO: Create a config */}
        <a href="https://data.labs.kadaster.nl/login?returnTo=/me/-/settings/tokens" target="_blank">
          {state.source}
        </a>
      </FormHelperText>
    );
  }
  if (state.source == "PLDN") {
    helperText = (
      <FormHelperText>
        Create a new token from {/* TODO: Link to PLDN API */}
        <a href="https://data.pldn.nl/login?returnTo=/me/-/settings/tokens" target="_blank">
          {state.source}
        </a>
      </FormHelperText>
    );
  }
  const loadToken = async () => {
    try {
      const app = App.get(currentTokenValue);
      // Lets check if the endpoint is configured correctly
      await app.getApiInfo();
      if (shouldStoreToken) localStorage.setItem("token", currentTokenValue);
      setToken(currentTokenValue);
    } catch (e) {
      // This is when the api cannot be found, this means either an old token or that the API is down
      if (e.message === "info is null") {
        setTokenError("This token cannot be use please create a new one");
      } else if (e.message === "Invalid token") {
        setTokenError(e.message);
      } else {
        throw e;
      }
    }
  };

  return (
    <ErrorBoundary>
      {!!token && (
        <div className={style.loadedTokenMessage}>
          <Typography>{`Using token of account ${tokenOwner?.name || tokenOwner?.accountName}`}</Typography>
          <IconButton
            title="Forget token"
            onClick={() => {
              localStorage.removeItem("token");
              setToken("");
            }}
          >
            <FontAwesomeIcon icon="times" size="sm" />
          </IconButton>
        </div>
      )}
      {!token && (
        <form
          className={style.tokenForm}
          onSubmit={(e) => {
            e.preventDefault();
            return loadToken();
          }}
        >
          <div>
            <FormControl className={style.tokenControl}>
              <InputLabel htmlFor="source-native-helper">Token account</InputLabel>
              <NativeSelect
                value={state.source}
                onChange={handleChange}
                inputProps={{
                  name: "source",
                  id: "source-native-helper",
                }}
              >
                <option>Select Account</option>
                <option value={"default"}>Spatial Wizard(PLDN)</option>
                <option value={"Kadaster"}>Kadaster</option>
                <option value={"PLDN"}>PLDN</option>
              </NativeSelect>
              {helperText}
            </FormControl>
          </div>
          <div className={style.tokenField}>
            <TextField
              fullWidth
              label="Token"
              name="token"
              value={currentTokenValue}
              error={!!tokenError}
              onChange={(event) => {
                setCurrentTokenValue(event.currentTarget.value);
                setTokenError(undefined);
              }}
              helperText={tokenError}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={shouldStoreToken}
                  onChange={(event) => setShouldStoreToken(event.currentTarget.checked)}
                  name="storeToken"
                />
              }
              label="Remember"
            />
          </div>
          <Button type="submit" color="primary" disabled={currentTokenValue.length === 0}>
            Load token
          </Button>
        </form>
      )}
    </ErrorBoundary>
  );
};
export default TokenForm;
