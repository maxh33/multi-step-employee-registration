import React from 'react';
import { Typography, Tooltip, TypographyProps } from '@mui/material';

interface TruncatedTextProps extends Omit<TypographyProps, 'children'> {
  text: string;
  maxLength: number;
  showTooltip?: boolean;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLength,
  showTooltip = true,
  tooltipPlacement = 'top',
  ...typographyProps
}) => {
  const isTruncated = text.length > maxLength;
  const displayText = isTruncated ? `${text.substring(0, maxLength)}...` : text;

  const textComponent = (
    <Typography
      {...typographyProps}
      sx={{
        ...typographyProps.sx,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        cursor: isTruncated && showTooltip ? 'pointer' : 'inherit',
      }}
    >
      {displayText}
    </Typography>
  );

  if (isTruncated && showTooltip) {
    return (
      <Tooltip title={text} placement={tooltipPlacement} arrow>
        {textComponent}
      </Tooltip>
    );
  }

  return textComponent;
};

export default TruncatedText;