import './../../../styles/latest-release/latest-release.css';

import { useEffect, useLayoutEffect, useState } from "react";
import { getLatest, getMovieDetails } from "../../../api-functions";
import LatestCard from './latest-card';

let page = 1;
let latestRaw = {};

function Latest() {
    const [latest, setLatest] = useState({});
    const [cards, setCards] = useState([]);

    function createCards() {
        let newCards = Object.values(latest).map( l => <LatestCard key={l.id} data={l}/> );
        setCards([...newCards]);
    }

    useLayoutEffect(() => {
        getLatest((response) => {
            let data = response.results;
            for (let index = 0; index < data.length; index++) {
                let id = data[index].id;
                getMovieDetails(id , (response) => {
                    latestRaw[index] = response;
                    if ( Object.values(latestRaw).length == (page * 20) ) {
                        setLatest(latestRaw);
                    }
                })   
            }
        })
    }, [])

    useLayoutEffect(() => {
        if ( Object.values(latest).length == (20 * page) ) {
            createCards();
        }
    }, [latest])

    return (
        <section id='latest'>
            <span className="whats-latest">Latest Releases</span>
            <div className="cards-container">
                {cards}
            </div>
        </section>
    );
}

export default Latest;