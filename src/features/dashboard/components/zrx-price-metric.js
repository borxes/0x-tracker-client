import { connect } from 'react-redux';
import { compose } from 'recompose';
import { TrendingUp as TrendingUpIcon } from 'styled-icons/material/TrendingUp.cjs';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import React from 'react';

import { colors } from '../../../styles/constants';
import callApi from '../../../util/call-api';
import DashboardMetric from './dashboard-metric';
import formatCurrency from '../../../util/format-currency';
import LoadingIndicator from '../../../components/loading-indicator';
import withConversionRate from '../../currencies/components/with-conversion-rate';

class ZRXPriceMetric extends React.PureComponent {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { autoReloadKey, displayCurrency } = this.props;
    const autoReload = prevProps.autoReloadKey !== autoReloadKey;

    if (autoReload || prevProps.displayCurrency !== displayCurrency) {
      this.loadData();
    }
  }

  loadData = async () => {
    const { displayCurrency } = this.props;
    const zrxPrice = await callApi('zrx-price', { currency: displayCurrency });

    this.setState({ zrxPrice });
  };

  render() {
    const { displayCurrency } = this.props;
    const { zrxPrice } = this.state;

    return (
      <DashboardMetric title="ZRX Price">
        {zrxPrice === undefined ? (
          <LoadingIndicator size="small" type="cylon" />
        ) : (
          <React.Fragment>
            {formatCurrency(zrxPrice.value, displayCurrency)}{' '}
            <span
              css={`
                color: ${zrxPrice.change > 0
                  ? colors.fruitSalad
                  : colors.pomegranate};
                margin-left: 8px;
                font-size: 0.9em;
              `}
            >
              <TrendingUpIcon
                color={colors.fruitSalad}
                css="margin: 0 2px 0 4px;"
                height={24}
                width={24}
              />
              {numeral(zrxPrice.change).format('0.[00]')}%
            </span>
          </React.Fragment>
        )}
      </DashboardMetric>
    );
  }
}

ZRXPriceMetric.propTypes = {
  autoReloadKey: PropTypes.string,
  displayCurrency: PropTypes.string.isRequired,
};

ZRXPriceMetric.defaultProps = {
  autoReloadKey: undefined,
};

const mapStateToProps = state => ({
  autoReloadKey: state.autoReload.key,
  displayCurrency: state.preferences.currency,
});

const enhance = compose(
  withConversionRate,
  connect(mapStateToProps),
);

export default enhance(ZRXPriceMetric);