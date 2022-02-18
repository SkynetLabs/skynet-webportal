import { useCallback, useReducer } from "react";

const initialState = {
  open: false,
  selectedOptionIndex: -1,
};

const withDefaultValue = (state, { defaultValue, options, placeholder }) => {
  let index = -1;

  if (!defaultValue) {
    if (!placeholder) {
      // If no default value and no placeholder are provided, select first option.
      // TODO: might need to look for the first *available* option.
      index = 0;
    }
  } else {
    index = options.findIndex((option) => {
      if (!option || !option.props) {
        return false;
      }

      return option.props.value === defaultValue;
    });
  }

  return {
    ...state,
    selectedOptionIndex: index,
  };
};

const stateReducer = (state, action) => {
  switch (action.type) {
    case "close":
      return {
        ...state,
        open: false,
      };
    case "open":
      return {
        ...state,
        open: true,
      };
    case "selectOption":
      return {
        ...state,
        open: false,
        selectedOptionIndex: action.index,
      };
    default:
      return {
        ...state,
      };
  }
};

export const useSelectReducer = ({ defaultValue, options, placeholder }) =>
  useReducer(stateReducer, withDefaultValue(initialState, { defaultValue, options, placeholder }));

export const useCallbacks = (state, dispatch) => {
  const close = useCallback(() => {
    if (state.open) {
      dispatch({ type: "close" });
    }
  }, [dispatch, state.open]);

  const toggle = useCallback(() => {
    dispatch({ type: state.open ? "close" : "open" });
  }, [dispatch, state.open]);

  const selectOption = useCallback(
    (optionIndex) => {
      if (optionIndex !== state.selectedOptionIndex) {
        dispatch({ type: "selectOption", index: optionIndex });
      }
    },
    [dispatch, state.selectedOptionIndex]
  );

  return {
    close,
    selectOption,
    toggle,
  };
};
