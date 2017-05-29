import React from 'react';
import { connect } from 'react-redux';
import { Grid, Button, PageHeader } from 'react-bootstrap';
import { incrementCounter, decrementCounter } from 'modules/counter/ducks';
import PropTypes from 'prop-types';
import styles from './styles.scss';

export const CounterContainer = ({ increment, decrement, counterValue }) => (
  <Grid>
    <PageHeader>Redux Counter</PageHeader>
    <p>
      Lorem ipsum dolor sit amet, an eius aeque est, vel
      vidisse fuisset rationibus an. Eu nam
      ullum consul. Te putant scripta albucius pri,
      vim oblique scriptorem in. Eos te mazim
      aliquip, ea erat utinam oblique cum, has simul scripta tractatos et.
    </p>
    <p>
      Current counter value is: <strong>{ counterValue }</strong>
    </p>
    <Button className={styles.button} onClick={increment}>Increment</Button>
    <Button className={styles.button} onClick={decrement}>Decrement</Button>
  </Grid>
);

CounterContainer.propTypes = {
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  counterValue: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  counterValue: state.counter.value,
});

const mapDispatchToProps = dispatch => ({
  increment: () => dispatch(incrementCounter()),
  decrement: () => dispatch(decrementCounter()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CounterContainer);
