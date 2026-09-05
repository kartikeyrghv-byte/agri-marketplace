import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

function FarmerProfile() {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmerRes, productsRes, reviewsRes] = await Promise.all([
          API.get(`/auth/farmer/${id}`),
          API.get(`/products/farmer/${id}`),
          API.get(`/reviews/farmer/${id}`)
        ]);
        setFarmer(farmerRes.data);
        setProducts(productsRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Error fetching farmer profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="text-brown/60 text-center py-16">Loading profile...</p>;
  if (!farmer) return <p className="text-brown/60 text-center py-16">Farmer not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-card border border-border rounded-lg p-6 mb-10">
        <h2 className="font-serif text-3xl font-semibold text-brown mb-1">{farmer.name}</h2>
        <p className="text-brown/60 mb-4">{farmer.email}</p>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-brown/70">
          {farmer.farmLocation && <p><span className="font-medium text-brown">Location:</span> {farmer.farmLocation}</p>}
          {farmer.cropTypes?.length > 0 && <p><span className="font-medium text-brown">Crops:</span> {farmer.cropTypes.join(', ')}</p>}
          {farmer.farmingMethod && <p><span className="font-medium text-brown">Method:</span> {farmer.farmingMethod}</p>}
        </div>
        <span className={`inline-block mt-4 text-xs px-3 py-1 rounded-full font-medium ${farmer.isVerified ? 'bg-olive text-cream' : 'bg-terracotta/10 text-terracotta-dark'}`}>
          {farmer.isVerified ? 'Verified Farmer' : 'Pending Verification'}
        </span>
      </div>

      <h3 className="font-serif text-2xl font-semibold text-brown mb-4">Products by {farmer.name}</h3>
      {products.length === 0 ? (
        <p className="text-brown/60 mb-10">No products listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {products.map((product) => (
            <div key={product._id} className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-serif font-semibold text-brown">{product.name}</h4>
              <p className="text-brown/70 text-sm">₹{product.price} / {product.unit}</p>
              <p className="text-brown/60 text-sm">Available: {product.quantity} {product.unit}</p>
              {product.organic && <p className="text-olive-dark text-sm mt-1">Organic</p>}
            </div>
          ))}
        </div>
      )}

      <h3 className="font-serif text-2xl font-semibold text-brown mb-4">Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-brown/60">No reviews yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div key={review._id} className="bg-card border border-border rounded-lg p-4">
              <p className="text-brown text-sm">
                <span className="font-medium">{review.consumer?.name}</span> rated {review.product?.name}{' '}
                <span className="text-terracotta">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </p>
              {review.comment && <p className="text-brown/70 text-sm mt-1">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FarmerProfile;