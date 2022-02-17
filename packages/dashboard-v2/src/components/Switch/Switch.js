import PropTypes from 'prop-types'
import './Switch.css'

/**
 * Primary UI component for user interaction
 */
export const Switch = ({ isOn, handleToggle }) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
      />
      <label className={'react-switch-label'} htmlFor={`react-switch-new`}>
        <span className={`react-switch-button ${isOn ? 'bg-primary' : 'bg-palette-200'}`} />
      </label>
    </>
  )
}

Switch.propTypes = {
  /**
   * Switch's current value
   */
  isOn: PropTypes.bool,
  /**
   * Function to execute on change
   */
  handleToggle: PropTypes.func,
}

Switch.defaultProps = {
  isOn: false,
}
