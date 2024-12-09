
import { DetailDescriptionDPRecordLetter } from "./DetailDescriptionDPRecordLetter";
import { DetailDescriptionDPRecordImage } from "./DetailDescriptionDPRecordImage";
import { DetailDescriptionDPVisualImage } from "./DetailDescriptionDPVisualImage";
import { DetailDescriptionDPVisualLetter } from "./DetailDescriptionDPVisualLetter";

export const DetailDescriptionDP = () => {
    return(
        <div>
            <DetailDescriptionDPRecordLetter></DetailDescriptionDPRecordLetter>
            <DetailDescriptionDPRecordImage></DetailDescriptionDPRecordImage>
            <DetailDescriptionDPVisualImage></DetailDescriptionDPVisualImage>
            <DetailDescriptionDPVisualLetter></DetailDescriptionDPVisualLetter>
        </div>
    );
};