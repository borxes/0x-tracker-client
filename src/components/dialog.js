import { Portal } from 'react-portal';
import { rgba } from 'polished';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { colors } from '../styles/constants';
import DialogHeader from './dialog-header';
import DisableBodyScroll from './disable-body-scroll';
import useEscapeKey from '../hooks/use-escape-key';

const StyledDialog = styled.section`
  background-color: ${colors.white};
  border-radius: 0.25rem;
  max-height: ${props => props.height}px;
  height: ${props => props.height}px;
  position: relative;
  max-width: ${props => props.width}px;
  width: ${props => props.width}px;
`;

const Overlay = styled.div`
  background-color: ${rgba(colors.violet, 0.8)};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 2rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
`;

const DialogBody = styled.div`
  padding: 2rem 1.5rem;
`;

const Dialog = ({ children, className, onClose, width, height, title }) => {
  useEscapeKey(onClose);

  return (
    <>
      <DisableBodyScroll />
      <Portal>
        <Overlay className={className}>
          <StyledDialog height={height} width={width}>
            <DialogHeader onClose={onClose}>{title}</DialogHeader>
            <DialogBody>{children}</DialogBody>
          </StyledDialog>
        </Overlay>
      </Portal>
    </>
  );
};

Dialog.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  height: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  width: PropTypes.number,
};

Dialog.defaultProps = {
  className: undefined,
  height: 600,
  width: 800,
};

export default Dialog;
