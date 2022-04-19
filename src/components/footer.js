import './../styles/footer/footer.css';
import facebookLogo from './../svg/social_links_logos/facebook.svg';
import twitterLogo from './../svg/social_links_logos/twitter.svg';
import youtubeLogo from './../svg/social_links_logos/youtube.svg';

function Footer() {
    return (
        <footer>
            <h2>Getflix</h2>
            <div className="links-wrapper">
                <ul>
                    <li><a href="#">About GETFLIX</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Help Center</a></li>
                </ul>
                <ul>
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">Terms of Use</a></li>
                    <li><a href="#">Privacy</a></li>
                </ul>
            </div>
            <div className="socials-wrapper">
                <a href="#"><img src={facebookLogo} alt="facebook logo"/></a>
                <a href="#"><img src={twitterLogo} alt="twitter logo"/></a>
                <a href="#"><img src={youtubeLogo} alt="youtube logo"/></a>
            </div>
        </footer>
    );
}

export default Footer;