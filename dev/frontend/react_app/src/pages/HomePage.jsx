
import { DescriptionDP } from '../components/DescriptionDP';
import MainAppBar from '../components/MainAppBar';
import { DetailDescriptionDP } from '../components/DetailDescriptionDP';

const HomePage = ()=>{
    return(
        <div>
            <MainAppBar></MainAppBar>
            <DescriptionDP></DescriptionDP>
            <DetailDescriptionDP></DetailDescriptionDP>
        </div>
    );
};

export default HomePage;