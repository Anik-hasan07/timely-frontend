/* eslint-disable no-unused-expressions */
import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const Option = (props) => {
  const {
    children,
    className,
    cx,
    getStyles,
    isDisabled,
    isFocused,
    isSelected,
    innerRef,
    innerProps,
    value,
    options,
  } = props;
  return (
    <Box
      ref={innerRef}
      css={getStyles('option', props)}
      className={cx(
        {
          option: true,
          'option--is-disabled': isDisabled,
          'option--is-focused': isFocused,
          'option--is-selected': isSelected,
        },
        className
      )}
      {...innerProps}
      sx={{
        height: 'auto',
        padding: '0',
        borderLeft: '3px solid transparent',
        ':hover': {
          backgroundColor: '#EEEEEE',
          borderLeft: '3px solid #ff5722',
        },
      }}
    >
      <Typography
        variant="span"
        sx={{
          display: 'block',
          padding: '5px',
          borderRadius: '5px',
          margin: '5px',
        }}
      >
        <Box
          sx={{
            display: 'inline',
            background: '#ECF2FF',
            color: options.find((option) => option.value === value).color,
            padding: '5px',
            borderRadius: '5px',
            fontWeight: '800',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          {children}
        </Box>
      </Typography>
    </Box>
  );
};

const getBeforeStyles = (showIcon, iconVisible, selectedOption, showOptionAsBadge) => ({
  alignItems: 'center',
  display: 'flex',
  textAlign: 'center',
  ':before': {
    content: showIcon && !showOptionAsBadge && `""`,
    height: showIcon && !showOptionAsBadge && '20px',
    marginRight: showIcon && !showOptionAsBadge && '5px',
    background: iconVisible && showIcon && !showOptionAsBadge && `url(${selectedOption.icon})`,
    width: showIcon && !showOptionAsBadge && '25px',
    backgroundSize: showIcon && !showOptionAsBadge && 'cover',
  },
});

function DropDown({
  showIcon,
  options,
  isSearchable,
  menuPlacement = 'bottom',
  showOptionAsBadge = true,
  width = '100%',
  selectedItem,
  defaultValue,
  selectRef,
}) {
  const [iconVisible, setIconVisible] = useState(true);
  const [selectedOption, setSelectedOption] = useState(defaultValue || options[0]);
  const [isChangeValue, setIsChangValue] = useState(false);

  useEffect(() => {
    if (defaultValue?.value !== undefined) {
      setSelectedOption(defaultValue);
      setIsChangValue(true);
    }
  }, [defaultValue?.value]);

  useEffect(() => {
    if (isChangeValue) {
      selectedItem(selectedOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  const dropDownStyles = {
    menu: (styles) => ({
      ...styles,
      width,
    }),
    control: (styles) => ({
      ...styles,
      backgroundColor: 'white',
      width,
      background: showOptionAsBadge && selectedOption?.color ? selectedOption.color : 'transparent',
      marginBottom: '10px',
    }),
    option: (styles, { data, isDisabled }) => {
      return {
        ...styles,
        backgroundColor: 'white',
        borderLeft: '3px solid transparent',
        ':before': {
          content: showIcon && `""`,
          display: showIcon && 'inline-block',
          height: showIcon && '20px',
          width: showIcon && '20px',
          position: showIcon && 'relative',
          top: showIcon && '3px',
          marginRight: showIcon && '5px',
          backgroundImage: showIcon && `url(${data.icon})`,
          backgroundSize: showIcon && 'cover',
        },
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        ':hover': {
          backgroundColor: '#EEEEEE',
          borderLeft: '3px solid #ff5722',
        },
        padding: showOptionAsBadge ? '10px' : '5px',
        color: 'black',
      };
    },
    input: (styles) => ({
      ...styles,
      ...getBeforeStyles(showIcon, iconVisible, selectedOption, showOptionAsBadge),
    }),
    placeholder: (styles) => ({
      ...styles,
      ...getBeforeStyles(showIcon, iconVisible, selectedOption, showOptionAsBadge),
    }),
    singleValue: (styles) => ({
      ...styles,
      ':before': {
        content: showIcon && !showOptionAsBadge && `""`,
        marginRight: showIcon && !showOptionAsBadge && '23px',
      },
      color: showOptionAsBadge && selectedOption?.color ? 'white' : 'black',
    }),
  };

  return showOptionAsBadge ? (
    <Select
      ref={selectRef}
      value={selectedOption}
      options={options}
      menuPlacement={menuPlacement}
      onChange={(value) => {
        setSelectedOption({ ...value });
        setIconVisible(true);
        setIsChangValue(true);
      }}
      onInputChange={(value) => {
        value.length > 0 && setIconVisible(false);
      }}
      styles={dropDownStyles}
      onBlur={() => setIconVisible(true)}
      blurInputOnSelect
      components={{
        IndicatorSeparator: () => null,
        Option,
      }}
      isSearchable={isSearchable}
      selectedOption={selectedOption}
    />
  ) : (
    <Select
      ref={selectRef}
      value={selectedOption}
      options={options}
      menuPlacement={menuPlacement}
      onChange={(value) => {
        setSelectedOption({ ...value });
        setIconVisible(true);
        setIsChangValue(true);
      }}
      onInputChange={(value) => {
        value.length > 0 && setIconVisible(false);
      }}
      styles={dropDownStyles}
      onBlur={() => setIconVisible(true)}
      blurInputOnSelect
      components={{
        IndicatorSeparator: () => null,
      }}
      isSearchable={isSearchable}
      selectedOption={selectedOption}
    />
  );
}

export default DropDown;
