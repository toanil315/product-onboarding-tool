import { LargeLoadingIcon, MediumLoadingIcon, SmallLoadingIcon } from '@/components/Icons';
import React from 'react';
import { StyledLoading } from './styled';

interface Props {
  size?: 'small' | 'medium' | 'large';
}

const Loading = ({ size = 'medium' }: Props) => {
  const renderLoadingIcon = () => {
    switch (size) {
      case 'small':
        return <SmallLoadingIcon />;

      case 'medium':
        return <MediumLoadingIcon />;

      case 'large':
        return <LargeLoadingIcon />;
    }
  };

  return <StyledLoading>{renderLoadingIcon()}</StyledLoading>;
};

export default Loading;
