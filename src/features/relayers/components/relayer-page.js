import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import { TIME_PERIOD, URL } from '../../../constants';
import buildRelayerUrl from '../util/build-relayer-url';
import ChartsContainer from '../../../components/charts-container';
import Fills from '../../fills/components/fills';
import getIsMobile from '../../../selectors/get-is-mobile';
import getPeriodOptions from '../../../util/get-period-options';
import getRelayer from '../selectors/get-relayer';
import NetworkFees from '../../metrics/components/network-fees';
import NetworkVolume from '../../metrics/components/network-volume';
import PageLayout from '../../../components/page-layout';
import relayersPropTypes from '../prop-types';
import TopTokens from '../../tokens/components/top-tokens';
import withRelayers from './with-relayers';

const CHARTS_HEIGHT = 265;

const RelayerPage = ({ isMobile, relayer }) =>
  relayer === undefined ? null : (
    <PageLayout
      breadcrumbItems={[
        { title: 'Relayers', url: URL.RELAYERS },
        { title: relayer.name, url: buildRelayerUrl(relayer) },
      ]}
      title={relayer.name}
    >
      <div className="row">
        <div className="col-xs-12 col-lg-7 mb-4">
          <ChartsContainer
            charts={[
              {
                title: 'Network Volume',
                component: <NetworkVolume relayerId={relayer.id} />,
              },
              {
                title: 'Fills',
                component: (
                  <NetworkVolume relayerId={relayer.id} type="fills" />
                ),
              },
              {
                title: 'Fees',
                component: <NetworkFees relayerId={relayer.id} />,
              },
            ]}
            chartsHeight={CHARTS_HEIGHT}
            defaultPeriod={TIME_PERIOD.MONTH}
            periods={getPeriodOptions([
              TIME_PERIOD.DAY,
              TIME_PERIOD.WEEK,
              TIME_PERIOD.MONTH,
              TIME_PERIOD.YEAR,
              TIME_PERIOD.ALL,
            ])}
          />
        </div>
        <div className="col-xs-12 col-lg-5 mb-4">
          <ChartsContainer
            charts={[
              {
                title: 'Top Tokens',
                component: <TopTokens relayerId={relayer.id} />,
              },
            ]}
            chartsHeight={CHARTS_HEIGHT}
            defaultPeriod={TIME_PERIOD.DAY}
            periods={
              !isMobile &&
              getPeriodOptions([
                TIME_PERIOD.DAY,
                TIME_PERIOD.WEEK,
                TIME_PERIOD.MONTH,
              ])
            }
          />
        </div>
      </div>
      <Fills
        excludeColumns={['relayer']}
        filter={{ relayer: relayer.id }}
        heading="Recent Fills"
      />
    </PageLayout>
  );

RelayerPage.propTypes = {
  isMobile: PropTypes.bool,
  relayer: relayersPropTypes.relayer,
};

RelayerPage.defaultProps = {
  isMobile: false,
  relayer: undefined,
};

const mapStateToProps = (state, ownProps) => ({
  isMobile: getIsMobile(state),
  relayer: getRelayer(state, ownProps),
});

const enhance = compose(
  withRelayers,
  mapProps(({ match }) => ({ relayerSlug: match.params.slug })),
  connect(mapStateToProps),
);

export default enhance(RelayerPage);
