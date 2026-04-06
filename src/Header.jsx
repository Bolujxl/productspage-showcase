import './App.css'

function Header(props) {

    const cartCount = props.cartCount;

    return(
        <header>

            <div className="inner-header">
                <div className="logo-reseil">
                    <span>reseill</span>
                </div>

                <nav className="nav-links">
                    <a href="#">Products</a>
                    <a href="#">Pricing</a>
                    <a href="#">Support</a>
                </nav>

                <div className="cart">
                    <p>Cart</p>
                    <span className="material-symbols-outlined">
                        shopping_cart
                    </span>

                    <span className='cartCounted'>{cartCount}</span>
                </div>
            </div>
                     
        </header>
    )
}

export default Header;
