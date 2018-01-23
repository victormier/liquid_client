import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
// import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import Slider from 'react-slick';
import gridStyles from 'styles/base/grid.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { querySaltedgeLogin } from 'qql';
import Header from 'components/common/Header';
import introCarousel1 from 'assets/images/introCarousel1.png';
import introCarousel2 from 'assets/images/introCarousel2.png';
import introCarousel3 from 'assets/images/introCarousel3.png';
import introCarousel4 from 'assets/images/introCarousel4.png';
import baseStyles from 'styles/base/base.scss';
import LoadingDots from '../LoadingDots';
import styles from './styles.scss';

const ProductSlider = () => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings} className={styles.introCarousel}>
        <div className={`${styles.slide} ${styles.initialSlide}`}>
          <h2 className={baseStyles.thin}>We are connecting to your bank.</h2>
          <h2 className={baseStyles.thin}>This might take a couple of minutes.</h2>
        </div>
        <div className={styles.slide}>
          <div className={styles.carouselImage}>
            <span className={styles.carouselImageHelper} />
            <img alt="Product introduction 1" src={introCarousel1} />
          </div>
          <h2 className={baseStyles.thin}>Save in as many accounts as you like with no hidden fees</h2>
        </div>
        <div className={styles.slide}>
          <div className={styles.carouselImage}>
            <span className={styles.carouselImageHelper} />
            <img alt="Product introduction 2" src={introCarousel2} />
          </div>
          <h2 className={baseStyles.thin}>Automatically set aside money for taxes</h2>
        </div>
        <div className={styles.slide}>
          <div className={styles.carouselImage}>
            <span className={styles.carouselImageHelper} />
            <img alt="Product introduction 3" src={introCarousel3} />
          </div>
          <h2 className={baseStyles.thin}>Stay connected to your cashflow</h2>
        </div>
        <div className={styles.slide}>
          <div className={styles.carouselImage}>
            <span className={styles.carouselImageHelper} />
            <img alt="Product introduction 4" src={introCarousel4} />
          </div>
          <h2 className={baseStyles.thin}>Truly understand how much you&apos;re making</h2>
        </div>
      </Slider>
    </div>
  );
};

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
          that.props.onConnectError(newData.saltedge_login);
        }
      }
    }
  }

  render() {
    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <Header
          title={<span>Connecting bank <LoadingDots /></span>}
          subtitle="This might take up to 2 min."
        />
        {
          (!this.state.pollFinished) ?
            <ProductSlider /> :
            <Row>
              <Col xs={12} className={baseStyles.textCentered}>
                <div>
                  <h2>Connection succesful!</h2>
                </div>
              </Col>
            </Row>
        }
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
    pollInterval: 6000,
  }),
})(PollProviderLogin);

export default withApollo(PollProviderLoginWithGraphQL);

// TESTING FROM HERE

// export default withApollo(PollProviderLogin);
