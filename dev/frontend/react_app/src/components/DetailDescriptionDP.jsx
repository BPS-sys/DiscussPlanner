
import { DetailDescriptionDPRecordLetter } from "./DetailDescriptionDPRecordLetter";
import { DetailDescriptionDPRecordImage } from "./DetailDescriptionDPRecordImage";
import { DetailDescriptionDPVisualImage } from "./DetailDescriptionDPVisualImage";
import { DetailDescriptionDPVisualLetter } from "./DetailDescriptionDPVisualLetter";

export const DetailDescriptionDP = () => {
    const divstyle = {
        display: 'flex',
        height: '20vw',
        width: '100%',
        marginTop: '10vw'
    };


    return (
        <div>
            <div style={divstyle}>
                <DetailDescriptionDPRecordLetter></DetailDescriptionDPRecordLetter>
                <DetailDescriptionDPRecordImage></DetailDescriptionDPRecordImage>
            </div>
            <div style={divstyle}>
                <DetailDescriptionDPVisualImage></DetailDescriptionDPVisualImage>
                <DetailDescriptionDPVisualLetter></DetailDescriptionDPVisualLetter>
            </div>
            <div style={divstyle}>
                {/* 空白 */}
            </div>
        </div>
    );
};