import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getUpcoming, imgUrl } from '../../../api-functions';
import './../../../styles/upcoming/upcoming.css';

let upSwitching = false

function Upcoming(props) {
    const [current, setCurrent] = useState(0);
    const [upcomings, setUpcomings] = useState([]);
    const [upcomingsBackdrops, setUpcomingsBackdrops] = useState([]);
    const [listItemButtons, setListItemButtons] = useState([]);
    const [titleLink, setTitleLink] = useState([<a href='#' key={'upTitle'}></a>]);
    
    const root = useRef();
    const bdWrapper = useRef();

    function createUpcomingsBackdrops() {
        setUpcomingsBackdrops([...upcomings.map( u =>
            <div className="upbg-wrapper" key={'upbg-' + u.id} id={'upbg-' + u.id}>
                <img src={imgUrl + u.backdrop_path} />    
            </div>
        )]);

        setListItemButtons([...upcomings.map( u => 
            <li key={'upBgli-' + u.id}>
                <input type="radio" name="upbgButton" id={'upbgButton-' + u.id} className='upbgButton' value={upcomings.indexOf(u)} onClick={scrollUpcomings}/>
                <label htmlFor={'upbgButton-' + u.id}></label>
            </li>
        )])
    }

    function scrollUpcomings(event) {
        if ( upSwitching == false ) {
            let index = event.target.value;
            let width = root.current.getBoundingClientRect().width;
            bdWrapper.current.scrollTo( width * parseFloat(index), 0 );
            setCurrent(index);
            upSwitching = true;
            setTimeout(() => {
                upSwitching = false;
            }, 1000);
        }
    }

    function changeTitleLink(event) {
        if ( event.target.classList.contains('switch') ) {
            setTitleLink([
                <a href='#' key={'upTitle'}>{upcomings[current].title}</a>
            ]);
        }
    }

    useLayoutEffect(() => {
        getUpcoming((response) => {
            setUpcomings([...response.results]);
        });
    }, []);

    useLayoutEffect(() => {
        if ( upcomings.length > 0 ) {
            createUpcomingsBackdrops();
        }
    }, [upcomings]);

    useEffect(() => {
        if ( upcomings.length > 0 ) {
            setTitleLink([
                <a href="#" className='switch' key={'upTitle'}>{document.querySelector('.upcoming-title-wrapper a').innerText}</a>
            ]);
        }
        if ( listItemButtons.length > 0 ) {
            if ( current == 0 ) {
                document.querySelector('.upbgButton').click();
            }
        }
    }, [current, listItemButtons]);

    return (
        <section id="upcoming" ref={root}>
            <div className="upcoming-backdrops-wrapper" ref={bdWrapper}>
                {upcomingsBackdrops}
            </div>
            <div className="up-gradient"></div>
            <span className='section-name'>Upcoming</span>
            <div className="upcoming-title-wrapper" onTransitionEnd={changeTitleLink}>
                {titleLink}
            </div>
            <button className="up-button up-button--left" onClick={() => {
                let buttons = document.querySelectorAll('.upbgButton');
                if ( current == 0 ) {
                    buttons[19].click();
                } else {
                    buttons[current - 1].click()
                }
            }}></button>
            <button className="up-button up-button--right" onClick={() => {
                let buttons = document.querySelectorAll('.upbgButton');
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

export default Upcoming;