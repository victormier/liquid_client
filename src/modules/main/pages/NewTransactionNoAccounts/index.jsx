import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Button from 'components/common/Button';
import Header from 'components/common/Header';
import { Grid, Row, Col } from 'react-flexbox-grid';
import baseStyles from 'styles/base/base.scss';
import gridStyles from 'styles/base/grid.scss';

const NewTransactionNoAccounts = props => (
  <Grid fluid className={gridStyles.mainGrid}>
    <Header
      backTo={props.backTo}
      mini
    />
    <Row center="xs" className={`${baseStyles.textCentered} ${baseStyles.baseMarginTopLarge}`}>
      <Col xs={10}>
        <p>You don&apos;t have an account to transfer to yet.</p>
        <p>Liquid accounts work like folders for your money. Create a new account so you can start organizing your money.</p>
        <br />
        <br />
        <Link to="/accounts/new"><Button text="Create a new account" /></Link>
      </Col>
    </Row>
  </Grid>
);

NewTransactionNoAccounts.propTypes = {
  backTo: PropTypes.string.isRequired,
};

export default NewTransactionNoAccounts;
