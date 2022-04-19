import { render } from "@testing-library/react";
import { useLayoutEffect, useReducer } from "react";
import { Link } from "react-router-dom";

import { discover } from "../../../api-functions";
import './../../../styles/discoverPage/discover.css';

const FILTER_ACTIONS = {
    OPENDROPDOWN : '0',
    ADDGENRE : '1',
    REMOVEGENRE : '2',
    RENDERGENRES : '3',
    RENDERCARDS : '4'
}

function reducer(state, action) {
    let newState = {...state};

    if ( action.type == FILTER_ACTIONS.OPENDROPDOWN ) {
        newState.isDropdownOpen = !newState.isDropdownOpen;
    } else if ( action.type == FILTER_ACTIONS.ADDGENRE ) {
        if ( !newState.genres.includes(action.genre_name) ) {
            newState.genres = [...newState.genres, action.genre_name];
            newState.renderGenres = true;
        } 
    } else if ( action.type == FILTER_ACTIONS.REMOVEGENRE ) {
        if ( newState.genres.includes(action.genre_name) ) {
            let index = newState.genres.indexOf(action.genre_name);
            newState.genres = [ ...newState.genres.slice( 0, index ), ...newState.genres.slice( index + 1 ) ];
            newState.renderGenres = true;
        }
    } else if ( action.type == FILTER_ACTIONS.RENDERGENRES ) {
        newState.genre_buttons = [...newState.genres.map( g => <FilterGenre key={g} genre_name={g} remove_function={action.remove_function} />)];
        newState.renderGenres = false;
    } else if ( action.type == FILTER_ACTIONS.RENDERCARDS ) {
        newState.results = {...action.results};
    }
    return newState;
}

function Discover(props) {
    
    const [state, dispatch] = useReducer(reducer, {
        isDropdownOpen : false,
        genres : [],
        genre_buttons : [],
        renderGenres : false,
        results : {},
        rows : []
    });

    function openDropdown() {
        dispatch({
            type : FILTER_ACTIONS.OPENDROPDOWN
        });
    };

    function addGenre(event) {
        dispatch({
            type : FILTER_ACTIONS.ADDGENRE,
            genre_name : event.target.getAttribute('data-name')
        });
    }

    function removeGenre(event) {
        dispatch({
            type : FILTER_ACTIONS.REMOVEGENRE,
            genre_name : event.target.getAttribute('data-name')
        });
    }

    useLayoutEffect(() => {
        discover( (result) => {
            dispatch({
                type : FILTER_ACTIONS.RENDERCARDS,
                results : result
            })
        } );
    }, []);

    useLayoutEffect(() => {
        if ( state.renderGenres ) {
            dispatch({
                type : FILTER_ACTIONS.RENDERGENRES,
                remove_function : removeGenre
            });
        }
    }, [state]);

    return (
        <main>
            <div id="discover-page">
                <div className="filters-container">
                    <div className="filter genre">
                        <div className="genre-dropdown">
                            <span className="filter-name" >Genres</span>
                            <button className={'add-genre ' + (state.isDropdownOpen ? "open" : "")} onClick={openDropdown} >
                                <span></span>
                                <span></span>
                            </button>
                            <div className={"dropdown-selections " + (state.isDropdownOpen ? 'open' : '')}>
                                <button className="selection" data-name="Action" onClick={addGenre}>Action</button>
                                <button className="selection" data-name="Adventure" onClick={addGenre}>Adventure</button>
                                <button className="selection" data-name="Science Fiction" onClick={addGenre}>Science Fiction</button>
                                <button className="selection" data-name="Horror" onClick={addGenre}>Horror</button>
                                <button className="selection" data-name="Mystery" onClick={addGenre}>Mystery</button>
                                <button className="selection" data-name="Drama" onClick={addGenre}>Drama</button>
                                <button className="selection" data-name="Comedy" onClick={addGenre}>Comedy</button>
                                <button className="selection" data-name="Crime" onClick={addGenre}>Crime</button>
                            </div>
                        </div>
                        <div className="added-genres">
                            {state.genre_buttons}
                        </div>
                    </div>
                    <div className="filter year">
                        <span className="filter-name">Year</span>
                        <select name="release-year" id="release-year">
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                            <option value="2019">2019</option>
                            <option value="2018">2018</option>
                            <option value="2017">2017</option>
                            <option value="2016">2016</option>
                            <option value="2015">2015</option>
                            <option value="2014">2014</option>
                            <option value="2013">2013</option>
                            <option value="2012">2012</option>
                        </select>
                    </div>
                    <div className="filter order-by">
                        <span className="filter-name">Order by</span>
                        <select name="order" id="order">
                            <option value="0">Popularity Ascending</option>
                            <option value="0">Popularity Descending</option>
                        </select>
                    </div>
                    <Link to={'/'}>Discover</Link>
                </div>
                <div className="results-container">

                </div>
            </div>
        </main>
    );
}

function FilterGenre(props) {
    return  (
        <div className="filter-genre">{props.genre_name}
            <button className="remove-genre" data-name={props.genre_name} onClick={props.remove_function}>
                <span></span>
                <span></span>
            </button>
        </div>
    );
}

function CardRow(props) {

    function generateCards() {

    }

    return (
        <div className="card-row">
            <div className="cards-container">

            </div>
        </div>
    );
}

function Card(props) {
    return (
        <div className="discover-card">
            
        </div>
    );
}
 
export default Discover;