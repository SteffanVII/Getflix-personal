import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useParams, useSearchParams, Link } from 'react-router-dom';
import { getMovieDetails, imgUrl, imgUrlw154, imgUrlw92, searchMovie } from '../../../api-functions';
import './../../../styles/searchPage/search-page.css';
import default_poster from './../../../svg/Default_poster.svg';
import default_backdrop from './../../../svg/Default_backdrop.svg';
import { resetTrendingVariables } from '../home/trending';

function SearchMovie(props) {

    const [response, setResponse] = useState({});
    const [cardRows, setCardRows] = useState([]);
    const [pages, setPages] = useState([]);

    const container = useRef();

    const [searchParams] = useSearchParams();
    const location = useLocation();

    function createCards() {
        let width = document.documentElement.clientWidth;

        function set(count) {
            let rowsLength = response.results.length / count;
            let rows = [];

            for (let rowIndex = 0; rowIndex < rowsLength; rowIndex++) {

                let rowCards = [];

                for (let index = 0; index < count; index++) {

                    let fIndex = index + (rowIndex * count);

                    if ( fIndex < response.results.length ) {
                        rowCards.push(response.results[fIndex]);
                    }
                }
                rows.push(<CardRow key={searchParams.get('searchString') + '-result-' + rowIndex} cards={[...rowCards]}/>);
            }
            setCardRows([...rows]);
        }

        if ( width > 1650 ) {
            set(8);
        } else if ( width < 1650 && width > 1380 ) {
            set(7);
        } else if ( width < 1380 && width > 1180 ) {
            set(6);
        } else if ( width < 1180 && width > 980 ) {
            set(5);
        } else if ( width < 980 && width > 780 ) {
            set(4);
        } else if ( width < 780 && width > 580 ) {
            set(3);
        } else if ( width < 580 && width > 380 ) {
            set(2);
        } else if ( width < 380 ) {
            set(2);
        }
    }

    useLayoutEffect(() => {
        searchMovie({
            title : searchParams.get('searchString'),
            callback : (datas) => {
                setResponse({...datas});
            }
        });
    }, [searchParams.get('searchString')]);

    useLayoutEffect(() => {
        if ( response.results != undefined ) {
            createCards();
        }
    }, [response])

    return (
        <main>
            <div id="search">
                <h2>Results</h2>
                <div className="search-page-results-container" ref={container}>
                    {cardRows}
                </div>
                <ul className="pages-selection">

                </ul>
            </div>
        </main>
    );
}

function CardRow(props) {
    const [cardsr, setCardsr] = useState([]);
    const [scrollPos, setScrollPos] = useState(0);
    const self = useRef();

    useLayoutEffect(() => {
        setCardsr([...props.cards.map( c => <Card key={c.id + '-' + c.title + '-result'} setScrollPos={setScrollPos} data={c}/> )])
    }, [])

    useEffect(() => {
        self.current.scrollTo( {
            top : 0,
            left : scrollPos,
            behavior : 'smooth'
        } );
    }, [scrollPos]);

    return (
        <div className={"search-page-card-row"} ref={self} onMouseLeave={(event) => { setScrollPos(0); }}>
            <div className="card-row-inner-wrap">
                {cardsr}
            </div>
        </div>
    );
}

function Card(props) {

    const [rating, setRating] = useState();
    const [fullDetail, setFullDetail] = useState({});

    function scrollParent(event) {
        let cards = Array.from(event.target.parentElement.parentElement.querySelectorAll('.card-row-inner-wrap .search-page-card'));
        if ( cards.indexOf(event.target) == cards.length - 1 ) {
            let width = document.documentElement.clientWidth;
            
            if ( width > 1650 && cards.length == 8 ) {
                props.setScrollPos(340 - 160);
            } else if ( width < 1650 && width > 1380 && cards.length == 7 ) {
                props.setScrollPos(340 - 160);
            } else if ( width < 1380 && width > 1180 && cards.length == 6 ) {
                props.setScrollPos(340 - 160);
            } else if ( width < 1180 && width > 980 && cards.length == 5 ) {
                props.setScrollPos(340 - 160);
            } else if ( width < 980 && width > 780 && cards.length == 4 ) {
                props.setScrollPos(340 - 160);
            } else if ( width < 780 && width > 580 && cards.length == 3 ) {
                props.setScrollPos(340 - 160);
            } else if ( width < 580 && width > 380 && cards.length == 2 ) {
                props.setScrollPos(340 - 160);
            } else if ( width < 380 && cards.length == 2 ) {
                props.setScrollPos(340 - 160);
            }
        }
    }

    function getRating() {
        fullDetail.releases.countries.forEach(element => {
            if ( element.iso_3166_1 == 'US' ) {
                setRating(element.certification);
            }
        });
    }

    function getFullDetails() {
        getMovieDetails(props.data.id, setFullDetail );
    }

    useLayoutEffect(() => {
        getFullDetails();
    }, []);

    useLayoutEffect(() => {
        if ( fullDetail.id != undefined ) {
            getRating()
        }
    }, [fullDetail]);

    return (
        <div className="search-page-card" onMouseEnter={scrollParent}>
            <span className="title">{props.data.title}</span>
            <div className="search-page-card-images-wrapper">
                <div className="bd-wrapper">
                    <img src={ props.data.backdrop_path == null ? default_backdrop : imgUrl + props.data.backdrop_path}/>
                </div>
                <img className='poster' src={ props.data.poster_path == null ? default_poster : imgUrlw154 + props.data.poster_path}/>
            </div>
            <div className="details">
                <span className="inner-title">{props.data.title}</span>
                <span className={'rating ' + rating}>{rating}</span>
                <span className='release-date'>{props.data.release_date}</span>
                <Link to={'/movie/?i=' + props.data.id} className='watch' onClick={resetTrendingVariables} >Watch</Link>
            </div>
        </div>
    );
}

export default SearchMovie;