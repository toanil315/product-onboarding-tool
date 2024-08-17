import styled from '@emotion/styled';

export const StyledColorPicker = styled.div`
  .ant-color-picker-color-block-inner {
    border-radius: ${({ theme }) => theme.radii.circle} !important;
    box-shadow: none;
    background-image: none;
  }

  .ant-color-picker-trigger {
    border-top: none;
    border-left: none;
    border-right: none;
    border-width: 2px;
    border-radius: 0;

    width: 100%;
    justify-content: space-between;
    padding: 20px 0;

    box-shadow: none !important;
  }
`;
