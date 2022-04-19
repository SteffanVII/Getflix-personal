import Footer from '../../footer.js';
import Latest from './latest-release.js';
import Popular from './popular.js';
import Trending from './trending.js';
import Upcoming from './upcoming.js';

function Home() {
    return (
        <main>
            <Trending/>
            <Latest/>
            <div className="popular-upcoming-wrapper">
                <Popular/>
                <Upcoming/>
            </div>
        </main>
    );
}

export default Home;