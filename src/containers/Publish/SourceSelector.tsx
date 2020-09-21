import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export interface Props {}

export interface State {}

export default function SourceSelector() {
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
  const [state, setState] = React.useState({
    source: "",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };
  return (
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
  );
}
