
import { TimerStringLetter } from "./TimerStringLetter";
import FacebookCircularProgress from "./TimerCircle";
import { TimerValue } from "./TimerValue";
import { TimerTest } from "./TimerTest";

export const Timer = ({timelist}) => {
    return (
        <div>
            {/* <TimerStringLetter></TimerStringLetter>
            <FacebookCircularProgress></FacebookCircularProgress>
            <TimerValue></TimerValue> */}
            <TimerTest timelist={timelist}></TimerTest>
        </div>
    );
};