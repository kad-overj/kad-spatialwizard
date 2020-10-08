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

import { matrixState, prefixState } from "state";
import { Redirect } from "react-router-dom";
import { AutocompleteSuggestion } from "utils/autocomplete";
import { Autocomplete } from "@material-ui/lab";
import { getPrefixed } from "@triply/utils/lib/prefixUtils";
import HintWrapper from "components/HintWrapper";

interface Props {}
const InteractiveTableBody: React.FC<Props> = ({}) => {
  const parsedCsv = useRecoilValue(matrixState);
  const [selectedField, setSelectedField] = React.useState<any | undefined>();

  if (!parsedCsv) {
    return <Redirect to="/1" />;
  }
  return (
    <>
      <TableBody>
        {parsedCsv.slice(1, 10).map((row, rowIndex) => {
          return (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell className={styles.tableCell} key={"r" + rowIndex + "c" + cellIndex}>
                  <Button className={styles.cellButton} onClick={() => setSelectedField(cell)}>
                    {cell}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          );
        })}
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
