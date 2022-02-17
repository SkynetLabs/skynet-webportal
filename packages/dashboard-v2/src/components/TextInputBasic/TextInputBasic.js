import PropTypes from 'prop-types'

/**
 * Primary UI component for user interaction
 */
export const TextInputBasic = ({ label, placeholder }) => {
  return (
    <div className={''}>
      <p className={'font-sans uppercase text-palette-300 text-inputLabel mb-textInputLabelBottom'}>{label}</p>
      <input
        placeholder={placeholder}
        className={
          'w-full bg-palette-100 h-textInput px-textInputBasicX focus:outline-none bg-transparent ' +
          'placeholder-palette-400 text-content tracking-inputPlaceholder text-textInput'
        }
      />
    </div>
  )
}

TextInputBasic.propTypes = {
  /**
   * Icon to place in text input
   */
  label: PropTypes.string,
  /**
   * Input placeholder
   */
  placeholder: PropTypes.string,
}
