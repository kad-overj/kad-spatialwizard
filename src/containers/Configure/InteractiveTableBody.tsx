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

import { transformationConfigState, prefixState, matrixState } from "state";
import { Autocomplete } from "@material-ui/lab";
import { getPrefixed } from "@triply/utils/lib/prefixUtils";
import { AutocompleteSuggestion, getAutocompleteResults } from "utils/autocomplete";
import HintWrapper from "components/HintWrapper";
import getClassName from "classnames";
import { Redirect } from "react-router-dom";

interface Props {}
const InteractiveTableBody: React.FC<Props> = ({}) => {
  const parsedCsv = useRecoilValue(matrixState);

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
                  <Button className={styles.cellButton} onClick={}>
                    {cell}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </>
  );
};

export default InteractiveTableBody;
