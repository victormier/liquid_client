import React from 'react';
import Spinner from 'components/common/Spinner';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import baseStyles from 'styles/base/base.scss';

const SpinnerBlock = () => (
  <Grid fluid className={gridStyles.mainGrid}>
    <Row>
      <Col className={baseStyles.marginCentered}>
        <Spinner />
      </Col>
    </Row>
  </Grid>
);

SpinnerBlock.propTypes = {};

export default SpinnerBlock;
