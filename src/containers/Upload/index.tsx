import React, { ChangeEventHandler } from "react";
import styles from "./style.scss";
import { Button, Box, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Papa from "papaparse";
import { useHistory } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { sourceState, matrixState, transformationConfigState } from "state";
import classNames from "classnames";
import { indexOf } from "*.jpg";

interface Props {}
export const Step = 1;
const parseCSV: (File: File) => Promise<Papa.ParseResult<string[]>> = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      error: (e) => {
        reject(e);
      },
      worker: true,
      complete: (results) => {
        resolve(results);
      },
      skipEmptyLines: "greedy",
    });
  });
};
const Upload: React.FC<Props> = ({}) => {
  const btnClass = classNames(styles.actionButtons, styles.btnNext);

  const history = useHistory();

  const [error, setError] = React.useState<string>();
  const [parsedSource, setParsedSource] = useRecoilState(matrixState);
  const [source, setSource] = useRecoilState(sourceState);

  const setTransformationConfig = useSetRecoilState(transformationConfigState);

  const sourceText =
    (source && (typeof source === "string" ? "Input selected" : `Current file: ${source.name}`)) || "No file selected";

  const handleNewFile: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files && event.target.files.length === 1) {
      const sourceFile = event.target.files[0];
      setSource(sourceFile);
      setTransformationConfig((state) => {
        return { ...state, sourceFileName: sourceFile.name };
      });
      setError(undefined);
      parseCSV(event.target.files[0])
        .then((parseResults) => {
          setParsedSource(parseResults.data);
          setTransformationConfig((state) => {
            return {
              ...state,
              key: undefined,
              csvProps: {
                delimiter: parseResults.meta.delimiter,
              },
              columnConfiguration: parseResults.data[0].map((header) => {
                return { columnName: header };
              }),
            };
          });
          history.push(`/${Step + 1}`);
        })
        .catch((e) => {
          setError(e.message);
        });
    } else {
      setError(
        event.target.files && event.target.files.length > 0 ? "You can only upload one file" : "No files selected"
      );
    }
  };
  return (
    <>
      <div className={styles.button}>
        <Typography variant="body1" gutterBottom>
          {sourceText}
        </Typography>
        <input id="csv-upload" type="file" className={styles.input} onChange={handleNewFile} accept="text/csv" />
        <label htmlFor="csv-upload">
          <Button
            className={styles.uploadButton}
            component="span"
            variant="contained"
            startIcon={<FontAwesomeIcon icon="upload" />}
          >
            Load your CSV File
          </Button>
          {error && <Typography color="error">No file selected</Typography>}
        </label>
        <p>
          Or download a example file{" "}
          <a href="https://labs.kadaster.nl/demonstrators/spatialwizard/Testset_spatialwizard_csv_correctie">here</a>
        </p>
      </div>
      <Box>
        <Button disabled className={styles.actionButtons}>
          Back
        </Button>
        <Button
          className={btnClass}
          variant="contained"
          color="primary"
          disabled={!parsedSource}
          onClick={() => history.push(`/${Step + 1}`)}
        >
          Next
        </Button>
      </Box>
    </>
  );
};
export default Upload;
