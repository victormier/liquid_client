import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
// import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import gridStyles from 'styles/base/grid.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { querySaltedgeLogin } from 'qql';
import Spinner from 'components/common/Spinner';
import baseStyles from 'styles/base/base.scss';

@inject('viewStore')
class PollProviderLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pollFinished: false,
    };
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.data.loading) {
      const newData = newProps.data;
      if (newData.saltedge_login &&
          newData.saltedge_login.finished_connecting &&
          !this.state.pollFinished) {
        this.setState({ pollFinished: true });

        const that = this;
        if (newData.saltedge_login.active) {
          setTimeout(() => {
            that.props.onConnectSuccess();
          }, 3000);
        } else {
          that.props.onConnectError();
        }
      }
    }
  }

  render() {
    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <Row>
          <Col xs={12} className={baseStyles.textCentered}>
            {
              (!this.state.pollFinished) ?
                <div>
                  <h2>
                    We are connecting to your bank.
                    <br />
                    This might take a while.
                  </h2>
                  <Spinner />
                </div> :
                <div>
                  <h2>Connection succesful!</h2>
                </div>
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

// PollProviderLogin.propTypes = {
//   data: PropTypes.shape({
//     loading: PropTypes.bool,
//     error: PropTypes.object,
//     saltedge_login: PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       status: PropTypes.string.isRequired,
//       active: PropTypes.bool.isRequired,
//       finished_connecting: PropTypes.bool.isRequired,
//     }),
//   }),
// };


const PollProviderLoginWithGraphQL = graphql(querySaltedgeLogin, {
  options: ownProps => ({
    variables: {
      id: ownProps.saltedgeLoginId,
    },
    pollInterval: 8000,
  }),
})(PollProviderLogin);

export default withApollo(PollProviderLoginWithGraphQL);

// TESTING FROM HERE

// export default withApollo(PollProviderLogin);
