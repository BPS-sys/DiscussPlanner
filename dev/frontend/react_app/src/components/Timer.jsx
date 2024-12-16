
import { TimerStringLetter } from "./TimerStringLetter";
import FacebookCircularProgress from "./TimerCircle";
import { TimerValue } from "./TimerValue";

export const Timer = () => {
    return (
        <div>
            <TimerStringLetter></TimerStringLetter>
            <FacebookCircularProgress></FacebookCircularProgress>
            <TimerValue></TimerValue>
        </div>
    );
};