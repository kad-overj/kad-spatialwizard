import React from "react";
import Wizard from "containers/Wizard";
import { AppBar, Toolbar, Typography, Container, Paper } from "@material-ui/core";
import KDWImg from "./logo.png";
import KDLogo from "./kadaster_logo.png";
import * as styles from "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

require("../../theme/global.scss");
interface Props {}

const App: React.FC<Props> = () => {
  return (
    <div className={styles.app}>
      <AppBar position="static" color="default">
        <Toolbar>
          <img src={KDWImg} className={styles.image} />
          <Typography className={styles.title}>Geo-data Wizard</Typography>
          <div className={styles.homeContainer}>
            <a className={styles.home} href="https://labs.kadaster.nl/demonstrators/spatialwizard/index.html">
              <FontAwesomeIcon icon="home" />
            </a>
          </div>
        </Toolbar>
        <div className={styles.appBarLine}></div>
      </AppBar>
      <Container component="main" className={styles.main}>
        <Wizard />
      </Container>
      <Paper component="footer" className={styles.footer}>
        {/* Is reversed in CSS */}
        <nav className={styles.footerNav}>
          <a href="https://data.pldn.nl">
            <FontAwesomeIcon icon="database" /> Dataplatform
          </a>
          <a href="https://github.com/kadaster/ld-spatialwizard">
            <FontAwesomeIcon icon={["fab", "github"]} /> Github
          </a>
          <a href="https://labs.kadaster.nl">
            <img src={KDLogo} className={styles.linkImage} /> Kadaster Labs
          </a>
        </nav>
      </Paper>
    </div>
  );
};
export default App;
