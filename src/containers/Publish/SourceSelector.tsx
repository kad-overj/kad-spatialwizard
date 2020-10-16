import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

export default function SourceSelector() {
  const classes = useStyles();
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
  } else {
    helperText = (
      <FormHelperText>
        Create a new token from {/* TODO: Link to PLDN API */}
        <a href="https://data.pldn.nl/login?returnTo=/me/-/settings/tokens" target="_blank">
          {state.source}
        </a>
      </FormHelperText>
    );
  }
  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="source-native-helper">Tokensource</InputLabel>
        <NativeSelect
          value={state.source}
          onChange={handleChange}
          inputProps={{
            name: "source",
            id: "source-native-helper",
          }}
        >
          <option value={"Kadaster"}>Kadaster</option>
          <option value={"PLDN"}>PLDN</option>
        </NativeSelect>
        {helperText}
      </FormControl>
    </div>
  );
}