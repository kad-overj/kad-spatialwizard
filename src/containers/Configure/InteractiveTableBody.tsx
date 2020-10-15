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
  TableBody,
} from "@material-ui/core";
import * as styles from "./style.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import getClassName from "classnames";
import { cellTransformationConfigState, matrixState, prefixState } from "state";
import { Redirect } from "react-router-dom";
import { AutocompleteSuggestion } from "utils/autocomplete";
import { Autocomplete } from "@material-ui/lab";
import { getPrefixed } from "@triply/utils/lib/prefixUtils";
import HintWrapper from "components/HintWrapper";

interface Props {}
const InteractiveTableBody: React.FC<Props> = ({}) => {
  const cellTranformationConfig = useRecoilValue(cellTransformationConfigState);
  const parsedCsv = useRecoilValue(matrixState);
  const [selectedField, setSelectedField] = React.useState<any | undefined>();
  const prefixes = useRecoilValue(prefixState);

  if (!parsedCsv) {
    return <Redirect to="/1" />;
  }

  return (
    <>
      <TableBody>
        <TableRow>
          {cellTranformationConfig.cellConfiguration.map((cellConfig, idx) => {
            const propertyIRI = cellTranformationConfig.cellConfiguration[idx].propertyIri;
            const fullUri = propertyIRI ?? `${cellTranformationConfig.baseIri}${cellConfig.cellName}`;
            const shortUri = propertyIRI !== undefined ? getPrefixed(propertyIRI, prefixes) || propertyIRI : "";
            const isKeyColumn = idx === cellTranformationConfig.key;
            return (
              <TableCell
                key={`${cellConfig.cellName}${idx}`}
                className={getClassName(styles.tableCell, { [styles.disabled]: isKeyColumn })}
                // Implement the disable here, I still want to be able to use tooltip
                onClick={isKeyColumn ? undefined : () => setSelectedField(idx)}
                // Replace Default tableCell with ButtonBase to create ripple effects on click
                component={(props) => (
                  <Tooltip title={isKeyColumn ? "This column will be used to create identifiers" : fullUri}>
                    <ButtonBase {...props} component="td" />
                  </Tooltip>
                )}
              >
                <p>{cellConfig.cellName + (isKeyColumn ? " (Key)" : "")}</p>
                <br />
                {shortUri ? <Typography variant="caption">{shortUri}</Typography> : <br />}
              </TableCell>
            );
          })}
        </TableRow>
      </TableBody>
      <CellDialog key={selectedField} selectedField={selectedField} onClose={() => setSelectedField(undefined)} />
    </>
  );
};

interface AutoCompleteProps {
  selectedField: string | undefined;
  onClose: () => void;
}

const CellDialog: React.FC<AutoCompleteProps> = ({ selectedField, onClose }) => {
  const prefixes = useRecoilValue(prefixState);
  const [autocompleteError, setAutocompleteError] = React.useState<string | undefined>();
  const [autocompleteSuggestions, setAutocompleteSuggestions] = React.useState<AutocompleteSuggestion[]>([]);
  const selectedCell = selectedField != undefined || undefined;
  const [propertyIri, setPropertyIri] = React.useState(selectedCell || "");
  return (
    <Dialog open={selectedField !== undefined} onClose={onClose} fullWidth>
      <DialogTitle>Choose property ({selectedField})</DialogTitle>
      <DialogContent>
        {selectedField !== undefined && (
          <form>
            <HintWrapper hint="This IRI will define the relation between the key column and this column">
              <TextField
                autoFocus
                label="property URI"
                placeholder="Bake the eggs"
                InputLabelProps={{ shrink: true }}
                type="url"
                inputMode="url"
                fullWidth
              />
            </HintWrapper>
          </form>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          className={styles.actionButtons}
          variant="contained"
          color="primary"
          onClick={() => showTestAlert(selectedField)}
        >
          Confirm
        </Button>
        <Button className={styles.actionButtons} onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function showTestAlert(selectedField: any) {
  alert(selectedField);
}

export default InteractiveTableBody;
