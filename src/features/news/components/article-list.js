import _ from 'lodash';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { colors } from '../../../styles/constants';
import Article from './article';
import callApi from '../../../util/call-api';
import LoadingIndicator from '../../../components/loading-indicator';

const LoadMoreButton = styled(Button).attrs({
  block: true,
  outline: true,
  size: 'lg',
})`
  border-color: currentColor;
  color: ${colors.tuna};

  &:hover {
    background-color: ${colors.tuna};
    border-color: ${colors.tuna};
  }
`;

class ArticleList extends Component {
  constructor() {
    super();

    this.state = { page: 1 };
    this.fetchData = this.fetchData.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  async componentDidMount() {
    const { page } = this.state;

    this.fetchData(page);
  }

  handleLoadMore(event) {
    const { page } = this.state;

    event.preventDefault();
    this.fetchData(page + 1);
  }

  async fetchData(page) {
    const data = await callApi('articles', { page });

    this.setState(prevState => ({
      articles: _.isArray(prevState.articles)
        ? prevState.articles.concat(data.articles)
        : data.articles,
      page: data.page,
      pageCount: data.pageCount,
    }));
  }

  render() {
    const { articles, page, pageCount } = this.state;
    const { screen } = this.props;

    if (articles === undefined) {
      return <LoadingIndicator centered />;
    }

    let deckSize = 3;
    if (screen.lessThan.medium) {
      deckSize = 1;
    } else if (screen.is.medium) {
      deckSize = 2;
    }

    const chunkedArticles = _.chunk(articles, deckSize);

    return (
      <React.Fragment>
        <div className="mt-2 mb-4">
          <p className="lead">
            Keep up to date with the most important 0x ecosystem news and
            updates in one place.
          </p>
        </div>

        {chunkedArticles.map((articlesChunk, chunk) => (
          <div
            className={classNames({
              'card-deck': true,
              'mb-1': deckSize === 1,
              'mb-4': deckSize > 1,
            })}
            key={chunk} // eslint-disable-line react/no-array-index-key
          >
            {articlesChunk.map(article => (
              <Article article={article} key={article.id} />
            ))}
          </div>
        ))}
        {page < pageCount && (
          <LoadMoreButton onClick={this.handleLoadMore}>
            Load More Stories
          </LoadMoreButton>
        )}
      </React.Fragment>
    );
  }
}

ArticleList.propTypes = {
  screen: PropTypes.object.isRequired,
};

export default connect(state => ({ screen: state.screen }))(ArticleList);
