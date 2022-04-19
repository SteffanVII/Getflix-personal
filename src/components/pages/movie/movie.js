import { useLayoutEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCredits, getMovieDetails, getTrailers, imgUrl } from './../../../api-functions';

import default_poster from './../../../svg/Default_poster.svg';
import default_backdrop from './../../../svg/Default_backdrop.svg';

import './../../../styles/moviePage/movie.css';

function Movie(props) {

    const [details, setDetails] = useState({});
    const [releaseDate, setReleaseDate] = useState('');
    const [rating, setRating] = useState('');
    const [runtime, setRuntime] = useState('-');
    const [imdbRating, setImdbRating] = useState('--');
    const [genres, setGenres] = useState([]);
    const [embedTrailer, setEmbedTrailer] = useState();
    const [trailers, setTrailers] = useState({});
    const [cast, setCast] = useState();

    const [searchParams] = useSearchParams();

    const [isFavorite, setIsFavorite] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

    useLayoutEffect(() => {
        getMovieDetails(searchParams.get('i'), setDetails);
    }, [searchParams.get('i')]);

    useLayoutEffect(() => {
        if ( details.releases != undefined ) {

            //Get age restriction
            details.releases.countries.forEach(element => {
                if ( element.iso_3166_1 == 'US' ) {
                    setRating(element.certification);
                }
            });

            // Get runtime
            let hours = Math.floor((parseInt(details.runtime) / 60));
            let minutes = parseInt(details.runtime) - ( 60 * hours );
            if ( minutes < 10 ) {
                minutes = '0' + minutes;
            }

            setRuntime( hours + ' : ' + minutes );

            // Get release year
            setReleaseDate(details.release_date.slice(0, 4));

            //Get genres
            setGenres([...details.genres.map( g => <Genre key={'movie-genre-' + g.name} genre={g} /> )]);

            //Get Trailers
            getTrailers( details.id, setTrailers );

            // Set Cast
            setCast(<Cast key={'cast-' + details.id} movie={details.id}/>);
        }
    }, [details]);

    useLayoutEffect(() => {
        if ( trailers.results != undefined ) {
            trailers.results.forEach( t => {
                if ( !t.name.includes('Teaser') ) {
                    if ( t.name.includes('Official') && t.name.includes('Trailer') || t.name.includes('Trailer') && t.type == 'Trailer' ) {
                        setEmbedTrailer(<YoutubeEmbed key={t.id} ytKey={t.key} />);
                    }
                }
            } );
        }
    }, [trailers]);

    return (
        <main className="in-movie">
            <div id="movie_page">
                <div className="main-wrapper">
                    <div className="background-container">
                        <div className="gradien-bg"></div>
                        <div className="backdrop-wrapper">
                            <img src={ details.backdrop_path == 'null' ? default_backdrop : imgUrl + details.backdrop_path } alt={ details.title + ' backdrop' } />
                        </div>
                    </div>
                    <div className="texts-wrapper">
                        <h1 className="title">{details.title}</h1>
                        <div className="others-wrapper">
                            <p className="overview">{details.overview}</p>
                            <div className="ratings-wrapper">
                                <span className="release-date">{ '( ' + releaseDate + ' )'}</span>
                                <span className={'rating ' + rating}>{rating}</span>
                                <em className="runtime">{ 'Runtime - ' + runtime}</em>
                                <div className="imdb-wrapper">
                                    <span className="imdb-logo">IMDb</span>
                                    <span className="imdb-rating">{imdbRating}</span>
                                </div>
                            </div>
                            <div className="genres-wrapper">
                                {genres}
                            </div>
                            <div className="buttons-wrapper">
                                <button className={"movie-button heart " + ( isFavorite ? 'active' : '' ) } onClick={() => {setIsFavorite(!isFavorite);}} >
                                    <svg
                                        width="60"
                                        height="60"
                                        viewBox="0 0 15.874999 15.875001"
                                        xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="m 5.058526,2.7985307 c -0.8008273,0 -1.6001406,0.304774 -2.2098441,0.9144775 -1.2194069,1.2194069 -1.2194069,3.2037129 0,4.4231197 L 3.8437981,9.131244 7.9375,13.226662 12.031202,9.131244 13.026318,8.1361279 c 1.219406,-1.2194065 1.219406,-3.2037128 0,-4.4231197 -1.219407,-1.2194069 -3.2019975,-1.2194065 -4.421404,0 L 7.9375,4.3804223 7.2700859,3.7130082 C 6.6603825,3.1033048 5.8593534,2.7985308 5.058526,2.7985307 Z"
                                                id="heart-path"/>
                                    </svg>
                                </button>
                                <button className={"movie-button bookmark " + ( isBookmarked ? 'active' : '' ) } onClick={() => {setIsBookmarked(!isBookmarked);}}>
                                    <svg
                                        width="60"
                                        height="60"
                                        viewBox="0 0 15.875 15.875"
                                        xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M 4.2425079,3.1589881 H 11.632492 V 12.716078 L 8.3161313,10.03448 c -0.2210148,-0.1780724 -0.5362471,-0.1780724 -0.757262,0 l -3.3163614,2.681598 z"
                                                id="bookmark-path" />
                                    </svg>
                                </button>
                                <div className={"playlist-wrapper " + ( isPlaylistOpen ? 'active' : '' ) }>
                                    <button className={"movie-button to-playlist " + ( isPlaylistOpen ? 'active' : '' ) } onClick={() => {setIsPlaylistOpen(!isPlaylistOpen);}}>
                                        <svg
                                            width="60"
                                            height="60"
                                            viewBox="0 0 15.875 15.875"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                id="playlist-path"
                                                transform="translate(-0.03671545,1.1038763)"
                                                d="M 3.1243824,3.3570917 A 0.52916502,0.52916502 0 0 0 2.5952157,3.8862584 0.52916502,0.52916502 0 0 0 3.1243824,4.4138748 H 9.1793097 A 0.52916502,0.52916502 0 0 0 9.7084764,3.8862584 0.52916502,0.52916502 0 0 0 9.1793097,3.3570917 Z m 0,1.9885091 A 0.52916502,0.52916502 0 0 0 2.5952157,5.8747675 0.52916502,0.52916502 0 0 0 3.1243824,6.4039341 H 9.1793097 A 0.52916502,0.52916502 0 0 0 9.7084764,5.8747675 0.52916502,0.52916502 0 0 0 9.1793097,5.3456008 Z m 7.9044266,0.1209228 a 0.52916502,0.52916502 0 0 0 -0.529166,0.5291666 v 1.267623 H 9.2340869 A 0.52916502,0.52916502 0 0 0 8.7049203,7.7924799 0.52916502,0.52916502 0 0 0 9.2340869,8.3200963 H 10.499643 V 9.587719 a 0.52916502,0.52916502 0 0 0 0.529166,0.529167 0.52916502,0.52916502 0 0 0 0.529167,-0.529167 V 8.3200963 h 1.266073 A 0.52916502,0.52916502 0 0 0 13.353215,7.7924799 0.52916502,0.52916502 0 0 0 12.824049,7.2633132 H 11.557976 V 5.9956902 A 0.52916502,0.52916502 0 0 0 11.028809,5.4665236 Z M 3.1243824,7.2633132 A 0.52916502,0.52916502 0 0 0 2.5952157,7.7924799 0.52916502,0.52916502 0 0 0 3.1243824,8.3200963 H 7.4450488 A 0.52916502,0.52916502 0 0 0 7.9742154,7.7924799 0.52916502,0.52916502 0 0 0 7.4450488,7.2633132 Z m 0,1.9885091 A 0.52916502,0.52916502 0 0 0 2.5952157,9.780989 0.52916502,0.52916502 0 0 0 3.1243824,10.310156 H 9.1793097 A 0.52916502,0.52916502 0 0 0 9.7084764,9.780989 0.52916502,0.52916502 0 0 0 9.1793097,9.2518223 Z" />
                                        </svg>
                                    </button>
                                    <div className="playlist-dropdown">
                                        <span>Your Playlist</span>
                                        <div className="pl">
                                            <label htmlFor="New-Playlist-1">Actions</label>
                                            <input type="checkbox" id="New-Playlist-1" />
                                        </div>
                                        <div className="pl">
                                            <label htmlFor="New-Playlist-2">Chill</label>
                                            <input type="checkbox" id="New-Playlist-2" />
                                        </div>
                                    </div>
                                </div>
                                <button className="movie-button play-movie">Play</button>
                            </div>
                        </div>
                    </div>
                    {/* { details.id != undefined && <Cast movie={details.id}/> } */}
                    {cast}
                    {embedTrailer}
                </div>
            </div>
        </main>
    );
}

function Genre(props) {
    return (
        <a href="#" className="genre">{props.genre.name}</a>
    );
}

function YoutubeEmbed(props) {
    const [active, setActive] = useState(false);
    const [show, setShow] = useState(false);

    return (
        <div className={"trailer-container " + (active ? 'active' : '')} onTransitionEnd={ (event) => {
            if ( event.target.classList.contains('trailer-container') && event.target.classList.contains('active') ) {
                setShow(true);
            }
        }}>
            <div className="embed-wrapper">
                { active && show && <iframe
                        src={"https://www.youtube-nocookie.com/embed/" + props.ytKey}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen></iframe>}
                <div className={"thumbnail-wrapper " + (active ? 'is-cover-active' : '')} onClick={() => {setActive(true);}}>
                    <img src={"http://img.youtube.com/vi/" + props.ytKey + "/0.jpg"} />
                </div>
                <button className={"close " + (active ? 'is-close-active' : '')} onClick={() => {setActive(false); setShow(false);}}>X</button>
            </div>
        </div>
    );
}

function Cast(props) {

    const [credits, setCredits] = useState({});
    const [castCard, setCastCard] = useState([]);

    useLayoutEffect(() => {
        getCredits(props.movie, setCredits);
    }, []);

    useLayoutEffect(() => {
        if ( credits.cast != undefined ) {
            if ( credits.cast.length != 0 ) {
                let castArray = [];
                for (let index = 0; index < 5; index++) {
                    if ( credits.cast[index] != undefined ) {
                        castArray.push(<CastCard key={credits.cast[index].cast_id} data={credits.cast[index]} />);
                    }
                }
                setCastCard([...castArray]);
            }
        }
    }, [credits]);

    return (
        <div className="cast-container">
            <span>Cast</span>
            <div className="cast-card-container">
                {castCard}
            </div>
        </div>
    );
}

function CastCard(props) {
    return (
        <div className="cast-card">
            <div className="profile-wrapper">
                <img src={imgUrl + props.data.profile_path} alt={props.data.name} />
            </div>
            <span className="cast-name">{props.data.name}</span>
        </div>
    );
}

export default Movie;