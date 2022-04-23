import { useNavigate } from "react-router-dom";

let api_key = process.env.REACT_APP_THE_MOVIE_DB_KEY;
let api_URL = process.env.REACT_APP_API_URL;

let movieDetailURL = api_URL + '/movie/';
let trendingsURL = api_URL + '/trending/movie/day?api_key=' + api_key;
let latestURL = api_URL + '/movie/now_playing?api_key=' + api_key + '&language=en-US&page=';
let popularURL = api_URL + '/movie/popular?api_key=' + api_key + '&language=en-US&page=1';
let upcomingURL = api_URL + '/movie/upcoming?api_key=' + api_key + '&language=en-US&page=1';
let searchURL = api_URL + '/search/movie?api_key=' + api_key + '&query=';

export const imgUrl = 'https://image.tmdb.org/t/p/original';
export const imgUrlw92 = 'https://image.tmdb.org/t/p/w92';
export const imgUrlw154 = 'https://image.tmdb.org/t/p/w154';
export const pUrlw342 = 'https://image.tmdb.org/t/p/w342';
export const bdUrl300 = 'https://image.tmdb.org/t/p/w300';

export function getTrendings(setTrendings) {
    let xml = new XMLHttpRequest();
    xml.open( 'GET', trendingsURL );
    stateChange(xml, () => {
        let response = JSON.parse(xml.response);
        let results = [...response.results];
        setTrendings([...results]);
    })
    xml.send();
}

export function getLatest( callback, page = 1) {
    let xml = new XMLHttpRequest();
    xml.open('GET', latestURL + page);
    stateChange(xml, () => {
        callback(JSON.parse(xml.response));
    });
    xml.send();
}

export function getPopular(callback) {
    let xml = new XMLHttpRequest();
    xml.open('GET', popularURL);
    stateChange(xml, () => {
        callback(JSON.parse(xml.response));
    });
    xml.send();
}

export function getUpcoming(callback) {
    let xml = new XMLHttpRequest();
    xml.open('GET', upcomingURL);
    stateChange(xml, () => {
        callback(JSON.parse(xml.response));
    })
    xml.send();
}

export function getMovieDetails(movie_id, setMovieDetails) {
    let xml = new XMLHttpRequest();
    xml.open('GET', movieDetailURL + movie_id + '?api_key=' + api_key + '&language=en-US&append_to_response=releases');
    stateChange(xml, () => {
        setMovieDetails(JSON.parse(xml.response));
    });
    xml.send();
}

export function searchMovie(params) {
    let xml = new XMLHttpRequest();
    xml.open('GET', searchURL + encodeURIComponent(params.title));
    stateChange(xml, () => {
        params.callback(JSON.parse(xml.response));
    });
    xml.send();
}

export function getTrailers(movie_id, callback) {
    let xml = new XMLHttpRequest();
    xml.open( 'GET', movieDetailURL + movie_id + '/videos?api_key=' + api_key + '&append_to_response=official' );
    stateChange( xml, () => {
        callback(JSON.parse(xml.response))
    } ) ;
    xml.send();
}

export function getCredits(movie_id, callback) {
    let xml = new XMLHttpRequest();
    xml.open( 'GET', movieDetailURL + movie_id + '/credits?api_key=' + api_key );
    stateChange( xml, () => {
        callback(JSON.parse(xml.response));
    } );
    xml.send();
}

export function discover(callback) {
    let xml = new XMLHttpRequest();
    xml.open( 'GET', 'https://api.themoviedb.org/3/discover/movie?api_key=' + api_key + '&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate' );
    stateChange( xml, () => {
        callback(JSON.parse(xml.response));
    } );
    xml.send();
}

export function stateChange(xml, callback) {
    xml.onreadystatechange = () => {
        if ( xml.readyState == 4 && xml.status == 200 ) {
            callback();
        }
    }
}