
import { display, width } from "@mui/system";
import { DescriptionDPImage } from "./DescriptionDPImage";
import { DescriptionDPLetter } from "./DescriptionDPLetter";
import { TryUseButton } from "./TryUseButton";

export const DescriptionDP = () => {
  const divstyle = {
    display: 'flex',
    height: '36vw',
    width: '100%'
  };

  return (
    <div>
      <div style={divstyle}>
        <DescriptionDPImage></DescriptionDPImage>
        <DescriptionDPLetter></DescriptionDPLetter>
      </div>
      <TryUseButton></TryUseButton>
    </div>
  );
};