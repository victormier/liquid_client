import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import FormInput from 'components/common/FormInput';
import gridStyles from 'styles/base/grid.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { querySaltedgeProvider } from 'qql';

class NewProviderLogin extends Component {
  handleOnChange() {
    console.log(this);
  }

  render() {
    const { data } = this.props;

    if (data.loading) {
      return <p>Loading...</p>;
    }
    if (data.error) {
      return <p>Error!</p>;
    }

    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <Row>
          <Col xs={12}>
            <h1>Connect to your account</h1>
            <FormInput
              value={data.saltedge_provider.name}
              type="text"
              onChange={this.onChange}
              disabled
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

NewProviderLogin.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    saltedgeProvider: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      country_code: PropTypes.string.isRequired,
    }),
  }),
};

const NewProviderLoginWithGraphQL = graphql(querySaltedgeProvider, {
  options: ownProps => ({
    variables: {
      id: ownProps.params.saltedgeProviderId,
    },
  }),
})(NewProviderLogin);

export default NewProviderLoginWithGraphQL;
