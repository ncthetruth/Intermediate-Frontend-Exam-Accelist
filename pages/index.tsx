import { WithDefaultLayout } from '../components/DefautLayout';
import { Title } from '../components/Title';
import { Page } from '../types/Page';
import MainGrid from '../components/MainGrid';

const IndexPage: Page = () => {
    return (
        <div>
            <Title>Home</Title>
            {}
            <MainGrid />
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
