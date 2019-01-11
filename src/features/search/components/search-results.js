import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import PagedFillList from '../../fills/components/paged-fill-list';

const NoResults = styled.p`
  align-items: center;
  display: flex;
  flex-grow: 1;
  font-size: 1.3rem;
  justify-content: center;
  flex-shrink: 1;
  text-align: center;
  word-break: break-word;
  padding: 2rem;
`;

const SearchResults = ({
  changingPage,
  fills,
  onPageChange,
  page,
  pageCount,
  searchQuery,
}) => {
  if (fills.length === 0) {
    return (
      <NoResults>
        No results were found matching <br />
        <span css="font-weight: bold;">&quot;{searchQuery}&quot;</span>
      </NoResults>
    );
  }

  return (
    <PagedFillList
      changingPage={changingPage}
      fills={fills}
      onPageChange={onPageChange}
      page={page}
      pageCount={pageCount}
    />
  );
};

SearchResults.propTypes = {
  changingPage: PropTypes.bool,
  fills: PropTypes.arrayOf(PropTypes.object).isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
};

SearchResults.defaultProps = {
  changingPage: false,
};

export default SearchResults;