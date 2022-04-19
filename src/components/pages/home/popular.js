import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPopular } from '../../../api-functions';
import './../../../styles/popular/popular.css';
import { resetTrendingVariables } from './trending';

let popSwitching = false;

function Popular() {
    const [current, setCurret] = useState(0);
    const [populars, setPopulars] = useState([]);
    const [popularsBackdrops, setPopularsBackdrops] = useState([]);
    const [listItemButtons, setListItemButtons] = useState([]);
    const [titleLink, setTitleLink] = useState([ <Link to={'/'} key={'popTitle'}></Link> ]);

    const root = useRef();
    const bdWrapper = useRef();

    const imgUrl = 'https://image.tmdb.org/t/p/original';

    function createPopularBackdrops() {
        setPopularsBackdrops([...populars.map( d => 
            <div className="popbg-wrapper" key={'popbg-' + d.id} id={'popbg-' + d.id}>
                <img src={imgUrl + d.backdrop_path} />    
            </div>
        )])

        setListItemButtons([...populars.map( d => 
            <li key={'popBgli-' + d.id}>
                <input type="radio" name="popbgButton" id={'popbgButton-' + d.id} className='popbgButton' value={populars.indexOf(d)} onClick={scrollPopulars}/>
                <label htmlFor={'popbgButton-' + d.id}></label>
            </li>
        )])
    }

    function scrollPopulars(event) {
        if ( popSwitching == false ) {
            let index = event.target.value;
            let height = root.current.clientHeight;
            bdWrapper.current.scrollTo(0, height * index);
            setCurret(index);
            popSwitching = true;
            setTimeout(() => {
                popSwitching = false;
            }, 1000);
        }
    }

    function changeTitleLink(event) {
        if ( event.target.classList.contains('switch') ) {
            setTitleLink([
                <Link to={'/movie/?i=' + populars[current].id} key={'popTitle'} onClick={resetTrendingVariables} >{populars[current].title}</Link>
            ]);
        }
    }

    useLayoutEffect(() => {
        getPopular((response) => {
            setPopulars([...response.results]);
        });
    }, []);

    useLayoutEffect(() => {
        if ( populars.length > 0 ) {
            createPopularBackdrops();
        }
    }, [populars]);

    useEffect(() => {
        if ( populars.length > 0 ) {
            setTitleLink([
                <Link to={'/'} className='switch' key={'popTitle'}>{document.querySelector('.popular-title-wrapper a').innerText}</Link>
            ]);
        }

        if ( listItemButtons.length > 0 ) {
            if ( current == 0 ) {
                document.querySelector('.popbgButton').click();
            }
        }
    }, [current, listItemButtons]);

    return (
        <section id="popular" ref={root}>
            <div className="popular-backdrops-wrapper" ref={bdWrapper}>
                {popularsBackdrops}
            </div>
            <div className="pop-gradient"></div>
            <span className="section-name">What's Popular</span>
            <div className="popular-title-wrapper" onTransitionEnd={changeTitleLink}>
                {titleLink}
            </div>
            <button className="pop-button pop-button--up" onClick={() => {
                let buttons = document.querySelectorAll('.popbgButton');
                if ( current == 0 ) {
                    buttons[19].click();
                } else {
                    buttons[current - 1].click()
                }
            }}></button>
            <button className="pop-button pop-button--down" onClick={() => {
                let buttons = document.querySelectorAll('.popbgButton');
                if ( current == 19 ) {
                    buttons[0].click();
                } else {
                    buttons[parseInt(current) + 1].click();
                }
            }}></button>
            <ul>
                {listItemButtons}
            </ul>
        </section>
    );
}

export default Popular;