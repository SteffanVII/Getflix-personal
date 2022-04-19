import { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { imgUrlw154, imgUrlw92 } from "../../../api-functions";
import { resetTrendingVariables } from "./trending";

function LatestCard(props) {

    let genresRaw = [];

    const [optionOpen, setOptionOpen] = useState(false);
    const [rating, setRating] = useState('');
    const [genres, setGenres] = useState([]);

    function getRating() {
        props.data.releases.countries.forEach(element => {
            if ( element.iso_3166_1 == 'US' ) {
                setRating(element.certification);
            }
        });
    }

    function createGenres() {
        props.data.genres.forEach( element => {
            genresRaw.push(
                <a href="#" key={'genre-' + element.name + '-' + props.data.id}>{element.name}</a>
            );

            if ( genresRaw.length == Object.keys(props.data.genres).length ) {
                setGenres([...genresRaw]);
            }
            // setGenres([...genres, <a href="#">{element.name}</a>])
        } )
    }

    useLayoutEffect(() => {
        getRating();
    }, []);

    useEffect(() => {
        createGenres();
    }, []);

    return (
        <div className="latest-card" onTransitionEnd={(event) => {
            if ( event.target.className == 'details' ) {
                setOptionOpen(false);
            }
        }}>
            <div className="wrapper">
                <div className="details">
                    <div className="title-release-wrapper">
                        <span className="title">{props.data.title}</span>
                        <span className="release-date">{"(" + props.data.release_date + ")"}</span>
                    </div>
                    <span className={"rating " + rating}>{rating}</span>
                    <p className="overview">{props.data.overview}</p>
                    <div className="latest-genres-wrapper">
                        {genres}
                    </div>
                    <Link to={'/movie/?i=' + props.data.id} className='play' onClick={resetTrendingVariables}>View</Link>
                    {/* <a href="#" className='play'>Watch</a> */}
                </div>
                <img src={imgUrlw154 + props.data.poster_path}/>
            </div>
            <button className="option-button" onClick={() => {
                setOptionOpen(!optionOpen);
            }}>
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul className={'option ' + ( optionOpen ? 'open' : '' )}>
                <li><a href="">Watch later</a></li>
                <li><a href="">Add to Favorites</a></li>
            </ul>
        </div>
    );
}

export default LatestCard;