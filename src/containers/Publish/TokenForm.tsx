import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Typography, Checkbox, FormControlLabel, IconButton } from "@material-ui/core";
import { useRecoilState, useRecoilValue } from "recoil";
import * as style from "./style.scss";
import { currentTokenState, accountsInfoQuery } from "state/clientJs";
import ErrorBoundary from "components/ErrorBoundary";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import App from "@triply/client.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface Props {}
const TokenForm: React.FC<Props> = () => {
  const [token, setToken] = useRecoilState(currentTokenState);
  const accounts = useRecoilValue(accountsInfoQuery);
  // The first account is always the token owner
  const tokenOwner = accounts[0];

  const [shouldStoreToken, setShouldStoreToken] = React.useState(true);
  const [currentTokenValue, setCurrentTokenValue] = React.useState("");
  const [tokenError, setTokenError] = React.useState<string>();

  const [state, setState] = React.useState({
    source: "",
  });
  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

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
          <div className={style.tokenForm}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="source-native-simple">Token source</InputLabel>
              <Select
                native
                value={state.source}
                onChange={handleChange}
                inputProps={{
                  name: "source",
                  id: "source-native-simple",
                }}
              >
                <option aria-label="None" value="" />
                <option value={10}>PLDN</option>
                <option value={20}>Kadaster</option>
              </Select>
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
