import { useEffect, useState } from "react";

import { useUser } from "../../contexts/user";
// import { SimpleUploadIcon } from "../Icons";

import avatarPlaceholder from "../../../static/images/avatar-placeholder.svg";

export const AvatarUploader = (props) => {
  const { user } = useUser();
  const [imageUrl, setImageUrl] = useState(avatarPlaceholder);

  useEffect(() => {
    setImageUrl(user.avatarUrl ?? avatarPlaceholder);
  }, [user]);

  return (
    <div {...props}>
      <div
        className={`flex justify-center items-center xl:w-[245px] xl:h-[245px] bg-contain bg-none xl:bg-[url(/images/avatar-bg.svg)]`}
      >
        <img src={imageUrl} className="w-[160px]" alt="" />
      </div>
      {/* TODO: uncomment when avatar uploads work
      <div className="flex justify-center">
        <button
          className="flex items-center gap-4 hover:underline decoration-1 decoration-dashed underline-offset-2 decoration-gray-400"
          type="button"
          onClick={console.info.bind(console)}
        >
          <SimpleUploadIcon size={20} className="shrink-0" /> Upload profile picture
        </button>
      </div>
      */}
    </div>
  );
};
