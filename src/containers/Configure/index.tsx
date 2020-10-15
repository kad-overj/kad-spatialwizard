import React from "react";
import {
  Button,
  Box,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  Container,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TableHead,
  ButtonBase,
} from "@material-ui/core";
import { Redirect, useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { matrixState } from "state";
import * as styles from "./style.scss";
import BaseIriField from "./BaseIriField";
import FontAwesomeIcon from "components/FontAwesomeIcon";
import TableHeaders from "./InteractiveTableHeaders";
import InteractiveTableBody from "./InteractiveTableBody";
import ResourceClassField from "./ClassField";
import { Skeleton } from "@material-ui/lab";
import ColumnSelector from "./ColumnSelector";

interface Props {}

export const Step = 2;

const Configure: React.FC<Props> = ({}) => {
  const parsedCsv = useRecoilValue(matrixState);
  const history = useHistory();
  const confirmConfiguration = () => {
    history.push(`/${Step + 1}`);
  };
  if (!parsedCsv) {
    return <Redirect to="/1" />;
  }
  return (
    <>
      <Container className={styles.globalSettingsForm}>
        <Box className={styles.normalSettings}>
          <ColumnSelector />
          <React.Suspense fallback={<Skeleton width="500px" height="3rem" />}>
            <ResourceClassField />
          </React.Suspense>
        </Box>
        <Accordion variant="outlined" square className={styles.accordion}>
          <AccordionSummary expandIcon={<FontAwesomeIcon icon={["fas", "caret-down"]} />}>
            <Typography>Advanced</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <BaseIriField />
          </AccordionDetails>
        </Accordion>
      </Container>
      <Paper variant="outlined" square className={styles.tableWrapper}>
        <TableContainer>
          <Table>
            <React.Suspense
              fallback={
                <Skeleton
                  width="100%"
                  height="5rem"
                  style={{ display: "table-caption" }}
                  component={(props) => <TableHead {...props} />}
                />
              }
            >
              <TableHeaders />
            </React.Suspense>
            <React.Suspense
              fallback={
                <Skeleton
                  width="100%"
                  style={{ display: "table-cell" }}
                  component={(props) => <TableBody {...props} />}
                />
              }
            >
              <InteractiveTableBody />
            </React.Suspense>
          </Table>
        </TableContainer>
      </Paper>
      <Box>
        <Button className={styles.actionButtons} onClick={() => history.push(`/${Step - 1}`)}>
          Back
        </Button>
        <Button className={styles.actionButtons} variant="contained" color="primary" onClick={confirmConfiguration}>
          Next
        </Button>
      </Box>
    </>
  );
};
export default Configure;
