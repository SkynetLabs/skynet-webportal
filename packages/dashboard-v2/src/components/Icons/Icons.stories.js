import { Panel } from "../Panel";
import * as icons from ".";

export default {
  title: "SkynetLibrary/Icons",
  decorators: [
    (Story) => (
      <div style={{ margin: 50 }}>
        <Story />
      </div>
    ),
  ],
};

export const DefaultSizeIcon = () => <icons.SkynetLogoIcon />;

export const LargeIcon = () => <icons.SkynetLogoIcon size={60} />;

export const AllIcons = () => {
  const sizes = [24, 32, 60];

  return (
    <>
      {Object.entries(icons).map(([iconName, IconComponent]) => (
        <Panel key={`panel-${iconName}`}>
          <pre>{iconName}</pre>

          <div style={{ padding: 10, border: "1px dashed #fafafa", display: "flex", alignItems: "center", gap: 50 }}>
            {sizes.map((size) => (
              <IconComponent key={`${iconName}-${size}`} size={size} />
            ))}
          </div>
        </Panel>
      ))}
    </>
  );
};
