import PropTypes from 'prop-types'

/**
 * Primary UI component for user interaction
 */
export const Button = ({ primary, label, ...props }) => {
  return (
    <button
      type="button"
      className={`min-w-button min-h-button rounded-full font-sans uppercase tracking-wide text-button 
            ${primary ? 'bg-primary' : 'bg-white border-2 border-black'}`}
      {...props}
    >
      {label}
    </button>
  )
}

Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
}

Button.defaultProps = {
  primary: false,
  onClick: undefined,
}
