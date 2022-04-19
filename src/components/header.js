import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { imgUrl, imgUrlw92, searchMovie } from '../api-functions';
import './../styles/header/header.css';
import searchLogo from './../svg/search-vector.svg';
import { resetTrendingVariables } from './pages/home/trending';

let searchDelay;

function SearchResultCard(props) {
    return (
        <Link to={'/movie/?i=' + props.data.id} className="search-result-card">
            <img src={imgUrlw92 + props.data.poster_path} alt={props.data.title + ' poster'} />
            <span>{props.data.title}</span>
        </Link>
    );
}

function Header() {
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchResultCards, setSearchResultCards] = useState([]);
    const [viewAll, setViewAll] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Search
    function search(event) {
        if ( location.pathname != '/search' ) {
            if ( event.target.value == '' ) {
                setSearchResults([]);
            }
            if ( searchDelay != null ) {
                clearTimeout(searchDelay);
                searchDelay = null;
            };
            searchDelay = setTimeout(() => {
                searchMovie({
                    title : event.target.value,
                    callback : (response) => {
                        setSearchResults([...response.results])
                    }
                });
            }, 1000);
        }
    }

    // Redirect to search page
    function routeToSearch(event) {
        if ( event.key == 'Enter' ) {
            if ( location.pathname == '/search' ) {
                if ( event.target.value != '' ) {
                    navigate( {
                        pathname : '/search',
                        search : '?searchString=' + event.target.value
                    } )
                }
            } else {
                if ( event.target.value != '' ) {
                    clearTimeout(searchDelay);
                    resetTrendingVariables();
                    navigate( {
                        pathname : '/search',
                        search : '?searchString=' + event.target.value
                    } )
                }
                setSearchResults([]);
            }
        }
    }

    // Create search result cards
    function createSearchResultCards() {
        if ( searchResults.length == 0 ) {
            setSearchResultCards([]);
            setViewAll(false);
        } else if ( searchResults.length < 5 ) {
            setSearchResultCards([...searchResults.map( r =>
                <SearchResultCard key={r.id + '-' + r.title + '-result'} title={r.title} image={r.poster_path} />
            )])
            setViewAll(false);
        } else {
            let list = [];
            for (let index = 0; index < 5; index++) {
                list.push(<SearchResultCard key={searchResults[index].id + '-' + searchResults[index].title + '-result'} data={searchResults[index]} />)
            }
            setViewAll(true)
            setSearchResultCards(list);
        }
    }

    // Create Results cards after a delay
    useLayoutEffect(() => {
        createSearchResultCards();
    }, [searchResults]);

    return (
        <header>
            <div className="search-wrapper">
                <img src={searchLogo} alt="magnifying glass logo" className='search-logo'/>
                <input type="text" placeholder="Search Movie" onChange={search} onKeyUp={routeToSearch}/>
                <div className="search-results-wrapper">
                    <div className="search-results-overflow">
                        {searchResultCards}
                        {searchResultCards.length > 0 && <span className="results">Results</span> }
                    </div>
                    <span className={'view-all ' + (viewAll ? 'show' : '') }>View All</span>
                </div>
            </div>
            <h1><Link to={'/'}>Getflix</Link></h1>
            <div className="menu-button-wrapper">
                <div className="indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span className='username'>Steffan</span>
                <button className="menu-button" onClick={() => {setToggleSidebar(!toggleSidebar)}}></button>
            </div>
            <div className={"side-menu " + (toggleSidebar ? "show" : "")}>
                <a href="" className='logout'>Logout</a>
            </div>
            <div className="observer"></div>
        </header>
    );
}

export default Header;