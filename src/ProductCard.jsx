import { useState } from "react";
import "./Product.css"
import Button from "./Button";

function ProductCard(props){
    const [isAdded, setIsAdded] = useState(false);

    const { productName, productPrice, productImg, category = "Electronics", rating = Math.floor(Math.random() * 5) + 1, originalPrice, addToCart } = props;

    const renderStars = (r) => {
        const full = Math.floor(r);
        const half = r % 1 >= 0.5;
        const empty = 5 - full - (half ? 1 : 0);
        return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
    };

    const reviewCount = Math.floor(rating * 20 + 8);

    return(
        <div className="product-card">
            <div className="product-img">
                <img src={productImg} alt={productName} />
            </div>

            <div className="details-btn">
                <div className="product-details">

                    <div className="product-meta">
                        <span className="product-badge">{category}</span>
                        <div className="product-rating">
                            <span className="stars">{renderStars(rating)}</span>
                            <span className="rating-count">({reviewCount})</span>
                        </div>
                    </div>

                    <h3 className="productName">{productName}</h3>

                    <div className="price-group">
                        <p className="productPrice">{productPrice}</p>
                        {originalPrice && <span className="original-price">{originalPrice}</span>}
                    </div>

                </div>

                <div className="card-actions">
                    <Button 
                        buttonText={isAdded ? "Added!" : "Add to Cart"} 
                        iconName={isAdded ? "check" : "shopping_cart"} 
                        onClick={() => {
                            addToCart(productName);
                            setIsAdded(true);
                            setTimeout(() => setIsAdded(false), 2000);
                        }} 
                    />
                    <button className="wishlist-btn" aria-label="Add to wishlist">
                        <span className="material-symbols-outlined">favorite</span>
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ProductCard;