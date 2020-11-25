import * as React from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ButtonBase,
  TextField,
  NativeSelect,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import * as styles from "./style.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import { transformationConfigState, prefixState, matrixState } from "state";
import { Autocomplete } from "@material-ui/lab";
import { getPrefixed, getPrefixInfoFromPrefixedValue } from "@triply/utils/lib/prefixUtils";
import getClassName from "classnames";
import HintWrapper from "components/HintWrapper";
import { AutocompleteSuggestion } from "Definitions";
import { wizardConfig } from "config";
import { cleanCSVValue, getBasePredicateIri } from "utils/helpers";
import { datatypes } from "mappings/datatypesset";

interface Props {}

const TableHeaders: React.FC<Props> = ({}) => {
  const transformationConfig = useRecoilValue(transformationConfigState);
  const [selectedHeader, setSelectedHeader] = React.useState<number | undefined>();
  const prefixes = useRecoilValue(prefixState);

  return (
    <>
      <TableHead>
        <TableRow>
          {transformationConfig.columnConfiguration.map((columnConfig, idx) => {
            const propertyIRI = transformationConfig.columnConfiguration[idx].propertyIri;
            const fullUri =
              propertyIRI ??
              `${getBasePredicateIri(transformationConfig.baseIri.toString())}${cleanCSVValue(
                columnConfig.columnName
              )}`;
            const shortUri = propertyIRI !== undefined ? getPrefixed(propertyIRI, prefixes) || propertyIRI : "";
            const isKeyColumn = idx === transformationConfig.key;
            return (
              <TableCell
                key={`${columnConfig.columnName}${idx}`}
                className={getClassName(styles.tableHeader, { [styles.disabled]: isKeyColumn })}
                // Implement the disable here, I still want to be able to use tooltip
                onClick={isKeyColumn ? undefined : () => setSelectedHeader(idx)}
                // Replace Default tableCell with ButtonBase to create ripple effects on click
                component={(props) => (
                  <Tooltip
                    PopperProps={{ className: styles.tooltip }}
                    title={isKeyColumn ? "This column will be used to create identifier" : fullUri}
                  >
                    <ButtonBase {...props} component="th" />
                  </Tooltip>
                )}
              >
                <strong>{columnConfig.columnName + (isKeyColumn ? " (Key)" : "")}</strong>
                <br />
                {shortUri ? <Typography variant="caption">{shortUri}</Typography> : <br />}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <ColumnConfigDialog
        key={selectedHeader}
        selectedHeader={selectedHeader}
        onClose={() => setSelectedHeader(undefined)}
      />
    </>
  );
};
interface AutoCompleteProps {
  selectedHeader: number | undefined;
  onClose: () => void;
}

const ColumnConfigDialog: React.FC<AutoCompleteProps> = ({ selectedHeader, onClose }) => {
  const [transformationConfig, setTransformationConfig] = useRecoilState(transformationConfigState);
  const prefixes = useRecoilValue(prefixState);
  const csvMatrix = useRecoilState(matrixState);
  const [errorMessage, setErrormessage] = React.useState<string | undefined>();
  const [autocompleteError, setAutocompleteError] = React.useState<string | undefined>();
  const [autocompleteSuggestions, setAutocompleteSuggestions] = React.useState<AutocompleteSuggestion[]>([]);
  const selectedColumn =
    (selectedHeader !== undefined && transformationConfig.columnConfiguration[selectedHeader]) || undefined;
  const [propertyIri, setPropertyIri] = React.useState(selectedColumn?.propertyIri || "");
  const [columnDatatypeIri, setColumnDataTypeIri] = React.useState(selectedColumn?.datatypeIri || "");
  const [applyIriTransformation, setApplyIriTransformation] = React.useState(selectedColumn?.iriPrefix !== undefined);
  const [applyBagLinkTransformation, setApplyBagLinkTransformation] = React.useState(
    selectedColumn?.selectedTransformation
  );
  const [linkedColumnValues, setLinkedColumnValues] = React.useState(selectedColumn?.linkedColumnValues || []);
  const [iriPrefix, setIriPrefix] = React.useState(selectedColumn?.iriPrefix ?? wizardConfig.defaultBaseIri);

  function getValuesFromLinkedColumn(selectedHeader: number) {
    var matrixArr: any[] = [];
    var valuesArr: any[] = [];
    for (var i = 0; i < csvMatrix.length; i++) {
      matrixArr.push(csvMatrix[i]);
    }
    console.log(matrixArr[0]);

    for (var i = 1; i < matrixArr[0].length; i++) {
      valuesArr.push(matrixArr[0][i][selectedHeader]);
    }

    return valuesArr;
  }
  const [placeColumnState, setPlaceColumnState] = React.useState<{ id: string | number; placeColumn: string | number }>(
    {
      id: "",
      placeColumn: "",
    }
  );

  const [datatypeState, setDatatypeState] = React.useState<{ id: string | number; datatype: string }>({
    id: "",
    datatype: "",
  });

  const [valueconfigState, setValueConfigState] = React.useState<{ id: string | number; valueconfig: string }>({
    id: "",
    valueconfig: "",
  });

  const handlePlaceColumnChange = (event: React.ChangeEvent<{ name?: string; value: string }>) => {
    const name = event.target.name as keyof typeof placeColumnState;
    setPlaceColumnState({
      ...placeColumnState,
      [name]: event.target.value,
    });
    setLinkedColumnValues(getValuesFromLinkedColumn(+event.target.value));
    console.log(event.target.value);
  };

  const handleDatatypeChange = async (event: React.ChangeEvent<{ name?: string; value: string }>) => {
    const name = event.target.name as keyof typeof datatypeState;
    setDatatypeState({
      ...datatypeState,
      [name]: event.target.value,
    });
    setErrormessage("");
    if (valueconfigState.valueconfig == "") {
      if (event.target.value != "") {
        if (event.target.value == "wktLiteral") {
          setColumnDataTypeIri("http://www.opengis.net/ont/geosparql#" + event.target.value);
        } else {
          setColumnDataTypeIri("http://www.w3.org/2001/XMLSchema#" + event.target.value);
        }
      } else {
        setErrormessage("");
      }
    } else {
      setErrormessage("There is already a value configuration set");
    }
  };

  const handleConfigChange = (event: React.ChangeEvent<{ name?: string; value: string }>) => {
    const name = event.target.name as keyof typeof valueconfigState;
    setValueConfigState({
      ...valueconfigState,
      [name]: event.target.value,
    });
    setErrormessage("");
    if (datatypeState.datatype == "") {
      setApplyBagLinkTransformation(undefined);
      if (event.target.value == "ToIri") {
        setApplyIriTransformation(true);
        setApplyBagLinkTransformation(undefined);
      }
      if (event.target.value == "LinkToBag") {
        setApplyBagLinkTransformation("linkToBag");
        setApplyIriTransformation(false);
      }
      if (event.target.value == "geoPoint") {
        setApplyBagLinkTransformation("geoPoint");
        setApplyIriTransformation(false);
      }
      if (event.target.value == "LinkToLocationServer") {
        setApplyBagLinkTransformation("LinkToLocationServer");
        setApplyIriTransformation(false);
      }
    } else {
      setErrormessage("There is already datatype selected");
    }
  };

  // Async call for results effect
  React.useEffect(() => {
    if (!selectedColumn) return;
    const searchTerm = propertyIri.length === 0 ? selectedColumn.columnName : propertyIri;
    const getAutocompleteSuggestions = async () => {
      setAutocompleteError(undefined);
      try {
        const results = await wizardConfig.getPropertySuggestions(searchTerm);
        setAutocompleteSuggestions(results);
      } catch (e) {
        console.error(e);
        setAutocompleteError(e.message);
        setAutocompleteSuggestions([]);
      }
    };
    getAutocompleteSuggestions();
  }, [selectedColumn, propertyIri]);

  const confirmIri = () => {
    setTransformationConfig((state) => {
      if (selectedHeader === undefined) return state;
      const columnConfiguration = [...state.columnConfiguration];
      // Objects in recoil arrays are read-only
      const processedDatatypeIri = columnDatatypeIri.length > 0 ? columnDatatypeIri : undefined;
      const processedPropertyIri = propertyIri.length > 0 ? propertyIri : undefined;
      const processedIriPrefix = applyIriTransformation ? iriPrefix : undefined;
      const processedLinkedColumnValues = linkedColumnValues;
      const processedApplyBagLinkTransformation = applyBagLinkTransformation;

      columnConfiguration[selectedHeader] = {
        columnName: columnConfiguration[selectedHeader].columnName,
        propertyIri: processedPropertyIri,
        iriPrefix: processedIriPrefix,
        datatypeIri: processedDatatypeIri,
        linkedColumnValues: processedLinkedColumnValues as any,
        selectedTransformation: processedApplyBagLinkTransformation as any,
      };

      console.log(columnConfiguration);
      return {
        ...state,
        columnConfiguration: columnConfiguration,
      };
    });

    // Close the dialog
    onClose();
  };
  return (
    <Dialog open={selectedHeader !== undefined} onClose={onClose} fullWidth maxWidth="md">
      <form onSubmit={confirmIri}>
        <DialogTitle>
          Column configuration (
          {selectedHeader !== undefined && transformationConfig.columnConfiguration[selectedHeader].columnName})
        </DialogTitle>
        <DialogContent>
          {selectedHeader !== undefined && (
            <>
              <div className={styles.columnConfigSection}>
                <Typography variant="subtitle1">Datatype</Typography>
                <HintWrapper hint="Select the datatype for the values in column">
                  <FormControl className={styles.datatypeSelector}>
                    <InputLabel htmlFor="datatype-native-helper">Select datatype</InputLabel>
                    <NativeSelect
                      value={datatypeState.datatype}
                      onChange={handleDatatypeChange}
                      error={!!errorMessage}
                      inputProps={{
                        name: "datatype",
                        id: "datatype-native-helper",
                      }}
                    >
                      <option value=""></option>
                      {datatypes.map((datatype) => (
                        <option value={datatype.value}>{datatype.label}</option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                </HintWrapper>
              </div>
              <div className={styles.columnConfigSection}>
                <Typography variant="subtitle1">Property configuration</Typography>
                <Autocomplete
                  freeSolo
                  options={autocompleteSuggestions}
                  value={propertyIri}
                  renderOption={(option: AutocompleteSuggestion) => {
                    let titleString: string;
                    let description: string | undefined;
                    if (typeof option === "string") {
                      titleString = option;
                    } else if ("iri" in option) {
                      titleString = option.iri;
                      description = option.description;
                    } else {
                      titleString = option.value;
                    }
                    return (
                      <div>
                        <Typography>{getPrefixed(titleString, prefixes) || titleString}</Typography>
                        {description && (
                          <Typography
                            dangerouslySetInnerHTML={{
                              __html: description,
                            }}
                            variant="caption"
                            className={styles.hint}
                          />
                        )}
                      </div>
                    );
                  }}
                  getOptionLabel={(value: any) =>
                    typeof value === "string" ? value : getPrefixed(value.iri, prefixes) || value.iri
                  }
                  onChange={(_event, newValue: AutocompleteSuggestion | null) => {
                    if (!newValue) return;
                    if (typeof newValue === "string") {
                      setPropertyIri(newValue);
                    } else if ("iri" in newValue) {
                      setPropertyIri(newValue.iri);
                    } else {
                      setPropertyIri(newValue.value);
                    }
                  }}
                  disableClearable
                  openOnFocus
                  renderInput={(props) => (
                    <HintWrapper hint="This IRI will define the relation between the key column and this column">
                      <TextField
                        {...props}
                        autoFocus
                        label="property URI"
                        className={styles.textField}
                        error={!!autocompleteError}
                        helperText={autocompleteError || getPrefixed(propertyIri, prefixes)}
                        placeholder={`${getBasePredicateIri(transformationConfig.baseIri.toString())}${cleanCSVValue(
                          transformationConfig.columnConfiguration[selectedHeader].columnName
                        )}`}
                        InputLabelProps={{ shrink: true }}
                        type="url"
                        inputMode="url"
                        fullWidth
                        onChange={(event) => {
                          const prefixInfo = getPrefixInfoFromPrefixedValue(event.currentTarget.value, prefixes);
                          if (prefixInfo.prefixLabel) {
                            setPropertyIri(`${prefixInfo.iri}${prefixInfo.localName}`);
                          } else {
                            setPropertyIri(event.currentTarget.value);
                          }
                        }}
                      />
                    </HintWrapper>
                  )}
                />
              </div>
              <div className={styles.columnConfigSection}>
                <Typography variant="subtitle1">Value configuration</Typography>
                <HintWrapper hint="Select the value config for the values in column">
                  <FormControl className={styles.datatypeSelector}>
                    <InputLabel htmlFor="valueconfig-native-helper">Select config type</InputLabel>
                    <NativeSelect
                      value={valueconfigState.valueconfig}
                      onChange={handleConfigChange}
                      error={!!errorMessage}
                      inputProps={{
                        name: "valueconfig",
                        id: "valueconfig-native-helper",
                      }}
                    >
                      <option value=""></option>
                      <option value="ToIri">Value to IRI</option>
                      <option value="LinkToBag">Link place to BAG</option>
                      <option value="geoPoint">Link Geopoint</option>
                      <option value="LinkToLocationServer">Link adress to BAG</option>
                    </NativeSelect>
                  </FormControl>
                </HintWrapper>
              </div>
              <div className={styles.columnConfigSection}>
                {applyIriTransformation && (
                  <div className={styles.indent}>
                    <HintWrapper hint="This prefix will be prepended to all values in this column.">
                      <TextField
                        label="Prefix"
                        value={iriPrefix || ""}
                        onChange={(event) => {
                          setIriPrefix(event.target.value);
                        }}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </HintWrapper>
                  </div>
                )}
                {applyBagLinkTransformation == "LinkToLocationServer" && (
                  <div className={styles.indent}>
                    <HintWrapper hint="This will append the value to the column values.">
                      <FormControl className={styles.datatypeSelector}>
                        <InputLabel htmlFor="placeColumn-native-helper">Select Column </InputLabel>
                        <NativeSelect
                          value={placeColumnState.placeColumn}
                          onChange={handlePlaceColumnChange}
                          error={!!errorMessage}
                          inputProps={{
                            name: "placeColumn",
                            id: "placeColumn-native-helper",
                          }}
                        >
                          {transformationConfig.columnConfiguration.map((config, idx) => (
                            <option value={idx}>{config.columnName}</option>
                          ))}
                        </NativeSelect>
                      </FormControl>
                    </HintWrapper>
                  </div>
                )}
              </div>
            </>
          )}
          <p className={styles.error}>{errorMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button className={styles.actionButtons} variant="contained" color="primary" type="submit">
            Confirm
          </Button>
          <Button className={styles.actionButtons} onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default TableHeaders;
