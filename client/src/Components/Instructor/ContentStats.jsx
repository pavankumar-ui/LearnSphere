import React from "react";
import { assets } from "../../assets/assets/assets";

const ContentIcon = ({ lessonDetails }) => {
  const fileType = lessonDetails.lessonFile?.type;

  return (
    <>
      {fileType && fileType === "application/pdf" ? (
        <img src={assets.pdf_icon} alt="file_icon" className="w-6" />
      ) : (
        <img src={assets.play_icon} alt="video_icon" className="w-6" />
      )}
    </>
  );
};

export default ContentIcon;
