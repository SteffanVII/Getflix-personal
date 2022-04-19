import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './../../../styles/header/trending.css';

import { getMovieDetails, getTrendings, imgUrl } from './../../../api-functions';

let movieId = '';
let titleText = '';
let overviewText = '';
let runtimeText = '';
let ratingText = '';
let genreButtons = [];

let outCurrent = 0;
let viewing = false;

let intervalID = null;
let pauseID = null;

export function resetTrendingVariables() {
    movieId = '';
    titleText = '';
    overviewText = '';
    runtimeText = '';
    ratingText = '';
    genreButtons = [];
    outCurrent = 0;
    viewing = false;

    clearTimeout(intervalID);
    clearInterval(pauseID);
    intervalID = null;
    pauseID = null;
}

function Trending() {
    const movieBackdrop = useRef();
    const firstButton = useRef();

    const [current, setCurrent] = useState(0);
    const [trendings, setTrendings] = useState({});
    const [trendingsDetails, setTrendingsDetails] = useState({});
    const [backdrops, setBackdrops] = useState([]);
    const [details, setDetails] = useState(<Detail switch={false} init={true} changeDetails={changeDetails}/>);

    function getTrendingsDetails() {
        let trendingsInit = {};
        for (let index = 0; index < trendings.length; index++) {
            getMovieDetails(trendings[index].id, (response) => {
                trendingsInit[index] = response;
                if ( Object.keys(trendingsInit).length == 20 ) {
                    setTrendingsDetails(Object.values(trendingsInit));
                }
            })
        }
    }

    function createBackdrops() {
        if ( trendingsDetails[0] != undefined ) {
            let newBackdrops = [ ...trendingsDetails.map( t =>
                <TrendingBackdrop key={t.id + '-trending-backdrop'} data={t} current={trendingsDetails.indexOf(t) == parseInt(current)} /> 
            )]
            setBackdrops(newBackdrops.reverse());
        }
    }

    function changeTrending(event) {
        setCurrent(event.target.value);
    }

    function changeDetails(event) {
        if ( event.target.classList.contains('switch') && event.propertyName === 'transform' ) {
            movieId = trendingsDetails[current].id;
            titleText = trendingsDetails[current].original_title;
            overviewText = trendingsDetails[current].overview;
            runtimeText = trendingsDetails[current].runtime + " min";
            genreButtons = [];
            
            trendingsDetails[current].releases.countries.forEach(element => {
                if ( element.iso_3166_1 == 'US' ) {
                    ratingText = element.certification;
                }
            });
            
            trendingsDetails[current].genres.forEach(element => {
                genreButtons.push(
                    <a href="" key={trendingsDetails[current].id + '-genre-' + element.name} >{element.name}</a>
                );
            });
    
            setDetails(<Detail switch={false} init={false} changeDetails={changeDetails} />);
        }
    }

    function pauseInterval() {
        if ( intervalID != null ) {
            clearInterval(intervalID);
            intervalID = null;
            viewing = true;
        }
        if ( pauseID != null )  {
            clearTimeout(pauseID);
        }
        pauseID = setTimeout(() => {
            viewing = false;
            pauseID = null;
            let buttons = Array.from(document.querySelectorAll('input[type=radio]'));
            let index = parseInt(outCurrent) == 19 ? 0 : parseInt(outCurrent) + 1;
            buttons[index].click();
        }, 30000)
    }

    useLayoutEffect(() => {
        getTrendings(setTrendings);
    }, [])
    
    useLayoutEffect(() => {
        getTrendingsDetails();
    }, [trendings]);

    useEffect(() => {
       if ( trendingsDetails[0] != undefined ) {
           let buttons = Array.from(document.querySelectorAll('input[type=radio]'));
           buttons[0].click();
       }
    }, [trendingsDetails]);

    useEffect( () => {
        outCurrent = current;
       createBackdrops();
       if ( trendingsDetails[0] != undefined ) {
           setDetails(<Detail switch={true} init={false} changeDetails={changeDetails}/>);
           if ( intervalID == null ) {
               if ( !viewing ) {
                   intervalID = setInterval(() => {
                       let buttons = Array.from(document.querySelectorAll('input[type=radio]'));
                       let index = parseInt(outCurrent) == 19 ? 0 : parseInt(outCurrent) + 1;
                       buttons[index].click();
                   }, 5000)
               }
           }
       }
    }, [current]);

    return (
        <section id="trending">
            <div className="gradient"></div>
            <div className="movie-backdrop" ref={movieBackdrop}>
                {backdrops}
                <div className="backdrop-gradient"></div>
            </div>
            {details}
            <ul>
                <li><input type="radio" name='backdrop-radio' value={0} id="radio0" onClick={changeTrending} ref={firstButton}/><label htmlFor="radio0" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={1} id="radio1" onClick={changeTrending}/><label htmlFor="radio1" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={2} id="radio2" onClick={changeTrending}/><label htmlFor="radio2" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={3} id="radio3" onClick={changeTrending}/><label htmlFor="radio3" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={4} id="radio4" onClick={changeTrending}/><label htmlFor="radio4" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={5} id="radio5" onClick={changeTrending}/><label htmlFor="radio5" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={6} id="radio6" onClick={changeTrending}/><label htmlFor="radio6" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={7} id="radio7" onClick={changeTrending}/><label htmlFor="radio7" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={8} id="radio8" onClick={changeTrending}/><label htmlFor="radio8" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={9} id="radio9" onClick={changeTrending}/><label htmlFor="radio9" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={10} id="radio10" onClick={changeTrending}/><label htmlFor="radio10" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={11} id="radio11" onClick={changeTrending}/><label htmlFor="radio11" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={12} id="radio12" onClick={changeTrending}/><label htmlFor="radio12" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={13} id="radio13" onClick={changeTrending}/><label htmlFor="radio13" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={14} id="radio14" onClick={changeTrending}/><label htmlFor="radio14" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={15} id="radio15" onClick={changeTrending}/><label htmlFor="radio15" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={16} id="radio16" onClick={changeTrending}/><label htmlFor="radio16" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={17} id="radio17" onClick={changeTrending}/><label htmlFor="radio17" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={18} id="radio18" onClick={changeTrending}/><label htmlFor="radio18" onClick={pauseInterval}></label></li>
                <li><input type="radio" name='backdrop-radio' value={19} id="radio19" onClick={changeTrending}/><label htmlFor="radio19" onClick={pauseInterval}></label></li>
            </ul>
            <span className="whats-trending">What's Trending</span>
        </section>
    );
}

function TrendingBackdrop(props) {
    return (
        <div className={"backdrop-wrapper " + (props.current ? '' : 'hide') }>
            <img src={imgUrl + props.data.backdrop_path}/>
        </div>
    );
}

function Detail(props) {
    return (
        <div key={'detail'} className="details">
            <div className={"title-overview-wrapper" + ' ' + ( props.switch ? 'switch' : '') + ' ' + (props.init ? 'initial' : '')} onTransitionEnd={props.changeDetails}>
                <div className="title-wrapper">
                    <span className="title">{titleText}</span>
                    <div className="watch">
                        <Link to={'/movie/?i=' + movieId} onClick={resetTrendingVariables} >View</Link>
                        <span className="runtime">{runtimeText}</span>
                    </div>
                </div>
                <span className="overview">{overviewText}</span>
                <div className="rating">
                    <span className={ratingText} >{ratingText}</span>
                </div>
                <div className="genres">
                    {genreButtons}
                </div>
            </div>
        </div> 
    );
}

export default Trending;