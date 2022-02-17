import { TextInputIcon } from './TextInputIcon'
import { CogIcon } from '../Icons'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'SkynetLibrary/TextInputIcon',
  component: TextInputIcon,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <TextInputIcon {...args} />

export const IconLeft = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
IconLeft.args = {
  icon: <CogIcon />,
  position: 'left',
  placeholder: 'Search',
}

export const IconRight = Template.bind({})
IconRight.args = {
  icon: <CogIcon />,
  position: 'right',
  placeholder: 'Search',
}
