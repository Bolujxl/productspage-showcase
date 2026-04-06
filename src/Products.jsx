import ProductCard from "./ProductCard"
import laptop from "./assets/laptop.jpg"
import phone from "./assets/phones.jpg"
import headphone from "./assets/headphones.jpg"
import iwatch from "./assets/iwatch.jpg"
import playstation from "./assets/psa.jpg"
import tv from "./assets/tvv.jpg"

function Products(props){
    const products = [
        { id: 1, name: "Acer Laptop", price: "$1,200" },
        { id: 2, name: "iPhone", price: "$800" },
        { id: 3, name: "Maxer Headphones", price: "$200" },
        { id: 4, name: "Samsung TV", price: "$1,500" },
        { id: 5, name: "Sony PlayStation", price: "$500" },
        { id: 6, name: "Apple Watch", price: "$400" },
        ];
    const addToCart = props.addToCart;
    return(
        <section className="products-section">
            <div className="product-headings">
                <h2>Check out available products</h2>
                <p>Find and preview the best products on special discount sale today</p>
            </div>

            <div className="products-card-container">
                <ProductCard productName={products[0].name} productImg={laptop}      productPrice={products[0].price} category="Laptops"     rating={4.3} originalPrice="$1,499" addToCart={addToCart}/>
                <ProductCard productName={products[1].name} productImg={phone}       productPrice={products[1].price} category="Smartphones" rating={4.7} originalPrice="$999"   addToCart={addToCart}/>
                <ProductCard productName={products[2].name} productImg={headphone}   productPrice={products[2].price} category="Audio"       rating={4.5} originalPrice="$299"   addToCart={addToCart}/>
                <ProductCard productName={products[3].name} productImg={tv}          productPrice={products[3].price} category="TVs"         rating={4.6} originalPrice="$1,999" addToCart={addToCart}/>
                <ProductCard productName={products[4].name} productImg={playstation} productPrice={products[4].price} category="Gaming"      rating={4.8} originalPrice="$649"   addToCart={addToCart}/>
                <ProductCard productName={products[5].name} productImg={iwatch}      productPrice={products[5].price} category="Wearables"   rating={4.4} originalPrice="$499"   addToCart={addToCart}/>

            </div>
           
            
        </section>
    )
}

export default Products;